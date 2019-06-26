# 🚀🚀🚀 基于 koa 和 context api 的 react ssr 框架

<p>
  <a href="https://travis-ci.com/jgeschwendt/serverless-react-ssr/">
    <img alt="Travis Badge" src="https://travis-ci.com/jgeschwendt/serverless-react-ssr.svg?branch=master" />
  </a>
  <a href="https://standardjs.com/">
    <img alt="Standard Code Style Badge" src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg" />
  </a>
  <a href="https://renovateapp.com/">
    <img alt="Renovate App Badge" src="https://img.shields.io/badge/renovate-app-blue.svg" />
  </a>
</p>


## 🚄 安装

```html
git clone https://github.com/zhengyuanbing/react-ssr

cd react-ssr

npm i
```

## 📦 打包

```html

npm run build

```

## ✈️ 开发

```html

npm run dev

http://localhost:8987 (服务端渲染)

http://localhost:8988 (客户端渲染)

项目通过 nodemon 启动，如果开发过程中 crash 了，按 rs 加回车键就可以重启

```

## 🦀️️️🦀️️️🦀️️️ 项目介绍

![](https://user-gold-cdn.xitu.io/2019/6/23/16b8018353fd6f0a?w=1410&h=1450&f=png&s=2619914)


![](https://user-gold-cdn.xitu.io/2019/6/23/16b80195dc4ddb5e?w=1372&h=1392&f=png&s=224178)
### 🚀 前言
自从 `react` `vue` `angular` 等 `mvvm` 前端框架问世之后，前后端分离使得分工更加明确，开发效率显著提高。
由以前的后端渲染数据吐页面变成了前端请求数据，渲染页面，所以在客户端渲染中必须先下载服务器的 js css 文件再进行渲染。这需要一定的时间，中间的白屏对用户来说也不是很友好，而且爬虫抓取到的页面是一个无内容的空页面，也不利于 `seo`。因此在前端框架基础上的 `ssr` 也成了刚需。`ssr` 的好处也十分明显
```
1.  利于 seo
2.  加快首屏加载，解决首屏的白屏问题
...
```

网上关于 `react ssr` 的文章成千上万，虽然原理相同，但每个人的实现方式风格迥异，而且很多都有着复杂的配置和代码逻辑，能把 `ssr` 解释清楚的少之又少，所以我认真研究了一下`react ssr`的实现，在同事的启发下搭了一个自己的 `react ssr & csr` 同构框架，只有一个目的，那就是争取把 ssr 讲得谁都能看懂。

前面有两张示意图，为了方便，我直接用了豆瓣和掘金的 api 来做数据展示，logo 直接用了豆瓣（不要在意这些细节😂）。

下面正式开始介绍本项目中 SSR 的实现

### 🚗 `SSR` 原理

![](https://user-gold-cdn.xitu.io/2019/6/22/16b7df8a45dc7bf8?w=2106&h=1188&f=png&s=227895)

本项目的客户端服务端同构大概是这样一个流程，总的来说就是在服务器和客户端之间加一成 node，这一层的作用是接收到客户端的请求之后，在这一层请求数据，然后把数据塞到 html 模版页面中，最后吐出一个静态页面，所有耗时的操作都在服务端完成。当然，服务端返回的只是一个静态的 html，想要交互、dom 操作的话必须运行一遍客户端的js，因此在吐页面的时候要把cdn上的js也插入进来，剩下的就交给客户端自己去处理了。这样才算完成同构。在开始之前，我先抛出几个新人容易困惑的问题（其实是我之前困惑的几个问题）

```
1. 服务端如何将客户端的异步请求劫持并完成请求，渲染页面呢？
2. 服务端请求回来的数据，在运行客户端js的时候会不会被覆盖呢？
3. 服务端返回一个没有样式的 html 的话会影响体验，如何在服务端就插入样式呢？
...

```

带着这些问题，我们开始研究下ssr的实现

### 📦 webpack

🚀打包的过程是重点，一个`webpack`配置文件通用，配置的部分参数需要根据客户端还是服务端、开发还是生产环境来区分。

```javascript
'use strict'
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const StartServerPlugin = require('start-server-webpack-plugin')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const ManifestPlugin = require('webpack-manifest-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const WebpackBar = require('webpackbar')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const postcss = require('../postcss')
const alias = require('./alias')
const config = require('../package.json')

function createEntry(termimal) {
  const isServer = termimal === 'server'
  const mainEntry = isServer ? alias.server : alias.client
  return isServer ? {
    main: mainEntry
  } : Object.assign({}, {main: mainEntry}, {
    vendor: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios'
    ]
  })
}

function createWebpackConfig (termimal) {
  const isProd = process.env.NODE_ENV === 'production'
  const isDev = !isProd
  const isServer = termimal === 'server'
  const isClient = termimal === 'client'
  const isDevServer = isDev && isServer
  const isProdClient = isProd && isClient
  const isProdServer = isProd && isServer
  const target = isServer ? 'node' : 'web'

  return {
    bail: isProd,
    mode: isProd ? 'production' : 'development',
    target,
    entry: createEntry(termimal),
    output: {
      filename: `[name]${isProdClient ? '.[chunkhash]' : ''}.js`,
      path: isServer ? alias.buildServer : alias.buildClient,
      publicPath: '',
      libraryTarget: isServer ? 'commonjs2' : 'var',
    },
    node: {
      __dirname: true,
      __filename: true
    },
    resolve: {
      alias
    },
    module: {
      strictExportPresence: true,
      noParse (file) {
        return !/\/cjs\/|react-hot-loader/.test(file) && /\.min\.js/.test(file)
      },
      rules: [
        {
          oneOf: [
            {
              test: /\.(js|jsx)?$/,
              use: [
                {
                  loader: 'babel-loader',
                  options: {
                    babelrc: false,
                    cacheDirectory: true,
                    compact: isProdClient,
                    highlightCode: true,
                    presets: [
                      path.resolve(__dirname, './babel'),
                      {}
                    ]
                  }
                }
              ]
            },
            {
              test: /\.css$/,
              use: [
                isClient && (isProd ? MiniCssExtractPlugin.loader : 'style-loader'),
                isDevServer && 'isomorphic-style-loader',
                {
                  loader: 'css-loader',
                  options: {
                    modules: true,
                    localIdentName: '[name]-[local]-[hash:base58:5]',
                    importLoaders: 1,
                    exportOnlyLocals: isProdServer
                  }
                }
              ].filter(Boolean)
            },
            {
              test: /\.(png|jpg|jpeg|gif|image.svg)$/,
              loader: 'file-loader',
              options: {
                name: `${isDev ? '' : '/'}[name].[hash:base58:8].[ext]`,
                emitFile: isClient
              }
            },
            {
              test: /\.svg$/,
              use: [
                {
                  loader: '@svgr/webpack',
                  options: {
                    svgProps: {
                      height: '{props.size || props.height}',
                      width: '{props.size || props.width}',
                      fill: '{props.fill || "currentColor"}'
                    },
                    svgo: false
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    plugins: [
      /* 启动编译后的 js 文件 */
      isDevServer && new StartServerPlugin({
        name: 'main.js',
        keyboard: true,
        signal: true
      }),
      isClient && new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: alias.baseHtml,
          },
          isProd
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              }
            : undefined
        )
      ),
      isDev && new webpack.HotModuleReplacementPlugin(),
      new WebpackBar({
        color: isClient ? '#ff2124' : '#1151fe',
        name: isClient ? 'client' : 'server'
      }),
      isProd && new MiniCssExtractPlugin({
        filename: `${isDev ? '' : '/'}[name].[contenthash].css`
      }),
      isClient && new ManifestPlugin({
        writeToFileEmit: true,
        fileName: `manifest.json`
      }),
      false && isClient && new OpenBrowserPlugin({ url: 'http://localhost:8988' })
    ].filter(Boolean),

    externals: [isServer && nodeExternals()].filter(Boolean),

    optimization: {
      minimize: isProdClient,
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: 2,
          sourceMap: true,
          terserOptions: {
            keep_fnames: /^[A-Z]\w+Error$/,
            safari10: true
          }
        })
      ],
      concatenateModules: isProdClient,
      splitChunks: {
        maxAsyncRequests: 1,
        cacheGroups: isClient ? {
          vendors: {
            test: /node_modules/,
            name: 'vendors',
          }
        } : undefined
      }
    },

    devServer: {
      allowedHosts: [".localhost"],
      disableHostCheck: false,
      compress: true,
      port: config.project.devServer.port,
      headers: {
        'access-control-allow-origin': '*'
      },
      hot: false,
      publicPath: '',
      historyApiFallback: true
    }
  }
}

module.exports = createWebpackConfig
```

📦 以上就是项目的 webpack 配置，为了能在全局像
```javascript
import Avatar from 'components/Avatar'
```
这样引用组件，我们需要配置 alias：

```javascript
'use strict'
const path = require('path')
const base = require('app-root-dir')

module.exports = function createAlias () {
  return Object.assign(
    {},
    {
      'base': base.get(),
      'client':  path.resolve(base.get(), 'client'),
      'server':  path.resolve(base.get(), 'server'),
      'lib':  path.resolve(base.get(), 'lib'),
      'config':  path.resolve(base.get(), 'client/config'),
      'utils':  path.resolve(base.get(), 'client/utils'),
      'hocs':  path.resolve(base.get(), 'client/hocs'),
      'router':  path.resolve(base.get(), 'client/router'),
      'components': path.resolve(base.get(), 'client/components'),
      'pages': path.resolve(base.get(), 'client/pages'),
    }
  )
}
```

运行 run dev 之后会启动客户端和服务端的编译：

```javascript
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const open = require('open')
const path = require('path')
const webpackConfig = require(path.resolve('lib/webpackConfig'))
const config = require(path.resolve(__dirname, '../package.json'))

// 客户端编译
const clientConfig = webpackConfig('client')
const clientCompiler = webpack(clientConfig)
const clientDevServer = new WebpackDevServer(
  clientCompiler,
  clientConfig.devServer
)
clientDevServer.listen(config.project.devServer.port)

// 服务端编译
const serverConfig = webpackConfig('server')
const serverCompiler = webpack(serverConfig)
serverCompiler.watch({
  quiet: true,
  stats: 'none'
})

```

![](https://user-gold-cdn.xitu.io/2019/6/17/16b64b4786b34595?w=1102&h=216&f=png&s=89654)

### 💻 服务端处理

下面是我的服务端处理，由于引入了 babel，所以我在服务端可以使用 es6 模块

```javascript
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

  //  匹配页面的实际路由
  const currentRoute = routes.find(r => r.path === ctx.request.url)

  const currentComponent = currentRoute && currentRoute.component
  
  // 把页面中的请求劫持过来在服务端发
  const { fetchId, getInitialProps } = currentComponent || {}
  const currentProps = getInitialProps && await getInitialProps()

  // 服务端请求到的数据
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
app.use(koaStatic(path.join(__dirname, '../public')))

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

```

于是在页面中配置异步请求：

```javascript
const fetchId = 'highRateMovie'

class HighRateMovie extends React.Component {
 ......
}

HighRateMovie.fetchId = fetchId

// 该组件下绑定的异步逻辑，供服务端抓取
HighRateMovie.getInitialProps = () => fetch(addQuery('https://movie.douban.com/j/search_subjects', {
  type: 'movie',
  tag: '豆瓣高分',
  sort: 'recommend',
  page_limit: 40,
  page_start: 0
}))

export default HighRateMovie
```
这里的 fetchId 是作为全局 context 对象的键来用的，不能重复，最后页面中的数据结构会是：

```javascript
{
    movies: [],
    music: {},
    heroList: []
    ...
}
```
这里的fetchId 就成了唯一标识。

### 全局状态管理

上面在服务端拿到的 contextProps 又是怎么传递到我们的页面中的呢，这就是 React 16.3 推出的新的 context api 了，熟悉的人应该一眼就能看懂，不太熟悉 context api 建议看一下相关文档 [context api](https://reactjs.org/docs/context.html) ，也十分简单。为什么我这里不用 redux 或者 mobx 呢，这就纯粹是个人喜好了，redux 相对来说比较重，而且开发工程中需要配置 action 和 reducer，写起来比较繁琐，mobx 相对来说较轻。这里采用了 contextApi，因为它相对来说更加简洁，且易于配置。

```javascript
// 创建上下文
const AppContext = React.createContext('')

// 由 Provider 提供 props
<AppContext.Provider value={this.state}>
    {this.props.children}
</AppContext.Provider>

// 由 Consumer 接收 props
<AppContext.Consumer>
    {this.props.children}
</AppContext.Consumer>

```
上面是 context 大致的工作原理，基于此，项目中抽出了一个统一的 app 生成器：

```javascript
import React from 'react'
import Pages from 'client/pages'
import AppContextProvider from 'hocs/withAppContext'

// 这里由 client 和 server 端共享，context 由外部传入，这里就有了全局的 props 了。
export const renderBaseApp = context => {

  return (
    <AppContextProvider appContext={context}>
      <Pages />
    </AppContextProvider>
  )
}

export default renderBaseApp
```

服务端渲染的时候就能抓取到这个请求，并把请求回来的数据塞进 context 中，通过 Provider 提供给所有的组件。

dangdangdang 重点在下面，所谓同构，就是服务端吐一个 `html` 页面，但是页面绑定的点击等事件如何执行呢，服务端是没有 `dom` 这个概念的，因此最最重要的同构就是吐出来的 `html` 仍然要加载客户端打包的 `js` 完成相关事件的绑定

```javascript
import React from 'react'
import path from 'path'
import fs from 'fs'
import Mustache from 'mustache'
import {StaticRouter} from 'react-router-dom'
import {renderToString} from 'react-dom/server'
import { getBuildFile, getAssetPath } from './utils'
import template from './template'
import renderBaseApp from 'lib/baseApp'

let ssrStyles = []

// 创建一个 ReactServer 类供服务端调用，这个类处理与 html 模版相关的一切东西
class ReactServer {
  constructor(props) {
    Object.assign(this, props)
  }

// 获取客户端所有的打包的文件
  get buildFiles() {
    return getBuildFile()()
  }

// 获取需要的打包文件，这里只需要js文件
  get vendorFiles() {
    return Object.keys(this.buildFiles).filter(key => {
      const item = this.buildFiles[key]
      return path.extname(item) === '.js'
    })
  }

// 拼接 script 标签字符串，接收 context 参数存储数据
  getScripts(ctx) {
    return this.vendorFiles
    .filter(item => path.extname(item) === '.js')
    .map(item => `<script type="text/javascript" src='${getAssetPath()}${item}'></script>`)
    .reduce((a, b) => a + b, `<script type="text/javascript">window._INIT_CONTEXT_ = ${JSON.stringify(ctx)}</script>`)
  }

// 服务端渲染初期就把 css 文件添加进来, 由于 isomorphic-style-loader提供给我们了
_getCss()这个方法，因此可以将 css 文件在服务端拼接成 style 标签，得到的页面最开始就有了样式
 
  getCss() {
    // 读取初始化样式文件
    const cssFile = fs.readFileSync(path.resolve(__dirname, '../client/index.css'), 'utf-8')
    const initStyles = `<style type="text/css">${cssFile}</style>`
    const innerStyles = `<style type="text/css">${ssrStyles.reduceRight((a, b) => a + b, '')}</style>`
    
    // 服务端 css 包含两部分，一个是初始化样式文件，一个是 css modules 生成的样式文件，都在这里插进来
    return initStyles + innerStyles
  }

// 这个方法提供给 withStyle hoc 使用，目的是把页面中的样式都提取出来
  addStyles(css) {
    const styles = typeof css._getCss === 'function' ? css._getCss() : ''
    if(!ssrStyles.includes(styles)) {
      ssrStyles.push(css._getCss())
    }
  }

  renderTemplate = props => {
    return Mustache.render(template(props))
  }

  renderApp(ctx, context) {
    const html = renderToString((
      <StaticRouter location={ctx.url} context={context}>
        
        // 这里统一下发一个 addStyles 函数供 withStyle hoc 使用，可以理解为下发一个爪子，把组件中的样式都抓回来
        {renderBaseApp({...context, addStyles: this.addStyles, ssrStyles: this.ssrStyles})}
      </StaticRouter>
    ))

    return this.renderTemplate({
      title: '豆瓣', 
      html, 
      scripts: this.getScripts(context), 
      css: this.getCss()
    })
  }
}

export default ReactServer
```
上面这个 getCss 钩子是如何抓取我页面中的样式的呢，这得益于 withStyle hoc：

```javascript
/**
 * 目前仅供开发环境下提取 CSS
 */

import React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { withAppContext } from './withAppContext'

function devWithStyle (css) {
  if (typeof window !== 'undefined') {
    return x => x
  }

  return function devWithStyleInner (Component) {
    const componentName = Component.displayName || Component.name
    class CSSWrapper extends React.Component {
      render () {

        if (typeof this.props.addStyles === 'function') {
          this.props.addStyles(css)
        }

        return <Component {...this.props} css={css} />
      }
    }
    hoistNonReactStatics(CSSWrapper, Component)
    CSSWrapper.displayName = `withStyle(${componentName})`
    return withAppContext('addStyles')(CSSWrapper)
  }
}

function prodwithStyle () {
  return x => x
}

const withStyle = process.env.NODE_ENV === 'production' ? prodwithStyle : devWithStyle
export default withStyle

```

然后在页面中引入：

```javascript
import React from 'react'
import withStyle from 'hocs/withStyle'
import JumpLink from './JumpLink'
import css from './MovieCell.css'

class MovieCell extends React.Component {
  render() {
    const {data = {}} = this.props
    return (
      <JumpLink href={data.url} blank className={css.root}>
        <img src={data.cover || 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg'} className={css.cover} />
        <div className={css.title}>{data.title}</div>
        <div className={css.rate}>{data.rate} 分</div>
      </JumpLink>
    )
  }
}

export default withStyle(css)(MovieCell)
```
在每个用到样式的插入这个 hoc 把样式抓到服务端处理，这就是 css 的处理。

大家可能注意到了，我在插入客户端打包后的脚本时，还插入了这样一个脚本

```javascript
<script type="text/javascript">window._INIT_CONTEXT_ = ${JSON.stringify(ctx)}</script>
```

这是因为同构之前客户端和服务端是两个服务，数据无法共享，我在服务端把数据下发之后，在执行客户端的js过程中又被客户端初始化清空了，可是我数据明明都已经有了啊，这一清空前面不都白做了吗，啊摔...

为了解决这个问题，就在这里多插入一个脚本，存我们初始化的数据，在客户端渲染的过程中，初始的context 直接从window中获取就可以了

```javascript
class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        {renderBaseApp(window._INIT_CONTEXT_)}
      </BrowserRouter>
    )
  }
}

export default App
```

到现在我们的服务端渲染基本已经完成了，启动服务之后看页面，

![](https://user-gold-cdn.xitu.io/2019/6/23/16b801a0ec2fd316?w=2132&h=956&f=png&s=1567289)

这里我们可以看到服务端确实把渲染好的页面直接吐出来了，而客户端渲染却只得到一个空的html文件，再下载js去加载页面内容，而且由于我用的豆瓣和掘金api，在客户端请求跨域，只有在服务端能拿到数据，这里又发现ssr的另一个好处了～～～而且由于请求是在服务端发的，在页面中是看不到请求的api的。

到这里我们基本已经完成了 基于 context api 的服务端渲染了，但是还有一个遗留的问题，如果我在服务端请求失败，吐出来页面也没有数据该怎么办呢？

所以要针对这种情况做一些特殊的处理。

### 🚄服务端请求失败后如何处理

这里增加了一个 clientFetch 的 hoc，对有异步请求的页面都套上这个 hoc，这个 hoc 的作用是客户端渲染的过程中发现如果没有想要的数据，判定为请求失败，在客户端重新请求一次。

```javascript
/**
 * 服务端请求失败时 client 端的发请求逻辑
 */
import hoistNonReactStatics from 'hoist-non-react-statics'
import {pick} from 'lodash'
import { withAppContext } from 'hocs/withAppContext'

const defaultOptions = {
  // 在浏览器端 didMount 和 didUpdate 时默认触发
  client: true,
  // 自动注入获取到的数据至 props 中 ([fetchId], error, pending)，指定一个 id
  fetchId: null
}

export default function clientFetch (options = {}) {
  options = Object.assign({}, defaultOptions, options)
  const { client: shouldFetch, fetchId } = options

  return function clientFetchInner (Component) {

    if (!Component.prototype.getInitialProps) {
      throw new Error(`getInitialProps must be defined`)
    }

    // 这里继承的是传入的 Component
    class clientFetchWrapper extends Component {

      constructor(props) {
        super(props)
        this.getInitialProps = this.getInitialProps.bind(this)
      }

      static defaultProps = {
        [fetchId]: {}
      }

      shouldGetInitialProps() {
        return this.props[fetchId].pending === undefined
      }

      componentDidMount () {
        if (typeof super.componentDidMount === 'function') {
          super.componentDidMount()
        }
        this.fetchAtClient()
      }

      componentDidUpdate (...args) {
        if (typeof super.componentDidUpdate === 'function') {
          super.componentDidUpdate(...args)
        }
        this.fetchAtClient()
      }

      // 客户端同构请求
      fetchAtClient () {
        if (!shouldFetch) {
          return
        }
        if (typeof this.shouldGetInitialProps === 'function') {
          if (this.shouldGetInitialProps() && typeof this.getInitialProps === 'function') {
            this.fetch()
          }
        }
      }

      // client 的实际请求发送逻辑
      fetch () {
        this.setContextProps({ pending: true })
        return this.getInitialProps()
          .then(data => {
            this.setContextProps({ pending: false, data, error: null })
          }, error => {
            this.setContextProps({ pending: false, data: {}, error })
          })
      }

      // connect 场景下，注入数据到 appContext
      setContextProps (x) {
        if (!fetchId) {
          return
        }

        this.props.setAppContext(appContext => {
          const oldVal = appContext[fetchId] || {}
          const newVal = {[fetchId]: { ...oldVal, ...x }}
          return newVal
        })
      }

      render () {
        return super.render()
      }
    }

    hoistNonReactStatics(clientFetchWrapper, Component)

    return withAppContext(
      function (appContext) {
        const con = pick(appContext, ['setAppContext'])
        return Object.assign(con, (appContext || {})[fetchId])
      }
    )(clientFetchWrapper)
  }
}

```

这个 hoc 有两个作用，一是服务端请求失败发二次请求，保证页面的有效性，第二是当我不做服务端渲染时，依然可以将客户端打包文件部署到线上，默认都会走这个 hoc 的发请求逻辑。这样相当于给上了一层保险。到这里才算真正做到客户端服务端同构了，项目还需要持续优化～～

### ✨✨✨

喜欢的小伙伴点个star吧～～

如果有任何问题，欢迎留言或者提issue，项目有任何需要改进的地方，也欢迎指正～～

另外在用豆瓣和掘金的`api`的时候突发奇想，简单设计了一个自己的 `koa` 爬虫框架，抓取静态页面或者动态`api`，感兴趣的小伙伴也可以瞄一眼～～

[爬虫 firm-spider](https://github.com/Fe-Icy/firm-spider) 