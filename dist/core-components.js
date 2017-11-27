(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["core-components"] = factory();
	else
		root["core-components"] = factory();
})(this, function() {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 61);
/******/ })
/************************************************************************/
/******/ ({

/***/ 28:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function onKey(event) {
  if (event.keyCode === 13 || event.keyCode === 32) onClick(event);
}

function onClick(event) {
  for (var el = event.target; el; el = el.parentElement) {
    if (el.nodeName.toLowerCase() === 'summary') break;
  }

  if (el) {
    var details = el.parentElement;
    var isOpen = details.hasAttribute('open');
    var isSupported = 'open' in details;

    el.setAttribute('aria-expanded', !isOpen);
    isSupported || details[(isOpen ? 'remove' : 'set') + 'Attribute']('open', '');
    isSupported || event.preventDefault(); // Prevents scroll on keydown
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('keydown', onKey);
  document.addEventListener('click', onClick);
  document.head.appendChild(document.createElement('style')).textContent = '\n    summary{display:block;cursor:pointer;touch-action:manipulation}\n    summary::-webkit-details-marker{display:none}\n    summary::before{content:\'\';padding-right:1em;background:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'%3E%3Cpath d=\'M0 0h10L5 10\'/%3E%3C/svg%3E") 0 45%/50% no-repeat}\n    summary[aria-expanded="false"]::before{background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'%3E%3Cpath d=\'M0 0l10 5-10 5\'/%3E%3C/svg%3E")}\n    summary[aria-expanded="false"]~*{display:none}\n  ';
}

/***/ }),

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),

/***/ 45:
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
    return '\n    <li role="option" aria-selected="' + (i === state.index) + '">' + value + '</li>\n  ';
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
        LIVE.textContent = value || 'Tomt tekstfelt'; // Hits (autohits) (TODO: test empty)
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
  document.head.appendChild(document.createElement('style')).textContent = '\n    datalist{display:none}\n    .' + KEY + '{position:relative}\n    .' + KEY + ' ul{position:absolute;z-index:2;list-style:none;margin:0;padding:0;width:100%;background:#fff;color:#333;box-shadow:0 5px 15px rgba(0,0,0,.3);animation:drop .2s forwards}\n    .' + KEY + ' li{padding:3px 7px}\n    .' + KEY + ' li[aria-selected="true"],\n    .' + KEY + ' li:hover {background:#c8c8c8}\n    @keyframes drop{from{opacity:0;transform:translateY(2px)}}\n  ';
}

module.exports = function () {
  return console.log('input');
};

/***/ }),

/***/ 61:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  details: __webpack_require__(28),
  dialog: __webpack_require__(44),
  input: __webpack_require__(45)
};

/***/ })

/******/ });
});