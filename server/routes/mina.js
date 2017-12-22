import mongoose from 'mongoose'
// 从decorator中引入
import { controller, get, post, required} from '../decorator/router'
import { openidAndSessionKey, WXBizDataCrypt } from '../wechat-lib/mina'
import { getUserAsync, loginAsync } from '../controllers/user'
import { createOrderAsync, paymentAsync } from '../controllers/wechat'
const User = mongoose.model('User')

@controller('/mina')
export class MinaController {
  @get('/codeAndSessionKey')
  @required({query: ['code']})
  async getCodeAndSessionKey (ctx, next) {
    const { code } = ctx.query
    let res = await openidAndSessionKey(code)
    ctx.body = {
      success: true,
      data: res
    }
  }

  @get('/user')
  @required({ query: ['code', 'userInfo']})
  // 获取用户信息
  async getUser (ctx, next) {
    await getUserAsync(ctx, next)
  }

  @post('/login')  // 路由对应的中间键方法，传入ctx和next
  @required({body: ['code', 'avatarUrl', 'nickName']})
  async login (ctx, next) {
    await loginAsync(ctx, next)
  }

  @post('/createOrder')
  @required({body: ['code', 'productId', 'userInfo', 'name', 'address', 'phoneNumber']})
  async createOrder (ctx, next) {
    await createOrderAsync(ctx, next)
  }

  @post('/payment')
  async payment (ctx, next) {
    await paymentAsync(ctx, next)
  }

}
