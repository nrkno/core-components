var name = "@nrk/core-input";


var version = "1.0.0";

/**
* addElements
* @param {String} key
* @param {String|NodeList|Array|Element} elements A CSS selector string, nodeList, element array, or single element
* @return {Array} Array of elements
*/


/**
* addEvent
* @param {String} key A namespace to ensure no double binding and only triggering on registered elements
* @param {String} eventName A case-sensitive string representing the event type to listen for
* @param {Function} listener The function which receives a notification
*/
function addEvent (key, eventName, listener) {
  if (typeof window === 'undefined') { return }

  // Store on window to make sure multiple instances is merged
  var namespace = window[key] = window[key] || {};
  var isUnbound = !namespace[eventName] && (namespace[eventName] = 1);

  if (isUnbound) {
    document.addEventListener(eventName, function (event) {
      for (var el = event.target; el; el = el.parentElement) {
        if (el[key]) { listener(el, event); }
      }
    }, true); // Use capture to make sure focus/blur bubbles in old Firefox
  }
}

/**
* assign
* @param {Object} target The target object
* @param {Object} sources The source object(s)
* @return {Object} The target object
*/


/**
* CustomEvent
* See {@link https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent}
* @param {String} eventName A case-sensitive string representing the event type to create
* @param {Object} params.detail Any data passed when initializing the event
* @param {Boolean} params.cancelable A Boolean indicating whether the event is cancelable.
* @param {Boolean} params.bubbles A Boolean indicating whether the event bubbles up through the DOM or not.
* @return {CustomEvent} Creates a CustomEvent.
*/


/**
* debounce
* @param {Function} callback The function to debounce
* @param {Number} ms The number of milliseconds to delay
* @return {Function} The new debounced function
*/

var KEY = name + "-" + version;  // Unique id of component
var ARIA_OWNS_ID = 0;              // Used for generating aria-owns ids
var ARIA_LIVE_EL;                  // Element to contain screen reader text


// var regex = new RegExp(input.query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'gi')

/*const input = new coreComponents.Input(element)
input.evaluate()
input.focus()
input.focusLine(3)
input.show()
input.hide()

document.addEventListener('input.hits', (event) => {
  event.target = coreInput
  event.detail = {store}
  ?.goToNextHit()
})*/

function input () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return new (Function.prototype.bind.apply( Input, [ null ].concat( args) ))
}

var Input = function Input (elements, options) {
  if ( options === void 0 ) options = {};

  this.elements = getElements(elements);
  this.elements.forEach(function (el) {
    var mode = options.complete || el.getAttribute('aria-autocomplete') || 'both';
    var owns = options.owns || el.getAttribute('aria-owns') || (KEY + "-" + (ARIA_OWNS_ID++));

    el.setAttribute('role', 'combobox');
    el.setAttribute('autocomplete', false);
    el.setAttribute('aria-expanded', false);
    el.setAttribute('aria-autocomplete', mode); // both = suggest, list = hits
    el.setAttribute('aria-owns', owns);

    if (!getList(el)) { // TODO what about <dataset>
      var list = document.createElement('ul');
      list.id = owns;
      list.className = 'nrk-dropdown';
      el.insertAdjacentElement('afterend', list);
    }

    el[KEY] = [].map.call(getList(el).children, function (el) { return el.innerHTML; });
    getList(el).setAttribute('hidden', '');
    getList(el).setAttribute('role', 'listbox');
  });
};
Input.prototype.value = function value () {

};
Input.prototype.show = function show () {
  ARIA_LIVE_EL.setAttribute('aria-hidden', false);
  this.elements.forEach(function (el) {
    el.setAttribute('aria-expanded', true);
    getList(el).removeAttribute('hidden');
    getList(el).style.width = (el.offsetWidth) + "px";
  });
  return this
};
Input.prototype.hide = function hide () {
  ARIA_LIVE_EL.setAttribute('aria-hidden', true);
  this.elements.forEach(function (el) {
    el.setAttribute('aria-expanded', false);
    getList(el).setAttribute('hidden', '');
  });
  return this
};

function getList (el) {
  return document.getElementById(el.getAttribute('aria-owns'))
}

function render (el) {
  var value = el.value.trim().toLowerCase();
  var index = 0;
  var list = getList(el);
  // const hits = [].map.call(list.children, (el) => el.textContent).filter((item) => item.toLowerCase().indexOf(value) !== -1)
  // console.log(value, list, hits)

  ARIA_LIVE_EL.setAttribute('aria-hidden', false);
  ARIA_LIVE_EL.textContent = (hits.length) + " treff";

  el.setAttribute('aria-expanded', true); // should be false if no hits?
  // el.setAttribute('aria-activedescendant')
  list.removeAttribute('hidden');
  list.style.width = (el.offsetWidth) + "px";
  list.innerHTML = hits.map(function (ref, i) {
    var value = ref.value;

    return ("<li role=\"option\" aria-selected=\"" + (i === index) + "\">" + value + "</li>");
  }).join('');
}

function onKey (el, event) {
  if (event.keyCode === 27) { input(el).hide(); }
  if (event.keyCode === 38 || event.keyCode === 40) {
    event.preventDefault();
    var items = [].slice.call(getList(el).children);
    var selected = items.filter(function (el) { return el.getAttribute('aria-selected') === 'true'; })[0];
    var index = (items.indexOf(selected) + (event.keyCode === 38 ? -1 : 1)) % items.length;
    var mode = el.getAttribute('aria-autocomplete');
    var value = (items[index] || el).value;
    console.log(index, value);

    render(el);

    if (mode === 'list') { LIVE.textContent = value || 'Tomt tekstfelt'; }
    else { el.value = value; }
  }
}

if (typeof document !== 'undefined') {
  ARIA_LIVE_EL = document.createElement('span');
  ARIA_LIVE_EL.setAttribute('aria-hidden', true);
  ARIA_LIVE_EL.setAttribute('aria-live', 'assertive');
  document.documentElement.appendChild(ARIA_LIVE_EL);
}

addEvent(KEY, 'keydown', onKey);
addEvent(KEY, 'focus', render);
addEvent(KEY, 'input', render);
addEvent(KEY, 'blur', function (el) { return input(el).hide(); });

export { input };
