// import _ from 'lodash'
// import('lodash')
// 预加载
// import( /* webpackPreload: true, webpackChunkName: "dependencies/lodash" */ 'lodash')
// 预取
// import( /* webpackPrefetch: true, webpackChunkName: "dependencies/lodash" */ 'lodash')
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
