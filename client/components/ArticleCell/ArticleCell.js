import React from 'react'
import withStyle from 'hocs/withStyle'
import JumpLink from '../JumpLink'
import {fromNow} from 'utils/date'
import {get} from 'lodash'
import css from './ArticleCell.css'

class ArticleCell extends React.Component {
  render() {
    const {data = {}} = this.props
    return (
      <JumpLink href={data.originalUrl} blank className={css.root}>
        <div className={css.top}>
          <div className={css.user}>
            {get(data, 'user.username', '')}
          </div>
          {data.tags.map(_ => <span key={_.id} className={css.tag}>{_.title}</span>)}
          <div className={css.time}>{fromNow(new Date(data.createdAt))}</div>
        </div>
        <div className={css.title}>{data.title}</div>
        <div className={css.bottom}>
          <div><img src="https://b-gold-cdn.xitu.io/v3/static/img/zan.e9d7698.svg" /><span>{data.likeCount}</span></div>
          <div><img src="https://b-gold-cdn.xitu.io/v3/static/img/comment.4d5744f.svg" /><span>{data.commentsCount}</span></div>
        </div>
      </JumpLink>
    )
  }
}

export default withStyle(css)(ArticleCell)