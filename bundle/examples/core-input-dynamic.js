import coreInput from '../../packages/core-input/core-input' // Replace with 'core-input' if you copy paste this code

coreInput('.js.docs-input-dynamic')

document.addEventListener('input.filter', (event) => {
  if (!event.target.className.match(/\bdocs-input-dynamic\b/)) return // Only listen to dynamic example
  event.preventDefault()

  const emails = ['facebook.com', 'gmail.com', 'hotmail.com', 'mac.com', 'mail.com', 'msn.com', 'live.com']
  const value = event.target.value

  coreInput(event.target, value ? emails.map((mail) =>
    `<li><button>${coreInput.highlight(value.replace(/(@.*|$)/, `@${mail}`), value)}</button><li>`
  ).join('') : '')
})
