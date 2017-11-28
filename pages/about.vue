<template>
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
    const wx = window.wx
    const url = window.location.href
    // 触发store中的actions
    this.$store.dispatch('getWechatSignature', encodeURIComponent(url))
      .then(res => {
        if (res.data.success) {
          const params = res.data.params
          wx.config({
            debug: true,
            appId: params.appId,
            timestamp: params.timestamp,
            nonceStr: params.noncestr,
            signature: params.signature,
            jsApiList: [
              'onMenuShareTimeline',
              'previewImage',
              'uploadImage',
              'downloadImage',
              'showMenuItems'
            ]
          })

          wx.ready(() => {
            console.log('success')
          })
        }
      })
  }
}
</script>

<style scoped>
.title
{
  margin-top: 50px;
}
.info
{
  font-weight: 300;
  color: #9aabb1;
  margin: 0;
  margin-top: 10px;
}
.button
{
  margin-top: 50px;
}
</style>
