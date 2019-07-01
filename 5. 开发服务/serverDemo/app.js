/**
 * 用于测试 file 协议访问 index.html 是否能请求到数据
 * 结论： 在开启跨域校验后可以取到数据
 */

const Koa = require('koa')
const app = new Koa()
const router = require('./router')

app.use(router.routes())

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000.')
  console.log('ctrl + c to stop it.')
})
