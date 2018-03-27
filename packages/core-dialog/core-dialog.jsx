import React from 'react'
import dialog from './core-dialog'

export default class Dialog extends React.Component {
  componentDidMount () {
    dialog(this.dialogEl, {open: this.props.open})
    this.props.handleOpen && this.dialogEl.addEventListener('dialog.open', this.props.handleOpen)
    this.props.handleClose && this.dialogEl.addEventListener('dialog.close', this.props.handleClose)
  }
  componentWillUnmount () {
    this.props.handleOpen && this.dialogEl.removeEventListener('dialog.open', this.props.handleOpen)
    this.props.handleClose && this.dialogEl.removeEventListener('dialog.close', this.props.handleClose)
  }

  componentWillReceiveProps (nextProps) {
    dialog(this.dialogEl, {open: nextProps.open})
  }

  render () {
    return (
      <div className='nrk-dialog'
        role='dialog'
        tabIndex='-1'
        ref={(el) => { this.dialogEl = el }}
      >
        {this.props.children}
      </div>
    )
  }
}
