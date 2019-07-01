<template>
  <div id="app">
    <router-link to="/">Home</router-link>
    <router-link to="/pa">Page A</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="stylus">
#app {
  padding 40px 20px
}
</style>
