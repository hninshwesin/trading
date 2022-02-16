<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card class="q-pa-md">
        <div>
          <div
            class="text-h6 text-bold text-center"
            style="color: #242c33; padding-bottom: 10px"
          >
            Fill Withdraw
          </div>
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <q-input
              filled
              type="number"
              v-model="amount"
              label="Your Withdraw Amount"
              lazy-rules
              :rules="[
                (val) => (val !== null && val !== '') || 'Please type amount',
              ]"
            />

            <q-input filled v-model="description" label="Remark" lazy-rules />

            <div>
              <q-btn label="Submit" type="submit" color="primary" />
              <q-btn
                label="Reset"
                type="reset"
                color="primary"
                flat
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </div>
      </q-card>
    </div>
    <div class="q-pa-md">
      <q-table
        :rows="withdraw"
        :columns="columns"
        title="Withdraw History"
        row-key="name"
        :pagination="initialPagination"
        :filter="filter"
        binary-state-sort
        :wrap-cells="wrap_cell"
      >
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
        <template v-slot:body-cell-approve_status="props">
          <q-td :props="props">
            <div v-if="props.row">
              <div v-if="props.value == 1">
                <q-badge
                  color="green"
                  label="Success"
                  class="text-caption text-weight-bold"
                />
              </div>
              <div v-if="props.value == 0">
                <q-badge
                  color="yellow"
                  label="Pending"
                  class="text-caption text-weight-bold"
                />
              </div>
            </div>
            <div v-else>-</div>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { api } from "boot/axios";

export default {
  name: "Withdraw",
  data() {
    return {
      amount: null,
      description: null,
      withdraw: [],
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
          label: "Amount",
          field: (row) => row.amount,
          // format: (val) => `${val}`,
          // sortable: true,
          style: "width: 500px",
        },
        // {
        //   name: "fee",
        //   required: true,
        //   align: "center",
        //   label: "Charges(%)",
        //   field: (row) => row.fee,
        //   // format: (val) => `${val}`,
        //   // sortable: true,
        //   style: "width: 300px",
        // },
        {
          name: "created_at",
          required: true,
          align: "center",
          label: "Date",
          field: (row) => row.created_at,
          style: "width: 400px",
        },
        {
          name: "approve_status",
          required: true,
          align: "center",
          label: "Approve",
          field: (row) => row.approve_status,
          style: "width: 400px",
        },
      ],
    };
  },
  created() {
    api.defaults.headers.Authorization =
      `Bearer ` + localStorage.getItem("token");
    api
      .get("/api/v1/withdraw_history")
      .then((response) => {
        this.withdraw = response.data.data;
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
    onSubmit() {
      console.log(this.amount);
      const formData = new FormData();
      formData.append("amount", this.amount);
      formData.append("description", this.description);
      api.defaults.headers.Authorization =
        `Bearer ` + localStorage.getItem("token");
      api
        .post("/api/v1/withdraw_request", formData)
        .then((response) => {
          console.log(response.data);
          if (response.data.error_code == 0) {
            this.$q.notify({
              color: "green-4",
              textColor: "white",
              icon: "cloud_done",
              message: response.data.message,
            });
            setTimeout(function () {
              // this.$router.go('/home')
              location.reload();
            }, 3000);
          }
          if (response.data.error_code == 1) {
            this.$q.notify({
              color: "negative",
              icon: "report_problem",
              message: response.data.message,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Loading failed",
            icon: "report_problem",
          });
        });
    },

    onReset() {
      this.amount = null;
      this.description = null;
    },
  },
};
</script>
