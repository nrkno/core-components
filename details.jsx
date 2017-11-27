import React from 'react'

module.exports = (props) => (
  <details>
    <summary role='button' tabIndex='0' aria-expanded={String(props.open || 'false') !== 'false'}>
      {props.summary}
    </summary>
    <div>{props.children}</div>
  </details>
)
