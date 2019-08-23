import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import {
  splitModName,
  getModResources,
  generateRoutes
} from '../utils/module'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'index',
    component: () =>
      import( /* webpackChunkName: "views/index" */ '@/views/index/main.vue')
  }]
})

// 记录注册过的模块
let registeredRouterRecord = []

/**
 * @description 检查模块是否注册
 * @param {String} modName 模块名 
 */
const isModRegistered = modName => {
  return registeredRouterRecord.includes(modName)
}

/**
 * @description 注册模块
 * @param {String} modName 模块名 
 */
const regeisterMod = modName => {
  getModResources(modName).then(res => {
    console.log('res:', res)

    // generate routes
    generateRoutes(modName, res.router).then(appendRoutes => {
      console.log('appendRoutes:', appendRoutes)
      // register router
      router.addRoutes(appendRoutes)
    })

    // register store
    store.registerModule(modName, res.store)

    registeredRouterRecord.push(modName)
  })
}

router.beforeEach((to, from, next) => {
  console.log(to, from)
  let modName = splitModName(to.path)
  // 非基础模块 + 模块未注册 = 需要注册模块
  if (modName && !isModRegistered(modName)) {
    regeisterMod(modName)
  }
  next()
})

export default router
