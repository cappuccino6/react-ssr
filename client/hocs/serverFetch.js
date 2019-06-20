/**
 * server 和 client 共享的发请求逻辑
 */
import hoistNonReactStatics from 'hoist-non-react-statics'
import {pick, isEmpty} from 'lodash'
import { withAppContext } from 'hocs/withAppContext'

const isProd = process.env.NODE_ENV === 'production'

const defaultOptions = {
  server: true,
  // 在浏览器端 didMount 和 didUpdate 时默认不触发
  client: false,
  // 自动注入获取到的数据至 props 中 ([fetchId], error, pending)，指定一个 id
  fetchId: null
}

export default function serverFetch (options = {}) {
  options = { ...defaultOptions, ...options }
  const enableAtServer = options.server
  const enableAtClient = options.client
  const { fetchId } = options

  return function serverFetchInner (Component) {
    if (!isProd && !Component.prototype.getInitialProps) {
      throw new Error(`getInitialProps must be defined`)
    }
    // 注意这里继承的是传入的 Component
    class serverFetchWrapper extends Component {
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
        this._triggerAtClient()
      }

      componentDidUpdate (...args) {
        if (typeof super.componentDidUpdate === 'function') {
          super.componentDidUpdate(...args)
        }
        this._triggerAtClient()
      }

      // 客户端同构请求
      _triggerAtClient () {
        if (!enableAtClient) {
          return
        }
        if (typeof this.shouldGetInitialProps === 'function') {
          if (this.shouldGetInitialProps() && isEmpty(this.props[fetchId])) {
            this._trigger()
          }
        }
      }

      // server 和 client 共享的实际请求发送逻辑
      _trigger () {
        let contextProps = {}
        this._setContextProps({ pending: true })
        return this.getInitialProps()
          .then(data => {
            contextProps = { pending: false, data, error: null }
            this._setContextProps(contextProps)
            return contextProps
          }, error => {
            contextProps = { pending: false, data: {}, error }
            this._setContextProps(contextProps)
            return contextProps
          })
      }

      // connect 场景下，注入数据到 appContext
      _setContextProps (x) {
        if (!fetchId) {
          return
        }
        // server 端必须以函数形式才能拿到最新的 appContext
        this.props.setAppContext(appContext => {
          const oldVal = appContext[fetchId] || {}
          const newVal = {[fetchId]: { ...oldVal, ...x }}
          return newVal
        })
      }

      refetch = () => this._trigger()

      render () {
        const { addFetchProcess } = this.props
        
        // 服务端发请求的入口
        if (enableAtServer && addFetchProcess) {
          if (typeof this.shouldGetInitialProps !== 'function' || this.shouldGetInitialProps()) {
            addFetchProcess(this._trigger(), fetchId)
          }
          if (typeof this.renderForSsrResolve === 'function') {
            return this.renderForSsrResolve()
          }
        }
        return super.render()
      }
    }

    hoistNonReactStatics(serverFetchWrapper, Component)

    return withAppContext(
      function (appContext) {
        const ret = pick(appContext, ['addFetchProcess', 'setAppContext'])
        return Object.assign(ret, (appContext || {})[fetchId])
      }
    )(serverFetchWrapper)
  }
}
