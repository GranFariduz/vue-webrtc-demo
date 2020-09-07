import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import socketIO from 'socket.io-client'

Vue.config.productionTip = false

// instance properties
Vue.prototype.$socket = socketIO('http://localhost:4000')

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
