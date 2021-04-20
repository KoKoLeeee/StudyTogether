<template>
	<div class="chart">
        <app-header></app-header>
		<h1 class="subheader">Business Statistics</h1>
        <b-button
              class="button"
              variant="outline-success"
              v-if="showStatistics == false"
              v-on:click.prevent="show()"
              >Show My Statistics</b-button
            >
        <!-- <button v-on:click.prevent ="show()">Show My Statistics</button>
        <br><br> -->
        <div class="charts">
        <form v-if="isLoaded">
            Search Data By:
            <select @change="changeDuration" v-model="selectedDuration">
                <option v-bind:key="item" v-for="item in selectDuration"> {{item}}</option> 
            </select>
        </form>
        <form v-if="isLoaded && duration=='Monthly'">
            <br>
            Select metric to track:
            
            <select @change="changeHandlerMonth" v-model="selectedMonthly">
                <option v-bind:key="item" v-for="item in selectArrMonthly"> {{item}} </option> 
            </select>
            <br><br>
            Select type of chart:
            <select v-model="selectedTypeMonthly">
                <option v-bind:key="item" v-for="item in selectTypeArrMonthly"> {{item}} </option> 
            </select>
        </form>
		<bar-chart-month :chart-data="dataColMonthly" v-if="selectedTypeMonthly=='Bar' && isLoaded && duration=='Monthly'"></bar-chart-month>
        <line-chart-month :chart-data="dataColMonthly" v-if="selectedTypeMonthly=='Line' && isLoaded && duration=='Monthly'"></line-chart-month>
        <form v-if="isLoaded && duration=='Timeslots'">
            <br>
            Select metric to track:
            <select @change="changeHandlerTime" v-model="selectedTime">
                <option v-bind:key="item" v-for="item in selectArrTime"> {{item}} </option> 
            </select>
            <br><br>
            Select type of chart:
            <select v-model="selectedTypeTime">
                <option v-bind:key="item" v-for="item in selectTypeArrTime"> {{item}} </option> 
            </select>
        </form>
        <br>
		<bar-chart-time :chart-data="dataColTime" v-if="selectedTypeTime=='Bar' && isLoaded && duration=='Timeslots'"></bar-chart-time>
        <line-chart-time :chart-data="dataColTime" v-if="selectedTypeTime=='Line' && isLoaded && duration=='Timeslots'"></line-chart-time>
        </div>
	</div>
</template>

<script>
import Header from '../../UI/Header.vue';
import BarChartMonth from "./BarChartMonth.js";
import LineChartMonth from "./LineChartMonth.js";
import LineChartTime from "./LineChartTime.js";
import BarChartTime from "./BarChartTime.js";
import firebase from "firebase";
import database from '../../../firebase.js';

export default {

	components: {
		"bar-chart-month": BarChartMonth,
        "bar-chart-time": BarChartTime,
        "line-chart-month": LineChartMonth,
        "line-chart-time": LineChartTime,
        'app-header': Header,

        
	},

    data() {
        return {
            isLoaded: false,
            type: '',
            selectedDuration: '',
            selectDuration: ['Timeslots', 'Monthly'],
            duration: '',

            totalMonthlyRevenue: {},
            totalMonthlyBookings: {},
            totalMonthlyClicks: {},
            totalMonthlyRatings: {},

            totalTimeRevenue: {},
            totalTimeBookings: {},

            bizID: '',
            timeBookings: {},
            timeRevenue: {},
            monthly: [],
            timeslots: [],
            mrData: {},
            mbData: {},
            mrtgData: {},
            mcData: {},

            trData: {},
            tbData: {},

            selectedMonthly: '',
            selectArrMonthly: ['Bookings', 'Revenue', 'Ratings', 'Clicks'],
            dataColMonthly: {},
            selectedTypeMonthly: 'Bar',
            selectTypeArrMonthly: ['Bar', 'Line'],

            selectedTime: '',
            selectArrTime: ['Bookings', 'Revenue'],
            dataColTime: {},
            selectedTypeTime: 'Bar',
            selectTypeArrTime: ['Bar', 'Line'],

            showStatistics: false,

        }
    },

    created() {
        this.fetchID(),
        this.fetchMonth(),
        this.fetchTime(),
        this.changeHandlerMonth(),
        this.changeHandlerTime()
    },    

    methods: {
        show() {
            this.showStatistics = true;
            this.isLoaded = true
        },

        changeDuration() {
            this.duration = this.selectedDuration;
        },

        changeHandlerMonth() {
            let selected = this.selectedMonthly;
            if (selected == 'Revenue') {
                this.dataColMonthly = this.mrData
            } else if (selected == 'Bookings') {
                this.dataColMonthly = this.mbData
            } else if (selected == 'Ratings') {
                this.dataColMonthly = this.mrtgData
            } else if (selected == 'Clicks') {
                this.dataColMonthly = this.mcData
            } 
        },

        changeHandlerTime() {
            let selected = this.selectedTime;
            if (selected == 'Revenue') {
                this.dataColTime = this.trData
            } else if (selected == 'Bookings') {
                this.dataColTime = this.tbData
            } 
        },

        fetchID: async function () {
            var user = firebase.auth().currentUser;
            console.log(user);
            var userID = user.uid;
            this.bizID = userID;
        },
        // retrieves from bookings collections all the documents (places I visited)
        getMonthData: async function() {
            var a = []
            await database.collection('listings').doc(this.bizID).collection('monthlyData').get().then(querySnapShot => {
                
                let monthData = {}
                querySnapShot.docs.forEach(doc => {
                    monthData = {...doc.data(), ['id']: doc.id}
                    a.push(monthData)
                })
            })
            return a;
        },

            

        getTimeData: async function() {
            var b = []
            await database.collection('listings').doc(this.bizID).collection('timeslotsData').get().then(querySnapShot => {
                
                let timeData = {}
                querySnapShot.docs.forEach(doc => {
                    timeData = {...doc.data(), ['id']: doc.id}
                    b.push(timeData)
                })
            })
            return b;
        },

        fetchMonth: async function() {
            // wait to get all my bookings and store to local variable
            this.monthly = await this.getMonthData()
            // create month:totalSpending pair object
            var monthlyRevenue = {
                Jan:0,
                Feb:0,
                Mar:0,
                Apr:0,
                May:0,
                Jun:0,
                Jul:0,
                Aug:0,
                Sep:0,
                Oct:0,
                Nov:0,
                Dec:0
            }

            var monthlyBookings = {
                Jan:0,
                Feb:0,
                Mar:0,
                Apr:0,
                May:0,
                Jun:0,
                Jul:0,
                Aug:0,
                Sep:0,
                Oct:0,
                Nov:0,
                Dec:0

            }

            var monthlyRatings = {
                Jan:0,
                Feb:0,
                Mar:0,
                Apr:0,
                May:0,
                Jun:0,
                Jul:0,
                Aug:0,
                Sep:0,
                Oct:0,
                Nov:0,
                Dec:0
            }

            var monthlyClicks = {
                Jan:0,
                Feb:0,
                Mar:0,
                Apr:0,
                May:0,
                Jun:0,
                Jul:0,
                Aug:0,
                Sep:0,
                Oct:0,
                Nov:0,
                Dec:0
            }

            this.monthly.forEach(async function(doc) {
                // timestamp
                // let dateOfVisit = doc['date']
                // timestamp into string
                // let dateInString = dateOfVisit.toDate().toDateString()
                // extract the month. E.g Apr
                // let month = dateInString.slice(4,7)
                // extract the year Eg 2021
                // let year = dateInString.slice(9,)
                // get listingId corresponding to this listing 
                // let listingId = doc['location']
                // let time = doc['time']
                // get the sarting time. E.g 11 
                // let start = Number(time[0].slice(0,2))
                // get ending time. E.g 14
                // let end = Number(time.pop().slice(-4,-2))
                // duration. E.g 14 - 11 = 3 hours.
                // let duration = end - start

                /* retrieves the 'price' field which is the hourly rate of the listing
                async function getPrice(listingId) {
                    var price = 0
                    await database.collection('listings').doc(listingId).get().then(doc => {
                        let data = doc.data()
                        price = data['price']
                    })
                    return price
                }
                // wait to get the rate
                let hourlyRate = await getPrice(listingId)
                // get total spending on this cafe
                let totalSpending = duration * hourlyRate
                */

                var month = doc['month']

                // var year = doc['year'] // maybe we dont add year? gets q complicated
                // add this spending to the corresponding month visited
                monthlyRevenue[`${month}`] = doc['revenue']
                monthlyBookings[`${month}`] = doc['bookings']
                monthlyRatings[`${month}`] = doc['ratings']
                monthlyClicks[`${month}`] = doc['clicks']
            })

            this.totalMonthlyRevenue = monthlyRevenue
            this.totalMonthlyBookings = monthlyBookings
            this.totalMonthlyRatings = monthlyRatings
            this.totalMonthlyClicks = monthlyClicks
            console.log(this.totalMonthlyRevenue)

            // get datacollection to have values. 
            // labels will be months, data will be the totalspendings. 
            this.mrData = {
                labels: Object.keys(this.totalMonthlyRevenue),
                datasets: [{
                    label: 'Total Monthly Revenue',
                    backgroundColor: '#f87979',
                    data: Object.values(this.totalMonthlyRevenue),
                    fill: false,
                    borderColor:'#f87979',
                }]
            }

            this.mbData = {
                labels: Object.keys(this.totalMonthlyBookings),
                datasets: [{
                    label: 'Total Monthly Bookings',
                    backgroundColor: '#0077b6',
                    data: Object.values(this.totalMonthlyBookings),
                    fill: false,
                    borderColor:'#0077b6',
                }]
            }

            this.mrtgData = {
                labels: Object.keys(this.totalMonthlyRatings),
                datasets: [{
                    label: 'Average Monthly Ratings',
                    backgroundColor: '#fca311',
                    data: Object.values(this.totalMonthlyRatings),
                    fill: false,
                    borderColor:'#fca311',
                }]
            }

            this.mcData = {
                labels: Object.keys(this.totalMonthlyClicks),
                datasets: [{
                    label: 'Total Monthly Clicks',
                    backgroundColor: '#90be6d',
                    data: Object.values(this.totalMonthlyClicks),
                    fill: false,
                    borderColor:'#90be6d',
                }]
            }
        },

        fetchTime: async function() {
            // wait to get all my bookings and store to local variable
            this.timeslots = await this.getTimeData()
            // create month:totalSpending pair object
            var timeRevenue = {
                '0000 - 0100':0,
                '0100 - 0200':0,
                '0200 - 0300':0,
                '0300 - 0400':0,
                '0400 - 0500':0,
                '0500 - 0600':0,
                '0600 - 0700':0,
                '0700 - 0800':0,
                '0800 - 0900':0,
                '0900 - 1000':0,
                '1000 - 1100':0,
                '1100 - 1200':0,
                '1200 - 1300':0,
                '1300 - 1400':0,
                '1400 - 1500':0,
                '1500 - 1600':0,
                '1600 - 1700':0,
                '1700 - 1800':0,
                '1800 - 1900':0,
                '1900 - 2000':0,
                '2000 - 2100':0,
                '2100 - 2200':0,
                '2200 - 2300':0,
                '2300 - 0000':0,
            }

            var timeBookings = {
                '0000 - 0100':0,
                '0100 - 0200':0,
                '0200 - 0300':0,
                '0300 - 0400':0,
                '0400 - 0500':0,
                '0500 - 0600':0,
                '0600 - 0700':0,
                '0700 - 0800':0,
                '0800 - 0900':0,
                '0900 - 1000':0,
                '1000 - 1100':0,
                '1100 - 1200':0,
                '1200 - 1300':0,
                '1300 - 1400':0,
                '1400 - 1500':0,
                '1500 - 1600':0,
                '1600 - 1700':0,
                '1700 - 1800':0,
                '1800 - 1900':0,
                '1900 - 2000':0,
                '2000 - 2100':0,
                '2100 - 2200':0,
                '2200 - 2300':0,
                '2300 - 0000':0,
            }

            this.timeslots.forEach(async function(doc) {
             
                var time = doc['id']

                // var year = doc['year'] // maybe we dont add year? gets q complicated
                // add this spending to the corresponding month visited
                timeRevenue[`${time}`] = doc['revenue']
                timeBookings[`${time}`] = doc['bookings']
            })

            this.totalTimeRevenue = timeRevenue
            this.totalTimeBookings = timeBookings

            console.log(this.totalTimeRevenue)

            // get datacollection to have values. 
            // labels will be months, data will be the totalspendings. 
            this.trData = {
                labels: Object.keys(this.totalTimeRevenue),
                datasets: [{
                    label: 'Total Revenue by Timeslots',
                    backgroundColor: '#f87979',
                    data: Object.values(this.totalTimeRevenue),
                    fill: false,
                    borderColor:'#f87979',
                }]
            }

            this.tbData = {
                labels: Object.keys(this.totalTimeBookings),
                datasets: [{
                    label: 'Total Bookings by Timeslots',
                    backgroundColor: '#0077b6',
                    data: Object.values(this.totalTimeBookings),
                    fill: false,
                    borderColor:'#0077b6',
                }]
            }
        },
    }
};
</script>

<style>
.subheader {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 40px;
  margin-bottom: 15px;
  width: 30%;
  margin: auto;
  padding-top: 5px;
  padding-bottom: 5px;
  border: 2px solid grey;
}

.button {
    margin-top: 15px;
}
.charts {
    margin-top: 15px;
}
</style>
