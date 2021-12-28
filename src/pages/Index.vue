<template>
  <q-page
    class="text-center"
  >
    <!-- <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    > -->

    <div class="tradingview-widget-container">
    <div id="tradingview_acc89"></div>
    <div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/NASDAQ-AAPL/" rel="noopener" target="_blank"><span class="blue-text">AAPL Chart</span></a> by TradingView</div>
    </div>

    <!-- <div id="chart">
      <apexchart type="candlestick" height="350" :options="chartOptions" :series="series"></apexchart>
    </div> -->

    <div class="q-pa-md items-start">
        <q-card class="my-card full-width" bordered>
          <q-form @submit="onSubmit">
            <q-card-section>
              <div class="input">
                <q-input rounded outlined v-model="amount" label="Amount" label-color="primary" bg-color="secondary" type="number" dark standout :rules="[val => !!val || 'Field is required']">
                  <template v-slot:before>
                    <span style="color: black;font-size: 18px">Amount</span>
                  </template>
                </q-input>
              </div>
            </q-card-section>
            <q-card-section>
              <div class="minute">
                <q-select rounded outlined v-model="minute" :options="options" label="Choose Minute" label-color="primary" bg-color="secondary" dark standout :rules="[ val => val && val != null || 'Field is required']">
                  <template v-slot:before>
                    <span style="color: black;font-size: 18px">Minute</span>
                  </template>
                </q-select>
              </div>
            </q-card-section>
            <q-card-section>
              <q-btn class="buy" label=" BUY " type="submit"/>
            </q-card-section>
          </q-form>
            
        </q-card>

    </div>

    <q-separator/>

    <div class="q-pa-md doc-container">
      <div class="text-h6 title">Your Last Order</div>
      <div class="row items-center">
        <div class="col">
          Open Price
        </div>
        <div class="col">
          Close Price
        </div>
        <div class="col">
          Amount
        </div>
      </div>
      <div class="row items-center">
        <div class="col">
          {{order.stock_rate}}
        </div>
        <div class="col">
          {{order_compare.end_rate}}
        </div>
        <div class="col">
          <div v-if="order_compare.status === 0" style="background-color: yellow">
            {{order.amount}} <q-icon name="fas fa-exchange-alt" color="black" />
          </div>
          <div v-if="order_compare.status === 1" style="background-color: green">
            {{order.amount}} <q-icon name="fas fa-level-up-alt" color="black" />
          </div>
          <div v-if="order_compare.status === 2" style="background-color: red">
            {{order.amount}} <q-icon name="fas fa-level-down-alt" color="black" />
          </div>
        </div>
      </div>
    </div>

  </q-page>
</template>

<script>

import { defineComponent } from 'vue';
import { api } from 'boot/axios';
import Pusher from 'pusher-js' // import Pusher
// import { loadScript } from "vue-plugin-load-script";

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
      amount: '',
      minute: '',
      options: [
        { label: '1 minute', value: '1' },
        { label: '3 minute', value: '3' },
        { label: '5 minute', value: '5' }
      ],
      // buy_popup : false
      order: {},
      order_compare: {},
    }
  },
  created () {
    // ...
    this.$loadScript("https://s3.tradingview.com/tv.js")
    .then(() => {
        new TradingView.widget(
    {
    "width": 980,
    "height": 610,
    "symbol": "NASDAQ:AAPL",
    "interval": "D",
    "timezone": "Etc/UTC",
    "theme": "light",
    "style": "1",
    "locale": "en",
    "toolbar_bg": "#f1f3f6",
    "enable_publishing": false,
    "allow_symbol_change": true,
    "container_id": "tradingview_acc89"
  }
    );
    })
    .catch(() => {
      // Failed to fetch script
    });
    
    this.subscribe()

    api.defaults.headers.Authorization = `Bearer ` + localStorage.getItem('token')
    api.get('/api/v1/last_order_history')
      .then((response) => {
        this.order = response.data.data
        this.order_compare = this.order.bid_compare
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

  watch: {

            timerCount: {
                handler(value) {

                    if (value > 0) {
                        setTimeout(() => {
                            this.timerCount--;
                        }, 1000);
                    }

                },
                immediate: true // This ensures the watcher is triggered upon creation
            }

        }

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
    },
    onSubmit() {
      if(this.minute.value != null && this.amount.length != 0) {
        // this.buy_popup = true;
      // console.log(this.amount)
      // console.log(this.minute.value)
      
      const formData =  new FormData()
      formData.append('amount', this.amount)
      formData.append('minute', this.minute.value)
      api.defaults.headers.Authorization = `Bearer ` + localStorage.getItem('token')
      api.post('/api/v1/order_create', formData)
        .then((response) => {
          if (response.data.error_code === '0') {
            // this.order = response.data.order
            // console.log(this.order)
            this.$q.notify({
              type: 'positive',
              message: response.data.message
            })
            this.$router.push('/home')
          } else {
            this.$q.notify({
            type: 'negative',
            message: response.data.message
          })
          }
        })
        .catch((err) => {
          // console.log(err.response.data)
          this.$q.notify({
            type: 'negative',
            message: err.response.data.message
          })
        })
      } else {
        this.$q.notify({
            type: 'negative',
            message: 'Field is required'
          })
      }
      
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

<style scoped>
.my-card {
  background-color: #daf8e1;
  border-radius: 25px;
  border: 5px solid #9cedaf
}
.input {
  width: auto; /* 151px */
  height: 50px; /* 19px */
  overflow: visible;
  white-space: pre;
  font-weight: 599;
  font-family: ".SFNSDisplay-Semibold", "SFProDisplay-Semibold",
    "SFUIDisplay-Semibold", ".SFUIDisplay-Semibold", "SF Pro Display",
    "-apple-system", "BlinkMacSystemFont", sans-serif;
  font-size: 16px;
  letter-spacing: 0px;
  line-height: 1.2;
  /* padding: 0 20px */
}
.minute {
  width: auto; /* 151px */
  height: 50px; /* 19px */
  overflow: visible;
  white-space: pre;
  font-weight: 599;
  font-family: ".SFNSDisplay-Semibold", "SFProDisplay-Semibold",
    "SFUIDisplay-Semibold", ".SFUIDisplay-Semibold", "SF Pro Display",
    "-apple-system", "BlinkMacSystemFont", sans-serif;
  font-size: 16px;
  letter-spacing: 0px;
  line-height: 1.2;
  color: black;
  /* padding: 0 20px */
}
.buy {
  /* width: 300px;
  height: auto; */
  padding-top: 8px;
  overflow: visible;
  white-space: pre;
  font-weight: 599;
  font-family: ".SFNSDisplay-Semibold", "SFProDisplay-Semibold",
    "SFUIDisplay-Semibold", ".SFUIDisplay-Semibold", "SF Pro Display",
    "-apple-system", "BlinkMacSystemFont", sans-serif;
  background-color: greenyellow;
  font-size: 18px;
  letter-spacing: 0px;
  line-height: 1.2;
  /* padding: 0 20px */
}

.row > div {
  padding: 10px 15px;
  background: rgba(86,61,124,.15);
  border: 1px solid rgba(86,61,124,.2)
}
  
.title {
  margin-bottom: 1rem
}
  
</style>