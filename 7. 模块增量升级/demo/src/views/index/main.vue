<template>
  <div class="index">
    <h1>
      这是首页
    </h1>
    <h3>访问模块 A 的 store.des : {{modADes}}</h3>
    <h3>访问模块 B 的 store.des : {{modBDes}}</h3>
  </div>
</template>

<script>
import { counter } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  name: 'index',
  computed: {
    ...mapGetters(['modADes', 'modBDes'])
  },
  created() {
    counter()
    console.log('home:', counter.count)
    console.log(this.$store)
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/styles/main.styl';
</style>
