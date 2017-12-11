import mongoose from 'mongoose'
// 从decorator中引入
import { controller, get, post, required} from '../decorator/router'
import { openidAndSessionKey, WXBizDataCrypt } from '../wechat-lib/mina'

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
    // 从query中拿到所需的数据
    const { code, userInfo } = ctx.query
    // 拿到用户信息
    const minaUser = await openidAndSessionKey(code)
    let user = await User.findOne({
      openid: {
        '$in': [minaUser.openid]
      }
    }).exec()
    if (!user) {
      // 通过解密拿到用户敏感信息
      let pc = new WXBizDataCrypt(minaUser.sessionKey)
      let data = pc.decryptData(userInfo.encryptedData, userInfo.iv)
      try {
        user = await User.findOne({
          openid: {
            '$in': [minaUser.openid]
          }
        }).exec()
        if (!user) {
          // 不存在则新增用户
          let _userData = userInfo.userInfo
          user = new User({
            avatarUrl: _userData.avatarUrl,
            nickname: _userData.nickname,
            openid: _userData.openid,
            sex: _userData.sex,
            country: _userData.country,
            province: _userData.province,
            city: _userData.city
          })
          await user.save()
        }
      } catch (err) {
        ctx.body = {
          success: false,
          err: err
        }
      }
    }
    ctx.body = {
      success: true,
      data: {
        nickName: user.nickName,
        avatarUrl: user.avatarUrl,
        sex: user.sex
      }
    }
  }

  @post('/login')  // 路由对应的中间键方法，传入ctx和next
  @required({body: ['code', 'avatarUrl', 'nickName']})
  async login (ctx, next) {
    const {code, avatarUrl, nickName} = ctx.request.body
    try {
      const {openid} = await openidAndSessionKey(code)
      let user = await User.findOne({
        openid
      })

      if (!user) {
        user = new User({
          openid: [openid],
          nickName: nickName,
          avatarUrl
        })
        user = await user.save()
      } else {
        user.avatarUrl = avatarUrl
        user.nickName = nickName
        user = await user.save()
      }

      ctx.body = {
        success: true,
        data: {
          nickName: nickName,
          avatarUrl: avatarUrl
        }
      }
    } catch (err) {
      ctx.body = {
        success: false,
        err: err
      }
    }
  }

}
