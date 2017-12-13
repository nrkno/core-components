(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["coreComponents"] = factory();
	else
		root["coreComponents"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 40);
/******/ })
/************************************************************************/
/******/ ({

/***/ 20:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),

/***/ 21:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var KEY = 'core-input';
var LIST = void 0,
    LIVE = void 0;

function attr(elem, prop, value) {
  if (typeof elem === 'string') elem = document.createElement(elem);
  if ((typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) === 'object') Object.keys(prop).forEach(function (k) {
    return attr(elem, k, prop[k]);
  });else if (value === null) elem.removeAttribute(prop);else if (prop) elem.setAttribute(prop, value);
  return elem;
}

function render(elem) {
  var state = elem[KEY];
  var value = state.value.trim().toLowerCase();
  state.hits = state.items.filter(function (item) {
    return item.value.toLowerCase().indexOf(value) !== -1;
  });

  attr(LIVE, 'aria-hidden', false);
  attr(LIST, 'hidden', state.hits.length ? null : true);
  attr(elem, 'aria-haspopup', Boolean(state.hits.length));
  attr(elem, 'aria-expanded', Boolean(state.hits.length));

  LIST.innerHTML = state.hits.map(function (_ref, i) {
    var value = _ref.value;
    return '<li role="option" aria-selected="' + (i === state.index) + '">' + value + '</li>';
  }).join('');
}

function onFocus(event) {
  var elem = event.target;
  var owns = elem.getAttribute('data-' + KEY);

  if (owns && !elem[KEY]) {
    var mode = elem.getAttribute('data-' + KEY + '-mode') || 'suggestions';
    var items = [].map.call(document.querySelectorAll('#' + owns + ' > *'), function (_ref2) {
      var value = _ref2.value;
      return { value: value };
    });
    var parent = elem.parentElement;

    attr(elem, {
      'role': 'combobox',
      'autocomplete': 'off',
      'aria-owns': KEY + '-' + owns,
      'aria-autocomplete': 'list',
      'aria-haspopup': false,
      'aria-expanded': false
    });

    parent.className = parent.className.split(' ').concat(KEY).join(' ');
    elem[KEY] = { items: items, mode: mode };
  }

  if (owns) {
    LIST.id = KEY + '-' + owns;
    elem.insertAdjacentElement('afterend', LIST);
    onInput(event);
  }
}

function onBlur(_ref3) {
  var target = _ref3.target;

  if (target[KEY]) {
    attr(LIST, 'hidden', 'hidden');
    attr(LIVE, { 'aria-hidden': 'true', 'aria-live': 'polite' });
  }
}

function onInput(event) {
  var elem = event.target;
  var state = elem[KEY];

  if (state) {
    state.index = -1;
    state.value = elem.value;
    render(elem);
    LIVE.textContent = state.hits.length + ' treff';
  }
}

function onKey(event) {
  if (event.target[KEY]) {
    var elem = event.target;
    var state = elem[KEY];
    if (event.keyCode === 27) onBlur(event);
    if (event.keyCode === 38 || event.keyCode === 40) {
      event.preventDefault();
      var hits = [].slice.call(LIST.children);
      var selected = hits.filter(function (el) {
        return el.getAttribute('aria-selected') === 'true';
      })[0];
      state.index = (hits.indexOf(selected) + (event.keyCode === 38 ? -1 : 1)) % hits.length;
      LIVE.setAttribute('aria-live', 'assertive');

      render(event.target);
      var value = (state.hits[state.index] || state).value;
      if (state.mode === 'results') {
        LIVE.textContent = value || 'Tomt tekstfelt';
      } else {
        elem.value = value;
      }
    }
  }
}

if (typeof document !== 'undefined') {
  LIST = attr('ul', { 'role': 'listbox' });
  LIVE = attr('span', { 'aria-hidden': 'true', 'aria-live': 'polite' });

  document.addEventListener('keydown', onKey);
  document.addEventListener('input', onInput);
  document.addEventListener('focus', onFocus, true); // Use capture to ensure event bubling
  document.addEventListener('blur', onBlur, true); // Use capture to ensure event bubling

  document.documentElement.appendChild(LIVE);
  document.head.appendChild(document.createElement('style')).textContent = 'datalist{display:none}';
}

module.exports = function () {
  return console.log('input');
};

/***/ }),

/***/ 40:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var components = {
  version: "1.0.0", // eslint-disable-line
  details: __webpack_require__(9),
  dialog: __webpack_require__(20),
  input: __webpack_require__(21)
};

if (typeof window !== 'undefined') {
  __webpack_require__(8);
  window.dispatchEvent(new window.CustomEvent('core-components', {
    detail: components
  }));
}

module.exports = components;

/***/ }),

/***/ 8:
/***/ (function(module, exports) {

// Polyfill for creating CustomEvents on IE9/10/11

// code pulled from:
// https://github.com/d4tocchini/customevent-polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Polyfill

try {
    var ce = new window.CustomEvent('test');
    ce.preventDefault();
    if (ce.defaultPrevented !== true) {
        // IE has problems with .preventDefault() on custom events
        // http://stackoverflow.com/questions/23349191
        throw new Error('Could not prevent default');
    }
} catch(e) {
  var CustomEvent = function(event, params) {
    var evt, origPrevent;
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };

    evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    origPrevent = evt.preventDefault;
    evt.preventDefault = function () {
      origPrevent.call(this);
      try {
        Object.defineProperty(this, 'defaultPrevented', {
          get: function () {
            return true;
          }
        });
      } catch(e) {
        this.defaultPrevented = true;
      }
    };
    return evt;
  };

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent; // expose definition to window
}


/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function onKey(event) {
  if (event.keyCode === 13 || event.keyCode === 32) onClick(event);
}

function onClick(event) {
  for (var el = event.target; el; el = el.parentElement) {
    if (el.nodeName.toLowerCase() === 'summary') break; //  Travese DOM tree and find closest summary
  }

  if (el) {
    var details = el.parentElement;
    var hasToggle = 'ontoggle' in details; // Snitt support since toggle event and details element is independent
    var hasDetails = 'open' in details; // Sniff support since preventDefault does not stop expand in Firefox
    var isOpen = details.hasAttribute('open');

    el.setAttribute('aria-expanded', !isOpen);

    hasDetails || event.preventDefault(); // Prevent scroll on keydown
    hasDetails || details[(isOpen ? 'remove' : 'set') + 'Attribute']('open', '');
    hasToggle || details.dispatchEvent(new window.CustomEvent('toggle'));
  }
}

// Make sure we are in a browser and have not allready loaded the polyfill
if (typeof document !== 'undefined' && !document.getElementById('details-polyfill')) {
  __webpack_require__(8); // Polyfill CustomEvent
  document.createElement('details'); // HTML5 shiv details for IE
  document.createElement('summary'); // HTML5 shiv summary for IE
  document.addEventListener('keydown', onKey);
  document.addEventListener('click', onClick);
  var style = document.createElement('style');
  style.id = 'details-polyfill';
  style.textContent = '\n    summary{display:block;cursor:pointer;touch-action:manipulation}\n    summary::-webkit-details-marker{display:none}\n    summary::before{content:\'\';padding-right:1em;background:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 10 10\'%3E%3Cpath d=\'M0 0h10L5 10\'/%3E%3C/svg%3E") 0 45%/50% no-repeat}\n    summary[aria-expanded="false"]::before{background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 10 10\'%3E%3Cpath d=\'M0 0l10 5-10 5\'/%3E%3C/svg%3E")}\n    summary[aria-expanded="false"]~* { display: none }\n  ';
  document.head.appendChild(style);
}

/***/ })

/******/ });
});