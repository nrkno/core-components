import React from 'react'
import coreToggle from '../core-toggle/core-toggle'
import {ariaTarget, assign, dispatchEvent} from '../utils'

function mountToggle (self) {
  coreToggle(ReactDOM.findDOMNode(self).firstElementChild)      // Button must be first child
}

export default class Toggle extends React.Component {
  componentDidMount() { mountToggle(this) }                     // Mount client side only to avoid rerender
  componentDidUpdate () { mountToggle(this) }                   // Must mount also on update in case content changes
  render () {
    return <div {...assign({}, this.props, {open: null, popup: null})}>
      {React.Children.map(this.props.children, (child, i) => {  // Augment children with aria-attributes
        return assign({}, child, {
          props: assign({}, child.props, i ?
            {'hidden': !this.props.open} :
            {
              'aria-expanded': String(Boolean(this.props.open)),
              'aria-haspopup': String(Boolean(this.props.popup))
            }
          )
        })
      })}
    </div>
  }
}
