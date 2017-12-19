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
/******/ 	return __webpack_require__(__webpack_require__.s = 48);
/******/ })
/************************************************************************/
/******/ ({

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

/***/ 48:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _utils = __webpack_require__(2);

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

/***/ })

/******/ });
});