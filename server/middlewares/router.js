import Router from 'koa-router'
import config from '../config/index'
import reply from '../wechat/reply'
import { resolve } from 'path'
import wechatMiddle from '../wechat-lib/middleware'

export const router = app => {
  const router = new Router()

  router.all('/wechat-hear', wechatMiddle(config.wechat, reply))

  router.get('/upload', async (ctx, next) => {
    let mp = require('../wechat')
    let client = mp.getWechat()
    const news = {
      articles: [
            {
              "title": '山竹和阿瓜的故事',   
              "thumb_media_id": 'myqaG97d9B436MKw8kwHX2L26ZEAmeCrd3HyUgleuHs', 
              "author": '林小辉',  
              "digest": '山竹和阿瓜',
              "show_cover_pic": 1,
              "content": '猜猜里面有什么',
              "content_source_url": 'https://github.com/linpenghui958'
            },
            {
              "title": '林小辉2',   
              "thumb_media_id": 'myqaG97d9B436MKw8kwHX2L26ZEAmeCrd3HyUgleuHs', 
              "author": '林小辉',  
              "digest": '山竹和阿瓜',
              "show_cover_pic": 0,
              "content": '猜猜里面有什么',
              "content_source_url": 'https://github.com/linpenghui958'
            }
          ]
    }
    const data = await client.handle('uploadMaterial', 'news', news, {})
    console.log(data)
  })

  app
    .use(router.routes())
    .use(router.allowedMethods())
}
