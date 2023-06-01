declare class QuickFilter {
    _elementSelector: string;
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
    _itemsScope: Document | HTMLElement | null;
    _allResults: NodeListOf<HTMLElement> | undefined;
    _noResult: HTMLElement | null;
    _counterElement: HTMLElement | null;
    _showCounter: number;
    _allInputs: NodeListOf<HTMLInputElement> | NodeListOf<HTMLSelectElement> | null;
    _allDataSets: DOMStringMap[] | undefined;
    _allFilters: QuickFilterObject;
    _keyupDebounce: number;
    _allShown: HTMLElement[];
    constructor({ elementSelector, filterCheckboxInputs, filterSelectInputs, filterTextInputs, filterRangeInputs, filterRadioInputs, filterStartTextInputs, resultNumberSelector, noResultMessage, showDisplayProperty, hideDisplayProperty, callBackFunction, modifySelectedFunction, itemsScope, keyupDebounce, }: QuickFilterOptions);
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
  elementSelector: string;
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
  itemsScope: string | null;
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
  pagesTarget: string;
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

export { CssDisplayProperty, DebounceEventCallback, DebounceExecutable, QuickFilterCounterOptions, QuickFilterObject, QuickFilterObjectKey, QuickFilterOptions, QuickFilterValue, QuickPaginationOptions, QuickSortingOptions, QuickSortingOrder, QuickSortingSelected, QuickSortingType };
