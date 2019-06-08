import Router from 'koa-router'
import Pages from '../client/pages'
import { StaticRouter } from 'react-router-dom'
import { renderToString } from 'react-dom/server'
import React from 'react'

const routes = new Router()

routes.get('*', (ctx, next) => {
  ctx.body = renderToString(
    <StaticRouter location={ctx.url}>
      <Pages />
    </StaticRouter>
  )
  next()
})