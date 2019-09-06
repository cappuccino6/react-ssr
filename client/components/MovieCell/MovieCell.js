import React from 'react'
import withStyle from 'hocs/withStyle'
import JumpLink from '../JumpLink'
import css from './MovieCell.css'

const MovieCell = React.memo(({data = {}}) => (
  <JumpLink href={data.url} blank className={css.root}>
    <img src={data.cover || 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg'} className={css.cover} />
    <div className={css.title}>{data.title}</div>
    <div className={css.rate}>{data.rate} 分</div>
  </JumpLink>
))

export default withStyle(css)(MovieCell)