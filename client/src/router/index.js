import Vue from 'vue'
import VueRouter from 'vue-router'

// views
import Home from '../views/Home.vue'
import Call from '../views/Call.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/call',
    name: 'Call',
    component: Call
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
