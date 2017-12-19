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
/******/ 	return __webpack_require__(__webpack_require__.s = 24);
/******/ })
/************************************************************************/
/******/ ({

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.details = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(2);

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
  __webpack_require__(6); // Polyfill CustomEvent
  document.createElement(DETAILS); // HTML5 shiv <details> for IE
  document.createElement(SUMMARY); // HTML5 shiv <summary> for IE
  document.addEventListener('keydown', onKey); // Make role="button" behave like <button>
  document.addEventListener('click', onClick); // Polyfill click to toggle
  document.head.insertAdjacentHTML('afterbegin', // Insert css in top for easy overwriting
  '<style id="' + STYLE_ID + '">\n      ' + SUMMARY + '{display:block;cursor:pointer;touch-action:manipulation}\n      ' + SUMMARY + '::-webkit-details-marker{display:none}\n      ' + SUMMARY + '::before{content:\'\';padding-right:1em;background:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 10 10\'%3E%3Cpath d=\'M0 0h10L5 10\'/%3E%3C/svg%3E") 0 45%/50% no-repeat}\n      ' + SUMMARY + '[aria-expanded="false"]::before{background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 10 10\'%3E%3Cpath d=\'M0 0l10 5-10 5\'/%3E%3C/svg%3E")}\n      ' + SUMMARY + '[aria-expanded="false"]~*{display:none}\n    </style>');
}

/***/ }),

/***/ 2:
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
    Object.keys(object).forEach(function (key) {
      return state[key] = object[key];
    });
  }

  return state;
};

var getWeakState = exports.getWeakState = function getWeakState(element) {
  return STATES[element[KEY]];
};

var queryAll = exports.queryAll = function queryAll(selector) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  return [].slice.call(context.querySelectorAll(selector));
};

/***/ }),

/***/ 24:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

__webpack_require__(12); // Load polyfill

module.exports = function (props) {
  var open = props.open !== 'false' && Boolean(props.open);
  var aria = { role: 'button', tabIndex: 0, 'aria-expanded': String(open) };
  var children = props.children;

  // Loop though children and augment <summary> with aria attributes
  if (Array.isArray(props.children)) {
    children = children.map(function (child, key) {
      var attr = child.type === 'summary' ? aria : {};
      if (!child.type) return React.createElement(
        'div',
        { key: key },
        child
      ); // Child is text or function, wrap'it'up
      return React.createElement(child.type, _extends({}, child.props, attr, { ref: child.ref, key: key }));
    });
  }

  return React.createElement(
    'details',
    _extends({}, props, { open: open }),
    children
  );
};

/***/ }),

/***/ 6:
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


/***/ })

/******/ });
});