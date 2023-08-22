export default class CoreDatepicker extends HTMLElement {
    static get observedAttributes(): string[];
    connectedCallback(): void;
    _date: any;
    disconnectedCallback(): void;
    _disabled: (() => boolean) | ((val: any) => any);
    attributeChangedCallback(attr: any, prev: any, next: any): any;
    set date(arg: any);
    get date(): any;
    handleEvent(event: any): void;
    diff(val: any): number;
    parse(val: any, from: any): any;
    set disabled(arg: Function);
    get disabled(): Function;
    get timestamp(): any;
    get year(): string;
    get month(): string;
    get day(): string;
    get hour(): string;
    get minute(): string;
    get second(): string;
    set months(arg: string[]);
    get months(): string[];
    set days(arg: string[]);
    get days(): string[];
}
//# sourceMappingURL=core-datepicker.d.ts.map