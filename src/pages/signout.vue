<script>
export default {
  name: 'signout',
  data () {
    return {
    }
  },
  async created () {
    console.log('signout');
    this.$q.notify({
      color: 'positive',
      message: 'Log Out Successfully',
      icon: 'update'
    });
    await localStorage.removeItem('token');
    await localStorage.removeItem('userId');
    this.$router.push('/')
  },
  mounted () {
  }
}
</script>