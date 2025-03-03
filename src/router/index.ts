import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import HabitDetails from '../views/HabitDetails.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/habit/:id',
    name: 'HabitDetails',
    component: HabitDetails,
    props: true
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})