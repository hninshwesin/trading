<template>
  <q-page class="text-center" padding>
    <div class="q-pa-md" style="color: #0892d1; padding: 20px">
      <q-card
        class="my-card"
        bordered
        v-for="(mydata, index) in data"
        :key="index"
      >
        <q-card-section>
          <div class="text-h5" style="color: #1d1d1d">
            95{{ mydata.phone_number }}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="text-h5" style="color: #26a69a"
          >Your Current Balance
        </q-card-section>
        <q-card-section class="text-center">
          <div class="text-h4 text-weight-bolder" style="color: #f4a601">
            {{ mydata.wallet_balance }} mmk
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="q-pa-md">
      <q-card class="card full-width" bordered>
        <!-- <q-card-section>
          <div class="text-h6">Your Deposit History</div>
        </q-card-section> -->
        <q-card-section>
          <div class="text-center deposit" @click="$router.push('/deposit')">
            Deposit Request & History
            <q-icon
              name="fas fa-arrow-circle-right"
              color="black"
              size="20px"
              class="q-ml-xs"
            />
          </div>
        </q-card-section>
      </q-card>
      <q-card class="card full-width" bordered>
        <q-card-section>
          <div class="text-center withdraw" @click="$router.push('/withdraw')">
            Withdraw Request & History
            <q-icon
              name="fas fa-arrow-circle-right"
              color="black"
              size="20px"
              class="q-ml-xs"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { api } from "boot/axios";
import { exportFile } from "quasar";

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}

export default defineComponent({
  name: "wallet",
  data() {
    return {
      data: [],
    };
  },
  methods: {
    exportTable() {
      // naive encoding to csv format
      const content = [this.columns.map((col) => wrapCsvValue(col.label))]
        .concat(
          this.data.map((row) =>
            this.columns
              .map((col) =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(",")
          )
        )
        .join("\r\n");

      const status = exportFile("table-export.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning",
        });
      }
    },
  },
  mounted() {
    console.log("mounted");
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
});
</script>

<style scoped>
.my-card {
  background: #f8e5e7;
  border-color: #ff808e;
  border-radius: 20px;
}
.card {
  /* width: 349px;
  height: 50px; */
  box-shadow: 2px 3px 22px -2px rgba(0, 0, 0, 0.25);
  background-color: #ffffff;
  overflow: visible;
  border-radius: 10px;
  margin-bottom: 10px;
}
.deposit {
  width: auto; /* 151px */
  height: auto; /* 19px */
  overflow: visible;
  white-space: pre;
  font-weight: 599;
  font-family: ".SFNSDisplay-Semibold", "SFProDisplay-Semibold",
    "SFUIDisplay-Semibold", ".SFUIDisplay-Semibold", "SF Pro Display",
    "-apple-system", "BlinkMacSystemFont", sans-serif;
  color: #f4a601;
  font-size: 16px;
  line-height: 1.2;
}
.withdraw {
  width: auto; /* 151px */
  height: auto; /* 19px */
  overflow: visible;
  white-space: pre;
  font-weight: 599;
  font-family: ".SFNSDisplay-Semibold", "SFProDisplay-Semibold",
    "SFUIDisplay-Semibold", ".SFUIDisplay-Semibold", "SF Pro Display",
    "-apple-system", "BlinkMacSystemFont", sans-serif;
  color: #f4a601;
  font-size: 16px;
  line-height: 1.2;
}
</style>
