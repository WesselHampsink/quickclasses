import {
  CssDisplayProperty,
  DebounceEventCallback,
  DebounceExecutable,
  QuickFilterObject,
  QuickFilterObjectKey,
  QuickFilterOptions,
} from './index';

class QuickFilter {
  _itemsSelector: string;
  _filterCheckboxInputs: string[] | undefined;
  _filterSelectInputs: string[] | undefined;
  _filterTextInputs: string[] | undefined;
  _filterRangeInputs: string[] | undefined;
  _filterRadioInputs: string[] | undefined;
  _filterStartTextInputs: string[] | undefined;
  _resultNumberSelector!: string | undefined;
  _noResultMessage!: string | null;
  _showDisplayProperty: CssDisplayProperty;
  _hideDisplayProperty: CssDisplayProperty;
  _callBackFunction!: ((arg0: QuickFilter) => void) | undefined;
  _modifySelectedFunction: ((object: QuickFilterObject) => QuickFilterObject) | undefined;
  _itemsScope!: Document | Element | null;
  _allResults: NodeListOf<HTMLElement> | undefined;
  _noResult!: HTMLElement | null;
  _counterElement: HTMLElement | null;
  _showCounter!: number;
  _allInputs!: NodeListOf<HTMLInputElement> | NodeListOf<HTMLSelectElement> | null;
  _allDataSets: DOMStringMap[] | undefined;
  _allFilters: QuickFilterObject;
  _keyupDebounce!: number;
  _allShown: HTMLElement[] = [];

  constructor({
    itemsSelector = '[data-index]',
    elementSelector = '[data-index]',
    filterCheckboxInputs = undefined,
    filterSelectInputs = undefined,
    filterTextInputs = undefined,
    filterRangeInputs = undefined,
    filterRadioInputs = undefined,
    filterStartTextInputs = undefined,
    resultNumberSelector = undefined,
    noResultMessage,
    showDisplayProperty = 'block' as CssDisplayProperty,
    hideDisplayProperty = 'none' as CssDisplayProperty,
    callBackFunction = undefined,
    modifySelectedFunction,
    itemsScope = document,
    keyupDebounce = 200,
  }: QuickFilterOptions) {
    this._allFilters = {};
    this._itemsSelector = itemsSelector ? itemsSelector : elementSelector;
    /* Set display property of hide and visible defaults to none and block : string */
    this._showDisplayProperty = showDisplayProperty;
    this._hideDisplayProperty = hideDisplayProperty;
    /* Element that displays amount of visible results defaults to null : element */
    this._counterElement = null;
    if (typeof resultNumberSelector !== 'undefined') {
      this._counterElement = document.querySelector(resultNumberSelector) || null;
    }
    this._itemsScope = typeof itemsScope === 'string' ? document.querySelector(itemsScope) : itemsScope;
    this._allResults = this._itemsScope?.querySelectorAll(this._itemsSelector);
    if (this._allResults?.length === 0 || this._allResults === undefined) return;
    if (itemsScope === document || itemsScope === null) {
      this._itemsScope = this._allResults[0]?.parentNode as HTMLElement;
    }
    if (typeof this._itemsScope === 'undefined') return;
    /* Element to display when no element meets the filter criteria defaults to null : element */
    if (noResultMessage) {
      this._noResultMessage = noResultMessage;
    }
    /* Set visible counter to number of result elements : int */
    this._showCounter = Number(this._allResults?.length);
    /* Get all filterable inputs/selectors in scope : nodelist */
    this._allInputs =
      <NodeListOf<HTMLInputElement> | NodeListOf<HTMLSelectElement>>(
        document.querySelectorAll('[data-filter]')
      ) ?? null;
    /* Filterable input element which type is checkbox : array */
    if (typeof filterCheckboxInputs !== 'undefined') {
      this._filterCheckboxInputs = filterCheckboxInputs;
    }
    /* Filterable select element which type is select : array */
    if (typeof filterSelectInputs !== 'undefined') {
      this._filterSelectInputs = filterSelectInputs;
    }
    /* Filterable select element which type is text and filters by startsWith : array */
    if (typeof filterStartTextInputs !== 'undefined') {
      this._filterStartTextInputs = filterStartTextInputs;
    }
    /* Filterable inputs which type is text : array */
    if (typeof filterTextInputs !== 'undefined') {
      this._filterTextInputs = filterTextInputs;
    }
    /* Filterable inputs which type is range : array */
    if (typeof filterRangeInputs !== 'undefined') {
      this._filterRangeInputs = filterRangeInputs;
    }
    /* Filterable inputs which type is checkbox : array */
    if (typeof filterRadioInputs !== 'undefined') {
      this._filterRadioInputs = filterRadioInputs;
    }
    /* Callback function after filter is done */
    this._callBackFunction = callBackFunction;
    /* Callback function before filter is fired */
    if (typeof modifySelectedFunction !== 'undefined' && modifySelectedFunction !== null) {
      this._modifySelectedFunction = modifySelectedFunction;
    }
    this._keyupDebounce = keyupDebounce;
    /* Scope in which results should be found, equals to document */
    /* Trigger event when checkbox or input has changed */
    this.inputCallback = this.inputCallback.bind(this);
    this._allInputs.forEach((input: HTMLInputElement | HTMLSelectElement) => {
      if (input instanceof HTMLInputElement && (input.type === 'text' || input.type === 'search')) {
        input.addEventListener('keyup', this.debounce(this.inputCallback, this._keyupDebounce));
      } else {
        input.addEventListener('change', () => {
          this.inputCallback();
        });
      }
    });
    this.getAllDataSets();
    this.showAmountResults();
    this.inputCallback();
  }

  /**
   * Debounces input events, to prevent firing on every single keystroke
   * @param {function} callback
   * @param {number} time
   * @returns {function}
   */
  debounce = (callback: DebounceEventCallback, time: number): DebounceExecutable => {
    let debounceTimer: number;
    return () => {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(callback.bind(null), time);
    };
  };

  /**
   * Return all data attributtes in array
   * @returns {DOMStringMap[]}
   */
  getAllDataSets(): DOMStringMap[] {
    this._allDataSets = new Array();
    this._allResults?.forEach((resultElement) => {
      this._allDataSets?.push(Object.assign({}, resultElement?.dataset));
    });
    return this._allDataSets;
  }

  /* Show all filterable elements */
  showAll() {
    this._allResults?.forEach((resultElement) => (resultElement.style.display = this._showDisplayProperty));
    this._showCounter = this._allResults?.length ?? 0;
  }

  /* Hide all filterable elements */
  hideAll() {
    if (this._noResult != null) {
      this._noResult.style.display = this._hideDisplayProperty;
    }
    this._allResults?.forEach((resultElement) => (resultElement.style.display = this._hideDisplayProperty));
    this._showCounter = 0;
  }

  /* Show no result messag */
  showNoResultMessage() {
    if (this._noResult === null) return;
    this._noResult.style.display = this._showDisplayProperty;
  }

  /* Show item by index */
  showThisItem(index: string | number) {
    let showThis = this._itemsScope?.querySelector(`[data-index="${index}"]`);
    if (showThis instanceof HTMLElement) {
      showThis.style.display = this._showDisplayProperty;
      this._allShown.push(showThis);
    }
    this._showCounter++;
  }

  /* Function to return true or false for input type text if value starts with search */
  textStartsWithFilter(key: QuickFilterObjectKey, value: string | undefined): boolean {
    if (value === undefined || value === '') return false;
    let searchString = this._allFilters[key]?.toString().toLowerCase();
    let lowerValue = value.toLowerCase();
    return searchString && lowerValue.startsWith(searchString) ? true : false;
  }

  /* Function to return true or false for input type text */
  textFilter(key: QuickFilterObjectKey, value: string | undefined): boolean {
    if (value === undefined || value === '') return false;
    let searchString = this._allFilters[key]?.toString().toLowerCase();
    let lowerValue = value.toLowerCase();
    return searchString && lowerValue.indexOf(searchString) === -1 ? false : true;
  }

  /* Function to return true or false for input type range */
  rangeFilter(key: QuickFilterObjectKey, value: string | undefined): boolean {
    if (value === undefined || value === '') return false;
    let minValue = parseFloat(this._allFilters?.[key]?.[0] || '0');
    let maxValue = parseFloat(this._allFilters?.[key]?.[1] || '0');
    if (value.indexOf(',') > -1) {
      let values = value.split(',');
      let maximValue = parseFloat(values[1] ?? '0');
      let minimValue = parseFloat(values[0] ?? '1');
      return maximValue <= maxValue && minimValue >= minValue ? true : false;
    }
    return parseFloat(value) >= minValue && parseFloat(value) <= maxValue ? true : false;
  }

  /* Function that returns true or false for select html elements */
  checkSelect(key: QuickFilterObjectKey, value: string | undefined): boolean {
    if (value === undefined || value === '') return false;
    /* Check if value contains multiple values (for multi select) */
    const checkboxValues = this._allFilters[key];
    if (value?.indexOf(',') !== -1 && Array.isArray(checkboxValues)) {
      return checkboxValues.some((item) => value?.split(',').indexOf(item) !== -1);
    }
    return checkboxValues !== null || checkboxValues === undefined ? checkboxValues?.[0] === value : false;
  }

  /* Function that returns true or false for input type checkbox or select elements */
  checkFilter(key: QuickFilterObjectKey, value: string | undefined): boolean {
    if (!value || value === '') return false;
    let searchString = this._allFilters[key]?.toString().toLowerCase();
    if (searchString) {
      let searchArray = searchString.split(',');
      let lowerValue = value.toLowerCase();
      let returns = searchArray.some((search) => lowerValue.indexOf(search) !== -1);
      return returns;
    }
    return false;
  }

  /* Function that returns true or false for input type radio or select elements */
  radioFilter(key: QuickFilterObjectKey, value: string | undefined): boolean {
    if (value === undefined || value === '') return false;
    if (value.indexOf(',') !== -1) {
      const values = value.split(',');
      return values.some((value) => value === this._allFilters?.[key]?.[0]);
    }
    return this._allFilters?.[key]?.[0] === value;
  }

  /* Function to filter elements by using their datasets and selected values */
  filterFunction() {
    /* Hide all elements */
    this._allShown = [];
    this.hideAll();
    this._allDataSets?.forEach((dataSet) => {
      /* Set flag for should hide element to false */
      let shouldShow: { [key: string]: boolean } = {};
      for (let key of Object.keys(this._allFilters)) {
        shouldShow[key] = true;
      }
      for (let key of Object.keys(this._allFilters)) {
        if (this._allFilters[key] === null) continue;
        if (this._filterCheckboxInputs instanceof Array && this._filterCheckboxInputs.indexOf(key) !== -1) {
          shouldShow[key] = this.checkFilter(key, dataSet[key]);
        } else if (
          this._filterSelectInputs instanceof Array &&
          this._filterSelectInputs.indexOf(key) !== -1
        ) {
          shouldShow[key] = this.checkSelect(key, dataSet[key]);
        } else if (
          this._filterStartTextInputs instanceof Array &&
          this._filterStartTextInputs.indexOf(key) !== -1
        ) {
          shouldShow[key] = this.textStartsWithFilter(key, dataSet[key]);
        } else if (this._filterTextInputs instanceof Array && this._filterTextInputs.indexOf(key) !== -1) {
          shouldShow[key] = this.textFilter(key, dataSet[key]);
        } else if (this._filterRadioInputs instanceof Array && this._filterRadioInputs.indexOf(key) !== -1) {
          shouldShow[key] = this.radioFilter(key, dataSet[key]);
        } else if (this._filterRangeInputs instanceof Array && this._filterRangeInputs.indexOf(key) !== -1) {
          if (
            this._allFilters?.[key]?.[0] == this._allFilters?.[key]?.[2] &&
            this._allFilters?.[key]?.[1] == this._allFilters?.[key]?.[3]
          )
            continue;
          shouldShow[key] = this.rangeFilter(key, dataSet[key]);
        }
      }
      if (Object.keys(shouldShow).every((key) => shouldShow[key])) {
        this.showThisItem(Number(dataSet.index));
      }
    });
  }

  showAmountResults(): number {
    if (this._counterElement === null || typeof this._counterElement === 'undefined') return 0;
    this._counterElement.textContent = `${this._showCounter}`;
    return this._showCounter;
  }

  /* Check if all inputs are empty, if so, show all results */
  checkIfAllEmpty(): boolean {
    const isEmpty = Object.keys(this._allFilters).every(
      (key) => this._allFilters[key] === null || this._allFilters?.[key]?.[0] === '',
    );
    if (isEmpty) {
      this.showAll();
      return true;
    } else {
      return false;
    }
  }

  /* Method to get all selected filters */
  getAllSelectedFilters() {
    this._allFilters = {};
    this._allInputs?.forEach((input: HTMLInputElement | HTMLSelectElement | null) => {
      if (input?.dataset?.filter) {
        this._allFilters[input?.dataset?.filter] = null;
      }
    });
  }

  /* Input change function callback */
  inputCallback() {
    /* Grab all selected values */
    this.getAllSelectedFilters();
    this._allInputs?.forEach((input: HTMLInputElement | HTMLSelectElement) => {
      if (input.value == undefined || input.value == null || input.value == '') return;
      if (input instanceof HTMLInputElement && input.type === 'checkbox' && !input.checked) return;
      let filterKey = input?.dataset?.filter;
      if (filterKey) {
        if (this._allFilters[filterKey] === null) {
          this._allFilters[filterKey] = [];
        }
        if (
          (input.type === 'radio' || input.type === 'RADIO') &&
          this._filterRadioInputs?.indexOf(filterKey) !== -1
        ) {
          if (input instanceof HTMLInputElement && input.checked === true) {
            if (this._allFilters[filterKey] === null) {
              this._allFilters[filterKey] = [input.value];
            } else if (this._allFilters[filterKey] instanceof Array) {
              this._allFilters[filterKey]?.push(input.value);
            }
          }
        } else if (input?.multiple && (input.tagName === 'select' || input.tagName === 'SELECT')) {
          let multiSelectValues = Array.from(
            input.querySelectorAll('option:checked') as NodeListOf<HTMLOptionElement>,
          ).map((el) => el.value);
          this._allFilters[filterKey]?.push(...multiSelectValues);
        } else if (
          input instanceof HTMLInputElement &&
          input.multiple &&
          (input.type === 'range' || input.type === 'RANGE')
        ) {
          if (input.classList.contains('ghost')) return;
          this._allFilters[filterKey]?.push(...input.value.split(','));
          this._allFilters[filterKey]?.push(input.min);
          this._allFilters[filterKey]?.push(input.max);
        } else {
          this._allFilters[filterKey]?.push(input.value);
        }
        if (this._filterRadioInputs?.indexOf(filterKey) !== -1 && this._allFilters[filterKey]?.length == 0) {
          this._allFilters[filterKey] = null;
        }
      }
    });
    /* Fire prefilterfunction before filters happen */
    if (typeof this._modifySelectedFunction !== 'undefined') {
      this._allFilters = this._modifySelectedFunction(this._allFilters);
    }
    /* Some filter is selected, so perform the filter actions */
    this.filterFunction();
    if (this._showCounter === 0 && !this.checkIfAllEmpty()) {
      this.showNoResultMessage();
    }
    this.showAmountResults();
    if (this._callBackFunction !== null && typeof this._callBackFunction !== 'undefined') {
      this._callBackFunction(this);
    }
  }
}

export default QuickFilter;
