declare class QuickFilter {
    _itemsSelector: string;
    _filterCheckboxInputs: string[] | undefined;
    _filterSelectInputs: string[] | undefined;
    _filterTextInputs: string[] | undefined;
    _filterRangeInputs: string[] | undefined;
    _filterRadioInputs: string[] | undefined;
    _filterStartTextInputs: string[] | undefined;
    _resultNumberSelector: string | undefined;
    _noResultMessage: string | null;
    _showDisplayProperty: CssDisplayProperty;
    _hideDisplayProperty: CssDisplayProperty;
    _callBackFunction: ((arg0: QuickFilter) => void) | undefined;
    _modifySelectedFunction: ((object: QuickFilterObject) => QuickFilterObject) | undefined;
    _itemsScope: Document | Element | null;
    _allResults: NodeListOf<HTMLElement> | undefined;
    _noResult: HTMLElement | null;
    _counterElement: HTMLElement | null;
    _showCounter: number;
    _allInputs: NodeListOf<HTMLInputElement> | NodeListOf<HTMLSelectElement> | null;
    _allDataSets: DOMStringMap[] | undefined;
    _allFilters: QuickFilterObject;
    _keyupDebounce: number;
    _allShown: HTMLElement[];
    constructor({ itemsSelector, elementSelector, filterCheckboxInputs, filterSelectInputs, filterTextInputs, filterRangeInputs, filterRadioInputs, filterStartTextInputs, resultNumberSelector, noResultMessage, showDisplayProperty, hideDisplayProperty, callBackFunction, modifySelectedFunction, itemsScope, keyupDebounce, }: QuickFilterOptions);
    /**
     * Debounces input events, to prevent firing on every single keystroke
     * @param {function} callback
     * @param {number} time
     * @returns {function}
     */
    debounce: (callback: DebounceEventCallback, time: number) => DebounceExecutable;
    /**
     * Return all data attributtes in array
     * @returns {DOMStringMap[]}
     */
    getAllDataSets(): DOMStringMap[];
    showAll(): void;
    hideAll(): void;
    showNoResultMessage(): void;
    showThisItem(index: string | number): void;
    textStartsWithFilter(key: QuickFilterObjectKey, value: string | undefined): boolean;
    textFilter(key: QuickFilterObjectKey, value: string | undefined): boolean;
    rangeFilter(key: QuickFilterObjectKey, value: string | undefined): boolean;
    checkSelect(key: QuickFilterObjectKey, value: string | undefined): boolean;
    checkFilter(key: QuickFilterObjectKey, value: string | undefined): boolean;
    radioFilter(key: QuickFilterObjectKey, value: string | undefined): boolean;
    filterFunction(): void;
    showAmountResults(): number;
    checkIfAllEmpty(): boolean;
    getAllSelectedFilters(): void;
    inputCallback(): void;
}

declare class QuickFilterCounter {
    _enableOnInputs: boolean;
    _enableOnSelects: boolean;
    _counterClass: string;
    _QuickFilterClass: QuickFilter;
    _allFilters: QuickFilterObject;
    _oldFilters: QuickFilterObject;
    _allInputs: NodeListOf<HTMLInputElement> | NodeListOf<HTMLSelectElement> | null;
    _allResults: NodeListOf<HTMLElement> | undefined;
    _allShown: HTMLElement[];
    _removeCounterFromSelected: boolean;
    constructor({ enableOnInputs, enableOnSelects, counterClass, removeCounterFromSelected, }: QuickFilterCounterOptions);
    init(QuickFilterClass: QuickFilter): void;
    resultsWhenCheckedSelect(select: HTMLSelectElement, option: HTMLOptionElement): number;
    resultsWhenChecked(input: HTMLInputElement): number;
    getLabelByElement(input: HTMLInputElement): HTMLLabelElement | null;
    createCounterElementHTML(results: number): HTMLSpanElement;
    createCountElementOption(option: HTMLOptionElement, results: number): void;
    createCounterElement(label: HTMLLabelElement | null, results: number): void;
    removeOldCounter(element: HTMLLabelElement | HTMLOptionElement | null): void;
}

declare class QuickPagination {
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
    private insertAfter;
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
     * @returns {boolean}
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

declare class QuickSorting {
    _elements: NodeListOf<HTMLElement>;
    _sortSelect: HTMLSelectElement | null;
    _parentElement: HTMLElement | null;
    _callBackFunction: (() => void) | undefined;
    _selectedValue: QuickSortingSelected;
    constructor({ elementsSelector, sortSelectSelector, parentElement, callBackFunction, }: QuickSortingOptions);
    /**
     * Initialize quicksorting, use this function to sort all
     */
    init(): void;
    /**
     * Append event listener to select element, and fire init function when changed
     */
    appendEvent(): void;
    /**
     * Method gets selected values from the select html element
     * @returns {QuickSortingSelected} this._selectedValue object of selected value
     */
    getSelectedValue(): QuickSortingSelected;
    /**
     * Sorts items by the given selected order and key.
     * @returns {array} this.elements sorted
     */
    sort(): Array<any>;
}

type QuickFilterCounterOptions = {
  enableOnInputs: boolean;
  enableOnSelects: boolean;
  counterClass: string;
  QuickFilterClass: QuickFilter;
  removeCounterFromSelected: boolean;
};

type CssDisplayProperty =
  | 'block'
  | 'inline'
  | 'inline-block'
  | 'flex'
  | 'inline-flex'
  | 'grid'
  | 'inline-grid'
  | 'flow-root'
  | 'none'
  | 'contents'
  | 'table'
  | 'table-row'
  | 'list-item'
  | 'inherit'
  | 'initial'
  | 'revert'
  | 'revert-layer'
  | 'unset';

interface QuickFilterOptions {
  itemsSelector: string;
  elementSelector: string | undefined;
  filterCheckboxInputs: string[] | undefined;
  filterSelectInputs: string[] | undefined;
  filterTextInputs: string[] | undefined;
  filterRangeInputs: string[] | undefined;
  filterRadioInputs: string[] | undefined;
  filterStartTextInputs: string[] | undefined;
  resultNumberSelector: string | undefined;
  noResultMessage: string | undefined;
  showDisplayProperty: CssDisplayProperty;
  hideDisplayProperty: CssDisplayProperty;
  callBackFunction: ((arg0: QuickFilter) => void) | undefined;
  modifySelectedFunction: ((object: QuickFilterObject) => QuickFilterObject) | null;
  itemsScope: string | null | Document;
  keyupDebounce: number;
}

type QuickFilterValue = string[] | null;
type QuickFilterObjectKey = string;

type DebounceEventCallback = () => void;
type DebounceExecutable = () => void;

type QuickFilterObject = {
  [key: QuickFilterObjectKey]: QuickFilterValue;
};

type QuickSortingOrder = 'ASC' | 'DESC' | null;
type QuickSortingType = 'CHAR' | 'NUM' | null;
type QuickSortingSelected = {
  key: 'random' | string;
  order: QuickSortingOrder;
  type: QuickSortingType;
};

type QuickSortingOptions = {
  elementsSelector: string;
  sortSelectSelector: string;
  parentElement: null | string;
  callBackFunction: undefined | (() => void);
};

interface QuickPaginationOptions {
  pagesTarget: string | null;
  itemsPerPage: number;
  itemsSelector: string;
  paginationSelector: string;
  pageDisplayProperty: CssDisplayProperty;
  nextPrevButtons: boolean;
  contentPrevButton: string;
  contentNextButton: string;
  pageClasses: string[];
  amountOfPrevNextItems: number;
}

export { CssDisplayProperty, DebounceEventCallback, DebounceExecutable, QuickFilter, QuickFilterCounter, QuickFilterCounterOptions, QuickFilterObject, QuickFilterObjectKey, QuickFilterOptions, QuickFilterValue, QuickPagination, QuickPaginationOptions, QuickSorting, QuickSortingOptions, QuickSortingOrder, QuickSortingSelected, QuickSortingType };
