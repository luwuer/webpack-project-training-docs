const router = require('koa-router')()

router.get('/test', async ctx => {
  ctx.response.body = 'get test api'
})

module.exports = router
