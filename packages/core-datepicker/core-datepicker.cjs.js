'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var name = "@nrk/core-datepicker";


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


/**
* debounce
* @param {Function} callback The function to debounce
* @param {Number} ms The number of milliseconds to delay
* @return {Function} The new debounced function
*/

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

var KEY = name + "-" + version;                    // Unique id of component

function datepicker () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];
              // Expose component
  return new (Function.prototype.bind.apply( Datepicker, [ null ].concat( args) ))
}

var Datepicker = function Datepicker (elements) {
  this.elements = addElements(elements, KEY);
  // tabindex="0" på datepicker kun lytte til events på disse
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

exports.datepicker = datepicker;
