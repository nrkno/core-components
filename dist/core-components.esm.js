function dispatchEvent (element, eventName, options) {
  console.warn('TODO: polyfill customEvent');
}

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

var closest = function (element, nodeName) {
  for (var el = element; el; el = el.parentElement) {
    if (el.nodeName.toLowerCase() === nodeName) { return el }
  }
};

function getElements (elements) {
  if (typeof elements === 'string') { return getElements(document.querySelectorAll(elements)) }
  if (elements && elements.length) { return [].slice.call(elements) }
  if (elements && elements.nodeType) { return [elements] }
  return []
}

var KEY = 'details-@VERSION';
var DETAILS = 'detail';
var SUMMARY = 'summar';
var ENTER_KEY = 13;
var SPACE_KEY = 32;

function details (elements) {
  if(!(this instanceof details)) { return new details(elements) } //eslint-disable-line
  this.elements = getElements(elements);
  this.elements.forEach(function (details) { return toggle(details, details.hasAttribute('open')); });
}

details.prototype.open = function (fn) {
  if ( fn === void 0 ) fn = true;

  this.elements.forEach(function (el, i) { return toggle(el, fn, i); });
  return this
};
details.prototype.close = function (fn) {
  if ( fn === void 0 ) fn = true;

  this.elements.forEach(function (el, i) { return toggle(el, !fn, i); });
  return this
};

function toggle (details, fn, index) {
  var isOpen = Boolean(typeof fn === 'function' ? fn(details, index) : fn);
  var slient = details.open === isOpen || 'ontoggle' in details;

  details[KEY] = true;                           // Register polyfill
  attr(details.querySelectorAll(SUMMARY), {
    tabindex: 0,
    role: 'button',
    'aria-expanded': isOpen
  });

  // console.log(details.open, isOpen, details.hasAttribute('open'))
  if (isOpen !== details.open) { details.open = isOpen; }
  if (isOpen !== details.hasAttribute('open')) { attr(details, {open: isOpen || null}); }

  slient || dispatchEvent(details, 'toggle');
}

function onKey (event) {
  if (event.keyCode === ENTER_KEY || event.keyCode === SPACE_KEY) { onClick(event); }
}

function onClick (event) {
  var summary = closest(event.target, SUMMARY);
  var details = closest(event.target, DETAILS);

  if (summary && details && KEY in details) {               // Only handle polyfilled elements
    if (event.keyCode === SPACE_KEY) { event.preventDefault(); } // Prevent scroll
    toggle(details, !details.open);
  }
}

// Make sure we are in a browser and have not already loaded the component
if (typeof document !== 'undefined' && !document.getElementById(KEY)) {
  document.createElement(DETAILS);                           // Shim <details> for IE and
  document.createElement(SUMMARY);                           // Shim <summary> for IE
  document.addEventListener('click', onClick);               // Polyfill click to toggle
  document.addEventListener('keydown', onKey);               // Make <summary role="button"> behave like <button>
  document.head.insertAdjacentHTML('afterbegin',            // Insert css in top for easy overwriting
    ("<style id=\"" + KEY + "\">\n      " + SUMMARY + "{display:block;cursor:pointer;touch-action:manipulation}\n      " + SUMMARY + "::-webkit-details-marker{display:none}\n      " + SUMMARY + "::before{content:'';padding-right:1em;background:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath d='M0 0h10L5 10'/%3E%3C/svg%3E\") 0 45%/50% no-repeat}\n      " + SUMMARY + "[aria-expanded=\"false\"]::before{background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath d='M0 0l10 5-10 5'/%3E%3C/svg%3E\")}\n      " + SUMMARY + "[aria-expanded=\"false\"]~*{display:none}\n    </style>"));
}

function Details (props) {
  var isOpen = props.open !== 'false' && Boolean(props.open);
  var aria = {role: 'button', tabIndex: 0, 'aria-expanded': String(isOpen)};
  var children = props.children;

  // Loop though children and augment <summary> with aria attributes
  if (Array.isArray(children)) {
    children = children.map(function (child, key) {
      var attr$$1 = assign({ref: child.ref, key: key}, child.props, child.type === 'summary' ? aria : {});
      return child.type ? React.createElement( child.type, attr$$1) : React.createElement( 'div', { key: key }, child)
    });
  }

  return React.createElement( 'details', assign({}, props, { open: isOpen }), children)
}

var LIST; // Element to contain list
var LIVE; // Element to contain screen reader text

if (typeof document !== 'undefined') {
  attr(LIST = document.createElement('ul'), {role: 'listbox'});
  attr(LIVE = document.createElement('span'), {'aria-hidden': 'true', 'aria-live': 'polite'});

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

var version = '@VERSION';

export { version, details, Details, input, Input };
