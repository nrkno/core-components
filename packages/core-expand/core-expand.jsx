import React from 'react'
import ReactDOM from 'react-dom'
import {expand as ref} from './core-expand'
import {assign} from '../utils'

export function Expand (props) {
  const isExpanded = props.open !== 'false' && Boolean(props.open)
  const attr = assign({
    'className': 'nrk-expand',
    'aria-expanded': isExpanded,
    ref
  }, props)

  return <button {...attr} />
}
