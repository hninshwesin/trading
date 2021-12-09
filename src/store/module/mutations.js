export function authUser (state, res) {
    console.log(res.data.app_user.id)
    state.token = res.data.access_token
    state.userId = res.data.app_user.id
}

export function clearAuth (state) {
    state.token = null
    state.userId = null
}
