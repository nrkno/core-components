import React from 'react'
import ReactDOM from 'react-dom'
import coreInput from '../core-input/core-input'
import {exclude} from '../utils'

const DEFAULTS = {open: null, items: null, onType() {}, onFocus() {}, onSelect() {}}

function mountInput (self) {
  coreInput(ReactDOM.findDOMNode(self).firstElementChild)       // Input must be first child
}

// function Highlight (text, regex) {
//   if (!query) return props.text
//   return props.text.split(query)
// }

export default class Input extends React.Component {
  constructor (props) {
    super(props)
    this.onType = this.onType.bind(this)
    this.state = {items: props.items, open: props.open}
  }
  componentDidMount () {                                        // Mount client side only to avoid rerender
    const elem = ReactDOM.findDOMNode(this)
    mountInput(this)
    elem.addEventListener('input.type', this.onType)
    elem.addEventListener('input.focus', this.props.onFocus)
    elem.addEventListener('input.select', this.props.onSelect)
  }
  componentDidUpdate () { mountInput(this) }                    // Must mount also on update in case content changes
  componentWillUnmount () {
    elem.removeEventListener('input.type', this.onType)
    elem.removeEventListener('input.focus', this.props.onFocus)
    elem.removeEventListener('input.select', this.props.onSelect)
  }
  onType (event) {
    const query = event.target.value
    event.detail.render = (items) => this.setState({items, open: true}) // Allow react items
    // event.detail.Highlight = (props) => {}
    this.props.onType(event)
  }
  render () {
    return React.createElement('div', exclude(this.props, DEFAULTS),
      React.Children.map(this.props.children, (child, adjacent) => {
        return adjacent ?
          React.cloneElement(child, {'hidden': !this.state.open}, this.state.items || child.props.children) :
          React.cloneElement(child, {'aria-expanded': String(Boolean(this.state.open))})
      })
    )
  }
}
