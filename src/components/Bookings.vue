<template>
  <div id="bookings list">
    <app-header></app-header>
    
    <div class="table" v-if="newBookings.length > 0">
        <!-- <h1>Bookings</h1> -->
        <!-- <br><br> -->
      <ul>
        <!-- <h3><b>Upcoming</b></h3> -->
        <h1 class="subheader">Upcoming Bookings</h1>
        <br>
        <li class="segment" v-for="(booking, index) in newBookings" :key="index">
          <!-- picture -->
          <!-- <div class="picture"> -->
          <img :src="booking[6]" alt="picture" class="main-pic" />
          <!-- </div> -->
          <!-- button -->
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

              <!-- <button
                class="button"
                v-bind:id="booking[7]"
                v-on:click="
                  cancel(booking.index);
                  del($event);
                "
              >
                Cancel Booking
              </button> -->
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
          <!-- <button
            href="#"
            class="btn"
            v-bind:id="booking[7]"
            v-on:click="
              cancel(booking.index);
              del($event);
            "
          >
            Cancel Booking
          </button> -->
          <!-- pax -->
          <!-- <div id="pax">
            <b>Total Coming: {{ booking[1] }}</b>
          </div> -->
          <!-- timing -->
          <!-- <div id="clockIcon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#2c3e50"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 15" />
            </svg>
            <span id="time"
              ><b>{{ booking[3] }} / {{ booking[4] }}</b></span
            >
          </div> -->
        </li>
      </ul>
    </div>

    <div class="past-booking-list" v-if="pastBookings.length > 0">
        <h1 class="subheader">Past Bookings</h1>
      <ul>
        <li class="segment" v-for="booking in pastBookings" :key="booking.index">
          <!-- picture -->
          <!-- <div class="picture"> -->
          <img :src="booking[6]" alt="picture" class="main-pic" />
          <!-- </div> -->
          <!-- button -->
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

              <!-- <button
                class="button"
                v-bind:id="booking[7]"
                v-on:click="
                  cancel(booking.index);
                  del($event);
                "
              >
                Cancel Booking
              </button> -->
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

          <!--     
        <h3><b>Previous</b></h3>
        <li v-for="booking in pastBookings" :key="booking.index">
          <div id="name">
            <b>{{ booking[6] }}</b>
          </div>
          <br />
          <img :src="booking[5]" alt="picture" id="main-pic" />
         
          <button
            href="#"
            class="btn"
            v-bind:id="booking[2]"
            v-on:click="route($event)"
          >
            Leave Review
          </button>
          <div id="pax">
            <b>Total Coming: {{ booking[1] }}</b>
          </div>
          <div id="clockIcon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#2c3e50"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 15" />
            </svg>
            <span id="time"
              ><b>{{ booking[3] }} / {{ booking[4] }}</b></span
            >
          </div>
        </li> -->
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
            // console.log(loc_id)
            // console.log(this.pastBookings)
            this.$router.push({path: `reviews/${loc_id}`, query: {loc_id: loc_id, date: dateBooked, doc_id: doc_id}})
        },

        visitDateToString: function(dateOfVisit) {
            // dateOfVisit == Apr 17 2021
            // month == Apr
            let month = dateOfVisit.slice(0,3)
            // day == 17
            let day = dateOfVisit.slice(4,6)
            // year == 21
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
            // console.log(currentUser)
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

            // function convertUTCDateToLocalDate(date) {
            //     var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

            //     var offset = date.getTimezoneOffset() / 60;
            //     var hours = date.getHours();

            //     newDate.setHours(hours - offset);

            //     return newDate;   
            // }

            // sorts the timings in the 'time' array in firestore. 
            // if the array is ['0900 - 1000', '0800 - 0900', '1400 - 1500','1300 - 1400'],
            // it returns ['0800 - 0900', '0900 - 1000', '1300 - 1400','1400 - 1500']
            function sortByTiming(a, b) {
                if (Number(a.slice(0,2)) == Number(b.slice(0,2))) {
                    return 0;
                } else {
                    return (Number(a.slice(0,2)) < Number(b.slice(0,2))) ? -1 : 1;
                }
            }
            // segements the timings into intervals. 
            // E.g if the sorted array is ['0800 - 0900', '0900 - 1000', '1000 - 1100', '1300 - 1400','1400 -1500']
            // it returns ['0800 - 1100', '1300 - 1500']
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
  /* display: flex; 
  flex-wrap: wrap;
  list-style-type: none;
  padding: 30%;
  padding-top: 3%; 
  margin: auto;
  height:30%; */
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
  /* height: 80%; */
  /* position: relative; */
  text-align: center;
  /* padding: 10px; */
  /* border: 3px solid #ED7A78; */
  /* margin: 10px; */
  /* margin-top: 5px; */
  /* margin-bottom: 0px; */
  /* padding-bottom: 1px; */
  /* border-radius: 25px; */
  font-family: "Ubuntu", sans-serif;
  margin: auto;
  /* margin: 0 0 10 0; */
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

/* h3 {
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-size: 20px;
} */
/* .bookings-list {
    margin-left: 36px;
} */

/* .table {
  display: table;
  margin: 0 auto;
  height: 100%;
  width: 100%;
} */

.status {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 25px;
}

/* .btn {
  position: relative;
  float: left;
  left: 20%;
  top: 20%;
  bottom: 150px;
  margin-top: 10px;
    margin-bottom: 10px;
  display: inline-block;
  cursor: pointer;
  border-radius: 10px;
  color: whitesmoke;
  background: #ed7a78;
  border: 2px solid transparent;
  height: 50px;
  width: 90px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 50px;
  padding-top: 10px;
  font-family: "Ubuntu", sans-serif;
  font-weight: bold;
  font-size: 15px;
  transition: 0.2s;
} */

/* #pax {
  position: relative;
  left: 10%;
  bottom: 140px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 15px;
} */

/* #clockIcon {
  position: relative;
  left: 20%;
  bottom: 100px;
} */

.picture {
  float: left;
  padding-right: 10px;
  border-right: 3px solid grey;
  width: 55%;
  height: 100%;
}

.main-pic {
  /* position: relative; */
  float: left;
  /* right:20%; */
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

/* #name {
  position: relative;
  width: 100%;
  right: 1px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 25px;
  font-weight: 1000;
} */

/* #time {
  position: relative;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 16px;
  left: 10px;
  bottom: 15px;
} */

/* #button {
  position: relative;
} */
/* imported css for buttons */

/* .btn-gradient {
  text-decoration: none;
  color: white;
  padding: 5px 10px;
  display: inline-block;
  position: relative;
  left: 150px;
  height: 50px;
  width: 90px;
  font-size: 15px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  border: 1px solid rgba(0, 0, 0, 0.21);
  border-bottom: 4px solid rgba(0, 0, 0, 0.21);
  border-radius: 4px;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
}

.btn-gradient.yellow {
  background: rgba(240, 210, 100, 1);
  background: -webkit-gradient(
    linear,
    0 0,
    0 100%,
    from(rgba(240, 210, 100, 1)),
    to(rgba(229, 201, 96, 1))
  );
  background: -webkit-linear-gradient(
    rgba(240, 210, 100, 1) 0%,
    rgba(229, 201, 96, 1) 100%
  );
  background: -moz-linear-gradient(
    rgba(240, 210, 100, 1) 0%,
    rgba(229, 201, 96, 1) 100%
  );
  background: -o-linear-gradient(
    rgba(240, 210, 100, 1) 0%,
    rgba(229, 201, 96, 1) 100%
  );
  background: linear-gradient(
    rgba(240, 210, 100, 1) 0%,
    rgba(229, 201, 96, 1) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f0d264', endColorstr='#e5c960', GradientType=0 );
}

.btn-gradient.red:active {
  background: #e35252;
}
.btn-gradient.orange:active {
  background: #e8601b;
}
.btn-gradient.cyan:active {
  background: #169499;
}
.btn-gradient.blue:active {
  background: #608fbf;
}
.btn-gradient.purple:active {
  background: #bd8eb7;
}
.btn-gradient.yellow:active {
  background: #dbc05b;
}
.btn-gradient.green:active {
  background: #72b08e;
} */
</style>