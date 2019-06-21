import Koa from 'koa'
import path from 'path'
import debug from 'debug'
import Router from 'koa-router'
import koaStatic from 'koa-static'
import bodyParser from 'koa-bodyparser'
import favic from 'koa-favicon'
import packageJson from '../package.json'
import ReactServer from './App'
import {routes} from 'client/pages'

const server = new ReactServer()

const log = (target, port) => debug(`dev:${target}  The ${target} side rendering is running at http://localhost:${port}`)

const app = new Koa()
const router = new Router()

app.use(bodyParser({
  jsonLimit: '8mb'
}))

// 对所以的路由都返回这个页面了
router.get('*', async ctx => {
  //  匹配路由  
  const currentRoute = routes.find(r => r.path === ctx.request.url)
  const currentComponent = currentRoute.component
  const { fetchId, getInitialProps } = currentComponent

  // 在服务端获取数据
  const currentProps = getInitialProps && await getInitialProps()

  const contextProps = {
    [fetchId]: {
      data: currentProps,
      pending: false,
      error: null
    }
  }
  ctx.body = server.renderApp(ctx, contextProps)
})

// 静态
app.use(koaStatic(path.join(__dirname, '../build')))

app.use(
  favic(path.resolve(__dirname, '../public/favicon.ico'), {
    maxAge: 1000 * 60 * 10
  })
);

app.use(router.routes())

// 处理 server hot reload
if (module.hot) {
  process.once('SIGUSR2', () => {
    log('Got HMR signal from webpack StartServerPlugin.')
  })
  module.hot.accept()
  module.hot.dispose(() => server.close())
}

app.listen(packageJson.project.port, () => {
  log('server', packageJson.project.port)('')
  log('client', packageJson.project.devServer.port)('')
})