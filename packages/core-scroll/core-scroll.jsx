import React from 'react'
import coreScroll from './core-scroll'
import {exclude} from '../utils'

const DEFAULTS = {onScroll: null}

export default class Scroll extends React.Component {
  componentDidMount () { this.update().addEventListener('scroll.change', this.props.onChange) }
  componentDidUpdate () { this.update() }
  componentWillUnmount () { this.el.removeEventListener('scroll.change', this.props.onChange) }
  update (options) { return coreScroll(this.el, options)[0] }
  render () {
    const props = exclude(this.props, DEFAULTS, {ref: el => (this.el = el)})
    return React.createElement('div', props, this.props.children)
  }
}
