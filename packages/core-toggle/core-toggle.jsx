import React from 'react'
import toggle from './core-toggle'
import {assign} from '../utils'

export default class Toggle extends React.PureComponent {
  constructor (props) {
    super(props)
    this.getElement = this.getElement.bind(this)
    this.toggle = this.toggle.bind(this)
    this.state = {open: this.props.open}
  }
  getElement (element) {
    this.element = element
  }
  toggle () {
    this.setState((prevState) => {
      const nextState = {open: !prevState.open}
      const isUpdate = dispatchEvent(this.element, 'toggle', nextState)
      return isUpdate? nextState : prevState
    })
  }
  render () {
    console.log('hei', this.props)
    return React.createElement('button', assign({
      'aria-expanded': this.state.open,
      onClick: this.toggle,
      ref: toggle
    }, this.props))
  }
}
