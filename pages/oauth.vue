<template lang="pug">
  <section class="container">
    <img src="../static/img/logo.png" alt="Nuxt.js Logo" class="logo" />
  </section>
</template>
<script>
function getUrlParam (param) {
  const reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)')
  const result = window.location.search.substr(1).match(reg)
  return result ? decodeURIComponent(result[2]) : null
}


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
  async beforeMount () {
    const url = window.location.href
    const { data } = await this.$store.dispatch('getWechatOAuth', url)
    console.log(data)
    
    if (data.success) {
      await this.$store.dispatch('setAuthUser', data.data)
      const paramsArr = getUrlParam('state').split('_')
      const visit = paramsArr.length === 1 ? `/${paramsArr[0]}` : `/${paramsArr[0]}?id=${paramsArr[1]}`
      this.$router.replace(visit)
    } else {
      throw new Error('用户信息获取失败')
    }
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
