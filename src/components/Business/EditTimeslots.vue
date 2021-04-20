<template>
  <div>
    <h1>Edit Booking Timings</h1>

    <div class="float-container">
      <div class="float-left">
        <h3>Select a date to start</h3>
        <v-date-picker v-model="date" :min-date="new Date()"></v-date-picker>
      </div>
      <div class="float-right">
        <div class="timeslot">
          <div v-if="dateSelected && availableTime">
            <h3>Time: Pax</h3>
            <label
              class="timing-listing"
              v-for="(slot, index) in timeslots"
              :key="index"
            >
              {{ slot.time }} : {{ slot.pax }}
              <input type="checkbox" v-bind:value="slot" v-model="selected" />
              <span class="checkmark"></span>
            </label>
            <div>
            <b-input-group class="paxupdate">
              <b-form-input v-model.number="pax" placeholder="PAX Limit"></b-form-input>
              <b-input-group-append>
                <b-button variant="outline-success" v-on:click="update()"><b-icon icon="arrow-repeat"></b-icon></b-button>
                 <b-button variant="outline-secondary" v-on:click="selectAll()"><b-icon icon="check-square"></b-icon></b-button>
                 <b-button variant="outline-secondary" v-b-modal.modal-prevent-closing
              ><b-icon icon="plus"></b-icon></b-button
            >
            <b-button variant="danger" v-on:click="del()"
              ><b-icon icon="trash"></b-icon></b-button
            >
              </b-input-group-append>
            </b-input-group>
            </div>
          </div>
          <div v-else-if="dateSelected">
            <b-button variant="outline-primary" v-b-modal.modal-prevent-closing
              >Add Timeslots</b-button
            >
            <h3>No timeslots available</h3>
          </div>

          <div>

            <b-modal
              id="modal-prevent-closing"
              ref="modal"
              title="Choose your Timeslots"
              @ok="add()"
              ok-only
            >
              <form ref="form" @submit.stop.prevent="handleSubmit">
                <h4 class="subtitle">Opening Time</h4>
                <b-form-input
                  v-model="start"
                  placeholder="Opening Time in HHMM format. Eg. 0000"
                ></b-form-input>
                <h4 class="subtitle">Closing Time</h4>
                <b-form-input
                  v-model="end"
                  placeholder="Closing Time in HHMM format. Eg. 0000"
                ></b-form-input>

                <h4 class="subtitle">Maximum PAX</h4>
                <b-form-input
                  type="number"
                  v-model="pax"
                  placeholder="Maximum PAX"
                ></b-form-input>
                <div>
                </div>
                <b-form-checkbox-group
                  class="checkgroup"
                  id="checkbox-group-2"
                  :value="true"
                  v-model="applyMonth"
                >
                  <b-form-checkbox
                    >Create timeslots for entire Month</b-form-checkbox
                  >
                </b-form-checkbox-group>

              </form>
            </b-modal>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import database from "../../firebase.js";
import DatePicker from "v-calendar/lib/components/date-picker.umd";

export default {
  data() {
    return {
      bizID: "", //change according to user
      timeslots: [],
      selected: new Array(), //timeslot selected
      paxDisplayed: 0,
      date: "",
      fulldate: "",
      pax: null,
      start: "",
      end: "",
      dateSelected: false,
      availableTime: false,
      applyMonth: false,
    };
  },

  components: {
    "v-date-picker": DatePicker,
  },

  watch: {
    date: async function () {
      this.selected = new Array();
      this.dateSelected = true;
      await this.fetch();
    },
  },

  methods: {
    fetchID: function () {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.bizID = user.uid 
        }
      })
    },

    selectAll: function () {
      if (this.selected.length == this.timeslots.length) {
        this.selected.splice(0);
      } else {
        this.selected.splice(0);
        this.selected.push(...this.timeslots);
      }
    },

    closeModal: function () {
      this.isModalVisible = false;
    },

    fetch: function () {
      if (this.date == undefined) {
        return;
      }

      var date = this.date.getDate();
      if (date < 10) {
        date = "0" + date;
      }
      var month = this.date.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      var year = this.date.getYear() % 100;

      this.fulldate = date + month + year;

      database
        .collection("listings")
        .doc(this.bizID)
        .collection("timeslots")
        .doc(this.fulldate)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            const data = snapshot.data();

            this.timeslots = [];

            Object.keys(data).map((time) => {
              this.timeslots.push({ time: time, pax: data[time] }); //[{time: xx, pax: xx}, {}]
              this.availableTime = true;
            });

            this.timeslots.sort((a, b) => {
              return (
                parseInt(a["time"].substring(0, 4)) -
                parseInt(b["time"].substring(0, 4))
              );
            }); //fix order
          } else {
            this.availableTime = false;
            this.timeslots = [];
          }
        });
    },

    add: async function () {
      //release new timeslots
      if (this.start == "") {
        alert("Please input a start time.");
      } else if (this.end == "") {
        alert("Please input an end time");
      } else if (this.pax == null) {
        alert("Please input a pax limit.");
      }

      var startHour = Math.floor(parseInt(this.start) / 100);
      var startMin = (parseInt(this.start) - startHour * 100).toString();
      if (startMin == "0") {
        startMin = "00";
      }
      var endHour = Math.floor(parseInt(this.end) / 100);
      var endMin = (parseInt(this.end) - endHour * 100).toString();
      if (endMin == "0") {
        endMin = "00";
      }

      if (startHour >= endHour) {
        alert("Start Time cannot exceed End Time.");
      }

      var newSlots = [];
      while (startHour < endHour) {
        var endSlot = startHour + 1;
        var startStr = startHour.toString() + startMin;
        if (startHour < 10) {
          startStr = "0" + startStr;
        }
        var endStr = endSlot.toString() + endMin;
        if (endSlot < 10) {
          endStr = "0" + endStr;
        } //create string representation of the time slots
        newSlots.push({ [startStr + " - " + endStr]: this.pax }); //collect the new timeslots
        startHour = endSlot;
      } //end of while loop

      if (this.applyMonth) {
        //add timeslots for the whole month
        var month = this.date.getMonth() + 1;
        var year = this.date.getYear() % 100;
        var numDay = 30;
        var day = 1;
        var longer = [1, 3, 5, 7, 8, 10, 12];
        if (longer.includes(month)) {
          numDay = 31;
        } else if (month == 2) {
          if (this.date.getYear() % 4 == 0) {
            numDay = 29;
          } else {
            numDay = 28;
          }
        } //calculate the number of days of the month
        if (month < 10) {
          month = "0" + month;
        }

        while (day <= numDay) {
          //loop through the days of the month
          var date = day; //change after each loop
          if (date < 10) {
            date = "0" + day;
          }
          var fulldate = date + month + year; //date of that specific day
          var docRef = database
            .collection("listings")
            .doc(this.bizID)
            .collection("timeslots")
            .doc(fulldate); //hard code works

          await docRef.get().then((snapshot) => {
            if (snapshot.exists) {
              //alr have existing timeslots
              for (var j = 0; j < newSlots.length; j++) {
                docRef.update(newSlots[j]);
              }
            } else {
              //empty doc
              docRef.set(newSlots[0]);
              for (var k = 1; k < newSlots.length; k++) {
                docRef.update(newSlots[k]);
              }
            }
          });
          day++;
        }

        this.applyMonth = false;
      } else {
        //add timeslot for the day
        var docRefDate = database
          .collection("listings")
          .doc(this.bizID)
          .collection("timeslots")
          .doc(this.fulldate);

        await docRefDate.get().then((snapshot) => {
          if (snapshot.exists) {
            //alr have existing timeslots
            for (var j = 0; j < newSlots.length; j++) {
              docRefDate.update(newSlots[j]);
            }
          } else {
            //empty doc
            docRefDate.set(newSlots[0]);
            for (var k = 1; k < newSlots.length; k++) {
              docRefDate.update(newSlots[k]);
            }
          }
        });
      }
    },

    update: function () {
      //update pax limit
      if (this.selected.length == 0) {
        alert("Please select at least 1 timeslot");
        return;
      }

      var docRef = database
        .collection("listings")
        .doc(this.bizID)
        .collection("timeslots")
        .doc(this.fulldate);

      for (var i = 0; i < this.selected.length; i++) {
        var time = this.selected[i]["time"];
        var updatedValue = this.pax;
        this.selected[i]["pax"] = updatedValue;
        docRef.update({
          [time]: updatedValue, //update the firebase
        });
      }
      this.pax = "";
      this.selected = new Array();
    },

    del: function () {

      if (this.selected.length == 0) {
        alert("Please select at least 1 timeslot");
        return;
      }

      const FieldValue = firebase.firestore.FieldValue;
      var docRef = database
        .collection("listings")
        .doc(this.bizID)
        .collection("timeslots")
        .doc(this.fulldate);

      for (var i = 0; i < this.selected.length; i++) {
        var time = this.selected[i]["time"];
        var index = this.timeslots.indexOf(this.selected[i]);
        this.timeslots.splice(index, 1);
        docRef.update({
          [time]: FieldValue.delete(), //delete field in firebase
        });
      }
      this.selected = new Array();
    },
  },

  created() {
    this.fetchID();
  },
};
</script>


<style scoped>
/* Customize the label (the container) */
.timing-listing {
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
  width: 50%;
}
/* Hide the browser's default checkbox */
.timing-listing input {
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
.timing-listing:hover input ~ .checkmark {
  background-color: #ccc;
}
/* When the checkbox is checked, add a blue background */
.timing-listing input:checked ~ .checkmark {
  background-color: #2196f3;
}
/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}
/* Show the checkmark when checked */
.timing-listing input:checked ~ .checkmark:after {
  display: block;
}
/* Style the checkmark/indicator */
.timing-listing .checkmark:after {
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
  width: 70%;
  display: flex;
  align-items: center;
  margin: auto;
}

.float-left {
  width: 50%;
  float: left;
  padding-top: 20px;
  margin: 0;
  margin-left: auto;
  height: 60vh;
}

.float-right {
  padding-top: 20px;
  width: 50%;
  float: right;
  margin: auto;
  border-left: 2px solid grey;
  height: 60vh;
}
.timeslot {
  width: 100%;
  margin: auto;
  font-size: 18px;
}

.paxupdate {
    width: 60%;
    margin: auto;
}

.subtitle {
  padding-left:3px;
  padding-top:10px;
}

.checkgroup {
  padding-top: 10px;
}
</style>
