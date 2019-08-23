/**
 * @description 返回子模块有权限的路由
 * @param {String} modName 模块名
 */
const getRoutes = modName => {
  return import('./base.json').then(data => data[modName])
}

export {
  getRoutes
}
