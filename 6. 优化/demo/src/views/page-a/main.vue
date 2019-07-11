<template>
  <div class="page-a">
    <h1>
      This is page-a
    </h1>
  </div>
</template>

<script>
// 设置 noParse 并引入 min 包
// import 'lodash'
// import(/*webpackChunkName: "dependencies/lodash" */ 'lodash')
// import(/*webpackChunkName: "dependencies/lodash" */ '@root/node_modules/lodash/lodash.js')
// 单个函数引入
// import now from 'lodash/now'
// import 'lodash'
// 静态加载
// import _ from 'lodash'
// 懒加载
// import(/* webpackChunkName: "dependencies/lodash" */ 'lodash')
import { counter } from '@/utils'

export default {
  name: 'page-a',
  created() {
    counter()
    console.log('page-a:', counter.count)
    console.log('page-a:', _.now())
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/styles/main.styl';

.page-a {
  background: blue;
}
</style>
