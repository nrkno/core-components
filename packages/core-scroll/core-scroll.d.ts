export default class CoreScroll extends HTMLElement {
    connectedCallback(): void;
    _throttledEvent: (...args: any[]) => void;
    _childListObserver: MutationObserver;
    disconnectedCallback(): void;
    /**
     *
     * @param {Event} event
     */
    handleEvent(event?: Event): void;
    /**
     * Scroll to Element, point or cardinal direction within core-scroll
     * @param {scrollTarget} point Element, {x, y} pixel distance from top/left or cardinal direction ['up', 'down', 'left', 'right']
     * @returns {Promise<scrollPoint>} scrollPoint
     */
    /** @ts-ignore: overloaded function has different signature */
    scroll(point: any): Promise<any>;
    set items(arg: Element[]);
    get items(): Element[];
    get scrollRight(): number;
    get scrollBottom(): number;
    set friction(arg: number);
    get friction(): number;
}
export type scrollCoords = {
    x: number;
    y: number;
};
export type scrollPoint = {
    x: number;
    y: number;
    prop: 'top' | 'bottom';
};
export type scrollDirection = 'up' | 'down' | 'left' | 'right';
export type scrollStatus = {
    /**
     * distance above to bounding element
     */
    up: number;
    /**
     * distance right to bounding element
     */
    right: number;
    /**
     * distance below to bounding element
     */
    down: number;
    /**
     * distance left to bounding element
     */
    left: number;
};
export type scrollTarget = scrollDirection | scrollPoint | HTMLElement;
export type dragType = {
    /**
     * Id of element to animate
     */
    animate: string;
    diffSumX: number;
    diffSumY: number;
    diffX: number;
    diffY: number;
    pageX: number;
    pageY: number;
    scrollX: number;
    scrollY: number;
    target: HTMLElement;
};
//# sourceMappingURL=core-scroll.d.ts.map