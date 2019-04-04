import React from 'react'
import PropTypes from 'prop-types'
import dialog from './core-dialog'
import { exclude } from '../utils'

export default class Dialog extends React.Component {
  static get defaultProps () { return { strict: null, onToggle: null, modal: null } }
  constructor (props) {
    super(props)
    this.onToggle = this.onToggle.bind(this)
  }
  componentDidMount () {
    dialog(this.el, this.props)
    this.el.addEventListener('dialog.toggle', this.onToggle)
  }
  componentDidUpdate () { dialog(this.el, this.props) }
  componentWillUnmount () { this.el.removeEventListener('dialog.toggle', this.onToggle) }
  onToggle (event) { this.props.onToggle && this.props.onToggle(event) }
  render () {
    const props = exclude(this.props, Dialog.defaultProps, { ref: el => (this.el = el) })
    return React.createElement('dialog', props, this.props.children)
  }
}

Dialog.propTypes = {
  onToggle: PropTypes.func,
  strict: PropTypes.bool,
  modal: PropTypes.bool,
  open: PropTypes.bool
}
