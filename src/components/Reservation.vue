<template>
  <div>
    <app-header></app-header>

    <div>
      <h1 class="subheader">Make A Reservation</h1>
    </div>
    <div class="float-container">
      <form class="form">
        <div class="float-left">
          <br />
          <label for="">PAX: </label>
          <select v-model="pax">
            <option v-for="num in 5" v-bind:key="num">{{ num }}</option>
          </select>
          <br />
          <br />
          <div v-if="paxSelected">
            <label for="date">Date </label>
            <br />
            <v-date-picker
              v-model="date"
              :min-date="new Date()"
            ></v-date-picker>
            <br />
            <br />
            <button class="submit" type="submit" v-on:click="submit" v-if="dateSelected && availableTime && selected.length != 0">
              Submit
            </button>
            <br />
            <br />
          </div>
        </div>

        <div class="float-right">
          <div class="timeslot"  v-if="dateSelected && availableTime">
            <br />
            <label for="time">Timeslot: </label>
            <br />
            <br />
            <div>
              <label class="container" v-for="item in timeslot" :key="item"
                >{{ item }}
                <input type="checkbox" v-bind:value="item" v-model="selected" />
                <span class="checkmark"></span>
              </label>
              <br />
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Header from "./UI/Header.vue";
import database from "../firebase.js";
import firebase from "firebase/app";
import DatePicker from "v-calendar/lib/components/date-picker.umd";

export default {
  data() {
    return {
      pax: new Number(),
      date: "",
      timeslot: new Array(),
      selected: new Array(),
      paxSelected: false,
      dateSelected: false,
      timeSelected: false,
      availableTime: false,
      price: 0,
      monthID: '',
      timeIDs: [],
    };
  },
  components: {
    "app-header": Header,
    "v-date-picker": DatePicker,
  },

  methods: {
    fetchTime: function () {
      if (this.date == undefined) {
        this.timeslot = [];
        return;
      }

      var date = this.date.getDate();
      if (date < 10) {
        date = "0" + date;
        console.log(date);
      }
      var month = this.date.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      var year = this.date.getYear() % 100;

      var fulldate = date + month + year;
      console.log(fulldate);

      database
        .collection("listings")
        .doc(this.$route.params.id)
        .collection("timeslots")
        .doc(fulldate)
        .get()
        .then((snapshot) => {
          console.log(snapshot.data());

          if (snapshot.exists) {
            const data = snapshot.data();

            this.timeslot = [];

            Object.keys(data).map((time) => {
              console.log(time);

              var now = new Date();

              if (data[time] >= this.pax) {
                console.log("test1");

                var startTime = Number(time.substring(0, 2));
                if (
                  new Date(
                    this.date.getFullYear(),
                    this.date.getMonth(),
                    this.date.getDate(),
                    startTime,
                    0,
                    0,
                    0
                  ) > now
                ) {
                  console.log("test2");
                  this.availableTime = true;
                  this.timeslot.push(time);
                }
              }
            });

            this.timeslot = this.timeslot.filter((element) => {
              return element !== undefined;
            });

            console.log(this.timeslot);

            this.timeslot.sort();
          } else {
            const arrayResult = [];

            this.availableTime = false;

            arrayResult.sort();

            this.timeslot = arrayResult;
          }
        });
    },

    fetchItems: function() {
      console.log("hi")
      var locationID = this.$route.params.id;
      
      database.collection('listings').doc(locationID).get().then(snapshot => {
        const toAdd = snapshot.data();
        this.price = toAdd.price;
        console.log(this.price)
      });
    },


    updateMData: async function () {
      var locationID = this.$route.params.id;
      var dateString = this.date.toDateString()
      let monthString = dateString.slice(4,7)
      console.log(monthString)
      var someArr = []
 
      console.log("check if empty")
      console.log("check this id", locationID)
      await database.collection('listings').doc(locationID).collection('monthlyData').doc(monthString).get().then(querySnapshot => {
        console.log("checking...")
        if(!querySnapshot.exists) {
          console.log("its empty")
          database.collection('listings').doc(locationID).collection('monthlyData').doc(monthString).set({
          month: monthString,
          bookings: Number(0),
          clicks: Number(0),
          revenue: Number(0),
          ratings: Number(0),
          }) 
        }
      })
      await database.collection('listings').doc(locationID).collection('monthlyData').doc(monthString).get().then(querySnapshot => {
        console.log(querySnapshot.id, "=>", querySnapshot.data())
        let data = {...querySnapshot.data(), ['id']: querySnapshot.id}
        someArr.push(data)
      })
    
        console.log(someArr)
        return someArr
    },

    updateTData: async function() {
      var locationID = this.$route.params.id;
      var currTData = []
      for (var i = 0; i < this.selected.length; i++) {
        var time = this.selected[i];
        await database.collection("listings").doc(locationID).collection("timeslotsData").doc(time).get().then((snapshot) => {
          console.log("dont have doc1")
          if(!snapshot.exists) {
            console.log("dont have doc")
            database.collection('listings').doc(locationID).collection('timeslotsData').doc(time).set({
              bookings: 0,
              revenue: 0,
            }) 
          }
        })
      }

      for (var j = 0; j < this.selected.length; j++) {
        var time1 = this.selected[j];
            await database.collection("listings").doc(locationID).collection("timeslotsData").doc(time1).get().then((snapshot) => {
              const timeData = snapshot.data();
              currTData.push({time: snapshot.id, currTBookings: Number(timeData.bookings), currTRevenue: Number(timeData.revenue)})
              console.log("curr time bookings", "=>", timeData.bookings)
              //  this.currTBookings = timeData.bookings
              //  this.currTRevenue = timeData.revenue
            })

      }
      console.log(currTData)
      return currTData
    },


    submit: async function (e) {
      e.preventDefault(); 

      if (this.selected.length == 0) {
        alert("Please select at least 1 timeslot");
        return;
      }

      var locationID = this.$route.params.id;

      var user = firebase.auth().currentUser;

      var data = {
        location: locationID,
        userid: user.uid,
        name: user.displayName,
        pax: this.pax,
        date: this.date,
        time: this.selected,

      };

      var date = this.date.getDate();
      if (date < 10) {
        date = "0" + date;
      }
      var month = this.date.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      var year = this.date.getYear() % 100;

      var fulldate = date + month + year;

      database
        .collection("listings")
        .doc(this.$route.params.id)
        .collection("timeslots")
        .doc(fulldate)
        .get()
        .then((snapshot) => {
          const data = snapshot.data();

          for (var i = 0; i < this.selected.length; i++) {
            var time = this.selected[i];
            var updatedValue = data[time] - this.pax;

            database
              .collection("listings")
              .doc(locationID)
              .collection("timeslots")
              .doc(fulldate)
              .update({
                [time]: updatedValue,
              });

            /*
            database
              .collection("listings")
              .doc(locationID)
              .collection("timeslotsData")
              .doc(time)
              .get()
              .then((snapshot) => {
                const timeData = snapshot.data();
                this.currTData += {time: timeData.id, currTBookings: timeData.bookings, currTRevenue: timeData.revenue}
                console.log("curr time bookigns", "=>", timeData.bookings)
              //  this.currTBookings = timeData.bookings
              //  this.currTRevenue = timeData.revenue
              })
              */
          }
        });

      console.log(this.currTData)

      database.collection("bookings").add(data);

      // get month doc id and currbookings and currrevenue
      var dateString = this.date.toDateString()
      let monthString = dateString.slice(4,7)
      console.log(monthString)
      
      var currMBookings = 0
      var currMRevenue = 0
      var result = await this.updateMData()
      console.log(result)
      result.forEach(doc => {
        currMBookings += Number(doc.bookings)
        currMRevenue += Number(doc.revenue)
        this.monthID += doc.id
        console.log(doc.id)
      })
  

      console.log("currBookings", currMBookings)
      console.log("currRevenue", currMRevenue)
      console.log("what's the issue1")

      console.log(locationID)
      var newMBookings = Number(Number(currMBookings) + Number(this.pax)*Number(this.selected.length))
      console.log(this.selected.length)
      console.log(this.pax)
      console.log(this.price)
      var newMRevenue = Number(Number(currMRevenue) + Number((this.pax*this.price*this.selected.length)))

        // update monthlyData
      console.log("month to add data in", this.monthID)
      console.log("new revenue", this.newMRevenue)
      await database.collection('listings').doc(locationID).collection('monthlyData').doc(this.monthID).update({
        bookings: Number(newMBookings),
        revenue: Number(newMRevenue)
      })
      //.then(() => {console.log("help")});
      console.log("what's the issue2")

      var result2 = await this.updateTData()
      console.log("result2", "=>", result2[0].time)
      for (var i = 0; i < this.selected.length; i++) {
        var time = this.selected[i];
        console.log("selected time", time)
        var dataToAdd = result2[i];
        console.log("check selected time", time)
        console.log("current time bookings", "=>", dataToAdd.currTBookings)
        var newTBookings = Number(Number(dataToAdd.currTBookings) + Number(this.pax));
        var newTRevenue = Number(dataToAdd.currTRevenue + (this.pax*this.price))
        await database.collection('listings').doc(locationID).collection('timeslotsData').doc(time).update({
          bookings: newTBookings,
          revenue: newTRevenue
        })
      }

      console.log("done")
      alert("Booking successful!");
      this.$router.push({ path: "/listings" });
    
    },
  },
  created: function() {
        this.fetchItems();
    },
  

  watch: {
    date: async function () {
      this.dateSelected = true;
      await this.fetchTime();
    },

    pax: async function () {
      this.paxSelected = true;
      if (this.dateSelected) {
        await this.fetchTime();
      }
    },
  },
};
</script>

<style scoped>
.subheader {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 40px;
  margin-bottom: 15px;
  width: 30%;
  margin:auto;
  padding-top: 5px;
  padding-bottom: 5px;
  border: 2px solid grey;
  margin-bottom: 35px;
}
/* Customize the label (the container) */
.container {
  display: block;
  margin: auto;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: 10%;
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: #2196f3;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

select {
  height: 25px;
  width: 40%;
  font-size: 15px;
}

.float-container {
  display: flex;
  
  align-items: center;
  width: 70%;
  margin: auto;
}

/* .float-left,
.float-right {
  flex: 1;
  height: 100%;
  overflow: auto;
} */

.float-left {
  width: 50%;
  float: left;
  align-items: left;
  /* background-color: #ffffff; */
  /* border-radius: 20px; */
  margin-left: 5px;
  /* box-shadow: 0px 0px 10px 10px lightgrey; */
}

.float-right {
  width: 50%;
  margin-left: 30px;
  float: right;
  align-items: left;
  height: 60vh;
  border-left: 2px solid grey;
  /* background-color: #ffffff; */
  /* border-radius: 20px; */
  /* box-shadow: 0px 0px 10px 10px lightgrey; */
}

.timeslot {
  width: 100%;
  margin: auto;
  font-size: 18px;
}

.container {
  width: 50%;
  text-align: center;
  margin-left: auto;
}

form {
  display: flex;
  margin: auto;
  width: 100%;
}

.submit {
  display: inline-block;
  padding: 0.5em 3em;
  border: 0.16em solid darkgray;
  margin: 0 0.3em 0.3em 0;
  box-sizing: border-box;
  text-decoration: none;
  text-transform: uppercase;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  color: darkgray;
  text-align: center;
  transition: all 0.2s;
  cursor: pointer;
}

.submit:hover {
  color: #dddddd;
  border-color: #dddddd;
}
.submit:active {
  color: #bbbbbb;
  border-color: #bbbbbb;
}
</style>