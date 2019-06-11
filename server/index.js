import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import packageJson from '../package.json'
import { renderApp } from './App'

const app = new Koa()
const router = new Router()

app.use(bodyParser({
  jsonLimit: '8mb'
}))

router.get('*', async ctx => {
  ctx.body = renderApp(ctx, {})
})

app.use(router.routes())

app.listen(packageJson.project.port, () => {
  console.log(`The server side rendering is running on port ${packageJson.project.port}`)
})