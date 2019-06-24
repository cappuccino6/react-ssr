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
