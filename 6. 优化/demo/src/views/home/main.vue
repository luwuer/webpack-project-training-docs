<template>
  <div class="home">
    <h1>
      This is page-home
    </h1>
  </div>
</template>

<script>
import { counter } from '@/utils'

export default {
  name: 'home',
  created() {
    counter()
    console.log('home:', counter.count)
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/styles/main.styl'

.home {
  background red
}
</style>
