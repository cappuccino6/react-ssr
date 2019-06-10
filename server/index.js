// const Koa = require('koa')
// const Router = require('koa-router')
// const React = require('react')
// const bodyParser = require('koa-bodyparser')
// const { renderToString } = require('react-dom/server')


import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { renderApp } from './App'

const app = new Koa()
const router = new Router()

app.use(bodyParser({
  jsonLimit: '8mb'
}))

router.get('*', async ctx => {
  // console.log('ctx====', ctx.req)
  ctx.body = renderApp(ctx, {})
})

app.use(router.routes())

app.listen(9000)