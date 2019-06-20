import React from 'react'
import {withRouter} from 'react-router'
import JumpLink from './JumpLink'
import cx from 'classnames'
import css from './Navigator.css'

const navs = [
  {name: '首页', link: '/home'},
  {name: '高分电影', link: '/movie'},
]

class Navigator extends React.Component {
  render() {
    const {match: {url}} = this.props
    return (
      <div className={css.root}>
        {navs.map((nav, index) => (
          <JumpLink to={nav.link} key={index} className={cx(css.nav, {[css.active]: url === nav.link})}>
            {nav.name}
          </JumpLink>
        ))}
      </div>
    )
  }
}

export default withRouter(Navigator)