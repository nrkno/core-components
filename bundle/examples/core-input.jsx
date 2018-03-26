import ReactDOM from 'react-dom'
import Input from '../../packages/core-input/core-input.jsx' // Replace with 'core-input/jsx' if you copy paste this code

// First element must result in a <input>-tag. Accepts both elements and components
// Next element will be used as results container. Accepts both elements and components
// Results must be wrapped in <a> or <button> for accessibility
ReactDOM.render(
  <Input>
    <input type='text' className='docs-input docs-button' placeholder='Type "C"... (JSX)' />
    <ul className='docs-drop'>
      <li><button type='button' value='google'>Chrome</button></li>
      <li><button type='button'>Firefox</button></li>
      <li><button type='button'>Opera</button></li>
      <li><a href='https://www.apple.com/lae/safari/' target='_blank'>Safari</a></li>
      <li><a href='https://www.microsoft.com/en-us/windows/microsoft-edge' target='_blank'>Microsoft Edge</a></li>
    </ul>
  </Input>,
  document.getElementById('docs-react-input')
)
