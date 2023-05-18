import { QuickSortingOptions, QuickSortingOrder, QuickSortingSelected, QuickSortingType } from './index';

export default class QuickSorting {
  _elements: NodeListOf<HTMLElement>;
  _sortSelect!: HTMLSelectElement | null;
  _parentElement!: HTMLElement | null;
  _callBackFunction: (() => void) | undefined;
  _selectedValue!: QuickSortingSelected;
  constructor({
    elementsSelector = '[data-index]',
    sortSelectSelector = 'select[name="sort"]',
    parentElement = null,
    callBackFunction = undefined,
  }: QuickSortingOptions) {
    this._elements = document.querySelectorAll(elementsSelector);
    if (this._elements === null) return;
    this._sortSelect = document.querySelector(sortSelectSelector);
    if (this._sortSelect === null) return;
    if (parentElement === null) return;
    this._parentElement = document.querySelector(parentElement);
    if (this._parentElement === null && this._elements[0]?.parentElement !== undefined)
      this._parentElement = this._elements[0].parentElement;
    this._callBackFunction = callBackFunction;
    this.appendEvent();
    this._selectedValue = {
      key: this._sortSelect.options[this._sortSelect.selectedIndex]?.dataset?.key || 'random',
      order: this._sortSelect.options[this._sortSelect.selectedIndex]?.dataset?.order as QuickSortingOrder,
      type: this._sortSelect.options[this._sortSelect.selectedIndex]?.dataset?.type as QuickSortingType,
    };
  }
  /**
   * Initialize quicksorting, use this function to sort all
   */
  init() {
    this.getSelectedValue();
    if (this._parentElement instanceof HTMLElement) {
      this._parentElement.innerHTML = '';
      this.sort().forEach((ele) => {
        this._parentElement?.appendChild(ele);
      });
    }
    if (this._callBackFunction !== undefined) {
      this._callBackFunction();
    }
  }
  /**
   * Append event listener to select element, and fire init function when changed
   */
  appendEvent() {
    this._sortSelect?.addEventListener('change', () => {
      this.init();
    });
  }
  /**
   * Method gets selected values from the select html element
   * @returns {QuickSortingSelected} this._selectedValue object of selected value
   */
  getSelectedValue(): QuickSortingSelected {
    return (this._selectedValue = {
      key: this._sortSelect?.options[this._sortSelect?.selectedIndex]?.dataset.key || 'random',
      order: this._sortSelect?.options[this._sortSelect?.selectedIndex]?.dataset?.order as QuickSortingOrder,
      type: this._sortSelect?.options[this._sortSelect?.selectedIndex]?.dataset?.type as QuickSortingType,
    });
  }
  /**
   * Sorts items by the given selected order and key.
   * @returns {array} this.elements sorted
   */
  sort(): Array<any> {
    let searchKey = this._selectedValue.key;
    let sortOrder = this._selectedValue.order;
    let type = this._selectedValue.type;
    if (this._elements instanceof Array) {
      return Array.from(this._elements).sort((a, b) => {
        if (searchKey === 'random') {
          return 0.5 - Math.random();
        }
        if (type === 'CHAR') {
          if (sortOrder === 'ASC') {
            return a.dataset?.[searchKey].localeCompare(b.dataset?.[searchKey]);
          } else {
            return b.dataset?.[searchKey].localeCompare(a.dataset?.[searchKey]);
          }
        } else if (type === 'NUM') {
          if (sortOrder === 'ASC') {
            return parseFloat(a.dataset?.[searchKey]) - parseFloat(b.dataset?.[searchKey]);
          } else {
            return parseFloat(b.dataset?.[searchKey]) - parseFloat(a.dataset?.[searchKey]);
          }
        }
      });
    }
    return [];
  }
}
