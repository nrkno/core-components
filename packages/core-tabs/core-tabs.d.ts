export default class CoreTabs extends HTMLElement {
    static get observedAttributes(): string[];
    connectedCallback(): void;
    _childObserver: MutationObserver;
    disconnectedCallback(): void;
    attributeChangedCallback(attr: any, prev: any, next: any): void;
    set tab(arg: string | number | TabElement);
    /**
     * @type {string | number | TabElement}
     */
    get tab(): string | number | TabElement;
    handleEvent(event: any): void;
    get panels(): HTMLElement[];
    get panel(): HTMLElement;
    /**
     * @returns {[TabElement]}
     */
    get tabs(): [TabElement];
}
export type TabElement = HTMLButtonElement | HTMLAnchorElement;
//# sourceMappingURL=core-tabs.d.ts.map