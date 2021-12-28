import LoadScript from "vue-plugin-load-script";
import { loadScript } from "vue-plugin-load-script";
import { boot } from 'quasar/wrappers'

export default boot(async ({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  
  app.use(LoadScript)
  
})