<template>
  <q-page
    class="text-center"
    padding
  >
    <div>
      <q-card
        class="q-pa-lg shadow-0"
        style="background:none;border: none"
      >
        <q-card-section>
          <q-form
            class="q-gutter-md"
            @submit="onSubmit"
          >
            <div class="q-pa-md my-card col col-12 flex flex-center bordered">
              <q-btn
                rounded
                color="blue-7"
                size="lg"
                label="Generate Registration Code"
                type="submit"
              >
              </q-btn>
            </div>
          </q-form>

          <div
            class="text-h5 q-mt-sm q-mb-xs text-weight-bolder"
            style="color: #F4A601"
            v-if="this.code != null"
          >
            {{this.code}}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { api } from 'boot/axios';

export default defineComponent({
  name: 'registration_code',
  data () {
    return {
      code: '',
    }
  },
  methods: {
    onSubmit () {
      api.defaults.headers.Authorization = `Bearer ` + localStorage.getItem('token')
      api.post('/api/v1/generate_code')
        .then((response) => {
          const data = response.data
          this.code = data.generated_code
          const status = response.status
          if (status === 200) {
            this.$q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: 'Registration code generated Successfully'
            })
          }
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
  }
})
</script>
