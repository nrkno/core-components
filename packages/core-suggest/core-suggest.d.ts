export default class CoreSuggest extends HTMLElement {
    static get observedAttributes(): string[];
    connectedCallback(): void;
    _observer: MutationObserver;
    _xhr: XMLHttpRequest;
    _ariaLiveSpan: HTMLSpanElement;
    disconnectedCallback(): void;
    _input: Element;
    _regex: any;
    _xhrTime: any;
    _ariaLiveDelay: any;
    _ariaLiveTimeout: NodeJS.Timeout;
    attributeChangedCallback(name: any): void;
    /**
     * Use `focusin` because it bubbles (`focus` does not)
     * @param {KeyboardEvent | FocusEvent | InputEvent | MouseEvent} event
     */
    handleEvent(event: KeyboardEvent | FocusEvent | InputEvent | MouseEvent): void;
    escapeHTML(str: any): string;
    _clearLiveRegion(): void;
    _setLiveRegion(label: any): void;
    /**
     * @param {String} label
     * @returns {void}
     */
    pushToLiveRegion(label: string): void;
    _ariaLiveDebounce: NodeJS.Timeout;
    /**
     * @returns {HTMLInputElement}
     */
    get input(): HTMLInputElement;
    set ajax(arg: string);
    get ajax(): string;
    set limit(arg: number);
    /**
     * @type {number}
     */
    get limit(): number;
    set highlight(arg: "keep" | "off" | "on");
    /**
     * @returns {'on' | 'off' | 'keep'} defaults to `'on'`
     */
    get highlight(): "keep" | "off" | "on";
}
//# sourceMappingURL=core-suggest.d.ts.map