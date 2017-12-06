import api from '../api'
import { controller, get, post, del, put} from '../decorator/router'
import xss from 'xss'
import R from 'ramda'

@controller('/api')
export class ProductController {
  @get('/products')  // 路由对应的中间键方法，传入ctx和next
  async getProducts (ctx, next) {
    let { limit = 50 } = ctx.query
    const data = await api.product.getProducts(limit)

    ctx.body = {
      data: data,
      success: true
    }
  }

  @get('/products/:_id')
  async getProductById (ctx, next) {
    const { params } = ctx
    const { _id } = params
    if (!_id) {
      return (ctx.body = {success: false, err: '_id is required'})
    }

    const data = await api.product.getProductById(_id)
    
    ctx.body = {
      data: data,
      success: true
    }
  }

  @post('/products')  // 路由对应的中间键方法，传入ctx和next
  async postProducts (ctx, next) {
    let product = ctx.request.body
    console.log(product)
    product = {
      title: xss(product.title),
      price: xss(product.price),
      intro: xss(product.intro),
      images: R.map(xss)(product.images),
      parameters: R.map(
        item => ({
          key: xss(item.key),
          value: xss(item.value)
        })
      )(product.parameters)
    }

    try {
      product = await api.product.save(product)
      ctx.body = {
        success: true,
        data: product
      }
    } catch (e) {
      ctx.body = {
        success: false,
        err: e
      }
    }
  }

  @put('/products')  // 路由对应的中间键方法，传入ctx和next
  async putProduct (ctx, next) {
    let body = ctx.request.body
    console.log(body)
    const { _id } = body
    if (!_id) {
      console.log('putProduct待更新_id的不存在')
      return (ctx.body = {success: false, err: '_id is required'})
    }
    let product = await api.product.getProductById(_id)
    if (!product) {
      return (ctx.body = {
        success: fasle,
        err: 'product not exist'
      })
    }
    product.title = xss(body.title)
    product.price = xss(body.price)
    product.intro = xss(body.intro)
    product.images = R.map(xss)(body.images)
    product.parameters = R.map(
      item => ({
        key: xss(item.key),
        value: xss(item.value)
      })
    )(product.parameters)

    try {
      product = await api.product.update(product)
      ctx.body = product
    } catch (e) {
      ctx.body = {
        success: false,
        err: e
      }
    }
  }

  @del('/products/:id')  // 路由对应的中间键方法，传入ctx和next
  async delProduct (ctx, next) {
    console.log(ctx.params)
    let body = ctx.params
    
    const { id } = body
    if (!id) {
      return (ctx.body = {success: false, err: '_id is required'})
    }
    let product = await api.product.getProductById(id)

    if (!product) {
      return (ctx.body = {success: false, err: 'product is not exist'})
    }

    try {
      product = api.product.del(product)
      ctx.body = {
        success: true
      }
    } catch (e) {
      ctx.body = {
        success: false,
        err: e
      }
    }
  }
}
