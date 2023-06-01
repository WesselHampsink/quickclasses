import { QuickSortingOptions, QuickSortingSelected } from 'source';
export default class QuickSorting {
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
     * Method gets selected values from the select element
     * @returns {QuickSortingSelected} this._selectedValue object of selected value
     */
    getSelectedValue(): QuickSortingSelected;
    /**
     * Sorts items by the given selected order and key.
     * @returns {array} this.elements sorted
     */
    sort(): Array<any>;
}
