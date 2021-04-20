import { Line, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;

export default {
    extends: Line,
    mixins: [reactiveProp],
    data: function () {
      return {
          options: {
              legend: { display: false },
              title: {
                display: true
                // text: 'Total Monthly Spendings on Bookings'
              },
              responsive: true,
              maintainAspectRatio: false
          }
      }
    },
    mounted () {
      this.renderChart(this.chartData, this.options)
    }
}