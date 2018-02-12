import React from 'react'
import {assign} from '../utils'

export class Toggle extends React.PureComponent {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = {open: this.props.open !== 'false' && Boolean(this.props.open)}
  }
  toggle() {
    this.setState((prevState, props) => ({open: !prevState.open}))
  }
  render() {
    const attr = assign({
      'aria-expanded': this.state.open,
      'onClick': this.toggle
    }, this.props)

    return <button {...attr} />
  }
}
