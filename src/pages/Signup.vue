<template>
  <q-page class="window-height window-width row justify-center bg-image">
    <div class="column">
      <div class="row">
        <h4 class="text-h4 text-grey full-width">Create Your <br>Account</h4>
      </div>
      <div class="row">
        <q-card
          class="q-pa-xs shadow-0"
          style="background:none;border: none"
        >
          <q-card-section>
            <q-form
              class="q-gutter-xs"
              @submit="onSubmit"
              @reset="onReset"
            >
              <q-input
                square
                clearable
                v-model="phone_number"
                type="integer"
                label="Phone Number"
              >
                <template v-slot:prepend>
                  <q-icon
                    name="person"
                  />
                </template>
              </q-input>
              <q-input
                square
                clearable
                v-model="email"
                type="email"
                label="Email"
              >
                <template v-slot:prepend>
                  <q-icon
                    name="email"
                  />
                </template>
              </q-input>
              <q-input
                square
                clearable
                v-model="password"
                type="password"
                label="Password"
              >
                <template v-slot:prepend>
                  <q-icon
                    name="lock"
                  />
                </template>
              </q-input>
              <q-input
                square
                clearable
                v-model="password_confirmation"
                type="password"
                label="password_confirmation"
              >
                <template v-slot:prepend>
                  <q-icon
                    name="lock"
                  />
                </template>
              </q-input>

              <br>

              <q-card-actions class="q-px-md">
                <q-btn
                  unelevated
                  rounded
                  color="blue-7"
                  size="md"
                  class="full-width"
                  type="submit"
                  label="Sign Up"
                />

                <q-btn
                  style="background: none"
                  label="Reset "
                  type="reset"
                  flat
                  size="md"
                >
                  <q-icon
                    name="restore"
                    color="black"
                  />
                </q-btn>

                <!-- <q-btn label="Reset" type="reset" color="primary" flat class="q-md-sm" /> -->
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
      <div class="row">
        <p class="text text-right full-width text-indigo">Already have an account? <br>
          <q-btn
            style="background: none"
            size="md"
            label="Sign In"
            to="/"
            flat
          />
        </p>

      </div>
    </div>
  </q-page>
</template>

<script>
// import { api } from 'boot/axios'

export default {
  name: 'Signup',
  data () {
    return {
      phone_number: '',
      email: '',
      password: '',
      password_confirmation: ''
    }
  },
  methods: {
    onSubmit () {
      const formData = {
        phone_number: this.phone_number,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation
      }
      this.$store.dispatch('storedata/signup', formData)
    },
    onReset () {
      this.phone_number = null
      this.email = null
      this.password = null
      this.password_confirmation = null
    }
  }
}
</script>

<style lang="scss" scoped>
.q-card {
  width: 22.5rem;
}
.bg-image {
  background-image: url("../assets/istockphoto-1143850412-170667a.jpg");
  background-size: cover;
}
.bg-field {
  background: rgba(0, 0, 0, 0.5) !important;
}
</style>
