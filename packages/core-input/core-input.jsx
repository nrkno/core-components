import React from 'react'
import coreInput from './core-input'
import {exclude} from '../utils'

const DEFAULTS = {open: null, onFilter: null, onSelect: null}

export default class Input extends React.Component {
  constructor (props) {
    super(props)
    this.onFilter = this.onFilter.bind(this)
    this.onSelect = this.onSelect.bind(this)
  }
  componentDidMount () { // Mount client side only to avoid rerender
    this.el.addEventListener('input.filter', this.onFilter)
    this.el.addEventListener('input.select', this.onSelect)
    coreInput(this.el.firstElementChild)
  }
  componentDidUpdate () { coreInput(this.el.firstElementChild) } // Must mount also on update in case content changes
  componentWillUnmount () {
    this.el.removeEventListener('input.filter', this.onFilter)
    this.el.removeEventListener('input.select', this.onSelect)
  }
  onFilter (event) { this.props.onFilter && this.props.onFilter(event) }
  onSelect (event) { this.props.onSelect && this.props.onSelect(event) }
  render () {
    return React.createElement('div', exclude(this.props, DEFAULTS, {ref: el => (this.el = el)}),
      React.Children.map(this.props.children, (child, adjacent) => {
        if (adjacent === 0) {
          return React.cloneElement(child, {
            'aria-expanded': String(Boolean(this.props.open))
          })
        }
        if (adjacent === 1) return React.cloneElement(child, {'hidden': !this.props.open})
        return child
      })
    )
  }
}

Input.Highlight = ({text, query = ''}) =>
  React.createElement('span', {dangerouslySetInnerHTML: {
    __html: coreInput.highlight(text, query) // We know coreInput escapes, so this is safe
  }})
