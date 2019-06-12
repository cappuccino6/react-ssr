import React from 'react'
import JumpLink from './JumpLink'
import cx from 'classnames'
import css from './Navigator.css'

const navs = [
  {name: '首页', link: '/home'},
  {name: '个人中心', link: '/usercenter'},
]

class Navigator extends React.PureComponent {
  state = {
    active: 0
  }
  handleClick = index => {
    this.setState({active: index})
  }
  render() {
    const {active} = this.state
    return (
      <div className={css.root}>
        {navs.map((nav, index) => (
          <JumpLink key={index} className={cx(css.nav, {[css.active]: active === index})} to={nav.link} onClick={() => this.handleClick(index)}>
            {nav.name}
          </JumpLink>
        ))}
      </div>
    )
  }
}

export default Navigator