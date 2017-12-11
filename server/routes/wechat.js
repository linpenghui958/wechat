import Router from 'koa-router'
import config from '../config/index'
import reply from '../wechat/reply'
// 从decorator中引入
import { controller, get, post} from '../decorator/router'
import { resolve } from 'path'
import wechatMiddle from '../wechat-lib/middleware'
import { signature, redirect, oauth } from '../controllers/wechat'

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
