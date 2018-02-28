import React from 'react'
// import dropown from './core-dropdown'
// import {assign} from '../utils'

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
    // this.setState((prevState) => {
    //   const nextState = {open: !prevState.open}
    //   const isUpdate = dispatchEvent(this.element, 'toggle', nextState)
    //   return isUpdate? nextState : prevState
    // })
  }
  render () {
    return React.createElement('button')
    // return React.createElement('button', assign({
    //   'aria-expanded': this.state.open,
    //   onClick: this.toggle,
    //   ref: toggle
    // }, this.props))
  }
}
