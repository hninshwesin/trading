<template>
  <q-page class="text-center" padding>
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Your Order History</div>
        </q-card-section>
        <q-table
          :dense="$q.screen.lt.md"
          :rows="data"
          :columns="columns"
          row-key="name"
          :pagination="initialPagination"
          :filter="filter"
          binary-state-sort
          :wrap-cells="wrap_cell"
        >
          <template v-slot:top-left>
            <q-btn
              color="secondary"
              icon-right="archive"
              label="Export to csv"
              no-caps
              @click="exportTable"
            />
          </template>
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
          <template v-slot:body-cell-stock_rate="props">
            <q-td :props="props">
              <div>
                <q-badge
                  color="purple"
                  class="text-subtitle1"
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
                  class="text-subtitle1"
                  :label="props.value"
                />
              </div>
              <div class="my-table-details">
                {{ props.row.bid_compare.created_at }}
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
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
  name: "OrderHistory",
  data() {
    return {
      data: [],
      filter: "",
      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 10,
      },
      // separator: "cell",
      wrap_cell: true,
      columns: [
        {
          name: "stock_rate",
          required: true,
          align: "center",
          label: "Open Price",
          field: (row) => row.stock_rate,
          // format: (val) => `${val}`,
          // sortable: true,
          // style: "width: 500px",
          // headerStyle: "width: 500px;padding-inline: 10px",
        },
        {
          name: "end_rate",
          required: true,
          align: "center",
          label: "Close Price",
          field: (row) => row.bid_compare.end_rate,
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
          name: "status",
          required: true,
          align: "center",
          label: "Status",
          field: (row) => row.bid_compare.status,
        },
      ],
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
    api.defaults.headers.Authorization =
      `Bearer ` + localStorage.getItem("token");
    api
      .get("/api/v1/order_history")
      .then((response) => {
        this.data = response.data.data;
        // console.log(this.data);
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

<style>
.my-table-details {
  font-size: 0.85em;
  font-style: italic;
  max-width: 200px;
  white-space: normal;
  color: #555;
  margin-top: 4px;
}
</style>
