import coreInput from '../../packages/core-input/core-input' // Replace with 'core-input' if you copy paste this code

// IMPORTANT: Always debounce and properly abort requests to server APIs to avoid spaming
// Example implementation:
const debouncedRequest = (url, callback, timeout = 500) => {
  const xhr = debouncedRequest.xhr = debouncedRequest.xhr || new window.XMLHttpRequest()

  xhr.abort() // Since we store reference to xhr, we can abort ongoing request
  xhr.onload = () => callback(xhr.responseText)

  clearTimeout(debouncedRequest.timer) // Clear timer
  debouncedRequest.timer = setTimeout(() => { // Setup new timer with request
    xhr.open('GET', url, true)
    xhr.send()
  }, timeout)
}

coreInput('.js.docs-input-ajax') // Initialize examples

document.addEventListener('input.filter', (event) => {
  if (!event.target.className.match(/\bdocs-input-ajax\b/)) return // Only listen to ajax example

  const value = event.target.value
  const query = encodeURIComponent(value).trim()
  const url = `https://tv.nrk.no/autocomplete?query=${query}`

  event.preventDefault() // Stop coreInput from default filtering
  coreInput(event.target, `<li><button>Søker etter ${coreInput.highlight(value, value)}...</button></li>`)

  debouncedRequest(url, (data) => {
    const items = JSON.parse(data).result
      .filter((item) => item._type === 'serie')
      .slice(0, 10)
      .map((item) => item._source)
      .map((item) => `
        <li><a href=https://tv.nrk.no/${coreInput.escapeHTML(item.url)}>
          ${coreInput.highlight(item.title, value)}
        </a></li>
      `)

    coreInput(event.target, items.join(''))
  })
})
