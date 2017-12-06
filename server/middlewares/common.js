import KoaBody from 'koa-bodyparser'

export const addBody = app => {
  app.use(KoaBody())
}
