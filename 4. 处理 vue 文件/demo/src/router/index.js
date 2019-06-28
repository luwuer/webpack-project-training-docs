import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () =>
        import(/* webpackChunkName: "views/home" */ '@/views/home/main.vue')
    },
    {
      path: '/pa',
      name: 'pa',
      component: () =>
        import(/* webpackChunkName: "views/page-a" */ '@/views/page-a/main.vue')
    }
  ]
})
