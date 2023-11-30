// source/QuickFilter.ts
var QuickFilter = class {
  constructor({
    itemsSelector = "[data-index]",
    elementSelector = "[data-index]",
    filterCheckboxInputs = void 0,
    filterSelectInputs = void 0,
    filterTextInputs = void 0,
    filterRangeInputs = void 0,
    filterRadioInputs = void 0,
    filterStartTextInputs = void 0,
    resultNumberSelector = void 0,
    noResultMessage = void 0,
    showDisplayProperty = "block",
    hideDisplayProperty = "none",
    callBackFunction = void 0,
    modifySelectedFunction,
    itemsScope = document,
    keyupDebounce = 200
  }) {
    this._allShown = [];
    /**
     * Debounces input events, to prevent firing on every single keystroke
     * @param {function} callback
     * @param {number} time
     * @returns {function}
     */
    this.debounce = (callback, time) => {
      let debounceTimer;
      return () => {
        window.clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(callback.bind(null), time);
      };
    };
    var _a, _b, _c, _d, _e, _f;
    this._allFilters = {};
    this._itemsSelector = itemsSelector ? itemsSelector : elementSelector;
    this._showDisplayProperty = showDisplayProperty;
    this._hideDisplayProperty = hideDisplayProperty;
    this._counterElement = null;
    if (typeof resultNumberSelector !== "undefined") {
      this._counterElement = document.querySelector(resultNumberSelector) || null;
    }
    this._itemsScope = typeof itemsScope === "string" ? document.querySelector(itemsScope) : itemsScope;
    this._allResults = (_a = this._itemsScope) == null ? void 0 : _a.querySelectorAll(this._itemsSelector);
    if (((_b = this._allResults) == null ? void 0 : _b.length) === 0 || this._allResults === void 0)
      return;
    if (itemsScope === document || itemsScope === null) {
      this._itemsScope = (_c = this._allResults[0]) == null ? void 0 : _c.parentNode;
    }
    if (typeof this._itemsScope === "undefined")
      return;
    if (noResultMessage) {
      this._noResult = ((_d = this._itemsScope) == null ? void 0 : _d.querySelector(noResultMessage)) || void 0;
    }
    this._showCounter = Number((_e = this._allResults) == null ? void 0 : _e.length);
    this._allInputs = (_f = document.querySelectorAll("[data-filter]")) != null ? _f : null;
    if (typeof filterCheckboxInputs !== "undefined") {
      this._filterCheckboxInputs = filterCheckboxInputs;
    }
    if (typeof filterSelectInputs !== "undefined") {
      this._filterSelectInputs = filterSelectInputs;
    }
    if (typeof filterStartTextInputs !== "undefined") {
      this._filterStartTextInputs = filterStartTextInputs;
    }
    if (typeof filterTextInputs !== "undefined") {
      this._filterTextInputs = filterTextInputs;
    }
    if (typeof filterRangeInputs !== "undefined") {
      this._filterRangeInputs = filterRangeInputs;
    }
    if (typeof filterRadioInputs !== "undefined") {
      this._filterRadioInputs = filterRadioInputs;
    }
    this._callBackFunction = callBackFunction;
    if (typeof modifySelectedFunction !== "undefined" && modifySelectedFunction !== null) {
      this._modifySelectedFunction = modifySelectedFunction;
    }
    this._keyupDebounce = keyupDebounce;
    this.inputCallback = this.inputCallback.bind(this);
    this._allInputs.forEach((input) => {
      if (input instanceof HTMLInputElement && (input.type === "text" || input.type === "search")) {
        input.addEventListener("keyup", this.debounce(this.inputCallback, this._keyupDebounce));
      } else {
        input.addEventListener("change", () => {
          this.inputCallback();
        });
      }
    });
    this.getAllDataSets();
    this.showAmountResults();
    this.inputCallback();
  }
  /**
   * Return all data attributtes in array
   * @returns {DOMStringMap[]}
   */
  getAllDataSets() {
    var _a;
    this._allDataSets = new Array();
    (_a = this._allResults) == null ? void 0 : _a.forEach((resultElement) => {
      var _a2;
      (_a2 = this._allDataSets) == null ? void 0 : _a2.push(Object.assign({}, resultElement == null ? void 0 : resultElement.dataset));
    });
    return this._allDataSets;
  }
  /* Show all filterable elements */
  showAll() {
    var _a, _b, _c;
    (_a = this._allResults) == null ? void 0 : _a.forEach((resultElement) => resultElement.style.display = this._showDisplayProperty);
    this._showCounter = (_c = (_b = this._allResults) == null ? void 0 : _b.length) != null ? _c : 0;
  }
  /* Hide all filterable elements */
  hideAll() {
    var _a;
    if (this._noResult !== void 0) {
      this._noResult.style.display = this._hideDisplayProperty;
    }
    (_a = this._allResults) == null ? void 0 : _a.forEach((resultElement) => resultElement.style.display = this._hideDisplayProperty);
    this._showCounter = 0;
  }
  /* Show no result messag */
  showNoResultMessage() {
    if (this._noResult === void 0)
      return;
    this._noResult.style.display = this._showDisplayProperty;
  }
  /* Show item by index */
  showThisItem(index) {
    var _a;
    let showThis = (_a = this._itemsScope) == null ? void 0 : _a.querySelector(`[data-index="${index}"]`);
    if (showThis instanceof HTMLElement) {
      showThis.style.display = this._showDisplayProperty;
      this._allShown.push(showThis);
    }
    this._showCounter++;
  }
  /* Function to return true or false for input type text if value starts with search */
  textStartsWithFilter(key, value) {
    var _a;
    if (value === void 0 || value === "")
      return false;
    let searchString = (_a = this._allFilters[key]) == null ? void 0 : _a.toString().toLowerCase();
    let lowerValue = value.toLowerCase();
    return searchString && lowerValue.startsWith(searchString) ? true : false;
  }
  /* Function to return true or false for input type text */
  textFilter(key, value) {
    var _a;
    if (value === void 0 || value === "")
      return false;
    let searchString = (_a = this._allFilters[key]) == null ? void 0 : _a.toString().toLowerCase();
    let lowerValue = value.toLowerCase();
    return searchString && lowerValue.indexOf(searchString) === -1 ? false : true;
  }
  /* Function to return true or false for input type range */
  rangeFilter(key, value) {
    var _a, _b, _c, _d, _e, _f;
    if (value === void 0 || value === "")
      return false;
    let minValue = parseFloat(((_b = (_a = this._allFilters) == null ? void 0 : _a[key]) == null ? void 0 : _b[0]) || "0");
    let maxValue = parseFloat(((_d = (_c = this._allFilters) == null ? void 0 : _c[key]) == null ? void 0 : _d[1]) || "0");
    if (value.indexOf(",") > -1) {
      let values = value.split(",");
      let maximValue = parseFloat((_e = values[1]) != null ? _e : "0");
      let minimValue = parseFloat((_f = values[0]) != null ? _f : "1");
      return maximValue <= maxValue && minimValue >= minValue ? true : false;
    }
    return parseFloat(value) >= minValue && parseFloat(value) <= maxValue ? true : false;
  }
  /* Function that returns true or false for select html elements */
  checkSelect(key, value) {
    if (value === void 0 || value === "")
      return false;
    const checkboxValues = this._allFilters[key];
    if ((value == null ? void 0 : value.indexOf(",")) !== -1 && Array.isArray(checkboxValues)) {
      return checkboxValues.some((item) => (value == null ? void 0 : value.split(",").indexOf(item)) !== -1);
    }
    return checkboxValues !== null || checkboxValues === void 0 ? (checkboxValues == null ? void 0 : checkboxValues[0]) === value : false;
  }
  /* Function that returns true or false for input type checkbox or select elements */
  checkFilter(key, value) {
    var _a;
    if (!value || value === "")
      return false;
    let searchString = (_a = this._allFilters[key]) == null ? void 0 : _a.toString().toLowerCase();
    if (searchString) {
      let searchArray = searchString.split(",");
      let lowerValue = value.toLowerCase();
      let returns = searchArray.some((search) => lowerValue.indexOf(search) !== -1);
      return returns;
    }
    return false;
  }
  /* Function that returns true or false for input type radio or select elements */
  radioFilter(key, value) {
    var _a, _b;
    if (value === void 0 || value === "")
      return false;
    if (value.indexOf(",") !== -1) {
      const values = value.split(",");
      return values.some((value2) => {
        var _a2, _b2;
        return value2 === ((_b2 = (_a2 = this._allFilters) == null ? void 0 : _a2[key]) == null ? void 0 : _b2[0]);
      });
    }
    return ((_b = (_a = this._allFilters) == null ? void 0 : _a[key]) == null ? void 0 : _b[0]) === value;
  }
  /* Function to filter elements by using their datasets and selected values */
  filterFunction() {
    var _a;
    this._allShown = [];
    this.hideAll();
    (_a = this._allDataSets) == null ? void 0 : _a.forEach((dataSet) => {
      var _a2, _b, _c, _d, _e, _f, _g, _h;
      let shouldShow = {};
      for (let key of Object.keys(this._allFilters)) {
        shouldShow[key] = true;
      }
      for (let key of Object.keys(this._allFilters)) {
        if (this._allFilters[key] === null)
          continue;
        if (this._filterCheckboxInputs instanceof Array && this._filterCheckboxInputs.indexOf(key) !== -1) {
          shouldShow[key] = this.checkFilter(key, dataSet[key]);
        } else if (this._filterSelectInputs instanceof Array && this._filterSelectInputs.indexOf(key) !== -1) {
          shouldShow[key] = this.checkSelect(key, dataSet[key]);
        } else if (this._filterStartTextInputs instanceof Array && this._filterStartTextInputs.indexOf(key) !== -1) {
          shouldShow[key] = this.textStartsWithFilter(key, dataSet[key]);
        } else if (this._filterTextInputs instanceof Array && this._filterTextInputs.indexOf(key) !== -1) {
          shouldShow[key] = this.textFilter(key, dataSet[key]);
        } else if (this._filterRadioInputs instanceof Array && this._filterRadioInputs.indexOf(key) !== -1) {
          shouldShow[key] = this.radioFilter(key, dataSet[key]);
        } else if (this._filterRangeInputs instanceof Array && this._filterRangeInputs.indexOf(key) !== -1) {
          if (((_b = (_a2 = this._allFilters) == null ? void 0 : _a2[key]) == null ? void 0 : _b[0]) == ((_d = (_c = this._allFilters) == null ? void 0 : _c[key]) == null ? void 0 : _d[2]) && ((_f = (_e = this._allFilters) == null ? void 0 : _e[key]) == null ? void 0 : _f[1]) == ((_h = (_g = this._allFilters) == null ? void 0 : _g[key]) == null ? void 0 : _h[3]))
            continue;
          shouldShow[key] = this.rangeFilter(key, dataSet[key]);
        }
      }
      if (Object.keys(shouldShow).every((key) => shouldShow[key])) {
        this.showThisItem(Number(dataSet.index));
      }
    });
  }
  showAmountResults() {
    if (this._counterElement === null || typeof this._counterElement === "undefined")
      return 0;
    this._counterElement.textContent = `${this._showCounter}`;
    return this._showCounter;
  }
  /* Check if all inputs are empty, if so, show all results */
  checkIfAllEmpty() {
    const isEmpty = Object.keys(this._allFilters).every(
      (key) => {
        var _a, _b;
        return this._allFilters[key] === null || ((_b = (_a = this._allFilters) == null ? void 0 : _a[key]) == null ? void 0 : _b[0]) === "";
      }
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
    var _a;
    this._allFilters = {};
    (_a = this._allInputs) == null ? void 0 : _a.forEach((input) => {
      var _a2, _b;
      if ((_a2 = input == null ? void 0 : input.dataset) == null ? void 0 : _a2.filter) {
        this._allFilters[(_b = input == null ? void 0 : input.dataset) == null ? void 0 : _b.filter] = null;
      }
    });
  }
  /* Input change function callback */
  inputCallback() {
    var _a;
    this.getAllSelectedFilters();
    (_a = this._allInputs) == null ? void 0 : _a.forEach((input) => {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      if (input.value == void 0 || input.value == null || input.value == "")
        return;
      if (input instanceof HTMLInputElement && input.type === "checkbox" && !input.checked)
        return;
      let filterKey = (_a2 = input == null ? void 0 : input.dataset) == null ? void 0 : _a2.filter;
      if (filterKey) {
        if (this._allFilters[filterKey] === null) {
          this._allFilters[filterKey] = [];
        }
        if ((input.type === "radio" || input.type === "RADIO") && ((_b = this._filterRadioInputs) == null ? void 0 : _b.indexOf(filterKey)) !== -1) {
          if (input instanceof HTMLInputElement && input.checked === true) {
            if (this._allFilters[filterKey] === null) {
              this._allFilters[filterKey] = [input.value];
            } else if (this._allFilters[filterKey] instanceof Array) {
              (_c = this._allFilters[filterKey]) == null ? void 0 : _c.push(input.value);
            }
          }
        } else if ((input == null ? void 0 : input.multiple) && (input.tagName === "select" || input.tagName === "SELECT")) {
          let multiSelectValues = Array.from(
            input.querySelectorAll("option:checked")
          ).map((el) => el.value);
          (_d = this._allFilters[filterKey]) == null ? void 0 : _d.push(...multiSelectValues);
        } else if (input instanceof HTMLInputElement && input.multiple && (input.type === "range" || input.type === "RANGE")) {
          if (input.classList.contains("ghost"))
            return;
          (_e = this._allFilters[filterKey]) == null ? void 0 : _e.push(...input.value.split(","));
          (_f = this._allFilters[filterKey]) == null ? void 0 : _f.push(input.min);
          (_g = this._allFilters[filterKey]) == null ? void 0 : _g.push(input.max);
        } else {
          (_h = this._allFilters[filterKey]) == null ? void 0 : _h.push(input.value);
        }
        if (((_i = this._filterRadioInputs) == null ? void 0 : _i.indexOf(filterKey)) !== -1 && ((_j = this._allFilters[filterKey]) == null ? void 0 : _j.length) == 0) {
          this._allFilters[filterKey] = null;
        }
      }
    });
    if (typeof this._modifySelectedFunction !== "undefined") {
      this._allFilters = this._modifySelectedFunction(this._allFilters);
    }
    this.filterFunction();
    if (this._showCounter === 0 && !this.checkIfAllEmpty()) {
      this.showNoResultMessage();
    }
    this.showAmountResults();
    if (this._callBackFunction !== null && typeof this._callBackFunction !== "undefined") {
      this._callBackFunction(this);
    }
  }
};
var QuickFilter_default = QuickFilter;

// source/QuickFilterCounter.ts
var QuickFilterCounter = class {
  constructor({
    enableOnInputs = true,
    enableOnSelects = true,
    counterClass = "counter",
    removeCounterFromSelected = true
  }) {
    this._allShown = [];
    this._enableOnInputs = enableOnInputs;
    this._enableOnSelects = enableOnSelects;
    this._counterClass = counterClass;
    this._removeCounterFromSelected = removeCounterFromSelected;
    this._allFilters = {};
  }
  init(QuickFilterClass) {
    var _a;
    this._QuickFilterClass = QuickFilterClass;
    this._allInputs = this._QuickFilterClass._allInputs;
    this._allResults = this._QuickFilterClass._allResults;
    (_a = this._allInputs) == null ? void 0 : _a.forEach((input) => {
      if (this._enableOnInputs && input instanceof HTMLInputElement && (input.type === "checkbox" || input.type === "radio")) {
        this.createCounterElement(this.getLabelByElement(input), this.resultsWhenChecked(input));
      }
      if (input instanceof HTMLInputElement && input.checked && this._removeCounterFromSelected) {
        this.removeOldCounter(this.getLabelByElement(input));
      }
      if (this._enableOnSelects && input instanceof HTMLSelectElement) {
        for (const option of Array.from(input.options)) {
          this.createCountElementOption(option, this.resultsWhenCheckedSelect(input, option));
        }
      }
      if (input instanceof HTMLInputElement && input.checked && this._removeCounterFromSelected) {
        this.removeOldCounter(this.getLabelByElement(input));
      }
    });
  }
  resultsWhenCheckedSelect(select, option) {
    var _a;
    this._oldFilters = JSON.stringify(this._QuickFilterClass._allFilters);
    const filterKey = (_a = select.dataset) == null ? void 0 : _a.filter;
    if (filterKey === void 0)
      return 0;
    const filterValue = option.value == "" ? null : option.value;
    let amountWhenChecked = 0;
    if (this._QuickFilterClass._allFilters[filterKey] === null && filterValue !== null) {
      this._QuickFilterClass._allFilters[filterKey] = [filterValue];
    } else if (filterValue === null) {
      this._QuickFilterClass._allFilters[filterKey] = null;
    } else {
      this._QuickFilterClass._allFilters[filterKey] = [filterValue];
    }
    this._QuickFilterClass.filterFunction();
    amountWhenChecked = this._QuickFilterClass._showCounter;
    this._QuickFilterClass._allFilters = JSON.parse(this._oldFilters);
    this._QuickFilterClass.filterFunction();
    return amountWhenChecked;
  }
  resultsWhenChecked(input) {
    var _a, _b;
    this._oldFilters = JSON.stringify(this._QuickFilterClass._allFilters);
    const filterKey = (_a = input.dataset) == null ? void 0 : _a.filter;
    if (filterKey === void 0)
      return 0;
    const filterValue = input.value == "" ? null : input.value;
    let amountWhenChecked = 0;
    if ((this._QuickFilterClass._allFilters[filterKey] === null || (input == null ? void 0 : input.type) === "radio") && filterValue !== null) {
      this._QuickFilterClass._allFilters[filterKey] = [filterValue];
    } else if (filterValue === null) {
      this._QuickFilterClass._allFilters[filterKey] = null;
    } else {
      (_b = this._QuickFilterClass._allFilters[filterKey]) == null ? void 0 : _b.push(filterValue);
    }
    this._QuickFilterClass.filterFunction();
    amountWhenChecked = this._QuickFilterClass._showCounter;
    this._QuickFilterClass._allFilters = JSON.parse(this._oldFilters);
    return amountWhenChecked;
  }
  getLabelByElement(input) {
    const inputId = input == null ? void 0 : input.id;
    if (inputId)
      return document.querySelector(`label[for="${inputId}"]`);
    return null;
  }
  createCounterElementHTML(results) {
    const counterElement = document.createElement("span");
    counterElement.className = `${this._counterClass} _quick_counter`;
    counterElement.textContent = ` (${results})`;
    return counterElement;
  }
  createCountElementOption(option, results) {
    this.removeOldCounter(option);
    option.append(this.createCounterElementHTML(results));
  }
  createCounterElement(label, results) {
    if (label !== null) {
      this.removeOldCounter(label);
      label.append(this.createCounterElementHTML(results));
    }
  }
  removeOldCounter(element) {
    var _a;
    if (element === null)
      return;
    (_a = element.querySelector("._quick_counter")) == null ? void 0 : _a.remove();
  }
};

// source/QuickPagination.ts
var QuickPagination = class {
  /**
   * Paginate class to create quick pagination
   * @param {object} {] object of options
   */
  constructor({
    pagesTarget = null,
    itemsPerPage = 5,
    itemsSelector = "[data-index]",
    paginationSelector = "#pagination",
    selectorSuffix = "",
    pageDisplayProperty = "block",
    nextPrevButtons = false,
    contentPrevButton = "Previous",
    contentNextButton = "Next",
    pageClasses = ["page", "row"],
    amountOfPrevNextItems = 1
  }) {
    this._chunks = [];
    this._visItems = [];
    var _a, _b, _c;
    this._chunks = [];
    this._perPage = itemsPerPage;
    this._itemsSelector = itemsSelector;
    this._selectorSuffix = selectorSuffix;
    this._pagesTarget = pagesTarget !== null ? document.querySelector(`${pagesTarget}${this._selectorSuffix}`) : null;
    this._paginationElement = (_a = document.querySelector(`${paginationSelector}${this._selectorSuffix}`)) != null ? _a : null;
    this._nextPrevButtons = nextPrevButtons;
    this._pageDisplay = pageDisplayProperty;
    this._currentPage = 1;
    this._amountOfPages = 0;
    this._amountOfPrevNextItems = amountOfPrevNextItems;
    this._originalItems = Array.prototype.slice.call(document.querySelectorAll(this._itemsSelector));
    this._contentPrevButton = contentPrevButton;
    this._contentNextButton = contentNextButton;
    this._pageClasses = pageClasses;
    const parentElement = (_b = document == null ? void 0 : document.querySelector(this._itemsSelector)) == null ? void 0 : _b.parentElement;
    if ((parentElement == null ? void 0 : parentElement.style) !== void 0) {
      parentElement.style.display = "none";
    }
    if (this._pagesTarget === null) {
      const pagesElement = document.createElement("div");
      pagesElement.setAttribute("id", `pagination${this._selectorSuffix}`);
      pagesElement.classList.add("pages");
      (_c = parentElement == null ? void 0 : parentElement.parentNode) == null ? void 0 : _c.insertBefore(pagesElement, parentElement);
      this._pagesTarget = pagesElement;
    }
    if (this._paginationElement === null) {
      const paginationElement = document.createElement("nav");
      paginationElement.setAttribute("id", `${paginationSelector}${this._selectorSuffix}`);
      paginationElement.classList.add("pagination", paginationSelector);
      this.insertAfter(paginationElement, this._pagesTarget);
      this._paginationElement = paginationElement;
    }
    this.init();
  }
  insertAfter(newNode, existingNode) {
    var _a;
    (_a = existingNode == null ? void 0 : existingNode.parentNode) == null ? void 0 : _a.insertBefore(newNode, existingNode.nextSibling);
  }
  /**
   * init method to fire all methods
   */
  init() {
    this._currentPage = 1;
    this.getItems();
    this.createChunks();
    this.appendPages();
    this.createPagination();
    this.addClickEvents();
  }
  /**
   * createPagination method calls methods to create the pagination elements
   * @returns {boolean} true
   */
  createPagination() {
    this.createPageNav();
    if (this._nextPrevButtons) {
      this.createNextPrev();
    }
    return true;
  }
  /**
   * Returns original items
   * @returns {HTMLElement[]}
   */
  getOriginalItems() {
    return this._originalItems = Array.prototype.slice.call(document.querySelectorAll(this._itemsSelector));
  }
  /**
   * getItems method returns all visible items
   * @returns {Array<HTMLElement>} this._visItems
   */
  getItems() {
    this._visItems = this.getOriginalItems().filter((element) => {
      return element.style.display != "none";
    });
    return this._visItems;
  }
  /**
   * createChunks method creates chunks of the visible items, per this._perPage
   * @returns {Array<HTMLElement[]>} this._chunks
   */
  createChunks() {
    var _a, _b;
    this._chunks = [];
    let i = 0;
    let n = this._visItems.length;
    while (i <= n) {
      const slicedVisItems = this._visItems.slice(i, i += this._perPage);
      this._chunks.push(slicedVisItems);
    }
    if (((_b = this._chunks[((_a = this._chunks) == null ? void 0 : _a.length) - 1]) == null ? void 0 : _b.length) === 0) {
      this._chunks.pop();
    }
    this._amountOfPages = this._chunks.length;
    return this._chunks;
  }
  /**
   * createAnchorTag method creates anchor tag for the pagination list item
   * @param {string} i
   * @param {boolean} datapageanchortag add data-page-anchor-tag
   * @returns {HTMLAnchorElement} anchorTag
   */
  createAnchorTag(i, datapageanchortag) {
    const anchorTag = document.createElement("a");
    anchorTag.classList.add("page-link");
    anchorTag.setAttribute("href", `#page-${i}`);
    anchorTag.setAttribute("aria-label", `Page${i}`);
    anchorTag.setAttribute("data-page-number", i);
    if (datapageanchortag) {
      anchorTag.setAttribute("data-page-anchor-tag", i);
    }
    anchorTag.textContent = `${i}`;
    return anchorTag;
  }
  /**
   * createListItem method creates list item element, with anchor tag
   * @param {string} i
   * @param {boolean} datapageanchortag add data-page-anchor-tag
   * @returns {HTMLLIElement} numPage
   */
  createListItem(i, datapageanchortag) {
    const numPage = document.createElement("li");
    numPage.classList.add("page-item");
    numPage.appendChild(this.createAnchorTag(i, datapageanchortag));
    return numPage;
  }
  /**
   * createEmptyListItem method creates empty list item element, with empty anchor tag
   * @returns {HTMLLIElement} noPage
   */
  createEmptyListItem() {
    const noLink = document.createElement("a");
    noLink.classList.add("page-link");
    noLink.setAttribute("aria-disabled", "true");
    noLink.setAttribute("href", "#");
    noLink.textContent = "...";
    const noPage = document.createElement("li");
    noPage.classList.add("empty-page-link");
    noPage.classList.add("disabled");
    noPage.classList.add("page-item");
    noPage.appendChild(noLink);
    return noPage;
  }
  /**
   * createPageNav method creates a <ol> element with a link for every chunk, empties the paginationElement and places the new pagination
   * @returns {HTMLOListElement} numList
   */
  createPageNav() {
    if (this._paginationElement === null)
      return;
    this._paginationElement.innerHTML = "";
    let numList = document.createElement("ol");
    numList.classList.add("pagination");
    numList.classList.add("flex-wrap");
    for (let i = 0; i < this._chunks.length; i++) {
      numList.appendChild(this.createListItem(`${i + 1}`, true));
    }
    this._paginationElement.appendChild(numList);
    return numList;
  }
  /**
   * createPage method creates a page for every chunk
   * @param {number} i
   * @returns {HTMLDivElement} page
   */
  createPage(i) {
    var _a, _b;
    let numPage = document.createElement("div");
    for (let i2 = 0; i2 < this._pageClasses.length; i2++) {
      numPage.classList.add((_a = this._pageClasses[i2]) != null ? _a : "");
    }
    numPage.id = "page-" + (i + 1);
    numPage.dataset.page = `${i + 1}`;
    numPage.style.display = "none";
    (_b = this._chunks[i]) == null ? void 0 : _b.forEach((element) => {
      numPage.appendChild(element.cloneNode(true));
    });
    return numPage;
  }
  /**
   * appendPages method appends pages to the pagesTarget div
   * @returns {HTMLElement} this._pagesTarget
   */
  appendPages() {
    var _a, _b;
    (_a = this._pagesTarget) == null ? void 0 : _a.querySelectorAll("[data-page]").forEach((page) => {
      page.remove();
    });
    for (let i = 0; i < this._chunks.length; i++) {
      (_b = this._pagesTarget) == null ? void 0 : _b.appendChild(this.createPage(i));
    }
    return this._pagesTarget;
  }
  /**
   * hideAllPages method hides all generated pages within scope
   */
  hideAllPages() {
    var _a, _b;
    (_b = (_a = this._pagesTarget) == null ? void 0 : _a.querySelectorAll("[data-page]")) == null ? void 0 : _b.forEach((page) => {
      if (page instanceof HTMLElement) {
        page.style.display = "none";
      }
    });
  }
  /**
   * removeActiveLinks removes all active pagination links
   */
  removeActiveLinks() {
    var _a;
    (_a = this._paginationElement) == null ? void 0 : _a.querySelectorAll("[data-page-anchor-tag]").forEach((pageEl) => {
      var _a2;
      (_a2 = pageEl == null ? void 0 : pageEl.parentElement) == null ? void 0 : _a2.classList.remove("active");
    });
  }
  /**
   * showPage method to show the right page based on the
   * @param {HTMLElement} anchor
   * @param {number} index
   */
  showPage(anchor, index) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    if (anchor.getAttribute("aria-disabled"))
      return;
    this.hideAllPages();
    this.removeActiveLinks();
    if (((_a = anchor == null ? void 0 : anchor.parentElement) == null ? void 0 : _a.id) !== "pagination-next-button" && ((_b = anchor == null ? void 0 : anchor.parentElement) == null ? void 0 : _b.id) !== "pagination-prev-button") {
      (_c = anchor == null ? void 0 : anchor.parentElement) == null ? void 0 : _c.classList.add("active");
      const pageEl = (_d = this._pagesTarget) == null ? void 0 : _d.querySelector(
        '[data-page="' + anchor.dataset.pageAnchorTag + '"]'
      );
      if (pageEl instanceof HTMLElement) {
        pageEl.style.display = this._pageDisplay;
      }
      this._currentPage = parseInt(((_e = anchor == null ? void 0 : anchor.dataset) == null ? void 0 : _e.pageAnchorTag) || "0");
    } else {
      (_h = (_g = (_f = this._paginationElement) == null ? void 0 : _f.querySelector('[data-page-anchor-tag="' + index + '"]')) == null ? void 0 : _g.parentElement) == null ? void 0 : _h.classList.add("active");
      const pageEl = (_i = this._pagesTarget) == null ? void 0 : _i.querySelector(
        '[data-page="' + index + '"]'
      );
      if (pageEl instanceof HTMLElement) {
        pageEl.style.display = this._pageDisplay;
      }
      this._currentPage = index;
    }
    this.replaceNumbersWithDots();
    this.checkCanClickNextPrev();
  }
  /**
   * addClickEvents method to append click events to paginators and forces check previous and next button if active
   */
  addClickEvents() {
    var _a;
    (_a = this._paginationElement) == null ? void 0 : _a.querySelectorAll("a").forEach((anchor) => {
      var _a2;
      if (parseInt(((_a2 = anchor == null ? void 0 : anchor.dataset) == null ? void 0 : _a2.pageAnchorTag) || "0") === this._currentPage) {
        this.showPage(anchor, this._currentPage);
      }
      anchor.addEventListener("click", (e) => {
        var _a3;
        e.preventDefault();
        if (!anchor.dataset.pageAnchorTag && this._nextPrevButtons) {
          this.showPage(anchor, this._currentPage + parseInt(((_a3 = anchor == null ? void 0 : anchor.dataset) == null ? void 0 : _a3.pageNumber) || "0"));
        } else {
          this.showPage(anchor, this._currentPage);
        }
      });
    });
  }
  /**
   * setContentAndIdForListItem sets the content for previous and next button defaults to Previous and Next
   * @param {HTMLLIElement} item
   * @returns {HTMLLIElement} item
   */
  setContentAndIdForListItem(item, nextOrPrev) {
    item.id = "pagination-" + nextOrPrev + "-button";
    if (nextOrPrev === "next" && item.children[0] !== void 0) {
      item.children[0].innerHTML = this._contentNextButton;
    }
    if (nextOrPrev === "prev" && item.children[0] !== void 0) {
      item.children[0].innerHTML = this._contentPrevButton;
    }
    return item;
  }
  /**
   * enableListItem enables disabled buttons
   */
  enableListItem() {
    var _a, _b, _c, _d, _e;
    if (this._nextPrevButtons === false)
      return;
    if (((_b = (_a = this._paginationElement) == null ? void 0 : _a.children[0]) == null ? void 0 : _b.lastElementChild) !== void 0 && ((_c = this._paginationElement) == null ? void 0 : _c.children[0].firstElementChild) !== void 0) {
      let nextButton = (_d = this._paginationElement) == null ? void 0 : _d.children[0].lastElementChild;
      let prevButton = (_e = this._paginationElement) == null ? void 0 : _e.children[0].firstElementChild;
      prevButton == null ? void 0 : prevButton.classList.remove("disabled");
      nextButton == null ? void 0 : nextButton.classList.remove("disabled");
      if ((prevButton == null ? void 0 : prevButton.children[0]) !== void 0 && (nextButton == null ? void 0 : nextButton.children[0]) !== void 0) {
        prevButton == null ? void 0 : prevButton.children[0].removeAttribute("aria-disabled");
        nextButton == null ? void 0 : nextButton.children[0].removeAttribute("aria-disabled");
      }
    }
  }
  /**
   * disableListItem adds disabled class to page list item
   * @param {HTMLLIElement} item
   * @returns {HTMLLIElement} item
   */
  disableListItem(item) {
    var _a;
    (_a = item.children[0]) == null ? void 0 : _a.setAttribute("aria-disabled", "true");
    item.classList.add("disabled");
    return item;
  }
  /**
   * canClickNextPrev method checks wether next and previous button can be clicked
   * @param {number} index
   * @returns {boolean}
   */
  canClickNextPrev(index) {
    if (index < 1 || index > this._amountOfPages) {
      return false;
    }
    return true;
  }
  /**
   * checkCanClinkNextPrev methods tries if next or prev button can be clicked or not (canClickNextPrev), in that case, fires disableListItem
   */
  checkCanClickNextPrev() {
    if (this._nextPrevButtons === false)
      return;
    this.enableListItem();
    if (!this.canClickNextPrev(this._currentPage - 1)) {
      this.disableListItem(this._prevButton);
    }
    if (!this.canClickNextPrev(this._currentPage + 1)) {
      this.disableListItem(this._nextButton);
    }
  }
  /**
   * createNextPrev methods creates the next and previous buttons and appends/prepends them
   */
  createNextPrev() {
    var _a, _b, _c;
    this._prevButton = this.setContentAndIdForListItem(this.createListItem("-1", false), "prev");
    this._nextButton = this.setContentAndIdForListItem(this.createListItem("+1", false), "next");
    if (((_a = this._paginationElement) == null ? void 0 : _a.children[0]) !== void 0) {
      (_b = this._paginationElement) == null ? void 0 : _b.children[0].prepend(this._prevButton);
      (_c = this._paginationElement) == null ? void 0 : _c.children[0].append(this._nextButton);
    }
  }
  /**
   * calculateInReach method calculates wether given index is in the range of amount of next and prev items
   * @param {number} index
   * @returns {boolean}
   */
  calculateInReach(index) {
    if (index === this._chunks.length || index === 1) {
      return true;
    } else {
      return (index - (this._currentPage - this._amountOfPrevNextItems)) * (index - (this._currentPage + this._amountOfPrevNextItems)) <= 0;
    }
  }
  /**
   * Shows all page item elements
   */
  showAllPaginationElements() {
    var _a, _b;
    (_b = (_a = this._paginationElement) == null ? void 0 : _a.children[0]) == null ? void 0 : _b.childNodes.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.display = "list-item";
      }
    });
  }
  /**
   * removeAllDotElements removes all empty page links, to reset its state
   */
  removeAllDotElements() {
    var _a;
    (_a = this._paginationElement) == null ? void 0 : _a.querySelectorAll(".empty-page-link").forEach((element) => {
      element.remove();
    });
  }
  /**
   * replaceElementsWithDots method hides all pagination elements that should not be visible and fires event to remove and add dotElements
   * @param {array} numsBefore
   * @param {array} numsAfter
   */
  replaceElementsWithDots(numsBefore, numsAfter) {
    var _a, _b, _c, _d;
    if (numsBefore.length > 0) {
      (_b = (_a = this._paginationElement) == null ? void 0 : _a.children[0]) == null ? void 0 : _b.insertBefore(
        this.createEmptyListItem(),
        numsBefore[0].parentNode
      );
      for (let i = 0; i < numsBefore.length; i++) {
        numsBefore[i].parentNode.style.display = "none";
      }
    }
    if (numsAfter.length > 0) {
      (_d = (_c = this._paginationElement) == null ? void 0 : _c.children[0]) == null ? void 0 : _d.insertBefore(
        this.createEmptyListItem(),
        numsAfter[numsAfter.length - 1].parentNode
      );
      for (let i = 0; i < numsAfter.length; i++) {
        numsAfter[i].parentNode.style.display = "none";
      }
    }
  }
  /**
   * replaceNumbersWithDots method replaces pagination items with dots
   */
  replaceNumbersWithDots() {
    var _a;
    let numsBefore = [];
    let numsAfter = [];
    (_a = this._paginationElement) == null ? void 0 : _a.querySelectorAll("[data-page-anchor-tag]").forEach((item) => {
      var _a2;
      if (item instanceof HTMLElement) {
        let itemIndex = parseInt(((_a2 = item == null ? void 0 : item.dataset) == null ? void 0 : _a2.pageAnchorTag) || "0");
        if (!this.calculateInReach(itemIndex)) {
          if (itemIndex < this._currentPage) {
            numsBefore.push(item);
          } else {
            numsAfter.push(item);
          }
        }
      }
    });
    this.removeAllDotElements();
    this.showAllPaginationElements();
    if (numsBefore.length > 0 || numsAfter.length > 0) {
      this.replaceElementsWithDots(numsBefore, numsAfter);
    }
  }
};

// source/QuickSorting.ts
var QuickSorting = class {
  constructor({
    itemsSelector = "[data-index]",
    elementsSelector = "[data-index]",
    sortSelectSelector = 'select[name="sort"]',
    parentElement = null,
    callBackFunction = void 0
  }) {
    var _a, _b, _c, _d, _e, _f, _g;
    this._elements = document.querySelectorAll(itemsSelector) ? document.querySelectorAll(itemsSelector) : document.querySelectorAll(elementsSelector);
    if (this._elements === null)
      return;
    this._sortSelect = document.querySelector(sortSelectSelector);
    if (this._sortSelect === null)
      return;
    if (parentElement === null && ((_a = this._elements[0]) == null ? void 0 : _a.parentElement) !== void 0) {
      this._parentElement = this._elements[0].parentElement;
    } else if (parentElement !== null) {
      this._parentElement = document.querySelector(parentElement);
    }
    this._callBackFunction = callBackFunction;
    this.appendEvent();
    this._selectedValue = {
      key: ((_c = (_b = this._sortSelect.options[this._sortSelect.selectedIndex]) == null ? void 0 : _b.dataset) == null ? void 0 : _c.key) || "random",
      order: (_e = (_d = this._sortSelect.options[this._sortSelect.selectedIndex]) == null ? void 0 : _d.dataset) == null ? void 0 : _e.order,
      type: (_g = (_f = this._sortSelect.options[this._sortSelect.selectedIndex]) == null ? void 0 : _f.dataset) == null ? void 0 : _g.type
    };
  }
  /**
   * Initialize quicksorting, use this function to sort all
   */
  init() {
    this.getSelectedValue();
    if (this._parentElement instanceof HTMLElement) {
      this._parentElement.innerHTML = "";
      this.sort().forEach((ele) => {
        var _a;
        (_a = this._parentElement) == null ? void 0 : _a.appendChild(ele);
      });
    }
    if (typeof this._callBackFunction !== "undefined") {
      this._callBackFunction();
    }
  }
  /**
   * Append event listener to select element, and fire init function when changed
   */
  appendEvent() {
    var _a;
    (_a = this._sortSelect) == null ? void 0 : _a.addEventListener("change", () => {
      this.init();
    });
  }
  /**
   * Method gets selected values from the select html element
   * @returns {QuickSortingSelected} this._selectedValue object of selected value
   */
  getSelectedValue() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
    return this._selectedValue = {
      key: ((_c = (_b = this._sortSelect) == null ? void 0 : _b.options[(_a = this._sortSelect) == null ? void 0 : _a.selectedIndex]) == null ? void 0 : _c.dataset.key) || "random",
      order: (_g = (_f = (_e = this._sortSelect) == null ? void 0 : _e.options[(_d = this._sortSelect) == null ? void 0 : _d.selectedIndex]) == null ? void 0 : _f.dataset) == null ? void 0 : _g.order,
      type: (_k = (_j = (_i = this._sortSelect) == null ? void 0 : _i.options[(_h = this._sortSelect) == null ? void 0 : _h.selectedIndex]) == null ? void 0 : _j.dataset) == null ? void 0 : _k.type
    };
  }
  /**
   * Sorts items by the given selected order and key.
   * @returns {array} this.elements sorted
   */
  sort() {
    let searchKey = this._selectedValue.key;
    let sortOrder = this._selectedValue.order;
    let type = this._selectedValue.type;
    if (this._elements instanceof NodeList) {
      return Array.from(this._elements).sort((a, b) => {
        var _a, _b;
        if (!(a instanceof HTMLElement && b instanceof HTMLElement))
          return 0;
        if (searchKey === "random") {
          return 0.5 - Math.random();
        }
        const aData = (_a = a.dataset) == null ? void 0 : _a[searchKey];
        const bData = (_b = b.dataset) == null ? void 0 : _b[searchKey];
        if (aData === void 0 || bData === void 0)
          return 0;
        if (type === "CHAR") {
          if (sortOrder === "ASC") {
            return aData.localeCompare(bData);
          } else {
            if (!a.dataset || !b.dataset)
              return 0;
            return bData.localeCompare(aData);
          }
        } else if (type === "NUM") {
          if (sortOrder === "ASC") {
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
};
export {
  QuickFilter_default as QuickFilter,
  QuickFilterCounter,
  QuickPagination,
  QuickSorting
};
