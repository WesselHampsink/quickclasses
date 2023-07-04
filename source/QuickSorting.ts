import { QuickSortingOptions, QuickSortingOrder, QuickSortingSelected, QuickSortingType } from './index';

export default class QuickSorting {
  _elements: NodeListOf<HTMLElement>;
  _sortSelect!: HTMLSelectElement | null;
  _parentElement!: HTMLElement | null;
  _callBackFunction: (() => void) | undefined;
  _selectedValue!: QuickSortingSelected;
  constructor({
    itemsSelector = '[data-index]',
    elementsSelector = '[data-index]',
    sortSelectSelector = 'select[name="sort"]',
    parentElement = null,
    callBackFunction = undefined,
  }: QuickSortingOptions) {
    this._elements = document.querySelectorAll(itemsSelector)
      ? document.querySelectorAll(itemsSelector)
      : document.querySelectorAll(elementsSelector);
    if (this._elements === null) return;
    this._sortSelect = document.querySelector(sortSelectSelector);
    if (this._sortSelect === null) return;
    if (parentElement === null && this._elements[0]?.parentElement !== undefined) {
      this._parentElement = this._elements[0].parentElement;
    } else if (parentElement !== null) {
      this._parentElement = document.querySelector(parentElement);
    }
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
    if (typeof this._callBackFunction !== 'undefined') {
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
    if (this._elements instanceof NodeList) {
      return Array.from(this._elements).sort((a, b) => {
        if (!(a instanceof HTMLElement && b instanceof HTMLElement)) return 0;
        if (searchKey === 'random') {
          return 0.5 - Math.random();
        }
        const aData = a.dataset?.[searchKey];
        const bData = b.dataset?.[searchKey];
        if (aData === undefined || bData === undefined) return 0;
        if (type === 'CHAR') {
          if (sortOrder === 'ASC') {
            return aData.localeCompare(bData);
          } else {
            if (!a.dataset || !b.dataset) return 0;
            return bData.localeCompare(aData);
          }
        } else if (type === 'NUM') {
          if (sortOrder === 'ASC') {
            return parseFloat(aData) - parseFloat(bData);
          } else {
            return parseFloat(bData) - parseFloat(aData);
          }
        }
        return 0;
      });
    }
    return [];
  }
}
