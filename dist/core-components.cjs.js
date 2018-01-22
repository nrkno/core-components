'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var version = "1.0.0";

var KEY$1 = "core-components-" + (Date.now());
var STATES = {};
var UUID = 0;



function attr (elements, attributes) {
  getElements(elements).forEach(function (element) {
    Object.keys(attributes).forEach(function (name) {
      element[((attributes[name] === null ? 'remove' : 'set') + "Attribute")](name, attributes[name]);
    });
  });
  return elements
}





function getElements (elements, key) {
  var list = [];
  if (typeof elements === 'string') { list = [].slice.call(document.querySelectorAll(elements)); }
  else if (elements && elements.length) { list = [].slice.call(elements); }
  else if (elements && elements.nodeType) { list = [elements]; }
  if (key) { list.forEach(function (el) { return (el[key] = 1); }); }
  return list
}

function weakState (element, object, initial) {
  if ( initial === void 0 ) initial = {};

  var weakMap = {
    get: function (element) { return STATES[element[KEY$1]]; },
    set: function (element, object) {
      var uuid = element[KEY$1] || (element[KEY$1] = ++UUID);
      var state = STATES[uuid] || (STATES[uuid] = initial);
      Object.keys(object).forEach(function (key) { return (state[key] = object[key]); });
      return state
    },
    has: function (element) { return Boolean(STATES[element[KEY$1]]); },
    delete: function (element) {
      if (!weakMap.get(element)) { return false }
      delete element[KEY$1];
      delete STATES[element[KEY$1]];
      return true
    }
  };

  if (object === false) {
    weakMap.delete(element);
  } else if (typeof object === 'object') {
    weakMap.set(element, object);
  }

  return weakMap
}

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

var BACKDROP;
var KEY$2 = 'dialog-@VERSION';
var KEY_UNIVERSAL = 'data-dialog-xxx';
var FOCUSABLE_ELEMENTS = "\n  [tabindex]:not([disabled]),\n  button:not([disabled]),\n  input:not([disabled]),\n  select:not([disabled]),\n  textarea:not([disabled])";

// Attempt to focus on an autofocus target first. If none exists we will focus
// on the first focusable element.
var focusOnFirstFocusableElement = function (el) {
  var autofocusElement = el.querySelector('[autofocus]:not([disabled])');
  var focusableElement = el.querySelector(FOCUSABLE_ELEMENTS);(autofocusElement || focusableElement || el).focus();
};

var getHighestZIndex = function () { return getElements('*').reduce(function (zIndex, el) { return Math.max(zIndex, Number(window.getComputedStyle(el, null).getPropertyValue('z-index')) || 0); }
  , 0); };

var getActive = function () { return document.querySelector(("[" + KEY_UNIVERSAL + "]")); };

var setActiveStateForElement = function (el) {
  var prevActive = getActive();
  prevActive && prevActive.removeAttribute(KEY_UNIVERSAL);
  el.setAttribute(KEY_UNIVERSAL, '');

  return weakState(el, {
    prevActive: prevActive,
    focusBeforeModalOpen: document.activeElement
  }).get(el)
};

// Will toggle the open state of the dialog depending on what the fn function
// returns or what (Boolean) value fn has.
var toggle = function (el, index, fn, open) {
  if ( open === void 0 ) open = true;

  var isOpen = Boolean(typeof fn === 'function' ? fn(el, index) : fn) === open;

  attr(el, {open: isOpen ? '' : null});

  if (isOpen) {
    el.style.zIndex = getHighestZIndex() + 1;
    setActiveStateForElement(el);
    focusOnFirstFocusableElement(el);
    BACKDROP.hidden = false;
    // set focus
  } else {
    BACKDROP.hidden = !(weakState().get(el).prevActive);
    el.removeAttribute(KEY_UNIVERSAL);
    if (!BACKDROP.hidden) {
      weakState().get(el).prevActive.setAttribute(KEY_UNIVERSAL, '');
    }
    // Should be able to pop when removing as the last element is the active dialog
    var state = weakState().get(el);
    // Focus on the last focused thing before the dialog modal was opened
    state.focusBeforeModalOpen && state.focusBeforeModalOpen.focus();
    // Delete state for element
    weakState(el, false);
  }
};

var keepFocus = function (event) {
  var activeDialog = getActive();
  // If no dialog is active, we don't need to do anything
  if (!activeDialog) { return }

  var state = weakState().get(activeDialog);
  var focusable = activeDialog.querySelectorAll(FOCUSABLE_ELEMENTS);

  // If focus moves us outside the dialog, we need to refocus to inside the dialog
  if (!activeDialog.contains(event.target)) {
    state.activeElement === focusable[0] ? focusable[focusable.length - 1].focus() : focusable[0].focus();
  } else {
    state.activeElement = event.target;
  }
};

var exitOnEscape = function (event) {
  if (event.keyCode === 27) { dialog(getActive()).close(); }
};

function dialog (selector, options) {
  if (!(this instanceof dialog)) { return new dialog(selector, options) } //eslint-disable-line

  // Initialize the element with necessary attributes for a dialog
  this.elements = attr(getElements(selector), {
    role: 'dialog',
    tabindex: -1,
    'aria-modal': true
  });

  return this
}

dialog.prototype.open = function (fn) {
  if ( fn === void 0 ) fn = true;

  this.elements.forEach(function (el, index) { return toggle(el, index, fn); });
  return this
};

dialog.prototype.close = function (fn) {
  if ( fn === void 0 ) fn = false;

  this.elements.forEach(function (el, index) { return toggle(el, index, fn); });
  return this
};

function createBackdrop () {
  attr(BACKDROP = document.createElement('div'), {hidden: true, id: KEY$2});
  // @todo: General styling. Should be removed?
  BACKDROP.classList.add('nrk-dialog-backdrop');
  document.addEventListener('focus', keepFocus, true);
  document.addEventListener('keydown', exitOnEscape);
  document.documentElement.appendChild(BACKDROP);
}

if (typeof document !== 'undefined' && !document.getElementById(KEY$2)) {
  createBackdrop();
}

function Dialog () {
  return React.createElement( 'div', null, "Testing dialog" )
}

exports.version = version;
exports.input = input;
exports.Input = Input;
exports.dialog = dialog;
exports.Dialog = Dialog;
