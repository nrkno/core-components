import React from 'react'
import coreScroll from './core-scroll'
import {exclude} from '../utils'

const DEFAULTS = {onScroll: null}

export default class Scroll extends React.Component {
  componentDidMount () { this.move().addEventListener('scroll.change', this.props.onChange) }
  componentDidUpdate () { this.move() }
  componentWillUnmount () { this.el.removeEventListener('scroll.change', this.props.onChange) }
  move (options) { return coreScroll(this.el, options)[0] }
  render () {
    const props = exclude(this.props, DEFAULTS, {ref: el => (this.el = el)})
    return React.createElement('div', props, this.props.children)
  }
}
