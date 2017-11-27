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
/******/ 	return __webpack_require__(__webpack_require__.s = 28);
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

/***/ })

/******/ });
});