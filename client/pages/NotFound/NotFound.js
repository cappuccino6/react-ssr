import React from 'react'
import { compose } from 'redux'
import { hot } from 'react-hot-loader'
import { Header, ArticleCell } from 'components'
import { withAppContext } from 'hocs/withAppContext'
import withFetch from 'hocs/withFetch'
import withStyle from 'hocs/withStyle'
import { fetchArticles } from 'store'
import css from './JueJin.css'

class JueJin extends React.Component {

  getInitialProps() {
    return [fetchArticles]
  }

  render() {
    const fetchId = fetchArticles.id
    const { data = {} } = this.props[fetchId] || {}
    const articleData = data.data || {}
    if(!articleData.articleFeed) return (
      <div>
        <Header/>
        掘金的鉴权改了，api请求不到了，憋着急我回头修改下～～
      </div>
    )
    const { articleFeed: {items: {edges = []}} } = articleData

    return (
      <div className={css.root}>
        <Header />
        <div className={css.articles}>
          {edges.map(_ => (
            <ArticleCell key={_.node.id} data={_.node} />
          ))}
        </div>
      </div>
    );
  }
}

export default compose(
  hot(module),
  withAppContext(),
  withStyle(css),
  withFetch()
)(JueJin)
