"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QuickFilter {
    constructor({ elementSelector = '[data-index]', filterCheckboxInputs = undefined, filterSelectInputs = undefined, filterTextInputs = undefined, filterRangeInputs = undefined, filterRadioInputs = undefined, filterStartTextInputs = undefined, resultNumberSelector = null, noResultMessage, showDisplayProperty = 'block', hideDisplayProperty = 'none', callBackFunction = null, modifySelectedFunction, itemsScope = null, keyupDebounce = 200, }) {
        var _a, _b, _c, _d, _e;
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
        this._allFilters = {};
        this._elementSelector = elementSelector;
        /* Set display property of hide and visible defaults to none and block : string */
        this._showDisplayProperty = showDisplayProperty;
        this._hideDisplayProperty = hideDisplayProperty;
        if (itemsScope === null) {
            this._itemsScope = document;
        }
        else if (document.querySelector(itemsScope)) {
            this._itemsScope = document.querySelector(itemsScope);
        }
        if (typeof this._itemsScope === 'undefined')
            return;
        this._allResults = (_a = this._itemsScope) === null || _a === void 0 ? void 0 : _a.querySelectorAll(this._elementSelector);
        if (((_b = this._allResults) === null || _b === void 0 ? void 0 : _b.length) === 0)
            return;
        /* Element to display when no element meets the filter criteria defaults to null : element */
        if (noResultMessage) {
            this._noResultMessage = noResultMessage;
        }
        /* Element that displays amount of visible results defaults to null : element */
        if (resultNumberSelector) {
            this._counterElement = (_c = document.querySelector(resultNumberSelector)) !== null && _c !== void 0 ? _c : null;
        }
        /* Set visible counter to number of result elements : int */
        this._showCounter = Number((_d = this._allResults) === null || _d === void 0 ? void 0 : _d.length);
        /* Get all filterable inputs/selectors in scope : nodelist */
        this._allInputs =
            (_e = (document.querySelectorAll('[data-filter]'))) !== null && _e !== void 0 ? _e : null;
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
        this._allInputs.forEach((input) => {
            if (input instanceof HTMLInputElement && (input.type === 'text' || input.type === 'search')) {
                input.addEventListener('keyup', this.debounce(this.inputCallback, this._keyupDebounce));
            }
            else {
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
     * Return all data attributtes in array
     * @returns {DOMStringMap[]}
     */
    getAllDataSets() {
        var _a;
        this._allDataSets = new Array();
        (_a = this._allResults) === null || _a === void 0 ? void 0 : _a.forEach((resultElement) => {
            var _a;
            (_a = this._allDataSets) === null || _a === void 0 ? void 0 : _a.push(Object.assign({}, resultElement === null || resultElement === void 0 ? void 0 : resultElement.dataset));
        });
        return this._allDataSets;
    }
    /* Show all filterable elements */
    showAll() {
        var _a, _b, _c;
        (_a = this._allResults) === null || _a === void 0 ? void 0 : _a.forEach((resultElement) => (resultElement.style.display = this._showDisplayProperty));
        this._showCounter = (_c = (_b = this._allResults) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
    }
    /* Hide all filterable elements */
    hideAll() {
        var _a;
        if (this._noResult != null) {
            this._noResult.style.display = this._hideDisplayProperty;
        }
        (_a = this._allResults) === null || _a === void 0 ? void 0 : _a.forEach((resultElement) => (resultElement.style.display = this._hideDisplayProperty));
        this._showCounter = 0;
    }
    /* Show no result messag */
    showNoResultMessage() {
        if (this._noResult === null)
            return;
        this._noResult.style.display = this._showDisplayProperty;
    }
    /* Show item by index */
    showThisItem(index) {
        var _a;
        let showThis = (_a = this._itemsScope) === null || _a === void 0 ? void 0 : _a.querySelector(`[data-index="${index}"]`);
        if (showThis instanceof HTMLElement) {
            showThis.style.display = this._showDisplayProperty;
            this._allShown.push(showThis);
        }
        this._showCounter++;
    }
    /* Function to return true or false for input type text if value starts with search */
    textStartsWithFilter(key, value) {
        var _a;
        if (value === undefined || value === '')
            return false;
        let searchString = (_a = this._allFilters[key]) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase();
        let lowerValue = value.toLowerCase();
        return searchString && lowerValue.startsWith(searchString) ? true : false;
    }
    /* Function to return true or false for input type text */
    textFilter(key, value) {
        var _a;
        if (value === undefined || value === '')
            return false;
        let searchString = (_a = this._allFilters[key]) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase();
        let lowerValue = value.toLowerCase();
        return searchString && lowerValue.indexOf(searchString) === -1 ? false : true;
    }
    /* Function to return true or false for input type range */
    rangeFilter(key, value) {
        var _a, _b, _c, _d;
        if (value === undefined || value === '')
            return false;
        let minValue = parseFloat(((_b = (_a = this._allFilters) === null || _a === void 0 ? void 0 : _a[key]) === null || _b === void 0 ? void 0 : _b[0]) || '0');
        let maxValue = parseFloat(((_d = (_c = this._allFilters) === null || _c === void 0 ? void 0 : _c[key]) === null || _d === void 0 ? void 0 : _d[1]) || '0');
        if (value.indexOf(',') > -1) {
            let values = value.split(',');
            let maximValue = parseFloat(values[1]);
            let minimValue = parseFloat(values[0]);
            return maximValue <= maxValue && minimValue >= minValue ? true : false;
        }
        return parseFloat(value) >= minValue && parseFloat(value) <= maxValue ? true : false;
    }
    /* Function that returns true or false for select elements */
    checkSelect(key, value) {
        if (value === undefined || value === '')
            return false;
        /* Check if value contains multiple values (for multi select) */
        const checkboxValues = this._allFilters[key];
        if ((value === null || value === void 0 ? void 0 : value.indexOf(',')) !== -1 && Array.isArray(checkboxValues)) {
            return checkboxValues.some((item) => (value === null || value === void 0 ? void 0 : value.split(',').indexOf(item)) !== -1);
        }
        return checkboxValues !== null ? checkboxValues[0] === value : false;
    }
    /* Function that returns true or false for input type checkbox or select elements */
    checkFilter(key, value) {
        var _a;
        if (!value || value === '')
            return false;
        let searchString = (_a = this._allFilters[key]) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase();
        if (searchString) {
            let searchArray = searchString.split(',');
            let lowerValue = value.toLowerCase();
            let returns = searchArray.some((search) => lowerValue.indexOf(search) !== -1);
            return returns;
        }
        return false;
    }
    /* Function that returns true or false for input type radio or select elements */
    radioFilter(key, value) {
        var _a, _b;
        if (value === undefined || value === '')
            return false;
        if (value.indexOf(',') !== -1) {
            const values = value.split(',');
            return values.some((value) => { var _a, _b; return value === ((_b = (_a = this._allFilters) === null || _a === void 0 ? void 0 : _a[key]) === null || _b === void 0 ? void 0 : _b[0]); });
        }
        return ((_b = (_a = this._allFilters) === null || _a === void 0 ? void 0 : _a[key]) === null || _b === void 0 ? void 0 : _b[0]) === value;
    }
    /* Function to filter elements by using their datasets and selected values */
    filterFunction() {
        var _a;
        /* Hide all elements */
        this._allShown = [];
        this.hideAll();
        (_a = this._allDataSets) === null || _a === void 0 ? void 0 : _a.forEach((dataSet) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            /* Set flag for should hide element to false */
            let shouldShow = {};
            for (let key of Object.keys(this._allFilters)) {
                shouldShow[key] = true;
            }
            for (let key of Object.keys(this._allFilters)) {
                if (this._allFilters[key] === null)
                    continue;
                if (this._filterCheckboxInputs instanceof Array && this._filterCheckboxInputs.indexOf(key) !== -1) {
                    shouldShow[key] = this.checkFilter(key, dataSet[key]);
                }
                else if (this._filterSelectInputs instanceof Array &&
                    this._filterSelectInputs.indexOf(key) !== -1) {
                    shouldShow[key] = this.checkSelect(key, dataSet[key]);
                }
                else if (this._filterStartTextInputs instanceof Array &&
                    this._filterStartTextInputs.indexOf(key) !== -1) {
                    shouldShow[key] = this.textStartsWithFilter(key, dataSet[key]);
                }
                else if (this._filterTextInputs instanceof Array && this._filterTextInputs.indexOf(key) !== -1) {
                    shouldShow[key] = this.textFilter(key, dataSet[key]);
                }
                else if (this._filterRadioInputs instanceof Array && this._filterRadioInputs.indexOf(key) !== -1) {
                    shouldShow[key] = this.radioFilter(key, dataSet[key]);
                }
                else if (this._filterRangeInputs instanceof Array && this._filterRangeInputs.indexOf(key) !== -1) {
                    if (((_b = (_a = this._allFilters) === null || _a === void 0 ? void 0 : _a[key]) === null || _b === void 0 ? void 0 : _b[0]) == ((_d = (_c = this._allFilters) === null || _c === void 0 ? void 0 : _c[key]) === null || _d === void 0 ? void 0 : _d[2]) &&
                        ((_f = (_e = this._allFilters) === null || _e === void 0 ? void 0 : _e[key]) === null || _f === void 0 ? void 0 : _f[1]) == ((_h = (_g = this._allFilters) === null || _g === void 0 ? void 0 : _g[key]) === null || _h === void 0 ? void 0 : _h[3]))
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
        if (this._counterElement === null)
            return 0;
        this._counterElement.textContent = `${this._showCounter}`;
        return this._showCounter;
    }
    /* Check if all inputs are empty, if so, show all results */
    checkIfAllEmpty() {
        const isEmpty = Object.keys(this._allFilters).every((key) => { var _a, _b; return this._allFilters[key] === null || ((_b = (_a = this._allFilters) === null || _a === void 0 ? void 0 : _a[key]) === null || _b === void 0 ? void 0 : _b[0]) === ''; });
        if (isEmpty) {
            this.showAll();
            return true;
        }
        else {
            return false;
        }
    }
    /* Method to get all selected filters */
    getAllSelectedFilters() {
        var _a;
        this._allFilters = {};
        (_a = this._allInputs) === null || _a === void 0 ? void 0 : _a.forEach((input) => {
            var _a, _b;
            if ((_a = input === null || input === void 0 ? void 0 : input.dataset) === null || _a === void 0 ? void 0 : _a.filter) {
                this._allFilters[(_b = input === null || input === void 0 ? void 0 : input.dataset) === null || _b === void 0 ? void 0 : _b.filter] = null;
            }
        });
    }
    /* Input change function callback */
    inputCallback() {
        var _a;
        /* Grab all selected values */
        this.getAllSelectedFilters();
        (_a = this._allInputs) === null || _a === void 0 ? void 0 : _a.forEach((input) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            if (input.value == undefined || input.value == null || input.value == '')
                return;
            if (input instanceof HTMLInputElement && input.type === 'checkbox' && !input.checked)
                return;
            let filterKey = (_a = input === null || input === void 0 ? void 0 : input.dataset) === null || _a === void 0 ? void 0 : _a.filter;
            if (filterKey) {
                if (this._allFilters[filterKey] === null) {
                    this._allFilters[filterKey] = [];
                }
                if ((input.type === 'radio' || input.type === 'RADIO') &&
                    ((_b = this._filterRadioInputs) === null || _b === void 0 ? void 0 : _b.indexOf(filterKey)) !== -1) {
                    if (input instanceof HTMLInputElement && input.checked === true) {
                        if (this._allFilters[filterKey] === null) {
                            this._allFilters[filterKey] = [input.value];
                        }
                        else if (this._allFilters[filterKey] instanceof Array) {
                            (_c = this._allFilters[filterKey]) === null || _c === void 0 ? void 0 : _c.push(input.value);
                        }
                    }
                }
                else if ((input === null || input === void 0 ? void 0 : input.multiple) && (input.tagName === 'select' || input.tagName === 'SELECT')) {
                    let multiSelectValues = Array.from(input.querySelectorAll('option:checked')).map((el) => el.value);
                    (_d = this._allFilters[filterKey]) === null || _d === void 0 ? void 0 : _d.push(...multiSelectValues);
                }
                else if (input instanceof HTMLInputElement &&
                    input.multiple &&
                    (input.type === 'range' || input.type === 'RANGE')) {
                    if (input.classList.contains('ghost'))
                        return;
                    (_e = this._allFilters[filterKey]) === null || _e === void 0 ? void 0 : _e.push(...input.value.split(','));
                    (_f = this._allFilters[filterKey]) === null || _f === void 0 ? void 0 : _f.push(input.min);
                    (_g = this._allFilters[filterKey]) === null || _g === void 0 ? void 0 : _g.push(input.max);
                }
                else {
                    (_h = this._allFilters[filterKey]) === null || _h === void 0 ? void 0 : _h.push(input.value);
                }
                if (((_j = this._filterRadioInputs) === null || _j === void 0 ? void 0 : _j.indexOf(filterKey)) !== -1 && ((_k = this._allFilters[filterKey]) === null || _k === void 0 ? void 0 : _k.length) == 0) {
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
exports.default = QuickFilter;
//# sourceMappingURL=QuickFilter.js.map