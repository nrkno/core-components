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
/******/ 	return __webpack_require__(__webpack_require__.s = 23);
/******/ })
/************************************************************************/
/******/ ({

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _utils = __webpack_require__(3);

var COMPONENT_ID = 'core-input';
var LIST = void 0; // Element to contain list
var LIVE = void 0; // Element to contain screen reader text

/**
* attr (utility)
* @param  {Element|String} elem Element or nodeName (will createElement)
* @param  {String} prop Accepts ID strings, gfx-urls or derviate-urls
* @return {Element} Element with manipulated attributes
*/
function attr(elem, prop, value) {
  if ((typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) === 'object') Object.keys(prop).forEach(function (k) {
    return attr(elem, k, prop[k]);
  });else if (value === null) elem.removeAttribute(prop);else if (prop) elem.setAttribute(prop, value);
  return elem;
}

function render(elem) {
  var state = elem[COMPONENT_ID];
  var value = state.value.trim().toLowerCase();
  state.hits = state.items.filter(function (item) {
    return item.value.toLowerCase().indexOf(value) !== -1;
  });

  (0, _utils.setAttributes)(LIVE, { 'aria-hidden': false });
  (0, _utils.setAttributes)(LIST, { 'hidden': state.hits.length ? null : true });
  (0, _utils.setAttributes)(elem, { 'aria-expanded': Boolean(state.hits.length) });

  LIST.style.width = elem.offsetWidth + 'px';
  LIST.innerHTML = state.hits.map(function (_ref, i) {
    var value = _ref.value;
    return '<li role="option" aria-selected="' + (i === state.index) + '">' + value + '</li>';
  }).join('');
}

function onFocus(event) {
  var elem = event.target;
  var controls = elem.getAttribute('data-' + COMPONENT_ID);

  if (controls && !elem[COMPONENT_ID]) {
    var mode = elem.getAttribute('data-' + COMPONENT_ID + '-mode') || 'suggestions';
    var items = [].map.call(document.querySelectorAll('#' + controls + ' > *'), function (_ref2) {
      var value = _ref2.value;
      return { value: value };
    });
    var parent = elem.parentElement;

    attr(elem, {
      'role': 'combobox',
      'autocomplete': 'off',
      'aria-controls': COMPONENT_ID + '-' + controls,
      'aria-autocomplete': 'list',
      'aria-haspopup': true,
      'aria-expanded': false
    });

    parent.className = parent.className.split(' ').concat(COMPONENT_ID).join(' ');
    elem[COMPONENT_ID] = { items: items, mode: mode, list: elem.nextElementSibling // TODO: list
    };
  }

  if (controls) {
    LIST.id = COMPONENT_ID + '-' + controls;
    elem.insertAdjacentElement('afterend', LIST);
    onInput(event);
  }
}

function onBlur(_ref3) {
  var target = _ref3.target;

  if (target[COMPONENT_ID]) {
    attr(LIST, 'hidden', 'hidden');
    attr(LIVE, { 'aria-hidden': 'true', 'aria-live': 'polite' });
  }
}

function onInput(event) {
  var elem = event.target;
  var state = elem[COMPONENT_ID];

  if (state) {
    state.index = -1;
    state.value = elem.value;
    render(elem);
    LIVE.textContent = state.hits.length + ' treff';
  }
}

function onKey(event) {
  if (event.target[COMPONENT_ID]) {
    var elem = event.target;
    var state = elem[COMPONENT_ID];
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

if (typeof document !== 'undefined' && !document.getElementById(COMPONENT_ID)) {
  LIST = (0, _utils.setAttributes)(document.createElement('ul'), { role: 'listbox' });
  LIVE = (0, _utils.setAttributes)(document.createElement('span'), { 'aria-hidden': 'true', 'aria-live': 'polite', id: COMPONENT_ID });

  document.addEventListener('keydown', onKey);
  document.addEventListener('input', onInput);
  document.addEventListener('focus', onFocus, true); // Use capture to ensure event bubling
  document.addEventListener('blur', onBlur, true); // Use capture to ensure event bubling
  document.documentElement.appendChild(LIVE);
}

module.exports = function () {
  return console.log('input');
};

/***/ }),

/***/ 23:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  version: "1.0.0", // eslint-disable-line
  details: __webpack_require__(7),
  dialog: __webpack_require__(11),
  input: __webpack_require__(12)

  /* function details (element, state) {
    if(state) {
      const opts = storeState(element, state)
      element.ontoggle = opts.ontoggle
      element[opts.open? 'setAttribute' : 'removeAttribute']('open', '')
    }
    return state
  }
  
  function details (element, opts = {}) {
    const open = element.hasAttribute('open')
  
    const actions = {
      close: () => {
        if (open) {
          open = false
          element.removeAttribute('open')
        }
      },
      open: () => {
        if (!open) {
          open = true
          element.setAttribute('open', '')
        }
      }
    }
  
    const handlers = {
      click: (event) => {
        if (event.target.closest('summary')) {
          if (opts.onOpen) opts.onOpen()
        }
      }
    }
  
    element.addEventListener('click', handlers.click)
  
    return {
      actions,
      destroy: () => {
        element.removeEventListener('click', handlers.click)
      }
    }
  }
  
  //
  
  const {actions, destroy} = details(detailsElement, {
    onOpen: (value) => {
      console.log('details opened')
    }
  }) */

};

/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.attr = attr;
exports.closest = closest;
var KEY = 'core-components-' + Date.now();
var STATES = {};
var UUID = 0;

function attr(elements, attributes) {
  getElements(elements).forEach(function (element) {
    Object.keys(attributes).forEach(function (name) {
      element[(attributes[name] === null ? 'remove' : 'set') + 'Attribute'](name, attributes[name]);
    });
  });
  return elements;
}

function closest(element, nodeName) {
  for (var el = element; el; el = el.parentElement) {
    if (el.nodeName.toLowerCase() === nodeName) return el;
  }
}

var getElements = exports.getElements = function getElements(elements) {
  if (typeof elements === 'string') return getElements(document.querySelectorAll(elements));
  if (elements.length) return [].slice.call(elements);
  if (elements.nodeType) return [elements];
  throw new Error('"elements" must be of type nodeList, array, selector string or single HTMLElement');
};

var weakState = exports.weakState = function weakState(element, object) {
  var initial = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var uuid = element[KEY] || (element[KEY] = ++UUID);
  var state = STATES[uuid] || (STATES[uuid] = initial);

  if (object === false) {
    delete element[KEY];
    delete STATES[uuid];
  } else if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object') {
    Object.keys(state).forEach(function (key) {
      return state[key] = object[key];
    });
  }

  return state;
};

var queryAll = exports.queryAll = function queryAll(selector) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  return [].slice.call(context.querySelectorAll(selector));
};

/***/ }),

/***/ 4:
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

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.details = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(3);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DETAILS = 'details';
var SUMMARY = 'summary';
var STYLE_ID = DETAILS + '-polyfill';
var ENTER_KEY = 13;
var SPACE_KEY = 32;

var details = exports.details = function () {
  function details(elements) {
    _classCallCheck(this, details);

    this.elements = (0, _utils.getElements)(elements);
    this.elements.forEach(function (el, i) {
      return toggle(el, i, el.getAttribute('open'));
    });
    return this;
  }

  _createClass(details, [{
    key: 'open',
    value: function open() {
      var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      this.elements.forEach(function (el, i) {
        return toggle(el, i, fn);
      });
      return this;
    }
  }, {
    key: 'close',
    value: function close() {
      var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      this.elements.forEach(function (el, i) {
        return toggle(el, i, fn);
      });
      return this;
    }
  }]);

  return details;
}();

function toggle(el, index, fn) {
  var open = typeof fn === 'function' ? fn(el, index) : Boolean(fn);
  var hasToggleSupport = 'ontoggle' in details;
  // const hasOpenSupport = 'open' in details
  var summaryAttribute = {
    tabindex: 0,
    role: 'button',
    'aria-expanded': Boolean(open)
  };

  (0, _utils.queryAll)(SUMMARY, details).forEach(function (summary) {
    return (0, _utils.attr)(summary, summaryAttribute);
  });
  (0, _utils.attr)(details, { open: open ? '' : null });

  // hasOpenSupport || details.
  hasToggleSupport || details.dispatchEvent(new window.CustomEvent('toggle'));
}

function onKey(event) {
  if (event.keyCode === ENTER_KEY || event.keyCode === SPACE_KEY) onClick(event);
}

function onClick(event) {
  var summary = (0, _utils.closest)(event.target, SUMMARY);
  var details = summary && summary.parentElement;

  if (details) {
    event.preventDefault(); // Prevent scroll
    toggle(details, !details.hasAttribute('open'));
  }
}

// Make sure we are in a browser and have not already loaded the component
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  __webpack_require__(4); // Polyfill CustomEvent
  document.createElement(DETAILS); // HTML5 shiv <details> for IE
  document.createElement(SUMMARY); // HTML5 shiv <summary> for IE
  document.addEventListener('keydown', onKey); // Make role="button" behave like <button>
  document.addEventListener('click', onClick); // Polyfill click to toggle
  document.head.insertAdjacentHTML('afterbegin', // Insert css in top for easy overwriting
  '<style id="' + STYLE_ID + '">\n      ' + SUMMARY + '{display:block;cursor:pointer;touch-action:manipulation}\n      ' + SUMMARY + '::-webkit-details-marker{display:none}\n      ' + SUMMARY + '::before{content:\'\';padding-right:1em;background:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 10 10\'%3E%3Cpath d=\'M0 0h10L5 10\'/%3E%3C/svg%3E") 0 45%/50% no-repeat}\n      ' + SUMMARY + '[aria-expanded="false"]::before{background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 10 10\'%3E%3Cpath d=\'M0 0l10 5-10 5\'/%3E%3C/svg%3E")}\n      ' + SUMMARY + '[aria-expanded="false"]~*{display:none}\n    </style>');
}

/***/ })

/******/ });
});