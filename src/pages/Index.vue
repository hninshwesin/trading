<template>
  <q-page
    class="text-center"
    padding
  >
    <!-- <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    > -->
    <div id="chart">
      <apexchart type="candlestick" height="350" :options="chartOptions" :series="series"></apexchart>
  </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { api } from 'boot/axios';
import Pusher from 'pusher-js' // import Pusher

export default defineComponent({
  name: 'PageIndex',
  data () {
    return {
      series: [{
        data: []

        // data: [ 
        //   { 
        //     x: 1638773914000, 
        //     y: [ 1783.34, 1787.83, 1780.8, 1784.55 ] 
        //   }, 
        //   { x: 1638773915000, 
        //   y: [ 1783.34, 1787.83, 1780.8, 1784.55 ] 
        //   }, 
        //   { x: 1638773916000, 
        //   y: [ 1783.34, 1787.83, 1780.8, 1784.55 ] 
        //   }, 
        //   { x: 1638773917000, 
        //   y: [ 1883.34, 1787.83, 1780.8, 1784.59 ] 
        //   } 
        // ]
      }],
      chartOptions: {
        chart: {
          type: 'candlestick',
          height: 500
        },
        title: {
          text: 'CandleStick Chart',
          align: 'left'
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: {
          tooltip: {
            enabled: true
          }
        },
      },
    }
  },
  created () {
    // ...
    this.subscribe()
  },
  methods: {
    // ...
    subscribe () {
      const app = this
      Pusher.logToConsole = true

      var pusher = new Pusher('4049c3e38649d1f7df88', { cluster: 'ap1', forceTLS: true })
      var channel = pusher.subscribe('goldapiData')
      channel.bind('App\\Events\\GoldPriceSend', function (data) {
        app.series[0].data.push(data.goldapi)
      })
    }
  },
  mounted () {
    console.log('mounted');
    console.log(this.series[0].data);
    // setTimeout(() => {  
    //   // console.log(this.series[0].data[0].x)
    //   this.series[0].data.push(
    //     {
    //       x: 1638773918000,
    //       y: [3587.81, 3595, 3583.27, 3591.96]
    //     },
    //     {
    //       x: 1638773920000,
    //       y: [2604.98, 2606, 2604.07, 2604]
    //     },
    //   // [
    //   //   {
    //   //           x: new Date(1538865000000),
    //   //           y: [6587.81, 6595, 6583.27, 6591.96]
    //   //         },
    //   //         {
    //   //           x: new Date(1538884800000),
    //   //           y: [6604.98, 6606, 6604.07, 6606]
    //   //         },
    //   // ]
    // )}, 5000);

    // console.log(this.series[0].data);


    api.defaults.headers.Authorization = `Bearer ` + localStorage.getItem('token')
    api.get('/api/v1/service_start')
      .then((response) => {
        this.series[0].data = response.data.data
        // console.log(this.series[0].data)
      })
      .catch(() => {
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: 'Loading failed',
          icon: 'report_problem'
        })
      })
  },
})

</script>
