<template>
  <div id="bookings list">
    <app-header></app-header>
    
    <div class="table" v-if="newBookings.length > 0">
      <ul>
        <h1 class="subheader">Upcoming Bookings</h1>
        <br>
        <li class="segment" v-for="(booking, index) in newBookings" :key="index">
          <img :src="booking[6]" alt="picture" class="main-pic" />
          <div class="info">
            <div class="title">
              <h3 class="name">
                {{ booking[7] }}
              </h3>

              <b-button
                class="button"
                variant="outline-danger"
                v-bind:val="booking[8]"
                v-on:click="
                  cancel(index);
                  del($event);
                "
                >Cancel Booking</b-button
              >
            </div>
            <p class="pax">
              <b-icon icon="person-plus" class="icons"></b-icon>
              Total Coming: {{ booking[1] }}
            </p>
            <p class="time">
              <b-icon icon="clock-history" class="icons"></b-icon>
              {{ booking[3] }} / {{ booking[4] }}
            </p>
          </div>
          
        </li>
      </ul>
    </div>

    <div class="past-booking-list" v-if="pastBookings.length > 0">
        <h1 class="subheader">Past Bookings</h1>
      <ul>
        <li class="segment" v-for="booking in pastBookings" :key="booking.index">
          <img :src="booking[6]" alt="picture" class="main-pic" />
          <div class="info">
            <div class="title">
              <h3 class="name">
                {{ booking[7] }}
              </h3>

              <b-button
                class="button"
                variant="outline-success"
                v-bind:locId ="booking[2]" 
                v-bind:date="booking[5]"
                v-bind:id ="booking[8][0]"
                v-on:click="route($event)"
                >Leave Review</b-button
              >
            </div>
            <p class="pax">
              <b-icon icon="person-plus" class="icons"></b-icon>
              Total Coming: {{ booking[1] }}
            </p>
            <p class="time">
              <b-icon icon="clock-history" class="icons"></b-icon>
              {{ booking[3] }} / {{ booking[4] }}
            </p>
          </div>

          
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Header from "./UI/Header.vue";
import database from "../firebase.js";
import firebase from "firebase";

export default {
  data() {
    return {
      pastBookings: [],
      newBookings: [],
      newBookingsNoDup: [],
      docArr: [],
    };
  },

    methods: {
        sendReview: function() {
            this.$router.push({path:'reviews'})
        },

        route: function(event) {
            let doc_id = event.target.getAttribute("id")
            let loc_id = event.target.getAttribute("locId");
            let dateBooked = event.target.getAttribute("date");
            this.$router.push({path: `reviews/${loc_id}`, query: {loc_id: loc_id, date: dateBooked, doc_id: doc_id}})
        },

        visitDateToString: function(dateOfVisit) {
            let month = dateOfVisit.slice(0,3)
            let day = dateOfVisit.slice(4,6)
            let year = dateOfVisit.slice(-2)

            let monthString = ''
            let dayString = day
            let yearString = year

            if (month == 'Jan') {
                monthString = '01'
            } else if (month == 'Feb') {
                monthString = '02'
            } else if (month == 'Mar') {
                monthString = '03'
            } else if (month == 'Apr') {
                monthString = '04'
            } else if (month == 'May') {
                monthString = '05'
            } else if  (month == 'Jun') {
                monthString = '06'
            } else if (month == 'Jul') {
                monthString = '07'
            } else if (month == 'Aug') {
                monthString = '08'
            } else if (month == 'Sep') {
                monthString = '09'
            } else if (month == 'Oct') {
                monthString = '10'
            } else if (month == 'Nov') {
                monthString = '11'
            } else if (month == 'Dec') {
                monthString = '12'
            }
            return dayString + monthString + yearString
        },

        del: async function(event) {
            let values = event.target.getAttribute("val")
            let id = values.split(',')[0]
            let loc = values.split(',')[1]
            let pax = values.split(',')[2]
            let dateOfVisit = values.split(',')[3]
            let stringOfVisitDate = this.visitDateToString(dateOfVisit)

            async function getTime() {                
                let time = []
                await database.collection('bookings').doc(id).get().then(doc => {
                    let data = doc.data()
                    let timeArr = data['time']
                    time = timeArr
                })
                return time
            }

            let arrOfBookings = await getTime()

            const increasePax = firebase.firestore.FieldValue.increment(pax)
            const timeslots = database.collection('listings').doc(loc).collection('timeslots').doc(stringOfVisitDate)
        
            for(var booking of arrOfBookings) {
                console.log(booking)
                timeslots.update({
                    [booking] :increasePax
                })
            }
            database.collection('bookings').doc(id).delete().then(() => console.log('delete success'))
        },


        cancel: function(idx) {
            this.newBookings.splice(idx,1)
        },
        
        
        getDoc: async function () {
          var arr = [];
          await database
            .collection("bookings")
            .get()
            .then((querySnapShot) => {
              let item = {};
              querySnapShot.docs.forEach((doc) => {
                item = { ...doc.data(), ["id"]: doc.id };
                arr.push(item);
              });
            });
          return arr;
        },

        fetchItems: async function() {
            this.docArr = await this.getDoc()
            var currentUser = firebase.auth().currentUser.uid
            let upcoming = []
            let past = []

            function sortByDateUpcoming(a, b) {
                if (new Date(a[3]) == new Date(b[3])) {
                    return 0;
                } else {
                    return (new Date(a[3]) < new Date(b[3])) ? -1 : 1;
                }
            }

            function sortByDatePast(a, b) {
              if (new Date(a[3]) == new Date(b[3])) {
                  return 0;
              } else {
                  return (new Date(a[3]) > new Date(b[3])) ? -1 : 1;
              }
            }
            function sortByTiming(a, b) {
                if (Number(a.slice(0,2)) == Number(b.slice(0,2))) {
                    return 0;
                } else {
                    return (Number(a.slice(0,2)) < Number(b.slice(0,2))) ? -1 : 1;
                }
            }
            function segmentToIntervals(arr) {
                var intervals = []
                var currTime = arr[0].slice(0,4)

                for (var i = 0; i < arr.length; i++) {
                    if (i == arr.length - 1) {
                        currTime = currTime + ' - ' + arr[i].slice(-4)
                        intervals.push(currTime)
                    } else if (arr[i].slice(-4) != arr[i + 1].slice(0,4)) {
                        currTime = currTime + ' - ' + arr[i].slice(-4)
                        intervals.push(currTime)
                        currTime = arr[i + 1].slice(0,4)
                    } else {
                        continue
                    }
                }
                return intervals
            }
            
            this.docArr.forEach(async function(doc) {
                let id = [doc['id']]
                let userid = doc['userid']
                let location = doc['location']
                let pax = doc['pax']
                async function retrieve(locationId) {     
                    var locationData = []
                        await database.collection('listings').doc(locationId).get().then(doc => {
                            let listingData = doc.data()
                            locationData.push(listingData['cover_photo'])
                            locationData.push(listingData['name'])
                        })
                    return locationData
                }
                let locationAndName = await retrieve(location)                
                let date = doc['date'].toDate().toString()
                let dateOfVisit = date.slice(4,15)
                // get the array of timings booked
                let month = dateOfVisit.slice(0,3);
                let time = doc['time']
                // sort the array
                let sortedTimings = time.sort(sortByTiming)

                let startTiming = Number(sortedTimings[0].slice(0,2))
                let currentDate = new Date().toDateString()
                let currentHour = new Date().getHours()

                let currentDateWithoutDayOfWeek = currentDate.substr(currentDate.indexOf(' ') + 1)
                // get all the intervals booked by the user and store into an array called 'duration'
                let duration = segmentToIntervals(sortedTimings)
                // v-bind values
                let vbindValues = [...id, location, pax, dateOfVisit]

                let booking = [userid, pax, location, dateOfVisit, duration, month]
                let combined = [...booking, ...locationAndName, vbindValues]
    
                if(new Date() < new Date(combined[3]) && combined[0] == currentUser) {
                    upcoming.push(combined)
                    upcoming.sort(sortByDateUpcoming)
                } else if((currentDateWithoutDayOfWeek == dateOfVisit) && combined[0] == currentUser) {
                    if (currentHour < startTiming) {
                        upcoming.push(combined)
                        upcoming.sort(sortByDateUpcoming)
                    } else {
                        past.push(combined)
                        past.sort(sortByDatePast)
                    }
                } else if (combined[0] == currentUser) {
                    past.push(combined)
                    past.sort(sortByDatePast)
                }
            })
            this.newBookings = upcoming
            this.pastBookings = past
        },
    },

  components: {
    "app-header": Header,
  },

  created: function () {
    this.fetchItems();
  },
};
</script>

<style scoped>
ul {
  display: inline-block;
  overflow-y: scroll;
  list-style-type: none;
  height: 100%;
  width: 100%;
  vertical-align: top;
  padding-left: 0px;
}

li {
  display: flex;
  width: 60%;
  height: 200px;
  text-align: center;
  font-family: "Ubuntu", sans-serif;
  margin: auto;
}

.info {
  width: 100%;
  float: right;
  margin: auto;
  padding-left: 20px;
}

.title {
  padding-bottom: 12px;
  border-bottom: 2px solid grey;
  display: flex;
  font-size: 35px;
  margin-bottom: 15px;
}

.name {
  font-size: 35px;
  text-align: left;
  float: left;
  margin-bottom: 0px;
}

.pax {
  font-size: 20px;
  text-align: left;
  margin-bottom: 15px;
}

.time {
  font-size: 20px;
  text-align: left;
}

.icons {
  margin-right: 15px;
}

.segment {
    margin-top: 40px;
  padding-bottom: 40px;
  padding-left: 50px;
  padding-right: 50px;
  border-bottom: 2px solid wheat;
}

.subheader {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 40px;
  margin-bottom: 15px;
  width: 30%;
  margin:auto;
  padding-top: 5px;
  padding-bottom: 5px;
  border: 2px solid grey;
}

.status {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 25px;
}

.picture {
  float: left;
  padding-right: 10px;
  border-right: 3px solid grey;
  width: 55%;
  height: 100%;
}

.main-pic {
  float: left;
  border-radius: 15px;
  width: 40%;
  height: 100%;
}

.button {
  font-size: 20px;
  margin-top: 0px;
  float: right;
  margin-left: auto;
}
</style>