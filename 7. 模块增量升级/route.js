import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap } from './staticRoutes'
import store from '@common/scripts/entry/store'
import hui from 'h_ui/dist/h_ui.min.js'
import { getMenuList } from '@frame/scripts/api/login'
import { getChildData } from '@common/scripts/entry/getChild'
import Cookies from 'js-cookie'
// 引入Vue实例处理国际化
import { Instance } from './main'

Vue.use(Router)

// whitelist without login
const whiteList = ['/login']
const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

/**
 * @description 根据路由（path），注册子模块所有路由
 */
function registRouter (to, next) {
  if (window.sessionStorage.getItem('menusType') === '0') {
    // 没有子系统的显示，只有菜单栏,根据views所在的名称进行获取对应router/store/locale等【极端情况】
  } else {
    // let curMenu = [store.getters.menusRoot[store.getters.activeIndex]]
    // console.log('curMenu', curMenu)
    // let curSysName = curMenu[0] ? curMenu[0].kind_code : ''
    let toArr = to.path.split('/') ? to.path.split('/') : to.meta.rootId
    let curSysName = toArr[1]
    // let toArr = to.meta.rootId
    // 在子系统刷新页面时，改变 ActiveRootIndex ，需要控制路由 /{a}/{b}/{c} , a = 子系统 ID
    console.log('store.getters.menusRoot: ', store.getters.menusRoot)
    if (toArr && toArr[1] !== '') {
      if (toArr[1] === 'mainIndex') {
        next({ path: '/' })
        return
      }
      let curFirstMenu = JSON.parse(window.sessionStorage.getItem('curFirstMenu'))
      store.getters.menusRoot.some((item, index) => {
        if (item.id === curFirstMenu.id) {
          store.dispatch('ActiveRootIndex', index)
          // curSysName = toArr[1]
          // curMenu = [item]
          return true
        } else {
          return false
        }
      })
    }
    // if (toArr) {
    //   store.getters.menusRoot.some((item, index) => {
    //     if (item.id === toArr) {
    //       store.dispatch('ActiveRootIndex', index)
    //       curSysName = item.kind_code
    //       curMenu = [item]
    //       return true
    //     } else {
    //       return false
    //     }
    //   })
    // }

    // 如果已经包含了子系统名称，无需重新生成路由
    if (registRouterRecord.includes(curSysName)) {
      next({ path: '/' })
      return
    }
    if (curSysName === '') {
      store.dispatch('GenerateRoutesByMenus', {
        menu: store.getters.menusRoot,
        asyncRouterMap: {}
      }).then(() => {
        router.addRoutes(store.getters.addRouters)
        next({ ...to })
      })
      return
    }

    getChildData(curSysName).then(res => {
      console.log('res: ', res)
      registRouterRecord.push(curSysName)
      // add routes
      let data = {
        // menu: curMenu,
        menu: store.getters.menusRoot,
        asyncRouterMap: res.router
      }

      store.dispatch('GenerateRoutesByMenus', data).then(() => {
        console.log('addRoutes:', store.getters.addRouters)
        router.addRoutes(store.getters.addRouters)
        next({ ...to })
      })
      // add store
      Object.keys(res.store).forEach(mod => {
        store.registerModule(mod, res.store[mod])
      })
      // add lang
      if (!res.lang) return
      window._childLangStorage = Object.assign({}, window._childLangStorage, res.lang)

      if (registRouterRecord.length === 1 || registRouterRecord.length === 2) {
        let _$t = Instance.$t
        Vue.prototype.$t = (key, langType = Vue.config.lang) => {
          let tran = _$t.call(Instance, key)
          if (tran === key) {
            return eval(`window._childLangStorage['${langType}'].${key}`)
            // let targetKey = key.replace('m.i.', '')
            // tran = window._childLangStorage[langType][targetKey]
            // return eval(`window._childLangStorage['${langType}'].${targetKey}`)
          }

          return tran
        }
      }
    })
  }
}

// +++
const registRouterRecord = []
// +++

router.beforeEach((to, from, next) => {
  hui.hLoadingBar.start()
  if (window.LOCAL_CONFIG.isToken) {
    if (store.getters.token) {
      // 有token，证明已登录
      if (to.path === '/login') {
        next({ path: '/' })
      } else {
        let menus = JSON.parse(window.sessionStorage.getItem('menus'))
        if (menus && menus.length >= 0 && store.getters.addRouters.length > 0) {
          if (to.matched.length === 0) {
            // +++
            registRouter(to, next)
            // +++
          } else {
            next()
          }
        } else if (
          menus &&
          menus.length >= 0 &&
          store.getters.addRouters.length === 0
        ) {
          store.dispatch('GenerateMenuByMenus', menus)
          registRouter(to, next)
        } else {
          getMenuList(store.getters.token).then(res => {
            if (res && res.data) {
              // 根据权限生成对应菜单
              let data = res.data instanceof Array ? res.data : [res.data]
              store.dispatch('GenerateMenuByMenus', data)
              // 根据权限生成路由
              registRouter(to, next)
            }
          }).catch(err => {
            // +++
            // 最好在 ./api.js 文件中的 httpFetch.interceptors.response 钩子中判断 code === {权限失效返回的 code} 时移除 cookie.token
            // 我这里记不得权限失效时的 code， 所以这里简单处理，报错就移除 cookie
            console.log(err)
            Cookies.remove('token')
            store.commit('SET_TOKEN', '')
            next('./login')
            // +++
          })
        }
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next('./login')
        hui.hLoadingBar.finish()
      }
    }
  } else {
    next()
  }
})

router.afterEach(() => {
  hui.hLoadingBar.finish()
})

export default router
