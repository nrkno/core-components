import React from 'react'
import PropTypes from 'prop-types'
import coreToggle from './core-toggle'
import { exclude } from '../utils'

export default class Toggle extends React.Component {
  static get defaultProps () { return { open: null, popup: null, onToggle: null, onToggleSelect: null } }
  constructor (props) {
    super(props)
    this.onToggle = this.onToggle.bind(this)
    this.onToggleSelect = this.onToggleSelect.bind(this)
  }
  update () {
    coreToggle(this.el.firstElementChild, {
      popup: this.props.popup,
      open: this.props.open
    })
  }
  componentDidMount () {
    this.update()
    this.el.addEventListener('toggle', this.onToggle)
    this.el.addEventListener('toggle.select', this.onToggleSelect)
  }
  componentDidUpdate () { this.update() }
  componentWillUnmount () {
    this.el.removeEventListener('toggle', this.onToggle)
    this.el.removeEventListener('toggle.select', this.onToggleSelect)
  }
  onToggle (event) {
    this.props.onToggle && this.props.onToggle(event)
  }
  onToggleSelect (event) {
    this.props.onToggleSelect && this.props.onToggleSelect(event)
  }
  render () {
    return React.createElement('div', exclude(this.props, Toggle.defaultProps, { ref: (el) => (this.el = el) }),
      React.Children.map(this.props.children, (child, adjacent) => {
        if (adjacent === 0) {
          return React.cloneElement(child, {
            'aria-expanded': String(Boolean(this.props.open))
          })
        }
        if (adjacent === 1) return React.cloneElement(child, { 'hidden': !this.props.open })
        return child
      })
    )
  }
}

Toggle.propTypes = {
  open: PropTypes.bool,
  popup: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  onToggle: PropTypes.func
}
