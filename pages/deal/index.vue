<template lang="pug">
.container
  .focus-goods-body
    .focus-goods-swiper(v-swiper:mySwiper='swiperConfig')
      .swiper-wrapper
        .swiper-slide(v-for='(item, index) in product.images', :key='index')
          img(:src="imageCDN + item")
          
      .swiper-pagination.swiper-pagination-bullets
    
    .focus-goods-content
      
      .focus-goods-price(v-if='product.price')
        span.focus-goods-price_main {{ product.price }}
        span.focus-goods-price_others {{ product.price }}
      
      .focus-goods-name {{ product.title }}

      .focus-goods-intro {{ product.intro }}

      .focus-goods-info
        cell(v-for='(item, index) in product.parameters', :key='index', :title='item.key', :content='item.value')

      .focus-goods-attentions
        .title 购买提示
        ol
          li(v-for='item in attentions') {{ item }}

  .focus-goods-footer
    span(@click='payHandle') 购买
  transition(name='slide-top')
    .payment-modal(v-if='showIndo')
      .payment-modal-header
        span 准备购买
        span(@click='showInfo = false') 取消
      .payment-modal-body
        .focus-item
          img(:src='imageCDN + product.images[0]')
          div
            p {{product.title}}
            p 价格 ￥{{product.price}}
        .focus-item
          span 收件人
          input(v-model.trim='info.name' placeholder='你的名字')
        .focus-item
          span 电话
          input(v-model.trim='info.phoneNumber' type='tel' placeholder='你的电话')
        
        .focus-item
          span 地址
          input(v-model.trim='info.address' placeholder='收货地址')
      .payment-modal-footer(@click='handPayment') 确认支付
  transition(name='fade')
    sapn.modal(v-if='modal.visibile') {{modal.content}}
</template>

<script>
import cell from '~/components/cell.vue'
import { mapState } from 'vuex'
import wechat from '../../static/mixins/wechat.js'
function toggleModal (obj, content) {
  clearTimeout(obj.timer)
  obj.visible = true
  obj.content = content
  obj.timer = setTimeout(() => {
    obj.visible = false
  }, 1500)
}
export default {
  middleware: 'wechat-auth',
  head () {
    return {
      title: '手办详情'
    }
  },
  data () {
    return {
      swiperConfig: {
        autoplay: 4000,
        direction: 'horizontal',
        loop: true,
        pagination: '.swiper-pagination'
      },
      attentions: [
        '商品和服务差异',
        '物流配送'
      ],
      showInfo: false,
      info: {
        name: '',
        phoneNumber: '',
        address: ''
      },
      modal: {
        visible: false,
        content: '成功'
      },
      swipeOptions: {
        startSlide: 0,
        speed: 300,
        auto: 4000,
        continuous: true,
        disableScroll: false,
        stopPropagation: false,
        callback: function (index, slide) { console.log('slide changes') },
        transitionEnd: function (index, slide) { console.log('slide transition ends') }
      }
    }
  },
  computed: {
    ...mapState({
      product: 'currentProduct',
      imageCDN: 'imageCDN'
    })
  },
  methods: {
    async payHandle () {
      const wx = window.wx
      const url = window.location.href
      console.log('will to buy it')
      const that = this
      const { name, address, phoneNumber} = this.info
      if (!name || !address || !phoneNumber) {
        toggleModal(this.modal, '收货信息忘填了')
        return
      }
      // 获取返回的订单信息
      const res = await this.$store.dispatch('createOrder', {
        productId: this.product._id,
        name: name,
        address: address,
        phoneNumber: phoneNumber
      })
      const data = res.data
      if (!data || !data.success) {
        toggleModal(this.modal, '服务器异常，请等待后重新尝试')
        return
      }
      // 调用微信支付
      wx.chooseWXPay({
        timestamp: data.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
        package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
        signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: data.paySign, // 支付签名
        success: (res) => {
          try {
            window.WeixinJSBridge.log(res.err_msg)
          } catch (e) {
            console.error(e)
          }
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            // 支付成功
            toggleModal(that.modal, '支付成功')
          } else {}
        }
      })
      // this.$store.dispatch('getWechatSignature', url).then(res => {
      //   if (res.data.success === 1) {
      //     const params = res.data.params
      //     wx.config({
      //       debug: true, // 调试模式
      //       appId: params.appId, // 公众号的唯一标识
      //       timestamp: params.timestamp, // 生成签名的时间戳
      //       nonceStr: params.noncestr, // 生成签名的随机串
      //       signature: params.signature, // 签名
      //       jsApiList: [ 'chooseWXPay' ]// 需要使用的JS接口列表: 微信支付接口
      //     })
      //     wx.ready(() => {
      //       wx.chooseWXPay({
      //         timestamp: params.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      //         nonceStr: params.nonceStr, // 支付签名随机串，不长于 32 位
      //         package: params.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
      //         signType: params.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      //         paySign: params.paySign, // 支付签名
      //         success: (res) => {
      //           try {
      //             window.WeixinJSBridge.log(res.err_msg)
      //           } catch (e) {
      //             console.error(e)
      //           }
      //           if (res.err_msg === 'get_brand_wcpay_request:ok') {
      //             // 支付成功
      //           } else {}
      //         }
      //       })
      //     })
      //   }
      // })
    }
  },
  mixins: [wechat],
  async beforeMount () {
    const id = this.$route.query.id
    const url = window.location.href
    this.$store.dispatch('showProduct', id)
    
    await this.wechatInit(url)
  },
  components: {
    cell
  }
}
</script>

<style scoped lang="sass" src='../../static/sass/deal.sass'></style>
