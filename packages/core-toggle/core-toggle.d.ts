export default class CoreToggle extends HTMLElement {
    static get observedAttributes(): string[];
    connectedCallback(): void;
    set value(arg: any);
    get value(): any;
    _open: any;
    disconnectedCallback(): void;
    _button: Element;
    attributeChangedCallback(): void;
    handleEvent(event: any): any;
    /**
    * updatePosition Exposed for _very_ niche situations, use sparingly
    * @param {HTMLElement} contentEl Reference to the core-toggle element
    */
    updatePosition(): void;
    _skipPosition: boolean;
    get button(): Element;
    set popup(arg: string | boolean);
    get popup(): string | boolean;
    set autoposition(arg: boolean);
    get autoposition(): boolean;
}
//# sourceMappingURL=core-toggle.d.ts.map