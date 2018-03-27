import ReactDOM from 'react-dom'
import Input from '../../packages/core-input/core-input.jsx' // Replace with 'core-input/jsx' if you copy paste this code

// First element must result in a <input>-tag. Accepts both elements and components
// Next element will be used as results container. Accepts both elements and components
// Results must be wrapped in <a> or <button> for accessibility
ReactDOM.render(
  <Input>
    <input type='text' className='docs-input docs-button' placeholder='Type "C"... (JSX)' />
    <ul className='docs-drop'>
      <li><button>Chrome</button></li>
      <li><button>Firefox</button></li>
      <li><button>Opera</button></li>
      <li><button>Safari</button></li>
      <li><button>Microsoft Edge</button></li>
    </ul>
  </Input>,
  document.getElementById('docs-react-input')
)
