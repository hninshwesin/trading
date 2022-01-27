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
      <q-card>
        <!-- <q-card-section>
          <div class="text-h6">Your Deposit History</div>
        </q-card-section> -->
        <q-table
          :rows="deposit"
          :columns="columns"
          title="Your Deposit History"
          row-key="name"
          :pagination="initialPagination"
          :filter="filter"
          binary-state-sort
          :wrap-cells="wrap_cell"
        >
          <!-- <template v-slot:top-left>
            <q-btn
              color="secondary"
              icon-right="archive"
              label="Export to csv"
              no-caps
              @click="exportTable"
            />
          </template> -->
          <template v-slot:top-right>
            <q-input
              dense
              debounce="300"
              v-model="filter"
              placeholder="Search"
              style="width: 100px"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
        </q-table>
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
      deposit: [],
      // withdraw: [],
      filter: "",
      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 5,
      },
      // separator: "cell",
      wrap_cell: true,
      columns: [
        {
          name: "amount",
          required: true,
          align: "center",
          label: "Deposit Amount",
          field: (row) => row.amount,
          // format: (val) => `${val}`,
          // sortable: true,
          style: "width: 400px",
        },
        {
          name: "fee",
          required: true,
          align: "center",
          label: "Charges (%)",
          field: (row) => row.fee,
          // format: (val) => `${val}`,
          // sortable: true,
          style: "width: 300px",
        },
        {
          name: "created_at",
          required: true,
          align: "center",
          label: "Date",
          field: (row) => row.created_at,
          style: "width: 400px",
        },
      ],
      // withdraw_columns: [
      //   {
      //     name: "amount",
      //     required: true,
      //     align: "center",
      //     label: "Withdraw Amount",
      //     field: (row) => row.amount,
      //     // format: (val) => `${val}`,
      //     // sortable: true,
      //     style: "width: 400px",
      //   },
      //   {
      //     name: "fee",
      //     required: true,
      //     align: "center",
      //     label: "Charges (%)",
      //     field: (row) => row.fee,
      //     // format: (val) => `${val}`,
      //     // sortable: true,
      //     style: "width: 300px",
      //   },
      //   {
      //     name: "created_at",
      //     required: true,
      //     align: "center",
      //     label: "Date",
      //     field: (row) => row.created_at,
      //     style: "width: 400px",
      //   },
      // ],
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

    api.defaults.headers.Authorization =
      `Bearer ` + localStorage.getItem("token");
    api
      .get("/api/v1/deposit_history")
      .then((response) => {
        this.deposit = response.data.data;
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

    // api.defaults.headers.Authorization =
    //   `Bearer ` + localStorage.getItem("token");
    // api
    //   .get("/api/v1/withdraw_history")
    //   .then((response) => {
    //     this.deposit = response.data.data;
    //     console.log(this.data);
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
  background: #f8e5e7;
  border-color: #ff808e;
  border-radius: 20px;
}
</style>
