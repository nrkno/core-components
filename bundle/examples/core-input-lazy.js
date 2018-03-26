import coreInput from '../../packages/core-input/core-input' // Replace with 'core-input' if you copy paste this code

coreInput('.js.docs-input-lazy') // Initialize examples

document.addEventListener('input.filter', function (event) {
  if (!event.target.className.match(/\bdocs-input-lazy\b/)) return // Only listen to lazy example

  const input = event.target
  const xhr = new window.XMLHttpRequest()

  input.className = input.className.replace(/\bdocs-input-lazy\b/g, '') // Remove className for single init
  xhr.onload = () => {
    const items = JSON.parse(xhr.responseText)
      .map((item) => `<li><button>${coreInput.escapeHTML(item.name)}</a></li>`)

    coreInput(event.target, items.join(''))
  }
  xhr.open('GET', 'https://restcountries.eu/rest/v1/lang/fr', true)
  xhr.send()
})
