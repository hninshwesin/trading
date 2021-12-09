<template>
  <q-page class="window-height window-width row justify-center bg-image">
    <div class="column">
      <div class="row">
        <h4 class="text-h4 text-grey full-width">Hello, <br>Sign in!</h4>
      </div>
      <div class="row q-mt-xl">
        <q-card
          class="q-pa-lg shadow-0"
          style="background:none;border: none"
        >
          <q-card-section>
            <q-form
              class="q-gutter-md"
              @submit="onSubmit"
            >
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
                    color="grey"
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
                    color="grey"
                  />
                </template>
              </q-input>

              <br>

              <q-card-actions class="q-px-md">
                <q-btn
                  rounded
                  color="blue-7"
                  size="md"
                  class="full-width"
                  type="submit"
                  label="Sign In"
                />
                <!-- <q-btn
                  style="background: none"
                  label="Reset Password"
                  to="/password_reset"
                  size="md"
                  class="full-width"
                  flat
                >
                  <q-icon
                    name="restore"
                    color="black"
                  />
                </q-btn> -->
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
      <br>
      <div class="row q-mt-lg q-pt-sm">
        <p class="text text-right text-indigo full-width">Don't have account? <br>
          <q-btn
            style="background: none"
            size="md"
            label="Sign Up"
            to="/Signup"
            flat
          />
        </p>

      </div>
    </div>
  </q-page>
</template>

<script>

export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    onSubmit () {
      // console.log(this.email)
      const formData = {
        email: this.email,
        password: this.password
      }
      this.$store.dispatch('storedata/login', formData)
    }
  },
  mounted () {
    // console.log('mounted');
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
