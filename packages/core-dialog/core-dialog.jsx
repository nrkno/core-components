import React from 'react'
import {dialog} from './core-dialog'

export class Dialog extends React.Component {
  componentDidMount () {
    this.dialog = dialog(this.dialogEl, {
      onOpenCallback: () => {
        this.props.onOpenCallback()
      },
      onCloseCallback: () => {
        this.props.onCloseCallback()
      }
    })
  }

  componentWillReceiveProps (nextProps) {
    this.props.open !== nextProps.open && this.toggle(nextProps.open)
  }

  shouldComponentUpdate () {
    return false
  }

  toggle (open) {
    if (open) {
      this.dialog.open()
    } else {
      this.dialog.close()
    }
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
