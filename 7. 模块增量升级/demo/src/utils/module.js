/**
 * @description 模块加载相关函数
 * @author luwuer
 */

import {
  getRoutes
} from '@/utils/api/base'

/**
 * @description 分离模块名
 * @param {String} path 路由路径
 */
const splitModName = path => {
  // 本例中路由规定为 /mod/{modName} ,如 /mod/a/xxx 对应模块名为 mod-a
  if (/\/mod\/(\w+)/.test(path)) {
    return 'mod-' + RegExp.$1
  }
  return ''
}

/**
 * @description 取得模块有权限的路由 + 模块路由和组件映射关系 = 需要动态添加的路由
 * @param {String} modName 模块名 
 */
const generateRoutes = (modName, routerMap) => {
  return getRoutes(modName).then(data => {
    return data.map(route => {
      route.component = routerMap[route.name]
      route.name = `${modName}-${route.name}`
      return route
    })
  })
}

/**
 * @description 获取模块打包后的标准入口 JS 文件
 * @param {String} modName 
 */
const getModResources = modName => {
  if (process.env.NODE_ENV === 'development') {
    // 开发环境用 es6 模块加载方式，方便调试
    return import(`@/modules/${modName}/index.js`).then(res => {
      return res
    })
  } else {
    return new Promise((resolve, reject) => {
      requirejs(['/modules/' + modName + '/' + modName + '.js'], mod => {
        resolve(mod)
      })
    })
  }
}

export {
  splitModName,
  generateRoutes,
  getModResources
}
