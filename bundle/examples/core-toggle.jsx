import ReactDOM from 'react-dom'
import Toggle from '../../packages/core-toggle/core-toggle.jsx' // Replace with 'core-toggle/jsx' if you copy paste this code

// Toggle
ReactDOM.render(
  <Toggle>
    <button className='docs-toggle docs-button'>Example toggle JSX</button>
    <div>Content</div>
  </Toggle>,
  document.getElementById('docs-react-toggle')
)

// Popup
ReactDOM.render(
  <Toggle popup>
    <button className='docs-dropdown docs-button'>Example dropdown JSX</button>
    <ul className='docs-drop'>
      <li><a href='#'>Link</a></li>
      <li>
        <Toggle popup>
          <button className='docs-dropdown'>Can also be nested</button>
          <ul className='docs-drop'>
            <li><a href='#'>Sub-link</a></li>
            <li><button>Sub-button</button></li>
          </ul>
        </Toggle>
      </li>
    </ul>
  </Toggle>,
  document.getElementById('docs-react-dropdown')
)
