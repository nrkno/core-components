export default class CoreDialog extends HTMLElement {
    static get observedAttributes(): string[];
    connectedCallback(): void;
    _focus: boolean | Element;
    disconnectedCallback(): void;
    _generatedBackdrop: any;
    attributeChangedCallback(attr: any, prev: any, next: any): void;
    handleEvent(event: any): void;
    close(): void;
    show(): void;
    set open(arg: boolean);
    get open(): boolean;
    set strict(arg: boolean);
    get strict(): boolean;
    set backdrop(arg: any);
    get backdrop(): any;
}
//# sourceMappingURL=core-dialog.d.ts.map