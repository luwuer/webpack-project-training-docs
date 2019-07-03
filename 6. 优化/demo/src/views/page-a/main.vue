<template>
  <div class="page-a">
    <h1>
      This is page-a
    </h1>
  </div>
</template>

<script>
import { counter } from '@/utils'

export default {
  name: 'page-a',
  created() {
    counter()
    console.log('home:', counter.count)
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/styles/main.styl';

.page-a {
  background: blue;
}
</style>
