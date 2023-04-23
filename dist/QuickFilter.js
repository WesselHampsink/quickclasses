class QuickFilter {
    constructor({ elementSelector = '[data-index]', filterCheckboxInputs = undefined, filterSelectInputs = undefined, filterTextInputs = undefined, filterRangeInputs = undefined, filterRadioInputs = undefined, filterStartTextInputs = undefined, resultNumberSelector = null, noResultMessage = null, showDisplayProperty = 'block', hideDisplayProperty = 'none', callBackFunction = null, modifySelectedFunction = undefined, itemsScope = null, keyupDebounce = 200, }) {
        var _a, _b;
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
        this._allResults = this._itemsScope.querySelectorAll(this._elementSelector);
        if (this._allResults.length === 0)
            return;
        /* Element to display when no element meets the filter criteria defaults to null : element */
        this._noResult = document.querySelector(noResultMessage);
        /* Element that displays amount of visible results defaults to null : element */
        if (resultNumberSelector) {
            this._counterElement = (_a = document.querySelector(resultNumberSelector)) !== null && _a !== void 0 ? _a : null;
        }
        /* Set visible counter to number of result elements : int */
        this._showCounter = this._allResults.length;
        /* Get all filterable inputs/selectors in scope : nodelist */
        this._allInputs =
            (_b = (document.querySelectorAll('[data-filter]'))) !== null && _b !== void 0 ? _b : null;
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
        if (typeof filterRadioInputs !== 'undefined') {
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
        this._allDataSets = new Array();
        this._allResults.forEach((resultElement) => {
            this._allDataSets.push(Object.assign({}, resultElement === null || resultElement === void 0 ? void 0 : resultElement.dataset));
        });
        return this._allDataSets;
    }
    /* Show all filterable elements */
    showAll() {
        this._allResults.forEach((resultElement) => (resultElement.style.display = this._showDisplayProperty));
        this._showCounter = this._allResults.length;
    }
    /* Hide all filterable elements */
    hideAll() {
        if (this._noResult != null) {
            this._noResult.style.display = this._hideDisplayProperty;
        }
        this._allResults.forEach((resultElement) => (resultElement.style.display = this._hideDisplayProperty));
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
        let showThis = this._itemsScope.querySelector(`[data-index="${index}"]`);
        if (showThis instanceof HTMLElement) {
            showThis.style.display = this._showDisplayProperty;
            this._allShown.push(showThis);
        }
        this._showCounter++;
    }
    /* Function to return true or false for input type text if value starts with search */
    textStartsWithFilter(key, value) {
        let searchString = this._allFilters[key].toString().toLowerCase();
        let lowerValue = value.toLowerCase();
        return lowerValue.startsWith(searchString) ? true : false;
    }
    /* Function to return true or false for input type text */
    textFilter(key, value) {
        let searchString = this._allFilters[key].toString().toLowerCase();
        let lowerValue = value.toLowerCase();
        return lowerValue.indexOf(searchString) === -1 ? false : true;
    }
    /* Function to return true or false for input type range */
    rangeFilter(key, value) {
        let minValue = parseFloat(this._allFilters[key][0]);
        let maxValue = parseFloat(this._allFilters[key][1]);
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
        /* Check if value contains multiple values (for multi select) */
        const checkboxValues = this._allFilters[key];
        if (value.indexOf(',') !== -1 && Array.isArray(checkboxValues)) {
            return checkboxValues.some((item) => value.split(',').indexOf(item) !== -1);
        }
        return checkboxValues[0] === value;
    }
    /* Function that returns true or false for input type checkbox or select elements */
    checkFilter(key, value) {
        if (!value || value === '')
            return false;
        let searchString = this._allFilters[key].toString().toLowerCase();
        let searchArray = searchString.split(',');
        let lowerValue = value.toLowerCase();
        let returns = searchArray.some((search) => lowerValue.indexOf(search) !== -1);
        return returns;
    }
    /* Function that returns true or false for input type radio or select elements */
    radioFilter(key, value) {
        if (value.indexOf(',') !== -1) {
            const values = value.split(',');
            return values.some((value) => value === this._allFilters[key][0]);
        }
        return this._allFilters[key][0] === value;
    }
    /* Function to filter elements by using their datasets and selected values */
    filterFunction() {
        /* Hide all elements */
        this._allShown = [];
        this.hideAll();
        this._allDataSets.forEach((dataSet) => {
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
                    if (this._allFilters[key][0] == this._allFilters[key][2] &&
                        this._allFilters[key][1] == this._allFilters[key][3])
                        continue;
                    shouldShow[key] = this.rangeFilter(key, dataSet[key]);
                }
            }
            if (Object.keys(shouldShow).every((key) => shouldShow[key])) {
                this.showThisItem(dataSet.index);
            }
        });
    }
    showAmountResults() {
        if (this._counterElement === null)
            return;
        this._counterElement.textContent = `${this._showCounter}`;
        return this._showCounter;
    }
    /* Check if all inputs are empty, if so, show all results */
    checkIfAllEmpty() {
        const isEmpty = Object.keys(this._allFilters).every((key) => this._allFilters[key] === null || this._allFilters[key][0] === '');
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
        this._allFilters = {};
        this._allInputs.forEach((input) => {
            var _a;
            this._allFilters[(_a = input === null || input === void 0 ? void 0 : input.dataset) === null || _a === void 0 ? void 0 : _a.filter] = null;
        });
    }
    /* Input change function callback */
    inputCallback() {
        var _a;
        /* Grab all selected values */
        this.getAllSelectedFilters();
        (_a = this._allInputs) === null || _a === void 0 ? void 0 : _a.forEach((input) => {
            var _a, _b;
            if (input.value == undefined || input.value == null || input.value == '')
                return;
            if (input instanceof HTMLInputElement && input.type === 'checkbox' && !input.checked)
                return;
            let filterKey = input.dataset.filter;
            if (this._allFilters[filterKey] === null) {
                this._allFilters[filterKey] = [];
            }
            if ((input.type === 'radio' || input.type === 'RADIO') &&
                ((_a = this._filterRadioInputs) === null || _a === void 0 ? void 0 : _a.indexOf(input.dataset.filter)) !== -1) {
                if (input instanceof HTMLInputElement && input.checked === true) {
                    this._allFilters[filterKey].push(input.value);
                }
            }
            else if ((input === null || input === void 0 ? void 0 : input.multiple) && (input.tagName === 'select' || input.tagName === 'SELECT')) {
                let multiSelectValues = Array.from(input.querySelectorAll('option:checked')).map((el) => el.value);
                this._allFilters[filterKey].push(...multiSelectValues);
            }
            else if (input instanceof HTMLInputElement &&
                input.multiple &&
                (input.type === 'range' || input.type === 'RANGE')) {
                if (input.classList.contains('ghost'))
                    return;
                this._allFilters[filterKey].push(...input.value.split(','));
                this._allFilters[filterKey].push(input.min);
                this._allFilters[filterKey].push(input.max);
            }
            else {
                this._allFilters[filterKey].push(input.value);
            }
            if (((_b = this._filterRadioInputs) === null || _b === void 0 ? void 0 : _b.indexOf(input.dataset.filter)) !== -1 &&
                this._allFilters[filterKey].length == 0) {
                this._allFilters[filterKey] = null;
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
        if (typeof this._callBackFunction !== 'undefined') {
            this._callBackFunction(this);
        }
    }
}
