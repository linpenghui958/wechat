<template lang="pug">
  <section class="container">
    <img src="../static/img/logo.png" alt="Nuxt.js Logo" class="logo" />
  </section>
</template>
<script>
import { mapState } from 'vuex'
export default {
  asyncData ({ req }) {
    return {
      name: req ? 'server' : 'client'
    }
  },
  head () {
    return {
      title: `测试页面`
    }
  },
  beforeMount () {
    const url = window.location.href
    // 触发store中的actions
    this.$store.dispatch('getUserByOAuth', encodeURIComponent(url))
      .then(res => {
        if (res.data.success) {
          console.log(res.data)
        }
      })
  }
}
</script>
