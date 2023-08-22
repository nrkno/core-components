/**
* addEvent
* @param {String} nodeName An unique ID of the event to bind - ensurnes single instance
* @param {String} type The type of event to bind
* @param {Function} handler The function to call on event
* @param {Boolean|Object} options useCapture or options object for addEventListener. Defaults to false
*/
export function addEvent(nodeName: string, type: string, handler: Function, options: boolean | any, key: any): void;
/**
* addStyle
* @param {String} nodeName An unique ID of the event to bind - ensurnes single instance
* @param {String} css The css to inject
*/
export function addStyle(nodeName: string, css: string): void;
export function escapeHTML(str: any): string;
/**
* dispatchEvent - with infinite loop prevention
* @param {Element} element The target object
* @param {String} name The event name
* @param {Object} detail Detail object (bubbles and cancelable is set to true)
* @return {Boolean} Whether the event was canceled. Returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.
*/
export function dispatchEvent(element: Element, name: string, detail?: any): boolean;
/**
* getUUID
* @return {String} A generated unique ID
*/
export function getUUID(): string;
/**
 * throttle
 * @param {Function} callback  The new throttled function
 * @param {Number} ms The threshold of milliseconds between each callback
 */
export function throttle(callback: Function, ms: number): (...args: any[]) => void;
/**
 * toggleAttribute (Ponyfill for IE and Edge, fixes #299)
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Element/toggleAttribute
 * @param {Element} el  Single DOM Element
 * @param {String} name The name of the attribute to be toggled
 * @param {Boolean} force Force attribute to be added or removed regardless of previous state
 */
export function toggleAttribute(el: Element, name: string, force?: boolean): boolean;
/**
* queryAll
* @param {String|NodeList|Array|Element} elements A CSS selector string, nodeList, element array, or single element
* @param {Element} context Node to look for elements within
* @return {Element[]} Array of elements
*/
export function queryAll(elements: string | NodeList | any[] | Element, context?: Element): Element[];
export const IS_BROWSER: boolean;
export const IS_ANDROID: boolean;
export const IS_IOS: boolean;
export const IS_IE11: any;
export function closest(el: any, css: any): any;
//# sourceMappingURL=utils.d.ts.map