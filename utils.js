function addCss (css) {
  if (!addCss.sheet) addCss.sheet = document.head.appendChild(document.createElement('style')).sheet
  css.split('}').forEach((css) => css.trim() && addCss.sheet.insertRule(`${css}}`))
}

// function onKeyDownFixRoleButton (event) {
//   const enterOrSpace = event.keyCode === 13 || event.keyCode === 32
//   if (enterOrSpace && event.target.getAttribute('role') === 'button') {
//     event.preventDefault()
//     event.target.click()
//   }
// }

// function onClickAriaExpanded (event) {
//   for (let el = event.target; el; el = el.parentElement) {
//     const expanded = el.getAttribute('aria-expanded')
//     if (expanded) {
//       el.setAttribute('aria-expanded', expanded === 'false')
//       break
//     }
//   }
// }

if (typeof document !== 'undefined') {
  // window.addEventListener('keydown', onKeyDownFixRoleButton)
  // document.addEventListener('click', onClickAriaExpanded)
  Object.defineProperty(window.Element.prototype, 'open', {
    enumerable: true,     // List property in Object.keys and for ( in )
    configurable: true,   // Make property editable
    get: function () {
      console.log('open.get')
      return this.hasAttribute('open')
    },
    set: function (open) {
      console.log('open.set')
      // this.setAttribute('aria-expanded', Boolean(open))
      this[open ? 'setAttribute' : 'removeAttribute']('open', '')
      return open
    }
  })
}

module.exports = {
  addCss
  // closest
  // fixAriaExpanded,
  // fixRoleButton
  // onClickAriaExpanded,
  // onKeyDownFixRoleButton
}
