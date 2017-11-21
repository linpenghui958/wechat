import config from '../config'

const tip = '山竹和阿瓜\n' +
 '回复 1，穿越到到冰火查身份\n' +
 '回复 2，进入冰火手办商城\n' +
 '回复 3，获取最新的种子资源\n' +
 '回复 4，查看 9 大家族秘密\n' +
 '或者点击 <a href="' + config.SITE_ROOT_URL + '/exam">开始查身份</a>'

const bt = '这里是山竹和阿瓜分享的前端资源 <a href="http://pan.baidu.com/s/1o8rAn70">Vue高级进阶</a>'

export default async (ctx, next) => {
  const message = ctx.weixin

  if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      ctx.body = tip
    } else if (message.Event === 'unsubscribe') {
      console.log('取关了')
    } else if (message.Event === 'LOCATION') {
      ctx.body = message.Latitude + ' : ' + message.Longitude
    } else {
      ctx.body = tip
    }
  } else if (message.MsgType === 'text') {
    ctx.body = message.Content
  } else if (message.MsgType === 'image') {
    ctx.body = {
      type: 'image',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'voice') {
    ctx.body = {
      type: 'voice',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'video') {
    ctx.body = {
      type: 'video',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'location') {
    ctx.body = message.Location_X + ' : ' + message.Location_Y + ' : ' + message.Label
  } else if (message.MsgType === 'link') {
    ctx.body = [{
      title: message.Title,
      description: message.Description,
      picUrl: 'http://mmbiz.qpic.cn/mmbiz_jpg/9Nar4BEjibeFgbYOul4KPkRDItTKf9lUWsESQ3vAupOVqN8a0Z5cOeibfyoXGvWsGgWD6AsyYkvWHzyYfjEAGHsA/0',
      url: message.Url
    }]
  }
}
