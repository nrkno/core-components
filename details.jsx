import React from 'react'

module.exports = ({summary, children, open = false}) => (
  <details>
    <summary role='button' tabIndex='0' aria-expanded={String(open) !== 'false'}>
      {summary}
    </summary>
    <div>{children}</div>
  </details>
)
