import sha1 from 'sha1'
import getRawBody from 'raw-body'
import * as util from './util'

export default function (opts, reply) {
  return async function wechatMiddle (ctx, next) {
    const token = opts.token
    const {
      signature,
      nonce,
      timestamp,
      echostr
    } = ctx.query

    const str = [token, timestamp, nonce].sort().join('') // 将数组排序
    const sha = sha1(str) // sha1加密

    console.log(sha === signature) // 比对sha跟微信服务器发来的signature是否一致
    if (ctx.method === 'GET') {
      if (sha === signature) {
        ctx.body = echostr
      } else {
        ctx.body = 'Failed'
      }
    } else if (ctx.method === 'POST') {
      if (sha !== signature) {
        ctx.body = false
        return
      }
      const data = await getRawBody(ctx.req, { // 获取请求对象中的数据
        length: ctx.length,
        limit: '1mb',
        encoding: ctx.charset
      })
      const content = await util.parseXML(data) // 解析XML
      const message = util.formatMessage(content.xml) // 将XML解析成对象
      console.log(content)
      ctx.weixin = message // 将解析后的message对象挂载的ctx，方便后面使用
      await reply.apply(ctx, [ctx, next]) // 将上下文和next交给回复模板reply
      const replyBody = ctx.body // 获取reply模板处理后的body
      const msg = ctx.weixin
      const xml = util.tpl(replyBody, msg) // 通过工具函数构建成一份标准的回复
      console.log(replyBody)

      ctx.status = 200
      ctx.type = 'application/xml'
      ctx.body = xml
    }
  }
}
