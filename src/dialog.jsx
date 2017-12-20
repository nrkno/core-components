import React from 'react'
import PropTypes from 'prop-types'

const ESC_KEY = 27

class Dialog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: props.isOpen,
      style: {}
    }
    this.dialogEl = null
    this.exitOnEscapeHandler = this.exitOnEscape.bind(this)
  }

  componentWillReceiveProps (newProps) {
    if (typeof newProps.isOpen !== 'undefined') {
      newProps.isOpen ? this.open() : this.close()
    }
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.exitOnEscapeHandler)
  }

  exitOnEscape (e) {
    if (e.keyCode === ESC_KEY && this.state.isOpen) {
      this.close()
    }
  }

  open () {
    this.setState({isOpen: true}, () => {
      document.addEventListener('keydown', this.exitOnEscapeHandler)
      this.props.handleOpen && this.props.handleOpen()
    })
  }

  close () {
    this.setState({isOpen: false}, () => {
      document.removeEventListener('keydown', this.exitOnEscapeHandler)
      this.props.handleClose && this.props.handleClose()
    })
  }

  positionModal () {
    this.setState({
      style: {
        top: Math.round((window.innerHeight - this.dialogEl.clientHeight) / 2) + 'px',
        left: Math.round((window.innerWidth - this.dialogEl.clientWidth) / 2) + 'px'
      }
    })
  }

  render () {
    const dialogProps = {
      role: 'dialog',
      tabIndex: '-1',
      'aria-label': this.props.dialogLabel,
      'aria-modal': this.props.isModal || true
    }
    !this.props.isOpen || (dialogProps.open = 'true')
    console.log('render: ', this.props, this.props.isOpen, dialogProps)
    return (
      <div {...dialogProps}
        ref={(el) => { this.dialogEl = el }}>
        {this.props.children}
      </div>
    )
  }
}

Dialog.propTypes = {
  // The aria label used for the dialog
  dialogLabel: PropTypes.string.isRequired,
  // The state that says if the dialog is open or not
  isOpen: PropTypes.bool.isRequired,
  // A callback when the dialog has been closed
  handleClose: PropTypes.func,
  // A callback when the dialog has been opened
  handleOpen: PropTypes.func
}

module.exports = Dialog
