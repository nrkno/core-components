import toggle from '../core-toggle/core-toggle'

const SPEAKER = typeof document !== 'undefined' && document.createElement('span')

export default function dropdown (elements) {
  return toggle(elements).map((el) => {
    el.setAttribute('aria-haspopup', true)
    return el
  })
}

/* core-toggle
core-dropdown
core-input

<button aria-haspopup="true" aria-controls="menu2" id="menubutton">
  WAI-ARIA Quick Links
</button>
<ul id="menu2" role="menu" aria-labelledby="menubutton">
  <li role="none"><a role="menuitem" href="#">W3C Home Page</a></li>
  <li role="none"><a role="menuitem" href="#">W3C Web Accessibility Initiative</a></li>
  <li role="none"><a role="menuitem" href="#">Accessible Rich Internet Application Specification</a></li>
  <li role="none"><a role="menuitem" href="#">WAI-ARIA Authoring Practices</a></li>
  <li role="none"><a role="menuitem" href="#">WAI-ARIA Implementation Guide</a></li>
  <li role="none"><a role="menuitem" href="#">Accessible Name and Description</a></li>
</ul> */

if (SPEAKER) {
  SPEAKER.setAttribute('aria-live', 'assertive')
  document.documentElement.appendChild(SPEAKER)
}
