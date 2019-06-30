import Koa from 'koa'
import path from 'path'
import debug from 'debug'
import Router from 'koa-router'
import {matchPath} from 'react-router-dom'
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

const redirectUrl = async (ctx, next) => {
  await next()
  if(ctx.request.url === '/') {
    ctx.redirect(routes[0].path)
  }
}

app.use(redirectUrl)

// 对所以的路由都返回这个页面了
router.get('*', async (ctx, next) => {
  await next()
  //  匹配路由  
  const currentRoute = routes.find(r => matchPath(ctx.request.url, r)) || routes[0]

  const currentComponent = currentRoute && currentRoute.component

  const { getInitialProps } = currentComponent || {}

  let contextProps = {}
  
  if(getInitialProps && Array.isArray(getInitialProps)) {
    // 多个请求
    let ajaxs = []
    let ids = []

    getInitialProps.forEach(_ => {
      ajaxs.push(_.ajax())
      ids.push(_.id)
    })

    const response = await Promise.all(ajaxs)

    ids.forEach((id, index) => {
      // 通过 Object.defineProperty 将服务端拿到的数据塞到 context 中
      Object.defineProperty(contextProps, id, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: {
          data: response[index],
          pending: false,
          error: null
        }
      })
    })

  } else {
    const {id} = getInitialProps
    contextProps = {
      [id]: {
        data: await getInitialProps.ajax(),
        pending: false,
        error: null
      }
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

const isProd = process.env.NODE_ENV === 'production'

app.listen(isProd ? 8086 : packageJson.project.port, () => {
  log('server', packageJson.project.port)('')
  log('client', packageJson.project.devServer.port)('')
})