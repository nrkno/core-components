function onKey (event) {

}

function onFocus (event) {

}

if (typeof document !== 'undefined') {
  document.addEventListener('keydown', onKey)
  document.addEventListener('focus', onFocus, true) // Use capture to ensure event bubling
  document.addEventListener('blur', onFocus, true)  // Use capture to ensure event bubling
  document.head.appendChild(document.createElement('style')).textContent = `
    input::-webkit-calendar-picker-indicator { opacity: 0 }
  `
}
