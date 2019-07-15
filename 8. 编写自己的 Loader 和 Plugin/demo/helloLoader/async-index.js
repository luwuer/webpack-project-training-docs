module.exports = function (content) {
  let callback = this.async()
  setTimeout(() => {
    callback(null, content.replace(/World/g, 'Async Loader'))
  }, 3000)
}
