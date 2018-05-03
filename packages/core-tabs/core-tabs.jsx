import React from 'react'
import coreTabs from './core-tabs'
import {exclude} from '../utils'

const DEFAULTS = {openIndex: null, onToggle: null}

export default class Tabs extends React.Component {
  componentDidMount () {
    coreTabs(this.el.firstElementChild) // Mount client side only to avoid rerender
    this.el.addEventListener('tabs.toggle', this.props.onToggle)
  }
  componentDidUpdate () { coreTabs(this.el.firstElementChild) } // In case content changes
  componentWillUnmount () { this.el.removeEventListener('tabs.toggle', this.props.onToggle) }
  render () {
    const open = this.props.open || 0
    const attr = exclude(this.props, DEFAULTS, {ref: (el) => (this.el = el)})

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
