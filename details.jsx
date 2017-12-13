require('./details') // Load polyfill

module.exports = (props) => {
  const open = props.open !== 'false' && Boolean(props.open)
  const aria = {role: 'button', tabIndex: 0, 'aria-expanded': String(open)}
  let children = props.children

  // Loop though children and augment <summary> with aria attributes
  if (Array.isArray(props.children)) {
    children = children.map((child, key) => {
      const attr = child.type === 'summary' ? aria : {}
      if (!child.type) return <span key={key}>{child}</span>
      return <child.type {...child.props} {...attr} ref={child.ref} key={key} />
    })
  }

  return <details {...props} open={open}>{children}</details>
}
