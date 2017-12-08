import {getWechat, getOAuth} from '../wechat'
import mongoose from 'mongoose'
const User = mongoose.model('User')
const client = getWechat()

export async function getSignatureAsync (url) {
  const data = await client.fetchAccessToken()
  const token = data.access_token
  const ticketData = await client.fetchTicket(token)

  let params = client.sign(ticketData.ticket, url)
  params.appId = client.appID
  return params
}

export async function getAuthorizeURL (...args) {
  const oauth = getOAuth()
  return oauth.getAuthorizeURL(...args)
}

export async function getUserByCode (code) {
  const oauth = getOAuth()
  const data = await oauth.fetchAccessToken(code)
  const user = await oauth.getUserInfo(data.access_token, data.openid)
  console.log(data)
  console.log(user)
  const existUser = await User.findOne({
    openid: data.openid
  }).exec()
  if (!existUser) {
    let newUser = new User({
      openid: [data.openid],
      unionid: '',
      nickname: user.nickname,
      province: user.province,
      country: user.country,
      city: user.city,
      headimgUrl: user.headimgUrl,
      sex: user.sex
    })
    await newUser.save()
  }
  
  return {
    nickname: user.nickname,
    province: user.province,
    country: user.country,
    city: user.city,
    headimgUrl: user.headimgUrl,
    sex: user.sex
  }
}
