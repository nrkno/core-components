import React from 'react'
import coreDate from './core-date'
import {exclude} from '../utils'

const DEFAULTS = {date: null, onChange: null}

export default class Datepicker extends React.Component {
  componentDidMount () {
    this.el.addEventListener('datepicker.change', this.props.onChange)
    coreDate(this.el.firstElementChild, this.props.date)
  }
  componentDidUpdate () { coreDate(this.el.firstElementChild, this.props.date) }
  componentWillUnmount () { this.el.removeEventListener('datepicker.change', this.props.onChange) }
  render () {
    const props = exclude(this.props, DEFAULTS, {ref: el => (this.el = el)})
    return React.createElement('div', props, this.props.children)
  }
}
