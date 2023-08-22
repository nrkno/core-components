export default class CoreProgress extends HTMLElement {
    static get observedAttributes(): string[];
    connectedCallback(): void;
    set type(arg: string);
    get type(): string;
    attributeChangedCallback(name: any, prev: any, next: any): void;
    get indeterminate(): string;
    get percentage(): number;
    set value(arg: string | number);
    get value(): string | number;
    set max(arg: number);
    get max(): number;
}
//# sourceMappingURL=core-progress.d.ts.map