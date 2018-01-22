import React from 'react'
import {expand as ref} from './core-expand'
import {assign} from '../utils'

export class Expand extends React.PureComponent {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = {
      expanded: this.props.open !== 'false' && Boolean(this.props.open)
    }
  }
  toggle() {
    // this.setState((prevState, props) => ({
    //   expanded: !prevState.expanded
    // }))
  }
  render() {
    const attr = assign({
      'aria-expanded': this.state.expanded,
      'onClick': this.toggleExpanded,
      ref
    }, this.props)

    return <button {...attr} />
  }
}
