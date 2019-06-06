import React from 'react'
import css from './Header.css'

class Header extends React.Component {
  render() {
    console.log('reender=====asdaasad')
    return (
      <div className={css.root}>
        <a href="/home">home</a>
        <a href="/usercentersss">usercenter</a>
      </div>
    )
  }
}

export default Header