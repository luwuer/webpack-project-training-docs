<template>
  <div id="app">
    <router-link to="/">Home</router-link>
    <router-link to="/mod/a/a/a">Module A</router-link>
    <router-link to="/mod/b/a/a">Module B</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="stylus">
@import '~@/styles/main.styl';

#app {
  padding: 40px 20px;
}
</style>
