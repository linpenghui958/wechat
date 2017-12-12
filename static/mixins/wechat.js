export default {
  methods: {
    async wechatInit (url) {
      // 获取服务器签名
      const res = await this.$store.dispatch('getWechatSignature', url)
      const {data, success} = res.data
      if (!success) throw new Error('不能成功获取服务器签名')
      const wx = window.wx
      wx.config({
        debug: true, // 调试模式
        appId: data.appId, // 公众号的唯一标识
        timestamp: data.timestamp, // 生成签名的时间戳
        nonceStr: data.noncestr, // 生成签名的随机串
        signature: data.signature, // 签名
        jsApiList: [
          'chooseWXPay',
          'onMenuShareTimeline',
          'previewImage',
          'uploadImage',
          'downloadImage',
          'showMenuItems'
        ]// 需要使用的JS接口列表: 微信支付接口
      })
      wx.ready(() => {
        // this.wechatSetMenu()
        // this.wechatShare({})
      })
    }
  }
}
