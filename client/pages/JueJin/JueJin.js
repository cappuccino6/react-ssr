import React from 'react'
import { compose } from 'redux'
import { hot } from 'react-hot-loader'
import Header from 'components/Header'
import ArticleCell from 'components/ArticleCell'
import { withAppContext } from 'hocs/withAppContext'
import withFetch from 'hocs/withFetch'
import withStyle from 'hocs/withStyle'
import { fetchArticles } from 'store'
import css from './JueJin.css'

class JueJin extends React.Component {

  render() {
    const fetchId = fetchArticles.id
    const { data = {} } = this.props[fetchId] || {}
    const articleData = data.data || {}
    if(!articleData.articleFeed) return null
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
  withFetch([fetchArticles])
)(JueJin)
