var coreComponents = window.coreComponents
var XMLHttpRequest = window.XMLHttpRequest

coreComponents.toggle('.js.docs-toggle')
coreComponents.toggle('.js.docs-dropdown', {popup: true})
coreComponents.input('.js.docs-input')

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
    {dangerousHTML: `<a href="https://nrk.no/">NRK.no</a>`},
    {dangerousHTML: `<a href="https://nrk.no/fjos/">NRK Fjos</a>`},
    {dangerousHTML: `<a href="https://nrk.no/mr/">NRK Møre og Romsdal</a>`},
    {dangerousHTML: `<a href="http://nrksuper.no/">NRK Super</a>`},
    {dangerousHTML: `<a href="https://nrk.no/sapmi/">NRK Sápmi</a>`}
  ])
}, 500)

var items
var itemsToList = function (event) {
  var query = event.target.value.toLowerCase()
  var mark = event.detail.highlight
  var esc = event.detail.escapeHTML

  event.detail.render(items.filter(function (item) {
    return item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1
  }).map(function (item) {
    return '<li><a href="' + esc(item.url) + '">' + mark(item.title) + '</a></li>'
  }).slice(0, 10).join(''))
}

document.addEventListener('input.select', console.log)  // Enter-key on item
document.addEventListener('input.type', function (event) {  // Typing results in filtering
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

  // var esc = event.detail.escapeHTML
  // var mark = event.detail.highlight
  // var query = esc(event.target.value)
  //
  // event.preventDefault()
  // fakeRequest.abort()
  // request.abort()
  //
  // coreComponents.input(event.target, query && `<li><button>Søker etter <strong>${esc(query)}</strong>...</button></li>`)
  // if (query) {
  //   tvSearchRequest(query, function (data) {
  //     var list = []
  //
  //     data.result.forEach(function (item) {
  //       if (item._type === 'serie') {
  //         list.push(`<li><a href="https://tv.nrk.no/${esc(item._source.url)}">${mark(item._source.title)}</a></li>`)
  //       }
  //     })
  //
  //     coreComponents.input(event.target, list.slice(0, 10).join(''))
  //   })
  // }

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
