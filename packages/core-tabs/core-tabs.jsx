import React from 'react'
import coreTabs from './core-tabs'
import {exclude} from '../utils'

export default class Tabs extends React.Component {
  static get defaultProps () { return {open: null, onToggle: null} }
  constructor (props) {
    super(props)
    this.onToggle = this.onToggle.bind(this)
  }
  componentDidMount () {
    coreTabs(this.el.firstElementChild, this.props.open) // Mount client side only to avoid rerender
    this.el.addEventListener('tabs.toggle', this.onToggle)
  }
  componentDidUpdate () { coreTabs(this.el.firstElementChild, this.props.open) } // In case content changes
  componentWillUnmount () { this.el.removeEventListener('tabs.toggle', this.onToggle) }
  onToggle (event) { this.props.onToggle && this.props.onToggle(event) }
  render () {
    const open = this.props.open || 0
    const attr = exclude(this.props, Tabs.defaultProps, {ref: (el) => (this.el = el)})

    return React.createElement('div', attr,
      React.Children.map(this.props.children, (group, isPanelGroup) => {
        if (isPanelGroup < 2) {
          return React.cloneElement(group, null, React.Children.map(group.props.children, (child, index) =>
            React.cloneElement(child, isPanelGroup
              ? {hidden: open !== index}
              : {'aria-selected': open === index})
          ))
        }
        return group
      })
    )
  }
}
