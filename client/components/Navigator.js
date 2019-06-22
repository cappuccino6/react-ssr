import React from 'react'
import {compose} from 'redux' 
import {withRouter} from 'react-router'
import JumpLink from './JumpLink'
import cx from 'classnames'
import withStyle from 'hocs/withStyle'
import css from './Navigator.css'

const navs = [
  {name: '首页', link: '/home'},
  {name: '高分电影', link: '/movie'},
]

class Navigator extends React.Component {
  render() {
    // 用 window.location 跳转的形式，这样会走服务端渲染，解决跨域问题
    const {match: {url}} = this.props
    return (
      <div className={css.root}>
        {navs.map((nav, index) => (
          <JumpLink href={nav.link} key={index} className={cx(css.nav, {[css.active]: url === nav.link})}>
            {nav.name}
          </JumpLink>
        ))}
      </div>
    )
  }
}

export default compose(
  withRouter,
  withStyle(css)
)(Navigator)