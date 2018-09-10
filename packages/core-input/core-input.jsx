import React from 'react'
import PropTypes from 'prop-types'
import coreInput from './core-input'
import { exclude } from '../utils'

export default class Input extends React.Component {
  static get defaultProps () { return { open: null, ajax: null, onAjax: null, onFilter: null, onSelect: null } }
  constructor (props) {
    super(props)
    this.onFilter = this.onFilter.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.onAjax = this.onAjax.bind(this)
  }
  componentDidMount () { // Mount client side only to avoid rerender
    this.el.addEventListener('input.filter', this.onFilter)
    this.el.addEventListener('input.select', this.onSelect)
    this.el.addEventListener('input.ajax', this.onAjax)
    coreInput(this.el.firstElementChild, this.props)
  }
  componentDidUpdate () { coreInput(this.el.firstElementChild) } // Must mount also on update in case content changes
  componentWillUnmount () {
    this.el.removeEventListener('input.filter', this.onFilter)
    this.el.removeEventListener('input.select', this.onSelect)
    this.el.removeEventListener('input.ajax', this.onAjax)
  }
  onFilter (event) { this.props.onFilter && this.props.onFilter(event) }
  onSelect (event) { this.props.onSelect && this.props.onSelect(event) }
  onAjax (event) { this.props.onAjax && this.props.onAjax(event) }
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
  ajax: PropTypes.string,
  open: PropTypes.bool
}
