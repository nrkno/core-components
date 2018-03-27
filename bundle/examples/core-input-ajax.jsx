import React from 'react'
import ReactDOM from 'react-dom'
import Input from '../../packages/core-input/core-input.jsx' // Replace with 'core-input/jsx' if you copy paste this code

// IMPORTANT: Always debounce and properly abort requests to server APIs to avoid spaming
// Example implementation:
const debouncedRequest = (url, callback, timeout = 500) => {
  const xhr = debouncedRequest.xhr = debouncedRequest.xhr || new window.XMLHttpRequest()

  xhr.abort() // Since we store reference to xhr, we can abort ongoing request
  xhr.onload = () => callback(xhr.responseText)

  clearTimeout(debouncedRequest.timer) // Clear timer
  debouncedRequest.timer = setTimeout(() => { // Setup new timer with request
    xhr.open('GET', url, true)
    xhr.send()
  }, timeout)
}

class MyAjaxCoreInput extends React.Component {
  constructor (props) {
    super(props)
    this.onFilter = this.onFilter.bind(this)
    this.state = { items: [], value: '' }
  }
  onFilter (event) {
    const value = event.target.value
    const query = encodeURIComponent(value).trim()
    const url = `https://tv.nrk.no/autocomplete?query=${query}`

    event.preventDefault() // Stop coreInput from default filtering
    this.setState({
      value, // Store value for highlighting
      items: value ? [{title: `Søker etter ${value}...`}] : []
    })

    debouncedRequest(url, (data) => {
      this.setState({
        items: JSON.parse(data).result
          .filter((item) => item._type === 'serie')
          .map((item) => item._source)
          .slice(0, 10)
      })
    })
  }
  render () {
    return <Input onFilter={this.onFilter}>
      <input type='text' className='docs-input docs-button' placeholder='Type "nytt"... (JSX)' />
      <ul className='docs-drop'>
        {this.state.items.map((item, key) =>
          <li key={key}>
            <a href={`https://tv.nrk.no/${item.url}`}>
              <Input.Highlight text={item.title} query={this.state.value} />
            </a>
          </li>
        )}
      </ul>
    </Input>
  }
}

ReactDOM.render(<MyAjaxCoreInput />, document.getElementById('docs-react-input-ajax'))
