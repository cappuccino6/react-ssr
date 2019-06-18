import React from 'react'
import Header from 'components/Header'
import axios from 'axios'

class Home extends React.Component {
  state = {
    data: {}
  }
  componentDidMount() {
    axios({
      url: 'http://3darar.com/api/v1/categories',
      method: 'GET'
    }).then(({data}) => {
      console.log(data)
      this.setState({data})
    })
  }
  render() {
    const {data} = this.state
    const {list = []} = data
    return (
      <div>
        <Header />
        {list.map((item, index) => (
          <div key={index}>{item.name}</div>
        ))}
        this is HomePage
      </div>
    );
  }
}

export default Home
