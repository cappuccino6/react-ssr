import Koa from 'koa'
import path from 'path'
import debug from 'debug'
import Router from 'koa-router'
import koaStatic from 'koa-static'
import bodyParser from 'koa-bodyparser'
import favic from 'koa-favicon'
import packageJson from '../package.json'
import { renderApp } from './App'

const log = (target, port) => debug(`dev:${target}  The ${target} side rendering is running at http://localhost:${port}`)

const app = new Koa()
const router = new Router()

app.use(bodyParser({
  jsonLimit: '8mb'
}))

// 静态
app.use(koaStatic(path.join(__dirname, '../public')))

// 对所以的路由都返回这个页面了
router.get('*', async ctx => {
  ctx.body = renderApp(ctx, {})
})

app.use(
  favic(path.resolve(__dirname, '../public/favicon.ico'), {
    maxAge: 1000 * 60 * 10
  })
);

app.use(router.routes())

app.listen(packageJson.project.port, () => {
  log('server', packageJson.project.port)('')
  log('client', packageJson.project.devServer.port)('')
})