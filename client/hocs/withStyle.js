import React, {Component} from 'react'

// 生成高阶组件:用于服务端渲染生成样式
export default (WrapperComponent, styles) => {
  return class NewComponent extends Component {
    componentWillMount(){
      const {staticContext} = this.props
      // 把服务端渲染样式注入到css中最后传递到style
      staticContext && (staticContext.css.push(styles._getCss()))
    }
    render(){
      return <WrapperComponent {...this.props} />
    }
  }
}

