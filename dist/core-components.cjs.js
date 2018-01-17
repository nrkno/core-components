'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React$1 = _interopDefault(require('react'));

var version = "1.0.0";

var name$1 = "@nrk/core-expand";


var version$1 = "1.0.0";

function assign (target) {
  var sources = [], len = arguments.length - 1;
  while ( len-- > 0 ) sources[ len ] = arguments[ len + 1 ];

  sources.filter(Boolean).forEach(function (source) {
    Object.keys(source).forEach(function (key) { return (target[key] = source[key]); });
  });
  return target
}

function attr (elements, attributes) {
  getElements(elements).forEach(function (element) {
    Object.keys(attributes).forEach(function (name) {
      element[((attributes[name] === null ? 'remove' : 'set') + "Attribute")](name, attributes[name]);
    });
  });
  return elements
}



function getElements (elements) {
  if (typeof elements === 'string') { return getElements(document.querySelectorAll(elements)) }
  if (elements && elements.length) { return [].slice.call(elements) }
  if (elements && elements.nodeType) { return [elements] }
  return []
}

if(typeof window !=="undefined" && typeof window.CustomEvent !== "function") {

	function CustomEvent ( event, params ) {
    	if ( params === void 0 ) params = { bubbles: false, cancelable: false, detail: undefined };

    	var evt = document.createEvent( 'CustomEvent' );
    	evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    	return evt;
	}

	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;

	

}

var KEY = name$1 + "-" + version$1;

function expand () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return new (Function.prototype.bind.apply( Expand, [ null ].concat( args) ))
}

var Expand = function Expand (elements) {
  this.elements = getElements(elements);
  this.elements.forEach(function (el) { return (el[KEY] = 1); }); // Register polyfill
};
Expand.prototype.open = function open (open) {
  if ( open === void 0 ) open = true;
 this.toggle(open); };
Expand.prototype.close = function close (open) {
  if ( open === void 0 ) open = false;
 this.toggle(open); };
Expand.prototype.toggle = function toggle (open) {
  this.elements.forEach(function (element, index) {
    // const shouldExpand = type === 'function' ? open(element, index) : (type === 'undefined' ? el.getAttribute('aria-expanded') === 'false') : open
    var toggleEvent = new window.CustomEvent('toggle', {bubbles: true, cancelable: true});
    el.dispatchEvent(toggleEvent);

    // Only toggle if not event.preventDefault()
    // toggleEvent.defaultPrevented || el.setAttribute('aria-expanded', Boolean(shouldExpand))
  });
};

// Click to toggle (only bind if unbound)
if (typeof window !== 'undefined' && !window[KEY] && (window[KEY] = 1)) {
  document.addEventListener('click', function (event) {
    for (var el = event.target; el; el = el.parentElement) {
      if (el[KEY]) { expand(el).toggle(); }  // Only handle polyfilled elements
    }
  });
}

function Expand$1 (props) {
  var isExpanded = props.open !== 'false' && Boolean(props.open);
  var attr$$1 = assign({
    'className': 'nrk-expand',
    'aria-expanded': isExpanded,
    ref: expand
  }, props);

  return React$1.createElement( 'button', attr$$1)
}

var LIST; // Element to contain list
var LIVE; // Element to contain screen reader text

if (typeof document !== 'undefined') {
  attr(LIST = document.createElement('ul'), {role: 'listbox'});
  attr(LIVE = document.createElement('span'), {'aria-hidden': 'true', 'aria-live': 'polite'});

  // document.head.insertAdjacentElement('afterbegin', `<style>
  //   .core-input { background: none }
  // </style>`)

  // document.addEventListener('keydown', onKey)
  // document.addEventListener('input', onInput)
  // document.addEventListener('focus', onFocus, true) // Use capture to ensure event bubling
  // document.addEventListener('blur', onBlur, true)   // Use capture to ensure event bubling
  // document.documentElement.appendChild(LIVE)
}

function input () {
  console.log('input');
}

function Input () {
  return React.createElement( 'div', null, "Testing input" )
}

exports.version = version;
exports.expand = expand;
exports.Expand = Expand$1;
exports.input = input;
exports.Input = Input;
