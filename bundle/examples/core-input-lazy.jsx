import React from 'react'
import ReactDOM from 'react-dom'
import Input from '../../packages/core-input/core-input.jsx' // Replace with 'core-input/jsx' if you copy paste this code

class MyLazyCoreInput extends React.Component {
  constructor (props) {
    super(props)
    this.onFilter = this.onFilter.bind(this)
    this.state = {items: []}
  }
  onFilter (event) {
    if (!this.xhr) { // Load items on first interaction
      this.xhr = new window.XMLHttpRequest()
      this.xhr.onload = () => {
        this.setState({items: JSON.parse(this.xhr.responseText)})
      }
      this.xhr.open('GET', 'https://restcountries.eu/rest/v1/lang/fr', true)
      this.xhr.send()
    }
  }
  render () {
    return <Input onFilter={this.onFilter}>
      <input type='text' className='docs-input docs-button' placeholder='Type "B"... (JSX)' />
      <ul className='docs-drop'>
        {this.state.items.map((item, key) =>
          <li key={key}><button>{item.name}</button></li>
        )}
      </ul>
    </Input>
  }
}

ReactDOM.render(<MyLazyCoreInput />, document.getElementById('docs-react-input-lazy'))
