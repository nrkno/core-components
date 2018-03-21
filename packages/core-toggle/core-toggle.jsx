import React from 'react'
import ReactDOM from 'react-dom'
import coreToggle from '../core-toggle/core-toggle'
import {exclude} from '../utils'

const DEFAULTS = {open: null, popup: null}

function mountToggle (self) {
  coreToggle(ReactDOM.findDOMNode(self).firstElementChild)      // Button must be first child
}

export default class Toggle extends React.Component {
  componentDidMount () { mountToggle(this) }                    // Mount client side only to avoid rerender
  componentDidUpdate () { mountToggle(this) }                   // Must mount also on update in case content changes
  render () {
    return React.createElement('div', exclude(this.props, DEFAULTS),
      React.Children.map(this.props.children, (child, adjacent) => {
        return React.cloneElement(child, adjacent ?
          {'hidden': !this.props.open} :
          {
            'aria-expanded': String(Boolean(this.props.open)),
            'aria-haspopup': String(Boolean(this.props.popup))
          })
      })
    )
  }
}
