import React from 'react'
import { withAppContext } from 'hocs/withAppContext'
import Header from 'components/Header'

class Movie extends React.Component {
  render() {
    return (
      <div>
        <Header />
      </div>
    );
  }
}

export default withAppContext()(Movie)
