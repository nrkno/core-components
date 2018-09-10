import React from 'react'
import PropTypes from 'prop-types'
import coreDatepicker from './core-datepicker'
import { exclude } from '../utils'

export default class Datepicker extends React.Component {
  static get defaultProps () { return { date: null, disable: null, onRender: null, onChange: null, onClickDay: null } }
  constructor (props) {
    super(props)
    this.onClickDay = this.onClickDay.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onRender = this.onRender.bind(this)
  }
  componentDidMount () {
    this.el.addEventListener('datepicker.click.day', this.onClickDay)
    this.el.addEventListener('datepicker.change', this.onChange)
    this.el.addEventListener('datepicker.render', this.onRender)
    coreDatepicker(this.el, this.props.date)
  }
  componentDidUpdate () { coreDatepicker(this.el, this.props.date) }
  componentWillUnmount () {
    this.el.removeEventListener('datepicker.click.day', this.onClickDay)
    this.el.removeEventListener('datepicker.change', this.onChange)
    this.el.removeEventListener('datepicker.render', this.onRender)
  }
  onClickDay (event) { this.props.onClickDay && this.props.onClickDay(event) }
  onChange (event) { this.props.onChange && this.props.onChange(event) }
  onRender (event) { this.props.disable && event.detail.disable(this.props.disable) }
  render () {
    const props = exclude(this.props, Datepicker.defaultProps, { ref: el => (this.el = el) })
    return React.createElement('div', props, this.props.children)
  }
}

// Expose API and config
Datepicker.parse = coreDatepicker.parse
Datepicker.months = coreDatepicker.months
Datepicker.days = coreDatepicker.days

Datepicker.propTypes = {
  disable: PropTypes.func,
  onRender: PropTypes.func,
  onChange: PropTypes.func,
  onClickDay: PropTypes.func,
  date: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date)
  ])
}
