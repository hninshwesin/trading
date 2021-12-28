<template>
  <q-page
    class="text-center"
    padding
  >
  
  <div
      class="text-h4 text-weight-bolder"
      style="color: #0892d1;padding: 20px"
    >Your Balance
      <div
        class="q-pa-md flex flex-center"
        v-for="(mydata, index) in data"
        :key="index"
      >
        <q-card
          class="my-card flex flex-center"
          bordered
        >
          <q-card-section class="text-center">
            <div
              class="text-h4 q-mt-sm q-mb-xs text-weight-bolder"
              style="color: #F4A601"
            >
              {{mydata.wallet_balance }} mmk

            </div>
          </q-card-section>
        </q-card>
        <span class="text-overline text-weight-bold">Admin Fees will take 17% from your wallet</span>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { api } from 'boot/axios';

export default defineComponent({
  name: 'wallet',
  data () {
    return {
      data: [],
      
    }
  },
  mounted () {
    console.log('mounted');
    api.defaults.headers.Authorization = `Bearer ` + localStorage.getItem('token')
    api.get('/api/v1/get_total_balance')
      .then((response) => {
        this.data = response.data.data
        // console.log(this.data)
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
