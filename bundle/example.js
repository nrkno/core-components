/* eslint-disable */
var coreComponents = window.coreComponents
var XMLHttpRequest = window.XMLHttpRequest

coreComponents.toggle('.js.docs-toggle')
coreComponents.toggle('.js.docs-dropdown', {popup: true})
coreComponents.input('.js.docs-input', '')

var debounce = function (fn, ms) {
  var bounced = function () {
    var self = this
    var args = arguments

    bounced.abort()
    bounced.timer = setTimeout(function () { fn.apply(self, args) }, ms)
  }
  bounced.abort = function () { clearTimeout(bounced.timer) }
  return bounced
}

var request = new XMLHttpRequest()
var tvSearchRequest = debounce(function (query, fn) {
  request.onload = function () { fn(JSON.parse(request.responseText)) }
  request.open('GET', `https://tv.nrk.no/autocomplete?query=${encodeURIComponent(query)}`, true)
  request.send()
}, 500)

var fakeRequest = debounce(function (fn) {
  fn([
    '<li><a href="https://nrk.no/">NRK.no</a></li>',
    '<li><a href="https://nrk.no/fjos/">NRK Fjos</a></li>',
    '<li><a href="https://nrk.no/mr/">NRK Møre og Romsdal</a></li>',
    '<li><a href="http://nrksuper.no/">NRK Super</a></li>',
    '<li><a href="https://nrk.no/sapmi/">NRK Sápmi</a></li>'
  ].join(''))
}, 500)

var items
var itemsToList = function (event) {
  var input = event.target
  var query = input.value.toLowerCase()
  var mark = coreComponents.input.highlight
  var esc = coreComponents.input.escapeHTML

  coreComponents.input(input, items.filter(function (item) {
    return item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1
  }).slice(0, 10).map(function (item) {
    return '<li><a href="' + esc(item.url) + '">' + mark(item.title, query) + '</a></li>'
  }).join(''))
}

var emails = ['facebook.com', 'gmail.com', 'hotmail.com', 'mac.com', 'mail.com', 'msn.com', 'live.com']
var list = ['CSS', 'JavaScript', 'HTML', 'SVG', 'ARIA', 'MathML']

// document.addEventListener('input.select', function (event) { // Enter-key on item
//   event.preventDefault()
//   event.target.value = event.target.value.split(',')
//     .slice(0, -1)
//     .map(function (val) { return val.trim() })
//     .concat(event.detail.value).join(', ') + ', '
//   event.target.focus()
// })
document.addEventListener('input.filter', function (event) { // Typing results in filtering
  if (!event.target.className.match(/\bjs\b/)) return
  event.preventDefault()

  // var query = event.target.value.split(',').pop().trim().toLowerCase()
  //
  // coreComponents.input(event.target, list.map(function (item) {
  //   return item.toLowerCase().indexOf(query) === -1 ? '' : '<li><button>' + item + '</button><li>'
  // }).join(''))

  // var input = coreComponents.input
  // var query = input.escapeHTML(event.target.value)
  //
  // input(event.target, query ? emails.map(function (mail) {
  //   return '<li><button>' + query + '@' + mail + '</button><li>'
  // }).join('') : '')

  // event.preventDefault()
  // if (!items) {
  //   var xhr = new XMLHttpRequest()
  //   event.detail.relatedTarget.innerHTML = '<li><a href="#">Laster...</a></li>'
  //   items = []
  //   xhr.onload = function () {
  //     items = JSON.parse(xhr.responseText)
  //     itemsToList(event)
  //   }
  //   xhr.open('GET', 'https://snutt.nrk.no/nrkno_apps/sok/', true)
  //   xhr.send()
  // } else {
  //   itemsToList(event)
  // }

  // var esc = coreComponents.input.escapeHTML
  // var mark = coreComponents.input.highlight
  // var query = esc(event.target.value)
  //
  // event.preventDefault()
  // fakeRequest.abort()
  // request.abort()
  //
  // coreComponents.input(event.target, query ? `<li><button>Søker etter <strong>${esc(query)}</strong>...</button></li>` : '')
  // if (query) {
  //   tvSearchRequest(query, function (data) {
  //     coreComponents.input(event.target, data.result.map(function (item) {
  //       if (item._type !== 'serie') return ''
  //       return '<li><a href="https://tv.nrk.no/' + esc(item._source.url) + '">' + mark(item._source.title, query) + '</a></li>'
  //     }).slice(0, 10).join(''))
  //   })
  // }

  // coreComponents.input(event.target, query ? 'Laster...' : '')
  // if (query) {
  //   fakeRequest(function (data) {
  //     coreComponents.input(event.target, data)
  //   })
  // }
})

// coreComponents.datepicker('.nrk-datepicker', {
//   baseClass: 'nrk',
//   value: Date.now(),
//   firstDayOfWeek: 1,
//   disabled: false,
//   required: true,
//   min: false,
//   max: false
// })
