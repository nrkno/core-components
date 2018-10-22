import React from 'react'
import PropTypes from 'prop-types'
import coreScroll from './core-scroll'
import { exclude, requestAnimFrame } from '../utils'

export default class Scroll extends React.Component {
  static get defaultProps () { return { onChange: null, friction: null } }
  constructor (props) {
    super(props)
    this.onScroll = this.onScroll.bind(this)
    this.scrollTo = (options) => coreScroll(this.el, options)
    this.scrollUp = () => coreScroll(this.el, 'up')
    this.scrollDown = () => coreScroll(this.el, 'down')
    this.scrollLeft = () => coreScroll(this.el, 'left')
    this.scrollRight = () => coreScroll(this.el, 'right')
  }
  componentDidMount () {
    this.el.addEventListener('scroll.change', this.onScroll)
    requestAnimFrame(() => coreScroll(this.el, { friction: this.props.friction })) // Make sure DOM has rendered
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.skipUpdate) this.skipUpdate = false // Update is from scroll.change, so prevent infinite loop
    else coreScroll(this.el)
  }
  componentWillUnmount () { this.el.removeEventListener('scroll.change', this.onScroll) }
  onScroll ({ detail }) {
    if (this.props.onChange) {
      this.skipUpdate = true
      this.props.onChange({
        scrollUp: detail.up ? this.scrollUp : null,
        scrollDown: detail.down ? this.scrollDown : null,
        scrollLeft: detail.left ? this.scrollLeft : null,
        scrollRight: detail.right ? this.scrollRight : null
      })
    }
  }
  render () {
    const props = exclude(this.props, Scroll.defaultProps, { ref: el => (this.el = el) })
    return React.createElement('div', props, this.props.children)
  }
}

Scroll.propTypes = {
  onChange: PropTypes.func,
  friction: PropTypes.number
}
