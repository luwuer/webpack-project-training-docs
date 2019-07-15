// 不能使用箭头函数，因为 Loader 函数中 this 指向 Loader Content 对象
module.exports = function (content) {
  return content.replace(/World/g, 'Loader')
}
