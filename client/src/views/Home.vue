<template>
  <div class="home">
    <h3>Available Users:</h3>
    <div v-for="user in users" :key="user">
      <template v-if="user !== socketID">
        <button @click="call(user)">CALL {{ user }}</button>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: ['socketID', 'users'],

  mounted() {
    this.$socket.on('call', (callerID) => {
      const answeredCall = confirm(`Accept call from ${callerID}?`)
      if (!answeredCall) return
      this.$router.push({ name: 'Call', query: { caller: callerID } })
    })
  },

  methods: {
    call(calleeID) {
      this.$router.push({ name: 'Call', query: { callee: calleeID } })
      this.$socket.emit('call', calleeID)
    }
  }
}
</script>
