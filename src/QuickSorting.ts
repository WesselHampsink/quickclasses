/* Class that can sort items based on a given dropdown option */
type QuickSortingOrder = 'ASC' | 'DESC' | null;
type QuickSortingType = 'CHAR' | 'NUM' | null;
type QuickSortingSelected = {
  key: 'random' | string;
  order: QuickSortingOrder;
  type: QuickSortingType;
}

class QuickSorting {
  _elements: NodeListOf<HTMLElement>;
  _sortSelect: HTMLSelectElement;
  _parentElement: HTMLElement;
  _callBackFunction: (() =>  void) | undefined;
  _selectedValue: QuickSortingSelected;
  constructor({
      elementsSelector = '[data-index]',
      sortSelectSelector = 'select[name="sort"]',
      parentElement = null,
      callBackFunction = undefined
  }) {
      this._elements = document.querySelectorAll(elementsSelector);
      if (this._elements === null) return;
      this._sortSelect = document.querySelector(sortSelectSelector);
      if (this._sortSelect === null) return;
      this._parentElement = document.querySelector(parentElement);
      if (this._parentElement === null) this._parentElement === this._elements[0].parentElement;
      this._callBackFunction = callBackFunction;
      this.appendEvent();
      this._selectedValue = {
          key: this._sortSelect.options[this._sortSelect.selectedIndex].dataset.key,
          order: this._sortSelect.options[this._sortSelect.selectedIndex].dataset?.order as QuickSortingOrder,
          type: this._sortSelect.options[this._sortSelect.selectedIndex].dataset?.type as QuickSortingType,
      }
  }
  /**
   * Initialize quicksorting, use this function to sort all
   */
  init() {
      this.getSelectedValue();
      this._parentElement.innerHTML = '';
      this.sort().forEach(ele => {
          this._parentElement.appendChild(ele);
      })
      if (this._callBackFunction !== null) {
          this._callBackFunction();
      }
  }
  /**
   * Append event listener to select element, and fire init function when changed
   */
  appendEvent() {
      this._sortSelect.addEventListener('change', () => {
          this.init();
      })
  }
  /**
   * Method gets selected values from the select element
   * @returns {QuickSortingSelected} this._selectedValue object of selected value
   */
  getSelectedValue(): QuickSortingSelected {
      return this._selectedValue = {
          key: this._sortSelect.options[this._sortSelect.selectedIndex].dataset.key,
          order: this._sortSelect.options[this._sortSelect.selectedIndex].dataset?.order as QuickSortingOrder,
          type: this._sortSelect.options[this._sortSelect.selectedIndex].dataset?.type as QuickSortingType,
      }
  }
  /**
   * Sorts items by the given selected order and key.
   * @returns {array} this.elements sorted
   */
  sort(): Array<any> {
      let searchKey = this._selectedValue.key;
      let sortOrder = this._selectedValue.order;
      let type = this._selectedValue.type;
      return [...this._elements].sort((a, b) => {
          if (searchKey === 'random') {
              return .5 - Math.random();
          }
          if (type === 'CHAR') {
              if (sortOrder === 'ASC') {
                  return a.dataset[searchKey].localeCompare(b.dataset[searchKey]);
              } else {
                  return b.dataset[searchKey].localeCompare(a.dataset[searchKey]);
              }
          } else if (type === 'NUM') {
              if (sortOrder === 'ASC') {
                  return parseFloat(a.dataset[searchKey]) - parseFloat(b.dataset[searchKey]);
              } else {
                  return parseFloat(b.dataset[searchKey]) - parseFloat(a.dataset[searchKey]);
              }
          }
      })
  }
}