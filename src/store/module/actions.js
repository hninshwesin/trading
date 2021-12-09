import { api } from 'boot/axios'
import { Notify } from 'quasar'

export function signup ({ commit }, formData) {
    api.post('/api/v1/register', {
        phone_number: formData.phone_number,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        returnSecureToken: true
    })
        .then(res => {
            localStorage.setItem('token', res.data.access_token)
            localStorage.setItem('userId', res.data.app_user.id)
            commit('authUser', res)
            Notify.create({
                color: 'green-4',
                textColor: 'white',
                icon: 'cloud_done',
                message: 'Sign Up Successfully'
            })

            this.$router.push("/home")
        })
        .catch(error => {
            console.log(error)
            Notify.create({
                color: 'negative',
                position: 'top',
                message: 'Sign up failed',
                icon: 'report_problem'
            });
        })
    localStorage.removeItem('token') // if the request fails, remove any possible user token if possible
    localStorage.removeItem('userId')
}
export function login ({ commit }, formData) {
    api.post('/api/v1/login', {
        email: formData.email,
        password: formData.password,
        returnSecureToken: true
    })
        .then(res => {
            localStorage.setItem('token', res.data.access_token)
            localStorage.setItem('userId', res.data.app_user.id)
            commit('authUser', res)
            Notify.create({
                color: 'green-4',
                message: 'Log In Successfully',
                textColor: 'white',
                icon: 'cloud_done',
            });

            this.$router.push("/home")
        })
        .catch(error => {
            console.log(error)
            Notify.create({
                color: 'negative',
                position: 'top',
                message: 'Sign in failed',
                icon: 'report_problem'
            });
            localStorage.removeItem('token')
            localStorage.removeItem('userId')
            // this.$router.go('/')
        })
}
