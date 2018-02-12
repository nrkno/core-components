var name = "@nrk/core-toggle";


var version = "1.0.0";

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

var KEY = name + "-" + version;                    // Unique id of component
var ATTR = 'aria-expanded';

function toggle (elems, open) {
  if ( open === void 0 ) open = null;
       // Toggle component
  return addElements(KEY, elems).map(function (el) {
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

addEvent(KEY, 'click', function (el) {
  toggle(el, el.getAttribute(ATTR) === 'false');
});

export { toggle };
