// export function user (state) {
//     return state.user
// }

// export function ifAuthenticated (state) {
//     return state.token !== null
// }


const getters = {
    user (state) {
    return state.user
    },
    ifAuthenticated (state) {
        return state.token !== null
    },
}