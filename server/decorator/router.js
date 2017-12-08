
import Router from 'koa-router'
import { resolve } from 'path'
import glob from 'glob'
import _ from 'lodash'
import R from 'ramda'

export let routersMap = new Map()

export const symbolPrefix = Symbol('prefix')
export const isArray = v => _.isArray(v) ? v : [v]
export const normalizePath = path => path.startsWith('/') ? path : `${path}`

export default class Route {
  constructor (app, apiPath) {
    this.app = app
    this.apiPath = apiPath
    this.router = new Router()
  }
  // 初始化函数
  init () {
    /** 通过glob遍历指定目录的js，并依次引入
     * @param {String} 指定路径
     * @param {String} 文件类型
     */
    glob.sync(resolve(this.apiPath, './*js')).forEach(require)
    // 遍历routersMap（让每一个路径对应controller）
    for (let [ conf, controller ] of routersMap) {
      const controllers = isArray(controller)
      let prefixPath = conf.target[symbolPrefix]
      if (prefixPath) prefixPath = normalizePath(prefixPath)

      const routerPath = prefixPath + conf.path
      // 将对应的get，post方法，施加到对应的控制器上
      this.router[conf.method](routerPath, ...controllers)
    }
    this.app.use(this.router.routes())
    this.app.use(this.router.allowedMethods())
  }
}

export const router = conf => (target, key, desc) => {
  conf.path = normalizePath(conf.path)

  routersMap.set({
    target: target,
    ...conf
  }, target[key])
}

export const controller = path => target => {
  target.prototype[symbolPrefix] = path
  return target
}

export const get = path => router({
  method: 'get',
  path: path
})
export const post = path => router({
  method: 'post',
  path: path
})
export const put = path => router({
  method: 'put',
  path: path
})
export const del = path => router({
  method: 'del',
  path: path
})

const decorate = (args, middleware) => {
  let [target, key, descriptor] = args
  target[key] = isArray(target[key])
  target[key].unshift(middleware)

  return descriptor
}

export const convert = middleware => (...args) => decorate(args, middleware)

export const required = rules => convert(async (ctx, next) => {
  let errors = []
  // 检查是否传入对应的参数
  const passRules = R.forEachObjIndexed(
    (value, key) => {
      errors = R.filter(i => !R.has(i, ctx.request[key]))(value)
    }
  )
  
  passRules(rules)

  if (errors.length) ctx.throw(412, `${errors.join(', ')}参数缺失`)

  await next()
})