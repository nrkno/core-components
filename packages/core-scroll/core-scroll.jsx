import React from 'react'
import coreScroll from './core-scroll'
import {exclude} from '../utils'

const DEFAULTS = {}

export default class Input extends React.Component {
  componentDidMount () {
    // this.el.addEventListener('input.filter', this.props.onFilter)
    coreScroll(this.el.firstElementChild)
  }
  componentDidUpdate () { coreScroll(this.el.firstElementChild) }
  componentWillUnmount () {
    // this.el.removeEventListener('input.filter', this.props.onFilter)
  }
  render () {
    const props = exclude(this.props, DEFAULTS, {ref: el => (this.el = el)})
    return React.createElement('div', props, this.props.children)
  }
}
