// CSS
import './styles/main.css'
// CSS 预处理器
import './styles/main.styl'
// 字体
import './styles/font.css'

let $body = document.querySelector('body')

// 图片
let $imgWrapper = document.createElement('div')

// 大图
let img = new Image()
img.src = require('./imgs/多啦A梦.jpg')
$imgWrapper.append(img)

// 小图
let smallImgNames = ['赞', '箭头', '添加', '搜索', '分享']
smallImgNames.forEach(name => {
  let img = new Image()
  img.src = require(`./imgs/${name}.png`)
  $imgWrapper.append(img)
})

$body.append($imgWrapper)

// 字体
$body.append(document.createElement('br'))
let $fontTitle = document.createElement('h1')
$fontTitle.innerHTML = '字体'
$body.append($fontTitle)

let $fontWrapper = document.createElement('div')

let $font = document.createElement('i')
$font.className = 'iconfont'
$font.innerHTML = '&#xe609;'

$fontWrapper.append($font)
$body.append($fontWrapper)
