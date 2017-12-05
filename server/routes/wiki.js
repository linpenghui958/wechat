import Router from 'koa-router'
import api from '../api'
import { controller, get, post} from '../decorator/router'

@controller('/wiki')
export class WechatController {
  @get('/houses')  // 路由对应的中间键方法，传入ctx和next
  async getHouse (ctx, next) {
    const data = await api.wiki.getHouse()

    ctx.body = {
      data: data,
      success: true
    }
  }

  @get('/houses/:_id')
  async getHouseById (ctx, next) {
    const { params } = ctx
    const { _id } = params
    if (!_id) return (ctx.body = {success: false, err: '_id is required'})

    const data = await api.wiki.getHouseById(_id)
    
    ctx.body = {
      data: data,
      success: true
    }
  }

  @get('/characters')  // 路由对应的中间键方法，传入ctx和next
  async getCharacters (ctx, next) {
    let { limit = 20 } = ctx.query
    const data = await api.wiki.getCharacters(limit)

    ctx.body = {
      data: data,
      success: true
    }
  }

  @get('/characters/:id')  // 路由对应的中间键方法，传入ctx和next
  async getCharacter (ctx, next) {
    const { params } = ctx
    const { id } = params
    console.log(id)
    if (!id) return (ctx.body = {success: false, err: '_id is required'})
    const data = await api.wiki.getCharacter(id)

    ctx.body = {
      data: data,
      success: true
    }
  }
}
