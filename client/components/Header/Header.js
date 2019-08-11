import React from 'react'
import Avatar from '../Avatar'
import Navigator from '../Navigator'
import withStyle from 'hocs/withStyle'
import css from './Header.css'

const logo = 'https://img3.doubanio.com/f/sns/0f9e2dbca60b52f595ddbc02073cb4bb879ed1c9/pics/nav/logo_db@2x.png'

class Header extends React.Component {
  render() {
    return (
      <div className={css.root}>

        <div className={css.wrapper}>
          <div className={css.left}>
            <img className={css.logo} src={logo} />
            <Navigator />
          </div>
          <Avatar />
        </div>
      </div>
    )
  }
}

export default withStyle(css)(Header)