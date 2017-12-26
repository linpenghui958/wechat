import api from '../api'
import config from '../config'
import { openidAndSessionKey, WXBizDataCrypt } from '../wechat-lib/mina'
import mongoose from 'mongoose'
const User = mongoose.model('User')

export async function getUserAsync (ctx, next) {
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

export async function loginAsync (ctx, next) {
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

export async function oauth (ctx, next) {
  let url = ctx.query.url
  url = decodeURIComponent(url)
  const urlObj = urlParse(url)
  const params = queryParse(urlObj.query)
  const code = params.code
  const user = await api.wechat.getUserByCode(code)
  console.log(user)
  ctx.session.user = user
  ctx.body = {
    success: true,
    data: user
  }
}

export const decryptUserAsync = async (code, userInfo) => {
  const minaUser = await openidAndSessionKey(code)

  let user = await User.findOne({
    unionid: minaUser.unionid
  }).exec()

  if (!user) {
    let pc = new WXBizDataCrypt(minaUser.session_key)
    let data = pc.decryptData(userInfo.encryptedData, userInfo.iv)

    user = await User.findOne({
      unionid: data.unionId
    })

    if (!user) {
      let _userData = userInfo.userInfo

      user = new User({
        avatarUrl: _userData.avatarUrl,
        nickname: _userData.nickName,
        unionid: data.unionid,
        openid: [minaUser.openid],
        sex: _userData.gender,
        country: _userData.country,
        province: _userData.province,
        city: _userData.city
      })

      await user.save()
    }
  }

  return user
}
