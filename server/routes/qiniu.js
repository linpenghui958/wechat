import { controller, get, post, del, put} from '../decorator/router'
import * as qiniu from '../libs/qiniu'

@controller('/qiniu')
export class QiniuController {
  @get('/token')  // 路由对应的中间键方法，传入ctx和next
  async qiniuToken (ctx, next) {
    let key = ctx.query.key
    let token = qiniu.uptoken(key)
    console.log(`上传token为${token}`)
    ctx.body = {
      success: true,
      data: {
        key: key,
        token: token
      }
    }
  }
}
