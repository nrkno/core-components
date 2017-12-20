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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ({

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _utils = __webpack_require__(2);

// First attempt to focus on the property with autofocus.
// If no such element exists, set focus to first focusable element.

var KEY = 'nrk-dialog';
var KEY_BACKDROP = 'nrk-dialog-backdrop';
var FOCUSABLE_ELEMENTS = ['[tabindex]:not([disabled])', 'button:not([disabled])', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])'];

var DEFAULT_Z_INDEX = 10000;

// The stack of active dialogs where the last element should be the dialog
// that is on "top".
var ACTIVE_DIALOG_STACK = [];

var setBackdrop = function setBackdrop() {
  // If a backdrop already exists we do not want to create another one
  if (document.querySelector('.' + KEY_BACKDROP)) {
    return;
  }

  var backdrop = document.createElement('div');
  backdrop.setAttribute('aria-hidden', true);
  backdrop.classList.add(KEY_BACKDROP);
  document.body.appendChild(backdrop);
};

var removeBackdrop = function removeBackdrop() {
  // Can remove backdrop when we're removing the last dialog
  if (ACTIVE_DIALOG_STACK.length === 1) {
    var backdrop = document.querySelector('.' + KEY_BACKDROP);
    backdrop && backdrop.parentElement.removeChild(backdrop);
  }
};

// Attempt to focus on an autofocus target first. If none exists we will focus
// on the first focusable element.
var focusOnFirstFocusableElement = function focusOnFirstFocusableElement(el) {
  var autofocusEl = el.querySelector('[autofocus]:not([disabled])');

  var _getWeakState = (0, _utils.getWeakState)(el),
      firstFocusableElement = _getWeakState.firstFocusableElement;

  if (autofocusEl) {
    autofocusEl.focus();
    return;
  }
  firstFocusableElement && firstFocusableElement.focus();
};

var findFirstAndLastFocusableElements = function findFirstAndLastFocusableElements(el) {
  var targets = el.querySelectorAll(FOCUSABLE_ELEMENTS.join(', '));
  return {
    firstFocusableElement: targets[0],
    lastFocusableElement: targets[targets.length - 1]
  };
};

var setActiveStateForElement = function setActiveStateForElement(el) {
  return (0, _utils.weakState)(el, _extends({
    focusBeforeModalOpen: document.activeElement
  }, findFirstAndLastFocusableElements(el)));
};

// Will toggle the open state of the dialog depending on what the fn function
// returns or what (Boolean) value fn has.
var toggle = function toggle(el, index, fn, invert) {
  var active = typeof fn === 'function' ? fn(el, index) : Boolean(fn);
  active = invert ? !active : active;

  active ? el.setAttribute('open', '') : el.removeAttribute('open');
  active ? setBackdrop() : removeBackdrop();

  if (active) {
    ACTIVE_DIALOG_STACK.indexOf(el) >= 0 || ACTIVE_DIALOG_STACK.push(el);
    el.style.zIndex = DEFAULT_Z_INDEX + ACTIVE_DIALOG_STACK.indexOf(el);
    setActiveStateForElement(el);
    focusOnFirstFocusableElement(el);
  } else {
    // Should be able to pop when removing as the last element is the active dialog
    ACTIVE_DIALOG_STACK.pop();
    var state = (0, _utils.getWeakState)(el);
    // Focus on the last focused thing before the dialog modal was opened
    state.focusBeforeModalOpen && state.focusBeforeModalOpen.focus();
    // Delete state for element
    (0, _utils.weakState)(el);
  }
};

var keepFocus = function keepFocus(e) {
  var activeDialog = ACTIVE_DIALOG_STACK[ACTIVE_DIALOG_STACK.length - 1];
  // If no dialog is active, we don't need to do anything
  if (!activeDialog) {
    return;
  }

  var state = (0, _utils.getWeakState)(activeDialog);
  // If focus moves us outside the dialog, we need to refocus to inside the dialog
  if (!activeDialog.contains(e.target)) {
    state.activeElement === state.lastFocusableElement ? state.firstFocusableElement.focus() : state.lastFocusableElement.focus();
  } else {
    state.activeElement = e.target;
  }
};

var exitOnEscape = function exitOnEscape(e) {
  if (e.keyCode === 27) {
    var activeDialog = ACTIVE_DIALOG_STACK.pop();
    activeDialog && window.coreComponents.dialog(activeDialog).close();
  }
};

// Initialize the element with necessary attributes for a dialog
var initialize = function initialize(el, options) {
  el.hasAttribute('role') || el.setAttribute('role', 'dialog');
  el.hasAttribute('tabindex') || el.setAttribute('tabindex', '-1');
  el.hasAttribute('aria-modal') || el.setAttribute('aria-modal', 'true');
};

function dialog(selector, options) {
  if (!(this instanceof dialog)) return new dialog(selector, options);

  this.elements = (0, _utils.getElements)(selector);
  this.elements.forEach(function (el) {
    return initialize(el, options);
  });

  return this;
}

dialog.prototype.open = function () {
  var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

  this.elements.forEach(function (el, idx) {
    return toggle(el, idx, fn);
  });
  return this;
};

dialog.prototype.close = function () {
  var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  this.elements.forEach(function (el, idx) {
    return toggle(el, idx, fn);
  });
  return this;
};

// @TODO Should I ensure this is not called everytime this component is required?
// The functions are scoped to the data accessible to the component, which means
// that two separate components technically don't interfere with each other
document.addEventListener('focusin', keepFocus);
document.addEventListener('keydown', exitOnEscape);

module.exports = dialog;
// dialog('dette er selected').open('test')

// function Dialog (el, type) {
//   this.open = false
//   this.el = el
//   this.backdrop = null
//   this.keepFocusListener = this.keepFocus.bind(this)
//   this.focusBeforeModalOpen = null
//   this.activeElement = null
//   this.firstFocusableElement = null
//   this.lastFocusableElement = null

//   this.el.show = this.show.bind(this)
//   this.el.showModal = this.showModal.bind(this)
//   this.el.close = this.close.bind(this)
//   document.addEventListener('keydown', this.exitOnEscape.bind(this))
// }

// Dialog.prototype.show = function () {
//   this.el.hasAttribute('open') || this.setOpen(true)
//   this.focusOnFirstFocusableElement()
// }

// Dialog.prototype.showModal = function () {
//   if (!this.el.hasAttribute('open')) {
//     this.focusBeforeModalOpen = document.activeElement
//     this.setBackdrop()
//     this.setOpen(true)
//     this.positionModal()
//     this.focusOnFirstFocusableElement()
//     document.addEventListener('focusin', this.keepFocusListener)
//   }
// }

// Dialog.prototype.close = function () {
//   this.setOpen(false)
//   this.removeBackdrop()
//   // Focus on the element that was last focused before opening the modal
//   this.focusBeforeModalOpen.focus()
// }

// Dialog.prototype.setBackdrop = function () {
//   this.backdrop = document.createElement('div')
//   this.backdrop.setAttribute('aria-hidden', true)
//   this.backdrop.classList.add('core-dialog-backdrop')
//   // this.el.parentElement.insertBefore(this.backdrop, this.el)
//   document.body.appendChild(this.backdrop)
//   this.backdrop.addEventListener('click', this.activateOverlayBlocking.bind(this))
// }

// Dialog.prototype.removeBackdrop = function () {
//   if (this.backdrop) {
//     this.backdrop.parentElement.removeChild(this.backdrop)
//   }
// }

// Dialog.prototype.activateOverlayBlocking = function (e) {
//   e.stopPropagation()
//   e.preventDefault()
// }

// Dialog.prototype.positionModal = function () {
//   this.el.style.top = Math.round((window.innerHeight - this.el.clientHeight) / 2) + 'px'
//   this.el.style.left = Math.round((window.innerWidth - this.el.clientWidth) / 2) + 'px'
// }

// Dialog.prototype.setOpen = function (value) {
//   if (value) {
//     this.el.hasAttribute('open') || this.el.setAttribute('open', '')
//   } else {
//     this.el.removeAttribute('open')
//   }
// }

// Dialog.prototype.exitOnEscape = function (e) {
//   if (e.keyCode === 27 && this.el.hasAttribute('open')) {
//     this.close()
//   }
// }

// Dialog.prototype.focusOnFirstFocusableElement = function () {
//   const focusableElements = ['[autofocus]', '[tabindex]', 'button', 'input', 'select', 'textarea']
//   const query = focusableElements.map(function (el) {
//     return `${el}:not([disabled])`
//   })
//   let targets = this.el.querySelectorAll(query.join(', '))
//   this.firstFocusableElement = targets[0]
//   this.lastFocusableElement = targets[targets.length - 1]
//   targets && targets[0].focus()
// }

// Dialog.prototype.keepFocus = function (e) {
//   // If focus moves us outside the dialog, we need to refocus to inside the dialog
//   if (!this.el.contains(e.target)) {
//     this.activeElement === this.lastFocusableElement ? this.firstFocusableElement.focus() : this.lastFocusableElement.focus()
//   } else {
//     this.activeElement = document.activeElement
//   }
// }

// module.exports = Dialog

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

/***/ })

/******/ });
});