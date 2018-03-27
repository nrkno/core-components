import React from 'react'
import ReactDOM from 'react-dom'
import Input from '../../packages/core-input/core-input.jsx' // Replace with 'core-input/jsx' if you copy paste this code

class MyDynamicCoreInput extends React.Component {
  constructor (props) {
    super(props)
    this.onFilter = this.onFilter.bind(this)
    this.emails = ['facebook.com', 'gmail.com', 'hotmail.com', 'mac.com', 'mail.com', 'msn.com', 'live.com']
    this.state = {items: []}
  }
  onFilter (event) {
    const value = event.target.value
    const items = value ? this.emails.map((mail) => value.replace(/(@.*|$)/, `@${mail}`)) : []

    event.preventDefault()
    this.setState({value, items})
  }
  render () {
    return <Input onFilter={this.onFilter}>
      <input type='text' className='docs-input docs-button' placeholder='Type your email... (JSX)' />
      <ul className='docs-drop'>
        {this.state.items.map((item, key) =>
          <li key={key}><button><Input.Highlight text={item} query={this.state.value} /></button></li>
        )}
      </ul>
    </Input>
  }
}

ReactDOM.render(<MyDynamicCoreInput />, document.getElementById('docs-react-input-dynamic'))
