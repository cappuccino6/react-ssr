/**
 * 服务端请求失败时 client 端的发请求逻辑
 */
import hoistNonReactStatics from 'hoist-non-react-statics'
import {pick, get} from 'lodash'
import { withAppContext } from 'hocs/withAppContext'

const shouldFetch = true

export default function withFetch (initialFetches) {

  return function withFetchInner (Component) {

    // 在这里显式定义 getInitialProps，让服务端可以抓到请求
    Component.getInitialProps = initialFetches

    if(!initialFetches || !Array.isArray(initialFetches)) {
      throw new Error(`initialFetches must be defined and must be an array`)
    }

    // 这里继承的是传入的 Component
    class withFetchWrapper extends Component {

      constructor(props) {
        super(props)
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
        const waitForFetch = initialFetches.filter(_ => get(this.props[_.id], 'pending', undefined) === undefined)
        waitForFetch.forEach(_ => {
          if(get(this.props[_.id], 'pending', undefined) === undefined) {
            this.fetch(_.id)
          }
        })
      }

      // client 的实际请求发送逻辑
      async fetch (id) {
        this.setContextProps({ [id]: {pending: true} })

        let contextProps = await initialFetches.find(_ => _.id === id).ajax()

        this.setContextProps({
          [id]: {
            error: null,
            pending: false,
            data: contextProps
          }
        })
      }

      setContextProps (props) {
        this.props.setAppContext(appContext => {
          const newVal = {...appContext, ...props}
          return newVal
        })
      }

      render () {
        return super.render()
      }
    }

    hoistNonReactStatics(withFetchWrapper, Component)

    return withAppContext(
      function (appContext) {
        const con = pick(appContext, ['setAppContext'])
        return Object.assign(con, (appContext || {}))
      }
    )(withFetchWrapper)
  }
}
