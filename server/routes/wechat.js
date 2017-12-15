import Router from 'koa-router'
import config from '../config/index'
import reply from '../wechat/reply'
// 从decorator中引入
import { controller, get, post, required} from '../decorator/router'
import { resolve } from 'path'
import wechatMiddle from '../wechat-lib/middleware'
import { signature, redirect, oauth } from '../controllers/wechat'
import mongoose from 'mongoose'
import { getParamsAsync } from '../wechat-lib/pay'


const Product = mongoose.model('Product')
const Payment = mongoose.model('Payment')
const User = mongoose.model('User')
@controller('')
export class WechatController {
  @get('/wechat-hear')  // 路由对应的中间键方法，传入ctx和next
  async wechatHear (ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    return middle(ctx, next)
  }

  @post('/wechat-hear')
  async wechatPostHear (ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    return middle(ctx, next)
  }

  @post('/wechat-pay')
  @required({body: ['productId', 'name', 'phoneNumber', 'address']})
  async createOrder (ctx, next) {
    const ip = ctx.ip.replace('::ffff:', '')
    const session = ctx.session
    const {
      productId,
      name,
      phoneNumber,
      address
    } = ctx.request.body
    const product = await Product.findOne({
      _id: productId
    }).exec()
    if (!product) {
      return (ctx.body = {success: false, err: '宝贝不存在'})
    }

    try {
      let user = await User.findOne({openid: session.openid}).exec()
      if (!user) {
        user = new User({
          openid: [session.user.openid],
          unionid: session.user.unionid,
          nickname: session.user.nickname,
          address: session.user.address,
          province: session.user.province,
          country: session.user.country,
          city: session.user.city,
          headimgUrl: session.user.headimgUrl,
        })
        user = await user.save()
      }
      // 需要传给微信的订单参数
      let orderParams = {
        body: product.title,
        attach: '公众周报手办',
        out_trade_no: 'Product' + (+new Date),
        total_fee: product.price * 100,
        openid: session.user.openid,
        trade_type: 'JSAPI',
        spbill_create_ip: ip
      }
      // 拿到微信返回的预付单信息
      const order = await getParamsAsync(orderParams)
      // 创建订单
      let payment = new Payment({
        user: user._id,
        product: product._id,
        name: name,
        address: address,
        phoneNumber: phoneNumber,
        payType: '公众号',
        totalFee: product.price,
        order: order
      })
      payment.save()
      ctx.body = {
        success: true,
        data: payment.order
      }
    } catch (err) {
      ctx.body = {
        success: false,
        err: err
      }
    }
  }

  @get('/wechat-signature')
  async wechatSignature (ctx, next) {
    await signature(ctx, next)
  }

  @get('/wechat-redirect')
  async wechatRedirect (ctx, next) {
    await redirect(ctx, next)
  }

  @get('/wechat-oauth')
  async wechatOauth (ctx, next) {
    await oauth(ctx, next)
  }

}
