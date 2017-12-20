import {assign} from './utils'
import './details'              // Load polyfill

export function Details (props) {
  const isOpen = props.open !== 'false' && Boolean(props.open)
  const aria = {role: 'button', tabIndex: 0, 'aria-expanded': String(isOpen)}
  let children = props.children

  // Loop though children and augment <summary> with aria attributes
  if (Array.isArray(children)) {
    children = children.map((child, key) => {
      const attr = assign({ref: child.ref, key}, child.props, child.type === 'summary' ? aria : {})
      return child.type ? <child.type {...attr} /> : <div key={key}>{child}</div>
    })
  }

  return <details {...props} open={isOpen}>{children}</details>
}
