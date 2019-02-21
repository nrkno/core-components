import React from 'react'
import PropTypes from 'prop-types'
import coreInput from './core-input'
import { exclude } from '../utils'

export default class Input extends React.Component {
  static get defaultProps () { return { open: null, ajax: null, onAjax: null, onAjaxBeforeSend: null, onFilter: null, onSelect: null } }
  constructor (props) {
    super(props)
    this.onFilter = (event) => this.props.onFilter && this.props.onFilter(event)
    this.onSelect = (event) => this.props.onSelect && this.props.onSelect(event)
    this.onAjaxBeforeSend = (event) => this.props.onAjaxBeforeSend && this.props.onAjaxBeforeSend(event)
    this.onAjax = (evnet) => this.props.onAjax && this.props.onAjax(event)
  }
  componentDidMount () { // Mount client side only to avoid rerender
    this.el.addEventListener('input.filter', this.onFilter)
    this.el.addEventListener('input.select', this.onSelect)
    this.el.addEventListener('input.ajax.beforeSend', this.onAjaxBeforeSend)
    this.el.addEventListener('input.ajax', this.onAjax)
    coreInput(this.el.firstElementChild, this.props)
  }
  componentDidUpdate () { coreInput(this.el.firstElementChild) } // Must mount also on update in case content changes
  componentWillUnmount () {
    this.el.removeEventListener('input.filter', this.onFilter)
    this.el.removeEventListener('input.select', this.onSelect)
    this.el.removeEventListener('input.beforeSend', this.onAjaxBeforeSend)
    this.el.removeEventListener('input.ajax', this.onAjax)
  }
  render () {
    return React.createElement('div', exclude(this.props, Input.defaultProps, { ref: el => (this.el = el) }),
      React.Children.map(this.props.children, (child, adjacent) => {
        if (adjacent === 0) return React.cloneElement(child, { 'aria-expanded': String(Boolean(this.props.open)) })
        if (adjacent === 1) return React.cloneElement(child, { 'hidden': !this.props.open })
        return child
      })
    )
  }
}

Input.Highlight = ({ text, query = '' }) =>
  React.createElement('span', { dangerouslySetInnerHTML: {
    __html: coreInput.highlight(text, query) // We know coreInput escapes, so this is safe
  } })

Input.propTypes = {
  onFilter: PropTypes.func,
  onSelect: PropTypes.func,
  onAjax: PropTypes.func,
  open: PropTypes.bool,
  ajax: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
}
