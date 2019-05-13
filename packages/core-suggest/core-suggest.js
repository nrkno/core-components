/* globals HTMLElement */
import { IS_IOS, closest, escapeHTML, dispatchEvent, queryAll } from '../utils'

const KEYS = { ENTER: 13, ESC: 27, PAGEUP: 33, PAGEDOWN: 34, END: 35, HOME: 36, UP: 38, DOWN: 40 }
const AJAX_DEBOUNCE = 500

export default class CoreSuggest extends HTMLElement {
  static get observedAttributes () { return ['hidden'] }

  connectedCallback () {
    // this._observer = new window.MutationObserver(() => onMutation(this)) // Enhance <a> and <button> markup
    // this._observer.observe(this, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden'] })

    if (IS_IOS) this.input.setAttribute('role', 'combobox') // iOS does not inform about editability if combobox
    this.input.setAttribute('autocomplete', 'off')
    this.input.setAttribute('aria-autocomplete', 'list')
    this.input.setAttribute('aria-expanded', false)

    document.addEventListener('click', this)
    document.addEventListener('input', this)
    // document.addEventListener('keydown', this)
    document.addEventListener('focusin', this)

    if (document.activeElement === this.input) this.hidden = false // Open if active
  }
  disconnectedCallback () {
    this._input = this._regex = null
    this._observer.disconnect()
    document.removeEventListener('click', this)
    document.removeEventListener('input', this)
    // document.removeEventListener('keydown', this)
    document.removeEventListener('focusin', this)
  }
  attributeChangedCallback (name, prev, next) {
    if (this._observer) this.input.setAttribute('aria-expanded', !this.hidden)
  }
  handleEvent (event) {
    if (event.ctrlKey || event.altKey || event.metaKey || event.defaultPrevented) return
    if (event.type === 'focusin' || event.type === 'click') onClick(this, event)
    if (event.type === 'keydown') onKey(this, event)
    if (event.type === 'input') onInput(this, event)
  }
  escapeHTML (str) { return escapeHTML(str) }

  get input () {
    if (this._input && this._input.getAttribute('list') === this.id) return this._input // Speed up
    return (this._input = this.id && document.querySelector(`input[list=${this.id}]`)) || this.previousElementSibling
  }

  get ajax () { return this.getAttribute('ajax') || '' } // Always return string consistent with .value or .className
  set ajax (url) { this.setAttribute('ajax', url) }

  get limit () { return Number(this.getAttribute('limit')) || Infinity }
  set limit (int) { this.setAttribute('limit', int) }

  // Must set attribute for IE11
  get hidden () { return this.hasAttribute('hidden') }
  set hidden (val) { this.toggleAttribute('hidden', val) }
}

// This can happen quite frequently so make it fast
function onMutation (self) {
  const needle = self.input.value.toLowerCase().trim()

  // Remove old highlights
  const marks = self.getElementsByTagName('mark')
  while (marks[0]) {
    const parent = marks[0].parentNode
    parent.replaceChild(document.createTextNode(marks[0].textContent), marks[0])
    parent.normalize && parent.normalize()
  }

  for (let els = self.querySelectorAll('a:not([hidden]),button:not([hidden])'), i = 0, l = els.length; i < l; ++i) {
    els[i].setAttribute('aria-label', `${els[i].textContent}, ${i + 1} av ${l}`)
    els[i].setAttribute('tabindex', '-1') // setAttribute a bit faster than tabIndex prop
    els[i].setAttribute('type', 'button') // Ensure <button> does not submit forms
  }

  if (needle) {
    const range = document.createRange()
    const iterator = document.createNodeIterator(self, window.NodeFilter.SHOW_TEXT)
    const haystack = self.textContent.toLowerCase()
    const length = needle.length
    const hits = []

    for (let start = 0; ~(start = haystack.indexOf(needle, start)); start += length) hits.push(start)
    for (let start = 0, hitsLength = hits.length, node; (node = iterator.nextNode());) {
      const nodeStart = start
      const nodeEnd = start += node.textContent.length

      for (let i = 0; i < hitsLength; ++i) {
        const hitStart = Math.max(hits[i] - nodeStart, 0) // Avoid splitting at minus index
        const hitEnd = Math.min(nodeEnd, hits[i] + length) - nodeStart // Avoid splitting after content end
        if (hitStart < hitEnd) {
          range.setStart(node, hitStart)
          range.setEnd(node, hitEnd)
          range.surroundContents(document.createElement('mark'))
          start = nodeStart + hitEnd // Reset start to character after <mark>
          iterator.nextNode() // skip newly created node next
          break
        }
      }
    }
  }
  // self._observer.takeRecords() // Empty mutation queue to skip mutations done by highlighting
}

function onInput (self, event) {
  if (event.target !== self.input || !dispatchEvent(self, 'suggest.filter') || onAjax(self)) return
  const value = self.input.value.toLowerCase()
  const limit = self.limit
  let index = 0

  queryAll('a,button', self).forEach((item) => {
    const hide = (item.value || item.textContent).toLowerCase().indexOf(value) === -1 || ++index > limit
    const elem = item.parentElement.nodeName === 'LI' ? item.parentElement : item
    elem.toggleAttribute('hidden', hide) // JAWS requires hiding of <li> (if existing)
    item.toggleAttribute('hidden', hide)
  })
  onMutation(self)
}

function onKey (self, event) {
  if (!self.contains(event.target) && self.input !== event.target) return
  const items = [self.input].concat(queryAll('[tabindex="-1"]:not([hidden])', self))
  let { keyCode, target, item = false } = event

  if (keyCode === KEYS.DOWN) item = items[items.indexOf(target) + 1] || items[0]
  else if (keyCode === KEYS.UP) item = items[items.indexOf(target) - 1] || items.pop()
  else if (self.contains(target)) { // Aditional shortcuts if focus is inside list
    if (keyCode === KEYS.END || keyCode === KEYS.PAGEDOWN) item = items.pop()
    else if (keyCode === KEYS.HOME || keyCode === KEYS.PAGEUP) item = items[1]
    else if (keyCode !== KEYS.ENTER) items[0].focus()
  }

  setTimeout(() => (self.hidden = keyCode === KEYS.ESC)) // Let focus buble first
  if (item || keyCode === KEYS.ESC) event.preventDefault() // Prevent leaving maximized safari
  if (item) item.focus()
}

function onClick (self, event) {
  const item = event.type === 'click' && self.contains(event.target) && closest(event.target, 'a,button')
  const show = !item && (self.contains(event.target) || self.input === event.target)

  if (item && dispatchEvent(self, 'suggest.select', item)) {
    self.input.value = item.value || item.textContent.trim()
    self.input.focus()
  }

  // setTimeout: fix VoiceOver Safari moving focus to parentElement and let focus bubbe first
  setTimeout(() => (self.hidden = !show))
}

function onAjax (self) {
  if (!self.ajax) return
  clearTimeout(onAjax.time) // Clear previous search
  onAjax.ajax = onAjax.ajax || new window.XMLHttpRequest()
  onAjax.ajax.abort() // Abort previous request
  onAjax.time = setTimeout(onAjaxSend, AJAX_DEBOUNCE, self, onAjax.ajax) // Debounce
  return true
}

function onAjaxSend (self, ajax) {
  if (!self.input.value) return // Abort if input is empty
  if (dispatchEvent(self, 'suggest.ajax.beforeSend', ajax)) {
    ajax.onload = () => {
      try { ajax.responseJSON = JSON.parse(ajax.responseText) } catch (err) { ajax.responseJSON = false }
      dispatchEvent(self, 'suggest.ajax', ajax)
      onMutation(self)
    }
    ajax.open('GET', self.ajax.replace('{{value}}', window.encodeURIComponent(self.input.value)), true)
    ajax.setRequestHeader('X-Requested-With', 'XMLHttpRequest') // https://en.wikipedia.org/wiki/List_of_HTTP_header_fields#Requested-With
    ajax.send()
  }
}

/*!***************************************************
* mark.js v9.0.0
* https://markjs.io/
* Copyright (c) 2014–2018, Julian Kühnel
* Released under the MIT license https://git.io/vwTVl
*****************************************************/

// (function (global, factory) {
//   typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
//   typeof define === 'function' && define.amd ? define(factory) :
//   (global.Mark = factory());
// }(this, (function () { 'use strict';
//
//   class DOMIterator {
//     constructor(ctx) {
//       this.ctx = ctx;
//     }
//     static matches (element, selector) {
//       const selectors = typeof selector === 'string' ? [selector] : selector,
//         fn = (
//           element.matches ||
//           element.matchesSelector ||
//           element.msMatchesSelector ||
//           element.mozMatchesSelector ||
//           element.oMatchesSelector ||
//           element.webkitMatchesSelector
//         );
//       if (fn) {
//         let match = false;
//         selectors.every(sel => {
//           if (fn.call(element, sel)) {
//             match = true;
//             return false;
//           }
//           return true;
//         });
//         return match;
//       } else {
//         return false;
//       }
//     }
//     getContexts() {
//       let ctx,
//         filteredCtx = [];
//       if (typeof this.ctx === 'undefined' || !this.ctx) {
//         ctx = [];
//       } else if (NodeList.prototype.isPrototypeOf(this.ctx)) {
//         ctx = Array.prototype.slice.call(this.ctx);
//       } else if (Array.isArray(this.ctx)) {
//         ctx = this.ctx;
//       } else if (typeof this.ctx === 'string') {
//         ctx = Array.prototype.slice.call(
//           document.querySelectorAll(this.ctx)
//         );
//       } else {
//         ctx = [this.ctx];
//       }
//       ctx.forEach(ctx => {
//         const isDescendant = filteredCtx.filter(contexts => {
//           return contexts.contains(ctx);
//         }).length > 0;
//         if (filteredCtx.indexOf(ctx) === -1 && !isDescendant) {
//           filteredCtx.push(ctx);
//         }
//       });
//       return filteredCtx;
//     }
//     createIterator(ctx, whatToShow, filter) {
//       return document.createNodeIterator(ctx, whatToShow, filter, false);
//     }
//     getIteratorNode(itr) {
//       const prevNode = itr.previousNode();
//       let node;
//       if (prevNode === null) {
//         node = itr.nextNode();
//       } else {
//         node = itr.nextNode() && itr.nextNode();
//       }
//       return {
//         prevNode,
//         node
//       };
//     }
//     iterateThroughNodes(whatToShow, ctx, eachCb, filterCb, doneCb) {
//       const itr = this.createIterator(ctx, whatToShow, filterCb);
//       let ifr = [],
//         elements = [],
//         node, prevNode, retrieveNodes = () => {
//           ({
//             prevNode,
//             node
//           } = this.getIteratorNode(itr));
//           return node;
//         };
//       while (retrieveNodes()) {
//         elements.push(node);
//       }
//       elements.forEach(node => eachCb);
//       doneCb();
//     }
//     forEachNode(whatToShow, each, filter, done = () => {}) {
//       const contexts = this.getContexts();
//       let open = contexts.length;
//       if (!open) {
//         done();
//       }
//       contexts.forEach(ctx => {
//         const ready = () => {
//           this.iterateThroughNodes(whatToShow, ctx, each, filter, () => {
//             if (--open <= 0) {
//               done();
//             }
//           });
//         };
//         ready();
//       });
//     }
//   }
//
//   class RegExpCreator {
//     constructor(options) {
//       this.opt = Object.assign({}, {
//         'diacritics': true,
//         'synonyms': {},
//         'accuracy': 'partially',
//         'caseSensitive': false,
//         'ignoreJoiners': false,
//         'ignorePunctuation': [],
//         'wildcards': 'disabled'
//       }, options);
//     }
//     create(str) {
//       if (this.opt.wildcards !== 'disabled') {
//         str = this.setupWildcardsRegExp(str);
//       }
//       str = this.escapeStr(str);
//       if (Object.keys(this.opt.synonyms).length) {
//         str = this.createSynonymsRegExp(str);
//       }
//       if (this.opt.ignoreJoiners || this.opt.ignorePunctuation.length) {
//         str = this.setupIgnoreJoinersRegExp(str);
//       }
//       if (this.opt.diacritics) {
//         str = this.createDiacriticsRegExp(str);
//       }
//       str = this.createMergedBlanksRegExp(str);
//       if (this.opt.ignoreJoiners || this.opt.ignorePunctuation.length) {
//         str = this.createJoinersRegExp(str);
//       }
//       if (this.opt.wildcards !== 'disabled') {
//         str = this.createWildcardsRegExp(str);
//       }
//       str = this.createAccuracyRegExp(str);
//       return new RegExp(str, `gm${this.opt.caseSensitive ? '' : 'i'}`);
//     }
//     sortByLength(arry) {
//       return arry.sort((a, b) => a.length === b.length ?
//         (a > b ? 1 : -1) :
//         b.length - a.length
//       );
//     }
//     escapeStr(str) {
//       return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
//     }
//     createSynonymsRegExp(str) {
//       const syn = this.opt.synonyms,
//         sens = this.opt.caseSensitive ? '' : 'i',
//         joinerPlaceholder = this.opt.ignoreJoiners ||
//         this.opt.ignorePunctuation.length ? '\u0000' : '';
//       for (let index in syn) {
//         if (syn.hasOwnProperty(index)) {
//           let keys = Array.isArray(syn[index]) ? syn[index] : [syn[index]];
//           keys.unshift(index);
//           keys = this.sortByLength(keys).map(key => {
//             if (this.opt.wildcards !== 'disabled') {
//               key = this.setupWildcardsRegExp(key);
//             }
//             key = this.escapeStr(key);
//             return key;
//           }).filter(k => k !== '');
//           if (keys.length > 1) {
//             str = str.replace(
//               new RegExp(
//                 `(${keys.map(k => this.escapeStr(k)).join('|')})`,
//                 `gm${sens}`
//               ),
//               joinerPlaceholder +
//               `(${keys.map(k => this.processSynonyms(k)).join('|')})` +
//               joinerPlaceholder
//             );
//           }
//         }
//       }
//       return str;
//     }
//     processSynonyms(str) {
//       if (this.opt.ignoreJoiners || this.opt.ignorePunctuation.length) {
//         str = this.setupIgnoreJoinersRegExp(str);
//       }
//       return str;
//     }
//     setupWildcardsRegExp(str) {
//       str = str.replace(/(?:\\)*\?/g, val => {
//         return val.charAt(0) === '\\' ? '?' : '\u0001';
//       });
//       return str.replace(/(?:\\)*\*/g, val => {
//         return val.charAt(0) === '\\' ? '*' : '\u0002';
//       });
//     }
//     createWildcardsRegExp(str) {
//       let spaces = this.opt.wildcards === 'withSpaces';
//       return str
//         .replace(/\u0001/g, spaces ? '[\\S\\s]?' : '\\S?')
//         .replace(/\u0002/g, spaces ? '[\\S\\s]*?' : '\\S*');
//     }
//     setupIgnoreJoinersRegExp(str) {
//       return str.replace(/[^(|)\\]/g, (val, indx, original) => {
//         let nextChar = original.charAt(indx + 1);
//         if (/[(|)\\]/.test(nextChar) || nextChar === '') {
//           return val;
//         } else {
//           return val + '\u0000';
//         }
//       });
//     }
//     createJoinersRegExp(str) {
//       let joiner = [];
//       const ignorePunctuation = this.opt.ignorePunctuation;
//       if (Array.isArray(ignorePunctuation) && ignorePunctuation.length) {
//         joiner.push(this.escapeStr(ignorePunctuation.join('')));
//       }
//       if (this.opt.ignoreJoiners) {
//         joiner.push('\\u00ad\\u200b\\u200c\\u200d');
//       }
//       return joiner.length ?
//         str.split(/\u0000+/).join(`[${joiner.join('')}]*`) :
//         str;
//     }
//     createDiacriticsRegExp(str) {
//       const sens = this.opt.caseSensitive ? '' : 'i',
//         dct = this.opt.caseSensitive ? [
//           'aàáảãạăằắẳẵặâầấẩẫậäåāą', 'AÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÄÅĀĄ',
//           'cçćč', 'CÇĆČ', 'dđď', 'DĐĎ',
//           'eèéẻẽẹêềếểễệëěēę', 'EÈÉẺẼẸÊỀẾỂỄỆËĚĒĘ',
//           'iìíỉĩịîïī', 'IÌÍỈĨỊÎÏĪ', 'lł', 'LŁ', 'nñňń',
//           'NÑŇŃ', 'oòóỏõọôồốổỗộơởỡớờợöøō', 'OÒÓỎÕỌÔỒỐỔỖỘƠỞỠỚỜỢÖØŌ',
//           'rř', 'RŘ', 'sšśșş', 'SŠŚȘŞ',
//           'tťțţ', 'TŤȚŢ', 'uùúủũụưừứửữựûüůū', 'UÙÚỦŨỤƯỪỨỬỮỰÛÜŮŪ',
//           'yýỳỷỹỵÿ', 'YÝỲỶỸỴŸ', 'zžżź', 'ZŽŻŹ'
//         ] : [
//           'aàáảãạăằắẳẵặâầấẩẫậäåāąAÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÄÅĀĄ', 'cçćčCÇĆČ',
//           'dđďDĐĎ', 'eèéẻẽẹêềếểễệëěēęEÈÉẺẼẸÊỀẾỂỄỆËĚĒĘ',
//           'iìíỉĩịîïīIÌÍỈĨỊÎÏĪ', 'lłLŁ', 'nñňńNÑŇŃ',
//           'oòóỏõọôồốổỗộơởỡớờợöøōOÒÓỎÕỌÔỒỐỔỖỘƠỞỠỚỜỢÖØŌ', 'rřRŘ',
//           'sšśșşSŠŚȘŞ', 'tťțţTŤȚŢ',
//           'uùúủũụưừứửữựûüůūUÙÚỦŨỤƯỪỨỬỮỰÛÜŮŪ', 'yýỳỷỹỵÿYÝỲỶỸỴŸ', 'zžżźZŽŻŹ'
//         ];
//       let handled = [];
//       str.split('').forEach(ch => {
//         dct.every(dct => {
//           if (dct.indexOf(ch) !== -1) {
//             if (handled.indexOf(dct) > -1) {
//               return false;
//             }
//             str = str.replace(
//               new RegExp(`[${dct}]`, `gm${sens}`), `[${dct}]`
//             );
//             handled.push(dct);
//           }
//           return true;
//         });
//       });
//       return str;
//     }
//     createMergedBlanksRegExp(str) {
//       return str.replace(/[\s]+/gmi, '[\\s]+');
//     }
//     createAccuracyRegExp(str) {
//       const chars = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~¡¿';
//       let acc = this.opt.accuracy,
//         val = typeof acc === 'string' ? acc : acc.value,
//         ls = typeof acc === 'string' ? [] : acc.limiters,
//         lsJoin = '';
//       ls.forEach(limiter => {
//         lsJoin += `|${this.escapeStr(limiter)}`;
//       });
//       switch (val) {
//         case 'partially':
//         default:
//           return `()(${str})`;
//         case 'complementary':
//           lsJoin = '\\s' + (lsJoin ? lsJoin : this.escapeStr(chars));
//           return `()([^${lsJoin}]*${str}[^${lsJoin}]*)`;
//         case 'exactly':
//           return `(^|\\s${lsJoin})(${str})(?=$|\\s${lsJoin})`;
//       }
//     }
//   }
//
//   class Mark {
//     constructor(ctx) {
//       this.ctx = ctx;
//       this.ie = false;
//       const ua = window.navigator.userAgent;
//       if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) {
//         this.ie = true;
//       }
//     }
//     set opt(val) {
//       this._opt = Object.assign({}, {
//         'element': '',
//         'ignoreGroups': 0
//       }, val);
//     }
//     get opt() {
//       return this._opt;
//     }
//     get iterator() {
//       return new DOMIterator(this.ctx);
//     }
//     getSeparatedKeywords(sv) {
//       let stack = [];
//       sv.forEach(kw => {
//         kw.split(' ').forEach(kwSplitted => {
//           if (kwSplitted.trim() && stack.indexOf(kwSplitted) === -1) {
//             stack.push(kwSplitted);
//           }
//         });
//       });
//       return {
//         'keywords': stack.sort((a, b) => {
//           return b.length - a.length;
//         }),
//         'length': stack.length
//       };
//     }
//     isNumeric(value) {
//       return Number(parseFloat(value)) == value;
//     }
//     checkRanges(array) {
//       if (
//         !Array.isArray(array) ||
//         Object.prototype.toString.call(array[0]) !== '[object Object]'
//       ) {
//         return [];
//       }
//       const stack = [];
//       let last = 0;
//       array
//         .sort((a, b) => {
//           return a.start - b.start;
//         })
//         .forEach(item => {
//           let {start, end, valid} = this.callNoMatchOnInvalidRanges(item, last);
//           if (valid) {
//             item.start = start;
//             item.length = end - start;
//             stack.push(item);
//             last = end;
//           }
//         });
//       return stack;
//     }
//     callNoMatchOnInvalidRanges(range, last) {
//       let start, end,
//         valid = false;
//       if (range && typeof range.start !== 'undefined') {
//         start = parseInt(range.start, 10);
//         end = start + parseInt(range.length, 10);
//         if (
//           this.isNumeric(range.start) &&
//           this.isNumeric(range.length) &&
//           end - last > 0 &&
//           end - start > 0
//         ) {
//           valid = true;
//         }
//       }
//       return {
//         start: start,
//         end: end,
//         valid: valid
//       };
//     }
//     checkWhitespaceRanges(range, originalLength, string) {
//       let end,
//         valid = true,
//         max = string.length,
//         offset = originalLength - max,
//         start = parseInt(range.start, 10) - offset;
//       start = start > max ? max : start;
//       end = start + parseInt(range.length, 10);
//       if (end > max) {
//         end = max;
//       }
//       if (start < 0 || end - start < 0 || start > max || end > max) {
//         valid = false;
//       } else if (string.substring(start, end).replace(/\s+/g, '') === '') {
//         valid = false;
//       }
//       return {
//         start: start,
//         end: end,
//         valid: valid
//       };
//     }
//     getTextNodes(cb) {
//       let val = '',
//         nodes = [];
//       this.iterator.forEachNode(NodeFilter.SHOW_TEXT, node => {
//         nodes.push({
//           start: val.length,
//           end: (val += node.textContent).length,
//           node
//         });
//       }, node => NodeFilter.FILTER_ACCEPT, () => {
//         cb({
//           value: val,
//           nodes: nodes
//         });
//       });
//     }
//     wrapRangeInTextNode(node, start, end) {
//       const hEl = !this.opt.element ? 'mark' : this.opt.element,
//         startNode = node.splitText(start),
//         ret = startNode.splitText(end - start);
//       let repl = document.createElement(hEl);
//       repl.setAttribute('data-markjs', 'true');
//       repl.textContent = startNode.textContent;
//       startNode.parentNode.replaceChild(repl, startNode);
//       return ret;
//     }
//     wrapRangeInMappedTextNode(dict, start, end, filterCb, eachCb) {
//       dict.nodes.every((n, i) => {
//         const sibl = dict.nodes[i + 1];
//         if (typeof sibl === 'undefined' || sibl.start > start) {
//           if (!filterCb(n.node)) {
//             return false;
//           }
//           const s = start - n.start;
//           const e = (end > n.end ? n.end : end) - n.start;
//           const startStr = dict.value.substr(0, n.start);
//           const endStr = dict.value.substr(e + n.start);
//
//           n.node = this.wrapRangeInTextNode(n.node, s, e);
//           dict.value = startStr + endStr;
//           dict.nodes.forEach((k, j) => {
//             if (j >= i) {
//               if (dict.nodes[j].start > 0 && j !== i) {
//                 dict.nodes[j].start -= e;
//               }
//               dict.nodes[j].end -= e;
//             }
//           });
//           end -= e;
//           eachCb(n.node.previousSibling, n.start);
//           if (end > n.end) {
//             start = n.end;
//           } else {
//             return false;
//           }
//         }
//         return true;
//       });
//     }
//     wrapMatchesAcrossElements (regex, ignoreGroups, endCb) {
//       const matchIdx = ignoreGroups === 0 ? 0 : ignoreGroups + 1;
//       this.getTextNodes(dict => {
//         let match
//         while (
//           (match = regex.exec(dict.value)) !== null &&
//           match[matchIdx] !== ''
//         ) {
//           let start = match.index
//           if (matchIdx !== 0) {
//             for (let i = 1; i < matchIdx; i++) start += match[i].length
//           }
//           const end = start + match[matchIdx].length;
//           this.wrapRangeInMappedTextNode(dict, start, end, (node, lastIndex) => {
//             regex.lastIndex = lastIndex;
//           });
//         }
//         endCb()
//       })
//     }
//     wrapRangeFromIndex (ranges) {
//       this.getTextNodes(dict => {
//         const originalLength = dict.value.length
//         ranges.forEach((range, counter) => {
//           let { start, end, valid } = this.checkWhitespaceRanges(range, originalLength, dict.value)
//           if (valid) this.wrapRangeInMappedTextNode(dict, start, end)
//         })
//       })
//     }
//     unwrapMatches (node) {
//       const parent = node.parentNode
//       let docFrag = document.createDocumentFragment()
//       while (node.firstChild) docFrag.appendChild(node.removeChild(node.firstChild))
//
//       parent.replaceChild(docFrag, node)
//       if (!this.ie) parent.normalize()
//       else this.normalizeTextNode(parent)
//     }
//     normalizeTextNode (node) {
//       if (!node) return
//       if (node.nodeType !== 3) this.normalizeTextNode(node.firstChild)
//       else {
//         while (node.nextSibling && node.nextSibling.nodeType === 3) {
//           node.nodeValue += node.nextSibling.nodeValue
//           node.parentNode.removeChild(node.nextSibling)
//         }
//       }
//       this.normalizeTextNode(node.nextSibling)
//     }
//     mark (sv, opt) {
//       this.opt = opt
//       const { keywords: kwArr, length: kwArrLen } = this.getSeparatedKeywords(typeof sv === 'string' ? [sv] : sv)
//       const handler = kw => {
//         const regex = new RegExpCreator(this.opt).create(kw)
//         this.wrapMatchesAcrossElements(regex, 1, () => {
//           if (kwArr[kwArrLen - 1] !== kw) handler(kwArr[kwArr.indexOf(kw) + 1])
//         })
//       }
//       if (kwArrLen !== 0) handler(kwArr[0])
//     }
//     markRanges(rawRanges, opt) {
//       this.opt = opt;
//       let totalMatches = 0, ranges = this.checkRanges(rawRanges);
//       if (ranges && ranges.length) {
//         this.wrapRangeFromIndex(ranges);
//       }
//     }
//     unmark(opt) {
//       this.opt = opt;
//       let sel = this.opt.element ? this.opt.element : '*';
//       sel += '[data-markjs]';
//       this.iterator.forEachNode(NodeFilter.SHOW_ELEMENT, node => {
//         this.unwrapMatches(node);
//       }, node => {
//         const matchesSel = DOMIterator.matches(node, sel);
//         matchesSel ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
//       }, this.opt.done);
//     }
//   }
//
//   function Mark$1(ctx) {
//     const instance = new Mark(ctx);
//     this.mark = (sv, opt) => {
//       instance.mark(sv, opt);
//       return this;
//     };
//     this.markRegExp = (sv, opt) => {
//       instance.markRegExp(sv, opt);
//       return this;
//     };
//     this.markRanges = (sv, opt) => {
//       instance.markRanges(sv, opt);
//       return this;
//     };
//     this.unmark = (opt) => {
//       instance.unmark(opt);
//       return this;
//     };
//     return this;
//   }
//
//   return Mark$1;
//
// })));
