import api from '../api'
import { controller, get, post, required} from '../decorator/router'

@controller('/admin')
export class AdminController {
  @post('/login')  // 路由对应的中间键方法，传入ctx和next
  // 中间键方法，检查请求是否携带email，password
  @required({body: ['email', 'password']})
  async login (ctx, next) {
    const { email, password } = ctx.request.body
    // 根据请求中携带的数据，查询数据库是否匹配
    const data = await api.admin.login(email, password)
    const {match, user} = data
    // 如果匹配上了将数据设置到session，并返回
    if (match) {
      if (user.role !== 'admin') {
        return (ctx.body = {
          success: false,
          err: '来错地方了'
        })
      }
      ctx.session.user = {
        _id: user._id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
        avatarUrl: user.avatarUrl
      }
      return (ctx.body = {
        success: true,
        data: {
          email: user.email,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl
        }
      })
    }
    // 未匹配上则返回错误
    return (ctx.body = {
      success: false,
      err: '密码错误'
    })
  }

  @post('/logout')
  async logout (ctx, next) {
    ctx.session = null
    ctx.body = {
      success: true,
      data: null
    }
  }

  @get('/payments')
  async getPayments (ctx, next) {
    const res = await api.payment.fetchPayments()
    ctx.body = {
      success: true,
      data: res.data
    }
  }
}
