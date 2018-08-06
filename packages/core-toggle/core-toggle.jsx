import React from 'react'
import PropTypes from 'prop-types'
import coreToggle from './core-toggle'
import {exclude} from '../utils'

export default class Toggle extends React.Component {
  static get defaultProps () { return {open: null, popup: null, onToggle: null} }
  constructor (props) {
    super(props)
    this.onToggle = this.onToggle.bind(this)
  }
  componentDidMount () {
    coreToggle(this.el.firstElementChild) // Mount client side only to avoid rerender
    this.el.addEventListener('toggle', this.onToggle)
  }
  componentDidUpdate () { coreToggle(this.el.firstElementChild) } // Must mount also on update in case content changes
  componentWillUnmount () { this.el.removeEventListener('toggle', this.onToggle) }
  onToggle (event) { this.props.onToggle && this.props.onToggle(event) }
  render () {
    return React.createElement('div', exclude(this.props, Toggle.defaultProps, {ref: (el) => (this.el = el)}),
      React.Children.map(this.props.children, (child, adjacent) => {
        if (adjacent === 0) {
          return React.cloneElement(child, {
            'aria-expanded': String(Boolean(this.props.open)),
            'aria-haspopup': String(Boolean(this.props.popup))
          })
        }
        if (adjacent === 1) return React.cloneElement(child, {'hidden': !this.props.open})
        return child
      })
    )
  }
}

Toggle.propTypes = {
  open: PropTypes.bool,
  popup: PropTypes.bool,
  onToggle: PropTypes.func
}
