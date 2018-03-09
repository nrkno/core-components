(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
	typeof define === 'function' && define.amd ? define(['react'], factory) :
	(global.Input = factory(global.React));
}(this, (function (React) { 'use strict';

React = React && React.hasOwnProperty('default') ? React['default'] : React;

function Input () {
  return React.createElement( 'div', null, "Testing input" )
}

return Input;

})));
//# sourceMappingURL=index.js.map
