import React from 'react'
import PropTypes from 'prop-types'
import progress from './core-progress'
import { exclude } from '../utils'

export default class Progress extends React.Component {
  static get defaultProps () { return { value: 0, max: 1, onChange: null } }
  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }
  componentDidMount () {
    progress(this.el, this.props)
    this.el.addEventListener('progress.change', this.onChange)
  }
  componentDidUpdate () { progress(this.el, this.props) }
  componentWillUnmount () { this.el.removeEventListener('progress.change', this.onChange) }
  onChange (event) { this.props.onChange && this.props.onChange(event) }
  render () {
    const props = exclude(this.props, Progress.defaultProps, { ref: el => (this.el = el) })
    return React.createElement('progress', props)
  }
}

Progress.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  max: PropTypes.number
}
