import { CssDisplayProperty, QuickPaginationOptions } from 'source';
export default class QuickPagination {
    _chunks: Array<HTMLElement[]>;
    _perPage: number;
    _itemsSelector: string;
    _pagesTarget: HTMLElement | null;
    _paginationElement: HTMLElement | null;
    _nextPrevButtons: boolean;
    _pageDisplay: CssDisplayProperty;
    _currentPage: number;
    _amountOfPages: number;
    _amountOfPrevNextItems: number;
    _originalItems: Array<HTMLElement>;
    _contentPrevButton: string;
    _contentNextButton: string;
    _pageClasses: string[];
    _visItems: HTMLElement[] | [];
    _nextButton: HTMLLIElement;
    _prevButton: HTMLLIElement;
    /**
     * Paginate class to create quick pagination
     * @param {object} {] object of options
     */
    constructor({ pagesTarget, itemsPerPage, itemsSelector, paginationSelector, pageDisplayProperty, nextPrevButtons, contentPrevButton, contentNextButton, pageClasses, amountOfPrevNextItems, }: QuickPaginationOptions);
    /**
     * init method to fire all methods
     */
    init(): void;
    /**
     * createPagination method calls methods to create the pagination elements
     * @returns {boolean} true
     */
    createPagination(): boolean;
    /**
     * Returns original items
     * @returns {HTMLElement[]}
     */
    getOriginalItems(): HTMLElement[];
    /**
     * getItems method returns all visible items
     * @returns {Array<HTMLElement>} this._visItems
     */
    getItems(): HTMLElement[];
    /**
     * createChunks method creates chunks of the visible items, per this._perPage
     * @returns {Array<HTMLElement[]>} this._chunks
     */
    createChunks(): Array<HTMLElement[]> | [];
    /**
     * createAnchorTag method creates anchor tag for the pagination list item
     * @param {string} i
     * @param {boolean} datapageanchortag add data-page-anchor-tag
     * @returns {HTMLAnchorElement} anchorTag
     */
    createAnchorTag(i: string, datapageanchortag: boolean): HTMLAnchorElement;
    /**
     * createListItem method creates list item element, with anchor tag
     * @param {string} i
     * @param {boolean} datapageanchortag add data-page-anchor-tag
     * @returns {HTMLLIElement} numPage
     */
    createListItem(i: string, datapageanchortag: boolean): HTMLLIElement;
    /**
     * createEmptyListItem method creates empty list item element, with empty anchor tag
     * @returns {HTMLLIElement} noPage
     */
    createEmptyListItem(): HTMLLIElement;
    /**
     * createPageNav method creates a <ol> element with a link for every chunk, empties the paginationElement and places the new pagination
     * @returns {HTMLOListElement} numList
     */
    createPageNav(): HTMLOListElement | void;
    /**
     * createPage method creates a page for every chunk
     * @param {number} i
     * @returns {HTMLDivElement} page
     */
    createPage(i: number): HTMLDivElement;
    /**
     * appendPages method appends pages to the pagesTarget div
     * @returns {HTMLElement} this._pagesTarget
     */
    appendPages(): HTMLElement | null;
    /**
     * hideAllPages method hides all generated pages within scope
     */
    hideAllPages(): void;
    /**
     * removeActiveLinks removes all active pagination links
     */
    removeActiveLinks(): void;
    /**
     * showPage method to show the right page based on the
     * @param {HTMLElement} anchor
     * @param {number} index
     */
    showPage(anchor: HTMLElement, index: number): void;
    /**
     * addClickEvents method to append click events to paginators and forces check previous and next button if active
     */
    addClickEvents(): void;
    /**
     * setContentAndIdForListItem sets the content for previous and next button defaults to Previous and Next
     * @param {HTMLLIElement} item
     * @returns {HTMLLIElement} item
     */
    setContentAndIdForListItem(item: HTMLLIElement, nextOrPrev: 'next' | 'prev'): HTMLLIElement;
    /**
     * enableListItem enables disabled buttons
     */
    enableListItem(): void;
    /**
     * disableListItem adds disabled class to page list item
     * @param {HTMLLIElement} item
     * @returns {HTMLLIElement} item
     */
    disableListItem(item: HTMLLIElement): HTMLLIElement;
    /**
     * canClickNextPrev method checks wether next and previous button can be clicked
     * @param {number} index
     * @returns {boolean}
     */
    canClickNextPrev(index: number): boolean;
    /**
     * checkCanClinkNextPrev methods tries if next or prev button can be clicked or not (canClickNextPrev), in that case, fires disableListItem
     */
    checkCanClickNextPrev(): void;
    /**
     * createNextPrev methods creates the next and previous buttons and appends/prepends them
     */
    createNextPrev(): void;
    /**
     * calculateInReach method calculates wether given index is in the range of amount of next and prev items
     * @param {number} index
     * @returns {boolean} true/false
     */
    calculateInReach(index: number): boolean;
    /**
     * Shows all page item elements
     */
    showAllPaginationElements(): void;
    /**
     * removeAllDotElements removes all empty page links, to reset its state
     */
    removeAllDotElements(): void;
    /**
     * replaceElementsWithDots method hides all pagination elements that should not be visible and fires event to remove and add dotElements
     * @param {array} numsBefore
     * @param {array} numsAfter
     */
    replaceElementsWithDots(numsBefore: Array<any>, numsAfter: Array<any>): void;
    /**
     * replaceNumbersWithDots method replaces pagination items with dots
     */
    replaceNumbersWithDots(): void;
}
