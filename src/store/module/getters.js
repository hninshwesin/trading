export function user (state) {
    return state.user
}

export function ifAuthenticated (state) {
    return state.token !== null
}
