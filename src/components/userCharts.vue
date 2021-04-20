<template>
	<div class="chart">
        <app-header></app-header>
        <h1 class="subheader">User Statistics</h1>
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
        <form v-show="isLoaded">
            Select metric to track:
            <select @change="changeMetric" v-model="selectedMetric">
                <option v-bind:key="item" v-for="item in metricTypeArr">{{item}}</option>
            </select>
            <br><br>
            Select type of chart:
            <select v-model="selectedChartType">
                <option v-bind:key="item" v-for="item in typeChart">{{item}}</option>
            </select>
        </form>
        <bar-chart v-if="selectedChartType == 'Bar Chart' && isLoaded" :chart-data="datacollection"></bar-chart>
        <line-chart v-if="selectedChartType == 'Line Chart' && isLoaded" :chart-data="datacollection"></line-chart>
        <br><br>
        </div>
	</div>
</template>

<script>
import Header from './UI/Header.vue';
import BarChart from "../BarChart.js";
import LineChart from '../LineChart.js';
import firebase from 'firebase';
import database from '../firebase.js';

export default {

	components: {
		"bar-chart": BarChart,
        "line-chart": LineChart,
        'app-header': Header
	},

    data() {
        return {
            isLoaded: false,
            datacollection: {},
            monthlyData: {},
            monthlySpendings: {},
            metricTypeArr: ['Total Monthly Spendings','Total Monthly Hours'],
            selectedMetric: 'Total Monthly Spendings',
            typeChart: ['Bar Chart', 'Line Chart'],
            selectedChartType:'Bar Chart',
            showStatistics: false,
        }
    },

    created() {
        this.fetchItems()
    },    

    methods: {
        // retrieves from bookings collections all the documents (places I visited)
        getDoc: async function() {
            // var user = "v4oiOOJHjmTxAGYxb3sn0oZjgC73"
            var user = firebase.auth().currentUser.uid
            var b = []
            await database.collection('bookings').where('userid', '==', user).get().then(querySnapShot => {
                let myBooking = {}
                querySnapShot.docs.forEach(doc => {
                    myBooking = {...doc.data(), ['id']: doc.id}
                    b.push(myBooking)
                })
            })
            return b
        },

        show() {
            this.showStatistics = true;
            this.isLoaded = true
        },

        changeMetric: function() {
            let selected = this.selectedMetric
            if (selected == 'Total Monthly Spendings') {
                this.datacollection = this.monthlyData
            } else if (selected == 'Total Monthly Hours') {
                this.datacollection = this.monthlySpendings
            }
        },

        

        fetchItems: async function() {
            // wait to get all my bookings and store to local variable
            var documents = await this.getDoc()
    
            var collectedData1 = {
                labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                datasets: [{
                    label: 'Total Monthly Spendings',
                    backgroundColor: '#f87979',
                    borderColor:'#f87979',
                    fill: false,
                    data: [0,0,0,0,0,0,0,0,0,0,0,0]
                }]
            }

            var collectedData2 = {
                labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                datasets: [{
                    label: 'Total Monthly Hours Spent',
                    backgroundColor: '#228B22',
                    borderColor: '#228B22',
                    fill: false,
                    data: [0,0,0,0,0,0,0,0,0,0,0,0]
                }]
            }

            var promisedData = new Promise((resolve) => {

                documents.forEach(async function(doc, i) {
                    // timestamp
                    let dateOfVisit = doc['date']
                    // timestamp into string
                    let dateInString = dateOfVisit.toDate().toDateString()
                    // extract the month. E.g Apr
                    let month = dateInString.slice(4,7)
                    // get listingId corresponding to this listing 
                    let listingId = doc['location']
                    // get the array of timings booked
                    let time = doc['time']                 
                    // since each element in the time array is 1 hour long, its length == total number of hours booked
                    let duration = time.length                    
                    // retrieves the 'price' field which is the hourly rate of the listing
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

                    // add this spending and duration to the corresponding month visited                    
                    if (month == "Jan") {
                        collectedData1.datasets[0].data[0] += totalSpending
                        collectedData2.datasets[0].data[0] += duration
                        
                    } else if (month == 'Feb') {
                        collectedData1.datasets[0].data[1] += totalSpending
                        collectedData2.datasets[0].data[1] += duration
                        
                    } else if (month == 'Mar') {
                        collectedData1.datasets[0].data[2] += totalSpending
                        collectedData2.datasets[0].data[2] += duration
                                     
                    } else if (month == 'Apr') {
                        collectedData1.datasets[0].data[3] += totalSpending
                        collectedData2.datasets[0].data[3] += duration
                        
                    } else if (month == 'May') {
                        collectedData1.datasets[0].data[4] += totalSpending
                        collectedData2.datasets[0].data[4] += duration
                        
                    } else if (month == 'Jun') {
                        collectedData1.datasets[0].data[5] += totalSpending
                        collectedData2.datasets[0].data[5] += duration
                        
                    } else if (month == 'Jul') {
                        collectedData1.datasets[0].data[6] += totalSpending
                        collectedData2.datasets[0].data[6] += duration
                        
                    } else if (month == 'Aug') {
                        collectedData1.datasets[0].data[7] += totalSpending
                        collectedData2.datasets[0].data[7] += duration
                        
                    } else if (month == 'Sep') {
                        collectedData1.datasets[0].data[8] += totalSpending
                        collectedData2.datasets[0].data[8] += duration
                        
                    } else if (month == 'Oct') {
                        collectedData1.datasets[0].data[9] += totalSpending
                        collectedData2.datasets[0].data[9] += duration
                        
                    } else if (month == 'Nov') {
                        collectedData1.datasets[0].data[10] += totalSpending
                        collectedData2.datasets[0].data[10] += duration
                        
                    } else if (month == 'Dec') {
                        collectedData1.datasets[0].data[11] += totalSpending
                        collectedData2.datasets[0].data[11] += duration
                        
                    }
                    if (i == documents.length - 1) resolve()
                })
                
            })
            promisedData.then(() => {
                this.monthlyData = collectedData1
                this.monthlySpendings = collectedData2
                this.datacollection = collectedData1
            })
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
