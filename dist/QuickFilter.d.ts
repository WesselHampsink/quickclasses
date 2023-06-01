import { CssDisplayProperty, DebounceEventCallback, DebounceExecutable, QuickFilterObject, QuickFilterObjectKey, QuickFilterOptions } from 'source';
export default class QuickFilter {
    _elementSelector: string;
    _filterCheckboxInputs: string[] | undefined;
    _filterSelectInputs: string[] | undefined;
    _filterTextInputs: string[] | undefined;
    _filterRangeInputs: string[] | undefined;
    _filterRadioInputs: string[] | undefined;
    _filterStartTextInputs: string[] | undefined;
    _resultNumberSelector: string | null;
    _noResultMessage: string | null;
    _showDisplayProperty: CssDisplayProperty;
    _hideDisplayProperty: CssDisplayProperty;
    _callBackFunction: ((arg0: QuickFilter) => void) | null;
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
