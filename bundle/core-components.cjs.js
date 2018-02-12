'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React$1 = _interopDefault(require('react'));

var version = "1.0.0";

var name$1 = "@nrk/core-datepicker";


var version$1 = "1.0.0";

/**
* addElements
* @param {String} key
* @param {String|NodeList|Array|Element} elements A CSS selector string, nodeList, element array, or single element
* @return {Array} Array of elements
*/
function addElements (key, elements) {
  if (typeof elements === 'string') { return addElements(key, document.querySelectorAll(elements)) }
  if (elements.length) { return [].map.call(elements, function (el) { return (el[key] = 1) && el; }) }
  if (elements.nodeType) { return (elements[key] = 1) && [elements] }
  return []
}

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
function assign (target) {
  var sources = [], len = arguments.length - 1;
  while ( len-- > 0 ) sources[ len ] = arguments[ len + 1 ];

  sources.filter(Boolean).forEach(function (source) {
    Object.keys(source).forEach(function (key) { return (target[key] = source[key]); });
  });
  return target
}

/**
* CustomEvent
* See {@link https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent}
* @param {String} eventName A case-sensitive string representing the event type to create
* @param {Object} params.detail Any data passed when initializing the event
* @param {Boolean} params.cancelable A Boolean indicating whether the event is cancelable.
* @param {Boolean} params.bubbles A Boolean indicating whether the event bubbles up through the DOM or not.
* @return {CustomEvent} Creates a CustomEvent.
*/
var CustomEvent = (function () {
  if (typeof window === 'undefined') { return }
  if (window.CustomEvent) { return window.CustomEvent }

  function CustomEvent (event, params) {
    if ( params === void 0 ) params = {};

    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, Boolean(params.bubbles), Boolean(params.cancelable), params.detail);
    return evt
  }

  CustomEvent.prototype = window.Event.prototype;
  return CustomEvent
})();

/**
* debounce
* @param {Function} callback The function to debounce
* @param {Number} ms The number of milliseconds to delay
* @return {Function} The new debounced function
*/

if(typeof window !=="undefined" && typeof window.CustomEvent !== "function") {

	function CustomEvent$1 ( event, params ) {
    	if ( params === void 0 ) params = { bubbles: false, cancelable: false, detail: undefined };

    	var evt = document.createEvent( 'CustomEvent' );
    	evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    	return evt;
	}

	CustomEvent$1.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent$1;

	

}

var KEY = name$1 + "-" + version$1;                    // Unique id of component

function datepicker () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];
              // Expose component
  return new (Function.prototype.bind.apply( Datepicker, [ null ].concat( args) ))
}

var Datepicker = function Datepicker (elements) {
  this.elements = addElements(elements, KEY);
  // tabindex="0" på datepicker kun lytte til events på disse
};
Datepicker.prototype.open = function open (open) {
    if ( open === void 0 ) open = true;
};
Datepicker.prototype.close = function close (open) {
    if ( open === void 0 ) open = false;
};


/* <table>
  <caption></caption>
  <thead></thead>
  <tbody></tbody>
  <tfoot></tfoot>
</table> */

function Datepicker$1 () {}

var name$2 = "@nrk/core-toggle";


var version$2 = "1.0.0";

var KEY$1 = name$2 + "-" + version$2;                    // Unique id of component
var ATTR = 'aria-expanded';

function toggle (elems, open) {
  if ( open === void 0 ) open = null;
       // Toggle component
  return addElements(KEY$1, elems).map(function (el) {
    var isExpand = el.getAttribute(ATTR) === 'true';
    var doExpand = open === null ? isExpand : Boolean(open);
    var canSetup = isExpand === doExpand || el.dispatchEvent(new CustomEvent('toggle', {
      bubbles: true,
      cancelable: true
    }));

    if (canSetup) { el.setAttribute(ATTR, doExpand); }
    return el
  })
}

addEvent(KEY$1, 'click', function (el) {
  toggle(el, el.getAttribute(ATTR) === 'false');
});

var Toggle = (function (superclass) {
  function Toggle(props) {
    superclass.call(this, props);
    this.toggle = this.toggle.bind(this);
    this.state = {open: this.props.open !== 'false' && Boolean(this.props.open)};
  }

  if ( superclass ) Toggle.__proto__ = superclass;
  Toggle.prototype = Object.create( superclass && superclass.prototype );
  Toggle.prototype.constructor = Toggle;
  Toggle.prototype.toggle = function toggle () {
    this.setState(function (prevState, props) { return ({open: !prevState.open}); });
  };
  Toggle.prototype.render = function render () {
    var attr = assign({
      'aria-expanded': this.state.open,
      'onClick': this.toggle
    }, this.props);

    return React$1.createElement( 'button', attr)
  };

  return Toggle;
}(React$1.PureComponent));

var name$3 = "@nrk/core-input";


var version$3 = "1.0.0";

var KEY$2 = name$3 + "-" + version$3;  // Unique id of component
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
    var owns = options.owns || el.getAttribute('aria-owns') || (KEY$2 + "-" + (ARIA_OWNS_ID++));

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

    el[KEY$2] = [].map.call(getList(el).children, function (el) { return el.innerHTML; });
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

addEvent(KEY$2, 'keydown', onKey);
addEvent(KEY$2, 'focus', render);
addEvent(KEY$2, 'input', render);
addEvent(KEY$2, 'blur', function (el) { return input(el).hide(); });

function Input$1 () {
  return React.createElement( 'div', null, "Testing input" )
}

exports.version = version;
exports.datepicker = datepicker;
exports.Datepicker = Datepicker$1;
exports.toggle = toggle;
exports.Toggle = Toggle;
exports.input = input;
exports.Input = Input$1;
