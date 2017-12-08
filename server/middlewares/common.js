import KoaBody from 'koa-bodyparser'
import session from 'koa-session'

export const addBody = app => {
  app.use(KoaBody())
}

export const addSession = app => {
  app.keys = ['ice']
  const CONFIG = {
    key: 'koa:sess',
    maxAge: 86400000,
    signed: true,
    rolling: false
  }
  app.use(session(CONFIG, app))
}
