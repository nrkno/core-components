import React from 'react'
import coreInput from './core-input'
import {exclude} from '../utils'

const DEFAULTS = {open: null, onFilter: null, onSelect: null}

export default class Input extends React.Component {
  componentDidMount () { // Mount client side only to avoid rerender
    this.el.addEventListener('input.filter', this.props.onFilter)
    this.el.addEventListener('input.select', this.props.onSelect)
    coreInput(this.el.firstElementChild)
  }
  componentDidUpdate () { coreInput(this.el.firstElementChild) } // Must mount also on update in case content changes
  componentWillUnmount () {
    this.el.removeEventListener('input.filter', this.props.onFilter)
    this.el.removeEventListener('input.select', this.props.onSelect)
  }
  render () {
    return React.createElement('div', exclude(this.props, DEFAULTS, {ref: el => (this.el = el)}),
      React.Children.map(this.props.children, (child, adjacent) => adjacent
        ? React.cloneElement(child, {'hidden': !this.props.open})
        : React.cloneElement(child, {'aria-expanded': String(Boolean(this.props.open))})
      )
    )
  }
}

Input.Highlight = ({text, query = ''}) =>
  React.createElement('span', {dangerouslySetInnerHTML: {
    __html: coreInput.highlight(text, query) // We know coreInput escapes, so this is safe
  }})
