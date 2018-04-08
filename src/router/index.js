import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/example',
      component: () => import('@/components/Example.vue')
    }
  ]
})
