(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
	(factory((global.Components = {}),global.React));
}(this, (function (exports,React) { 'use strict';

React = React && React.hasOwnProperty('default') ? React['default'] : React;

var name = "@nrk/core-toggle";


var version = "1.0.0";

var IS_ANDROID = typeof window !== 'undefined' && /(android)/i.test(window.navigator.userAgent); // Bad, but needed
var FOCUSABLE = 'a,button,input,select,textarea,iframe,[tabindex],[contenteditable="true"]';

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
* addEvent
* @param {String} uuid An unique ID of the event to bind - ensurnes single instance
* @param {String} type The type of event to bind
* @param {Function} handler The function to call on event
*/
function addEvent (uuid, type, handler) {
  if (typeof window === 'undefined' || window[(uuid + "-" + type)]) { return }        // Ensure single instance
  document.addEventListener(type, handler, window[(uuid + "-" + type)] = true);    // Use capture for old Firefox
}

function ariaExpand (master, open) {
  var relatedTarget = ariaTarget(master);
  var prevState = master.getAttribute('aria-expanded') === 'true';
  var wantState = typeof open === 'boolean' ? open : (open === 'toggle' ? !prevState : prevState);
  var canUpdate = prevState === wantState || dispatchEvent(master, 'toggle', {relatedTarget: relatedTarget, isOpen: prevState});
  var nextState = canUpdate ? wantState : prevState;

  relatedTarget[nextState ? 'removeAttribute' : 'setAttribute']('hidden', '');   // Toggle hidden attribute
  master.setAttribute('aria-expanded', nextState);                               // Set expand always
  return nextState
}

function ariaTarget (master, relationType, targetElement) {
  var targetId = master.getAttribute('aria-controls') || master.getAttribute('aria-owns') || master.getAttribute('list');
  var target = targetElement || document.getElementById(targetId) || master.nextElementSibling;
  var label = IS_ANDROID ? 'data' : 'aria';   // Andriod has a bug and reads only label instead of content

  if (!target) { throw new Error(("missing nextElementSibling on " + (master.outerHTML))) }
  if (relationType) {
    master.setAttribute(("aria-" + relationType), target.id = target.id || getUUID());
    target.setAttribute((label + "-labelledby"), master.id = master.id || getUUID());
  }
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
  if (typeof window.CustomEvent === 'function') { return window.CustomEvent }

  function CustomEvent (name, params) {
    if ( params === void 0 ) params = {};

    var event = document.createEvent('CustomEvent');
    event.initCustomEvent(name, Boolean(params.bubbles), Boolean(params.cancelable), params.detail);
    return event
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


/**
* dispatchEvent
* @param {Element} elem The target object
* @param {String} name The source object(s)
* @param {Object} detail Detail object (bubbles and cancelable defaults to true)
* @return {Boolean} Whether the event was cance
*/
function dispatchEvent (elem, name, detail) {
  if ( detail === void 0 ) detail = {};

  return elem.dispatchEvent(new CustomEvent(name, {
    bubbles: true,
    cancelable: true,
    detail: detail
  }))
}

/**
* getUUID
* @return {String} A generated unique ID
*/
function getUUID (el, attr) {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
}

/**
* isVisible
* @param {Element} el A element to check visibility on
* @return {Boolean} True of false based on visibility
*/
function isVisible (el) {
  return el.offsetWidth && el.offsetHeight && window.getComputedStyle(el).getPropertyValue('visibility') !== 'hidden'
}

/**
* queryAll
* @param {String|NodeList|Array|Element} elements A CSS selector string, nodeList, element array, or single element
* @return {Array} Array of elements
*/
function queryAll (elements, context) {
  if ( context === void 0 ) context = document;

  if (elements === ':focusable') { return queryAll(FOCUSABLE, context).filter(function (el) { return !el.disabled && isVisible(el); }) }
  if (typeof elements === 'string') { return queryAll(context.querySelectorAll(elements)) }
  if (elements.length) { return [].slice.call(elements) }
  return elements.nodeType ? [elements] : []
}

var UUID = ("data-" + name + "-" + version).replace(/\W+/g, '-');         // Strip invalid attribute characters
var OPEN = 'aria-expanded';
var POPS = 'aria-haspopup';

var isBool = function (val) { return typeof val === 'boolean'; };

function toggle (selector, open) {
  var options = typeof open === 'object' ? open : {open: open};
  var buttons = queryAll(selector);

  buttons.forEach(function (button) {
    var open = isBool(options.open) ? options.open : button.getAttribute(OPEN) === 'true';
    var pops = isBool(options.popup) ? options.popup : button.getAttribute(POPS) === 'true';

    button.setAttribute(UUID, '');
    button.setAttribute(POPS, pops);

    ariaTarget(button, 'controls');
    ariaExpand(button, open);
  });

  return buttons
}

addEvent(UUID, 'click', function (ref) {
  var target = ref.target;

  queryAll(("[" + UUID + "]")).forEach(function (el) {
    var open = el.getAttribute(OPEN) === 'true';
    var pops = el.getAttribute(POPS) === 'true';

    if (el.contains(target)) { toggle(el, !open); }                  // Click on toggle
    else if (pops) { toggle(el, ariaTarget(el).contains(target)); }  // Click in target or outside
  });
});

function mountToggle (self) {
  toggle(ReactDOM.findDOMNode(self).firstElementChild);      // Button must be first child
}

var Toggle = (function (superclass) {
  function Toggle () {
    superclass.apply(this, arguments);
  }

  if ( superclass ) Toggle.__proto__ = superclass;
  Toggle.prototype = Object.create( superclass && superclass.prototype );
  Toggle.prototype.constructor = Toggle;

  Toggle.prototype.componentDidMount = function componentDidMount () { mountToggle(this); };                     // Mount client side only to avoid rerender
  Toggle.prototype.componentDidUpdate = function componentDidUpdate () { mountToggle(this); };                   // Must mount also on update in case content changes
  Toggle.prototype.render = function render () {
    var this$1 = this;

    return React.createElement( 'div', assign({}, this.props, {open: null, popup: null}),
      React.Children.map(this.props.children, function (child, i) {  // Augment children with aria-attributes
        return assign({}, child, {
          props: assign({}, child.props, i ?
            {'hidden': !this$1.props.open} :
            {
              'aria-expanded': String(Boolean(this$1.props.open)),
              'aria-haspopup': String(Boolean(this$1.props.popup))
            }
          )
        })
      })
    )
  };

  return Toggle;
}(React.Component));

function Input () {
  return React.createElement( 'div', null, "Testing input" )
}

exports.Toggle = Toggle;
exports.Input = Input;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
