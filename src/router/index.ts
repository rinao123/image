import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import ImageInfo from '../views/ImageInfo.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'ImageInfo',
    component: ImageInfo
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
