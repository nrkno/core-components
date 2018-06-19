import React from 'react'
import coreDatepicker from './core-datepicker'
import {exclude} from '../utils'

export default class Datepicker extends React.Component {
  static get defaultProps () { return {date: null, disable: null, onChange: null, onChangeDay: null} }
  constructor (props) {
    super(props)
    this.onChangeDay = this.onChangeDay.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onRender = this.onRender.bind(this)
  }
  componentDidMount () {
    this.el.addEventListener('datepicker.change.day', this.onChangeDay)
    this.el.addEventListener('datepicker.change', this.onChange)
    this.el.addEventListener('datepicker.render', this.onRender)
    coreDatepicker(this.el, this.props.date)
  }
  componentDidUpdate () { coreDatepicker(this.el, this.props.date) }
  componentWillUnmount () {
    this.el.removeEventListener('datepicker.change.day', this.onChangeDay)
    this.el.removeEventListener('datepicker.change', this.onChange)
    this.el.removeEventListener('datepicker.render', this.onRender)
  }
  onChangeDay (event) { this.props.onChangeDay && this.props.onChangeDay(event) }
  onChange (event) { this.props.onChange && this.props.onChange(event) }
  onRender (event) { this.props.disable && event.detail.disable(this.props.disable) }
  render () {
    const props = exclude(this.props, Datepicker.defaultProps, {ref: el => (this.el = el)})
    return React.createElement('div', props, this.props.children)
  }
}

// Expose API and config
Datepicker.parse = coreDatepicker.parse
Datepicker.months = coreDatepicker.months
Datepicker.days = coreDatepicker.days
