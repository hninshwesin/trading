<template>
  <q-page class="text-center">
    <!-- <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    > -->

    <!-- <div class="tradingview-widget-container">
      <div id="tradingview_acc89"></div>
      <div class="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/symbols/NASDAQ-AAPL/"
          rel="noopener"
          target="_blank"
          ><span class="blue-text">AAPL Chart</span></a
        >
        by TradingView
      </div>
    </div> -->

    <div id="chart">
      <apexchart
        type="candlestick"
        height="350"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>

    <div class="q-pa-md text-h5">Current Price {{ current_price }}</div>

    <div class="q-pa-md items-start">
      <q-card class="my-card full-width" bordered>
        <q-card-section>
          <div
            v-for="(mydata, index) in data"
            :key="index"
            class="text-subtitle1"
            style="color: #242c33"
          >
            Your Current Balance is {{ mydata.wallet_balance }} MMK
          </div>
        </q-card-section>
        <!-- <q-form @submitBuy="onSubmitBuy" @submitSell="onSubmitSell"> -->
        <q-form @submit.prevent="">
          <q-card-section>
            <div class="input">
              <q-select
                rounded
                outlined
                v-model="amount"
                :options="amount_options"
                label="Choose Amount"
                label-color="primary"
                bg-color="secondary"
                dark
                standout
                :rules="[(val) => (val && val != null) || 'Field is required']"
              >
                <template v-slot:before>
                  <span style="color: black; font-size: 18px">Amount</span>
                </template>
              </q-select>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="minute">
              <q-select
                rounded
                outlined
                v-model="minute"
                :options="options"
                label="Choose Minute"
                label-color="primary"
                bg-color="secondary"
                dark
                standout
                :rules="[(val) => (val && val != null) || 'Field is required']"
              >
                <template v-slot:before>
                  <span style="color: black; font-size: 18px">Minute</span>
                </template>
              </q-select>
            </div>
          </q-card-section>
          <div class="flex flex-center">
            <q-card-section>
              <!-- <q-btn class="buy" label=" BUY " type="submitBuy" /> -->
              <!-- <q-btn class="buy" label=" BUY " @click="BuySubmit" /> -->
              <q-btn
                class="buy"
                label=" BUY "
                type="submit"
                @click="BuySubmit"
              />
            </q-card-section>
            <q-card-section>
              <!-- <q-btn class="sell" label=" SELL " type="submitSell" /> -->
              <!-- <q-btn class="sell" label=" SELL " @click="SellSubmit" /> -->
              <q-btn
                class="sell"
                label=" SELL "
                type="submit"
                @click="SellSubmit"
              />
            </q-card-section>
          </div>
        </q-form>
      </q-card>
    </div>

    <!-- <div class="q-pa-md text-center" > -->
    <q-card
      class="col-8 justify-center text-h5 text-center text-weight-bold"
      v-if="current_order.stock_rate"
    >
      <q-card-section>
        <div class="text-h6 text-weight-bold doc-token">
          Open Price is {{ current_order.stock_rate }}
        </div>
      </q-card-section>
    </q-card>
    <!-- </div> -->
    <!-- <div class="q-pa-md text-center" > -->
    <!-- <q-card
      class="col-8 justify-center text-h5 text-center text-weight-bold"
      v-else
    >
      <q-card-section>
        <q-badge
          color="black"
          class="text-subtitle2 text-weight-bold"
          outline
          align="middle"
        >
          <q-icon name="warning" color="warning" size="20px" class="q-ml-xs" />
          Currently you doesn't have any buy or sell price
        </q-badge>
      </q-card-section>
    </q-card> -->
    <!-- </div> -->

    <q-separator />

    <!-- <div class="q-pa-md doc-container">
      <div class="text-h6 title">Your Last Order</div>
      <div class="row items-center">
        <div class="col">Open Price</div>
        <div class="col">Close Price</div>
        <div class="col">Amount</div>
      </div>
      <div class="row items-center">
        <div class="col">
          {{ order.stock_rate }}
          <div>{{ order.created_at }}</div>
        </div>
        <div class="col">
          {{ order_compare.end_rate }}
          <div>{{ order_compare.created_at }}</div>
        </div>
        <div class="col">
          <div
            v-if="order_compare.status === 0"
            style="background-color: yellow"
          >
            {{ order.amount }}
          </div>
          <div
            v-if="order_compare.status === 1"
            style="background-color: green"
          >
            {{ order.amount }}
          </div>
          <div v-if="order_compare.status === 2" style="background-color: red">
            {{ order.amount }}
          </div>
        </div>
      </div>
    </div> -->
    <!-- <q-icon name="fas fa-exchange-alt" color="black" /> -->
    <!-- <q-icon name="fas fa-level-up-alt" color="black" /> -->
    <!-- <q-icon name="fas fa-level-down-alt" color="black" /> -->
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Current Order</div>
        </q-card-section>
        <q-table
          :dense="$q.screen.lt.md"
          :rows="order"
          :columns="columns"
          row-key="name"
          no-data-label="You don't have any order currently"
        >
          <template v-slot:body-cell-stock_rate="props">
            <q-td :props="props">
              <div>
                <q-badge
                  color="purple"
                  class="text-subtitle2"
                  :label="props.value"
                />
              </div>
              <div class="my-table-details">
                {{ props.row.created_at }}
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-end_rate="props">
            <q-td :props="props">
              <div>
                <q-badge
                  color="purple"
                  class="text-subtitle2"
                  :label="props.value"
                />
              </div>
              <div class="my-table-details" v-if="props.row.bid_compare">
                {{ props.row.bid_compare.created_at }}
              </div>
              <div class="my-table-details" v-else></div>
            </q-td>
          </template>
          <template v-slot:body-cell-bid_status="props">
            <q-td :props="props">
              <div v-if="!props.row.bid_status">
                <q-badge
                  color="green"
                  label="BUY"
                  class="text-caption text-weight-bold"
                />
              </div>
              <div v-if="props.value">
                <q-badge
                  color="red"
                  label="SELL"
                  class="text-caption text-weight-bold"
                />
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <div v-if="props.row.bid_compare">
                <div v-if="props.value == 1">
                  <q-badge
                    color="green"
                    label="WIN"
                    class="text-caption text-weight-bold"
                  />
                </div>
                <div v-if="props.value == 2">
                  <q-badge
                    color="red"
                    label="LOSS"
                    class="text-caption text-weight-bold"
                  />
                </div>
                <div v-if="props.value == 0">
                  <q-badge
                    color="yellow"
                    label="STABLE"
                    class="text-caption text-weight-bold"
                  />
                </div>
              </div>
              <div v-else>-</div>
            </q-td>
          </template>
          <!-- <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="calories" :props="props">
              <q-badge color="green">
                {{ props.row.name }}
              </q-badge>
            </q-td>
          </q-tr>
        </template> -->
        </q-table>
      </q-card>
    </div>
    <div class="col">
      <q-btn
        class="text-subtitle1 text-weight-bold"
        color="deep-orange-10"
        dense
        round
        flat
        @click="$router.push('order_history')"
        label="Check Order History >>"
        no-caps
      ></q-btn>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { api } from "boot/axios";
import Pusher from "pusher-js"; // import Pusher
// import { loadScript } from "vue-plugin-load-script";
import dayjs from "dayjs";

export default defineComponent({
  name: "PageIndex",
  data() {
    return {
      series: [
        {
          data: [],

          // data: [
          //   { x: 1638773914000, y: [2773.34, 2787.83, 2780.8, 2784.55] },
          //   { x: 1638773915000, y: [2753.34, 2787.83, 2780.8, 2784.55] },
          //   { x: 1638773916000, y: [2783.34, 2783.83, 2780.8, 2784.55] },
          //   { x: 1638773917000, y: [2883.34, 2787.83, 2780.8, 2780] },
          // ],
        },
      ],
      chartOptions: {
        chart: {
          type: "candlestick",
          height: 500,
        },
        title: {
          text: "CandleStick Chart",
          align: "left",
        },
        xaxis: {
          // type: "datetime",
          type: "category",
          labels: {
            formatter: function (val) {
              // return dayjs(val).format("MMM DD HH:mm:ss");
              // return dayjs(val).tz("Asia/Yangon").format("HH:mm");
              return dayjs(val).format("HH:mm");
            },
          },
        },
        yaxis: {
          tooltip: {
            enabled: true,
          },
          // min: "",
          // max: "",
        },
      },
      amount: "",
      amount_options: [
        { label: "100", value: "100" },
        { label: "300", value: "300" },
        { label: "500", value: "500" },
        { label: "700", value: "700" },
        { label: "900", value: "900" },
        { label: "1000", value: "1000" },
      ],
      minute: "",
      options: [
        { label: "1 minute", value: "1" },
        { label: "3 minute", value: "3" },
        { label: "5 minute", value: "5" },
      ],
      // buy_popup : false
      data: [],
      order: [],
      current_order: "",
      // order_minute: null,
      columns: [
        {
          name: "stock_rate",
          required: true,
          align: "center",
          label: "Open Price",
          field: (row) => row.stock_rate,
          format: (val) => `${val}`,
          // sortable: true,
          // style: "width: 500px",
          // headerStyle: "width: 500px;padding-inline: 10px",
        },
        {
          name: "end_rate",
          required: true,
          align: "center",
          label: "Close Price",
          field: (row) => (row.bid_compare ? row.bid_compare.end_rate : ""),
          // format: (val) => `${val}`,
          // sortable: true,
          // style: "width: 500px",
          // headerStyle: "width: 500px;padding-inline: 10px",
        },
        {
          name: "amount",
          required: true,
          align: "center",
          label: "Amount",
          field: "amount",
        },
        {
          name: "bid_status",
          required: true,
          align: "center",
          label: "Bid Status",
          field: (row) => row.bid_status,
          // format: (val) => `${val}`,
          // sortable: true,
          // style: "width: 500px",
          // headerStyle: "width: 500px;padding-inline: 10px",
        },
        {
          name: "status",
          required: true,
          align: "center",
          label: "Status",
          field: (row) => (row.bid_compare ? row.bid_compare.status : ""),
        },
      ],
      current_price: 1800,
    };
  },
  created() {
    api.defaults.headers.Authorization =
      `Bearer ` + localStorage.getItem("token");
    api
      .get("/api/v1/service_start")
      .then((response) => {
        this.series[0].data = response.data.data;
        console.log(this.series[0].data);
        // this.series[0].chartOptions.yaxis.max = response.data.high_price;
        // this.series[0].chartOptions.yaxis.min = response.data.low_price;
      })
      .catch(() => {
        this.$q.notify({
          color: "negative",
          position: "top",
          message: "Loading failed",
          icon: "report_problem",
        });
      });
    // ...
    // this.$loadScript("https://s3.tradingview.com/tv.js")
    //   .then(() => {
    //     new TradingView.widget({
    //       width: 980,
    //       height: 610,
    //       symbol: "NASDAQ:AAPL",
    //       interval: "D",
    //       timezone: "Etc/UTC",
    //       theme: "light",
    //       style: "1",
    //       locale: "en",
    //       toolbar_bg: "#f1f3f6",
    //       enable_publishing: false,
    //       allow_symbol_change: true,
    //       container_id: "tradingview_acc89",
    //     });
    //   })
    //   .catch(() => {
    //     // Failed to fetch script
    //   });

    this.subscribe();

    api.defaults.headers.Authorization =
      `Bearer ` + localStorage.getItem("token");
    api.get("/api/v1/today_order_history").then((response) => {
      this.order = response.data.data;
      // console.log(this.order);
      // console.log(this.order.bid_compare);
    });

    api.defaults.headers.Authorization =
      `Bearer ` + localStorage.getItem("token");
    api
      .get("/api/v1/get_total_balance")
      .then((response) => {
        this.data = response.data.data;
        // console.log(this.data)
      })
      .catch(() => {
        this.$q.notify({
          color: "negative",
          position: "top",
          message: "Loading failed",
          icon: "report_problem",
        });
      });
  },

  methods: {
    subscribe() {
      const app = this;
      Pusher.logToConsole = true;
      var pusher = new Pusher("4049c3e38649d1f7df88", {
        cluster: "ap1",
        forceTLS: true,
      });
      var channel = pusher.subscribe("goldapiData");
      channel.bind("App\\Events\\GoldPriceSend", function (data) {
        if (app.series[0].data.length > 10) app.series[0].data.shift();
        app.series[0].data.pop();
        app.series[0].data = app.series[0].data.concat(data.goldapi);
        console.log(app.series[0].data);
      });
      var channel = pusher.subscribe("everysecond_goldapiData");
      channel.bind("App\\Events\\GoldPriceSendEverySecond", function (data) {
        // app.series[0].data.pop();
        // app.series[0].data.push(data.everysecond_goldapi);
        app.series[0].data[app.series[0].data.length - 1] =
          data.everysecond_goldapi;
        console.log(app.series[0].data);
      });
      channel.bind("App\\Events\\CurrentPrice", function (data) {
        app.current_price = data.current_price;
        console.log(data);
      });
    },
    BuySubmit() {
      // if (this.minute.value != null && this.amount.length != 0) {
      if (this.amount.value != null && this.minute.value != null) {
        // this.buy_popup = true;
        console.log(this.amount.value);
        console.log(this.minute.value);

        const formData = new FormData();
        formData.append("amount", this.amount.value);
        formData.append("minute", this.minute.value);
        api.defaults.headers.Authorization =
          `Bearer ` + localStorage.getItem("token");
        api
          .post("/api/v1/buy_order_create", formData)
          .then((response) => {
            console.log("buy");
            console.log(response.data);
            console.log(response.data.error_code);
            console.log(response.data.order.bid_status);
            if (response.data.error_code === "0") {
              this.order.push(response.data.order);
              this.current_order = response.data.order;
              console.log(this.current_order);
              console.log(response.data.order.minute);
              if (response.data.order.minute === "1") {
                // console.log("hello 1 minute");
                setTimeout(function () {
                  // this.$router.go('/home')
                  location.reload();
                }, 63000);
              }
              if (response.data.order.minute === "3") {
                // console.log("hello 3 minute");
                setTimeout(function () {
                  location.reload();
                }, 183000);
              }
              if (response.data.order.minute === "5") {
                // console.log("hello 5 minute");
                setTimeout(function () {
                  location.reload();
                }, 303000);
              }

              this.$q.notify({
                type: "positive",
                message: response.data.message,
              });
            } else {
              this.$q.notify({
                type: "negative",
                message: response.data.message,
              });
            }
          })
          .catch((err) => {
            this.$q.notify({
              type: "negative",
              message: err.response.data.message,
            });
          });
      } else {
        this.$q.notify({
          type: "negative",
          message: "Field is required",
        });
      }
    },
    SellSubmit() {
      // if (this.minute.value != null && this.amount.length != 0) {
      if (this.amount.value != null && this.minute.value != null) {
        // this.buy_popup = true;
        console.log(this.amount.value);
        console.log(this.minute.value);

        const formData = new FormData();
        formData.append("amount", this.amount.value);
        formData.append("minute", this.minute.value);
        api.defaults.headers.Authorization =
          `Bearer ` + localStorage.getItem("token");
        api
          .post("/api/v1/sell_order_create", formData)
          .then((response) => {
            console.log("buy");
            console.log(response.data.order.bid_status);
            if (response.data.error_code === "0") {
              this.order.push(response.data.order);
              this.current_order = response.data.order;
              console.log(this.current_order);
              console.log(response.data.order.minute);
              if (response.data.order.minute === "1") {
                // console.log("hello 1 minute");
                setTimeout(function () {
                  // this.$router.go('/home')
                  location.reload();
                }, 63000);
              }
              if (response.data.order.minute === "3") {
                // console.log("hello 3 minute");
                setTimeout(function () {
                  location.reload();
                }, 183000);
              }
              if (response.data.order.minute === "5") {
                // console.log("hello 5 minute");
                setTimeout(function () {
                  location.reload();
                }, 303000);
              }

              this.$q.notify({
                type: "positive",
                message: response.data.message,
              });
            } else {
              this.$q.notify({
                type: "negative",
                message: response.data.message,
              });
            }
          })
          .catch((err) => {
            // console.log(err.response.data)
            this.$q.notify({
              type: "negative",
              message: err.response.data.message,
            });
          });
      } else {
        this.$q.notify({
          type: "negative",
          message: "Field is required",
        });
      }
    },
  },
  mounted() {
    console.log("mounted");
    // if (this.order_minute === 1) {
    //   console.log("hello" + this.order_minute);
    //   setTimeout(function () {
    //     location.reload();
    //   }, 300000);
    // }
    // if (this.order_minute === 3) {
    //   console.log("hello" + this.order_minute);
    //   setTimeout(function () {
    //     location.reload();
    //   }, 300000);
    // }
    // if (this.order_minute === 5) {
    //   console.log("hello" + this.order_minute);
    //   setTimeout(function () {
    //     location.reload();
    //   }, 300000);
    // }

    // console.log(this.series[0].data);
    // setTimeout(() => {
    //   // console.log(this.series[0].data[0].x)
    //   this.series[0].data.push(
    //     {
    //       x: 1638773918000,
    //       y: [2587.81, 2595, 2583.27, 2591.96],
    //     },
    //     {
    //       x: 1638773920000,
    //       y: [2604.98, 2606, 2604.07, 2604],
    //     }
    //     // [
    //     //   {
    //     //           x: new Date(1538865000000),
    //     //           y: [6587.81, 6595, 6583.27, 6591.96]
    //     //         },
    //     //         {
    //     //           x: new Date(1538884800000),
    //     //           y: [6604.98, 6606, 6604.07, 6606]
    //     //         },
    //     // ]
    //   );
    // }, 5000);

    // console.log(this.series[0].data);

    // api.defaults.headers.Authorization =
    //   `Bearer ` + localStorage.getItem("token");
    // api
    //   .get("/api/v1/service_start")
    //   .then((response) => {
    //     this.series[0].data = response.data.data;
    //     console.log(this.series[0].data);
    //   })
    //   .catch(() => {
    //     this.$q.notify({
    //       color: "negative",
    //       position: "top",
    //       message: "Loading failed",
    //       icon: "report_problem",
    //     });
    //   });
  },
});
</script>

<style scoped>
.my-card {
  background-color: #daf8e1;
  border-radius: 25px;
  border: 5px solid #9cedaf;
  box-shadow: 2px 2px 22px -2px rgba(0, 0, 0, 0.25);
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
  color: black;
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
  background-color: rgb(42, 211, 42);
  font-size: 18px;
  color: white;
  letter-spacing: 0px;
  line-height: 1.2;
  /* padding: 0 20px */
}

.sell {
  padding-top: 8px;
  overflow: visible;
  white-space: pre;
  font-weight: 599;
  font-family: ".SFNSDisplay-Semibold", "SFProDisplay-Semibold",
    "SFUIDisplay-Semibold", ".SFUIDisplay-Semibold", "SF Pro Display",
    "-apple-system", "BlinkMacSystemFont", sans-serif;
  background-color: red;
  font-size: 18px;
  color: white;
  letter-spacing: 0px;
  line-height: 1.2;
  /* padding: 0 20px */
}

.doc-token {
  background: #ffdfe3;
  border-color: #ff808e;
  border-radius: 20px;
}

.row > div {
  padding: 10px 15px;
  background: rgba(86, 61, 124, 0.15);
  border: 1px solid rgba(86, 61, 124, 0.2);
}

.title {
  margin-bottom: 1rem;
}
</style>
