import React from 'react'
import {withRouter} from 'react-router'

const JumpLink = (({children, className, ...props}) => {
  const handleClick = () => {
    // to 为相对链接，href 为绝对地址
    const {
      to, 
      history, 
      href, 
      onClick,
      disabled,
      blank
    } = props
    if(onClick) {
      onClick()
    }
    if(disabled) return
    if(to) {
      history.push(to)
    }
    if(href) {
      if(blank) {
        window.open(href, '__blank')
      } else {
        window.location.href = href
      }
    }
  }

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  )
})

export default withRouter(JumpLink)

