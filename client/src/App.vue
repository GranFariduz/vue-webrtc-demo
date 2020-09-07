<template>
  <div id="app">
    <router-view :socketID="socketID" :users="users" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      socketID: '',
      users: []
    }
  },
  mounted() {
    this.$socket.on('connect', () => {
      console.log('Connected to socket')
    })

    this.$socket.emit('join')

    this.$socket.on('join', (mySocketId) => {
      this.socketID = mySocketId
    })

    this.$socket.on('user-list', (users) => {
      this.users = users
    })
  },
  beforeDestroy() {
    this.$socket.emit('leave', this.socketID)
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
