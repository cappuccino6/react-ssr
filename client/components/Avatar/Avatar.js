import React from 'react'
import withStyle from 'hocs/withStyle'
import css from './Avatar.css'

const Avatar = ({src}) => (
  <img className={css.root} src={src || 'https://pic3.zhimg.com/v2-85ab519d7e442a5e3ca13aefe4397936.jpg'} />
)

export default withStyle(css)(Avatar)