'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React$1 = _interopDefault(require('react'));

var version = "1.0.0";

var name$1 = "@nrk/core-datepicker";


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



function on (key, event, handler) {
  if (typeof window === 'undefined') { return }
  var namespace = window[key] = window[key] || {};
  var isUnbound = !namespace[event] && (namespace[event] = 1);

  if (isUnbound) {
    document.addEventListener(event, function (event) {
      for (var el = event.target; el; el = el.parentElement) {
        if (el[key]) { handler(el, event); }
      }
    }, true); // Use capture to make sure focus/blur bubbles in old Firefox
  }
}

function getElements (elements, key) {
  var list = [];
  if (typeof elements === 'string') { list = [].slice.call(document.querySelectorAll(elements)); }
  else if (elements && elements.length) { list = [].slice.call(elements); }
  else if (elements && elements.nodeType) { list = [elements]; }
  if (key) { list.forEach(function (el) { return (el[key] = 1); }); }
  return list
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

var KEY = name$1 + "-" + version$1;                    // Unique id of component

function datepicker () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];
              // Expose component
  return new (Function.prototype.bind.apply( Datepicker, [ null ].concat( args) ))
}

var Datepicker = function Datepicker (elements) {
  this.elements = getElements(elements, KEY);
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

var name$2 = "@nrk/core-expand";


var version$2 = "1.0.0";

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

var KEY$2 = name$2 + "-" + version$2;                    // Unique id of component

function expand () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];
                  // Expose component
  return new (Function.prototype.bind.apply( Expand, [ null ].concat( args) ))
}

var Expand = function Expand (elements) {
  this.elements = getElements(elements, KEY$2);
};
Expand.prototype.open = function open (open) {
    if ( open === void 0 ) open = true;

  this.toggle(open);
};
Expand.prototype.close = function close (open) {
    if ( open === void 0 ) open = false;

  this.toggle(open);
};
Expand.prototype.toggle = function toggle (open) {
    if ( open === void 0 ) open = null;

  this.elements.forEach(function (el, index) {
    var isExpanded = el.getAttribute('aria-expanded') !== 'false';
    var willExpand = open === null ? isExpanded : (typeof open === 'function' ? open(el, index) : open);
    var event = new window.CustomEvent('toggle', {bubbles: true, cancelable: true});

    if (el.dispatchEvent(event)) { el.setAttribute('aria-expanded', Boolean(willExpand)); } // Expand if not preventDefault
  });
};

on(KEY$2, 'click', function (el) { return expand(el).toggle(); });

var Expand$1 = (function (superclass) {
  function Expand(props) {
    superclass.call(this, props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      expanded: this.props.open !== 'false' && Boolean(this.props.open)
    };
  }

  if ( superclass ) Expand.__proto__ = superclass;
  Expand.prototype = Object.create( superclass && superclass.prototype );
  Expand.prototype.constructor = Expand;
  Expand.prototype.toggle = function toggle () {
    // this.setState((prevState, props) => ({
    //   expanded: !prevState.expanded
    // }))
  };
  Expand.prototype.render = function render () {
    var attr$$1 = assign({
      'aria-expanded': this.state.expanded,
      'onClick': this.toggleExpanded,
      ref: expand
    }, this.props);

    return React$1.createElement( 'button', attr$$1)
  };

  return Expand;
}(React$1.PureComponent));

var LIST; // Element to contain list
var LIVE; // Element to contain screen reader text

if (typeof document !== 'undefined') {
  attr(LIST = document.createElement('ul'), {role: 'listbox'});
  attr(LIVE = document.createElement('span'), {'aria-hidden': 'true', 'aria-live': 'polite'});
  // document.head.insertAdjacentElement('afterbegin', '<style>.core-input{background:none}</style>'')
  // document.documentElement.appendChild(LIVE)

  // on(KEY, 'keydown', onKey)
  // on(KEY, 'input', onInput)
  // on(KEY, 'focus', onFocus)
  // on(KEY, 'blur', onBlur)
}

function input () {
  console.log('input');
}

function Input () {
  return React.createElement( 'div', null, "Testing input" )
}

exports.version = version;
exports.datepicker = datepicker;
exports.Datepicker = Datepicker$1;
exports.expand = expand;
exports.Expand = Expand$1;
exports.input = input;
exports.Input = Input;
