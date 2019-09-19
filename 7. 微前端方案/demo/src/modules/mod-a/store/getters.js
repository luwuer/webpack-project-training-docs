// getters 动态添加时不存在新的作用域，所以需要约定在命名时加上表示模块的唯一前缀，这里是 modA
const getters = {
  modADes: state => state.app.des
}
export default getters
