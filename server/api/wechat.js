import {getWechat, getOAuth} from '../wechat'

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
  
  return user
}
