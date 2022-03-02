/* QuickFilter Class, used to hide, show get and filter */
class QuickFilter {
    constructor({
        elementSelector = '[data-index]',
        filterCheckboxInputs = [],
        filterSelectInputs = [],
        filterTextInputs = [],
        filterRangeInputs = [],
        filterRadioInputs = [],
        filterStartTextInputs = [],
        resultNumberSelector = null,
        noResultMessage = null,
        showDisplayProperty = 'block',
        hideDisplayProperty = 'none',
        callBackFunction = null,
        modifySelectedFunction = null,
        itemsScope = null
    }) {
        this.elementSelector = elementSelector;
        /* Set display property of hide and visible defaults to none and block : string */
        this.showDisplayProperty = showDisplayProperty;
        this.hideDisplayProperty = hideDisplayProperty;
        if (itemsScope === null){
            this.itemsScope = document;
        } else {
            this.itemsScope = document.querySelector(itemsScope);
        }
        this.allResults = this.itemsScope.querySelectorAll(this.elementSelector);
        /* Element to display when no element meets the filter criteria defaults to null : element */
        this.noResult = document.querySelector(noResultMessage);
        /* Element that displays amount of visible results defaults to null : element */
        this.counterElement = document.querySelector(resultNumberSelector);
        /* Set visible counter to number of result elements : int */
        this.showCounter = this.allResults.length;
        /* Get all filterable inputs/selectors in scope : nodelist */
        this.allInputs = document.querySelectorAll('[data-filter]');
        /* Filterable input element which type is checkbox : array */
        if (typeof (filterCheckboxInputs) == 'object' || typeof (filterCheckboxInputs) == 'array') {
            this.filterCheckboxInputs = filterCheckboxInputs;
        }
        /* Filterable select element which type is select : array */
        if (typeof (filterSelectInputs) == 'object' || typeof (filterSelectInputs) == 'array') {
            this.filterSelectInputs = filterSelectInputs;
        }
        /* Filterable select element which type is text and filters by startsWith : array */
        if (typeof (filterStartTextInputs) == 'object' || typeof (filterStartTextInputs) == 'array') {
            this.filterStartTextInputs = filterStartTextInputs;
        }
        /* Filterable inputs which type is text : array */
        if (typeof (filterTextInputs) == 'object' || typeof (filterTextInputs) == 'array') {
            this.filterTextInputs = filterTextInputs;
        }
        /* Filterable inputs which type is range : array */
        if (typeof (filterRangeInputs) == 'object' || typeof (filterRangeInputs) == 'array') {
            this.filterRangeInputs = filterRangeInputs;
        }
        /* Filterable inputs which type is checkbox : array */
        if (typeof (filterRadioInputs) == 'object' || typeof (filterRadioInputs) == 'array') {
            this.filterRadioInputs = filterRadioInputs;
        }

        /* Callback function after filter is done */
        this.callBackFunction = callBackFunction;
        /* Callback function before filter is fired */
        this.modifySelectedFunction = modifySelectedFunction;
        /* Scope in which results should be found, equals to document */
        /* Trigger event when checkbox or input has changed */
        this.allInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.inputCallback();
            });
            input.addEventListener('keyup', () => {
                this.inputCallback();
            });
        });
        this.getAllDataSets();
        this.showAmountResults();
        this.inputCallback();
    }
    /* Return all data attributtes in array */
    getAllDataSets() {
        this.allDataSets = new Array();
        this.allResults.forEach(resultElement => {
            this.allDataSets.push(Object.assign({}, resultElement.dataset))
        });
        return this.allDataSets;
    }
    /* Show all filterable elements */
    showAll() {
        this.allResults.forEach(resultElement => resultElement.style.display = this.showDisplayProperty);
        this.showCounter = this.allResults.length;
    }
    /* Hide all filterable elements */
    hideAll() {
        if (this.noResult != null) {
            this.noResult.style.display = this.hideDisplayProperty;
        }
        this.allResults.forEach(resultElement => resultElement.style.display = this.hideDisplayProperty);
        this.showCounter = 0;
    }
    /* Show no result messag */
    showNoResultMessage() {
        if (this.noResult === null) return;
        this.noResult.style.display = this.showDisplayProperty;
    }
    /* Show item by index */
    showThisItem(index) {
        let showThis = this.itemsScope.querySelector('[data-index="' + index + '"]');
        showThis.style.display = this.showDisplayProperty;
        this.showCounter++;
    }
    /* Function to return true or false for input type text if value starts with search */
    textStartsWithFilter(key, value) {
        let searchString = this.allFilters[key].toString().toLowerCase();
        let lowerValue = value.toLowerCase();
        if (lowerValue.startsWith(searchString)) {
            return true;
        } else {
            return false;
        }
    }
    /* Function to return true or false for input type text */
    textFilter(key, value) {
        let searchString = this.allFilters[key].toString().toLowerCase();
        let lowerValue = value.toLowerCase();
        if (lowerValue.indexOf(searchString) === -1) {
            return false;
        } else {
            return true;
        }
    }
    /* Function to return true or false for input type range */
    rangeFilter(key, value) {
        let minValue = this.allFilters[key][0];
        let maxValue = this.allFilters[key][1];
        if (value.indexOf(',') > -1) {
            let values = value.split(',');
            let maximValue = parseFloat(values[1]);
            let minimValue = parseFloat(values[0]);
            if (maximValue <= maxValue && minimValue >= minValue) {
                return true;
            } else {
                return false;
            }
        }
        if (parseFloat(value) >= minValue && parseFloat(value) <= maxValue){
            return true;
        } else {
            return false;
        }
    }
    /* Function that returns true or false for select elements */
    checkSelect(key, value) {
        /* Check if value contains multiple values (for multi select) */
        if (value.indexOf(',') !== -1){
            return this.allFilters[key].some(item => value.split(',').includes(item));
        }
        return (this.allFilters[key] == value);
    }
    /* Function that returns true or false for input type checkbox or select elements */
    checkFilter(key, value) {
        if (!value || value === '') return false;
        let searchString = this.allFilters[key].toString().toLowerCase();
        let searchArray = searchString.split(',');
        let lowerValue = value.toLowerCase();
        let returns = searchArray.some((search) => lowerValue.indexOf(search) >= 0);
        return returns;
    }
    /* Function that returns true or false for input type radio or select elements */
    radioFilter(key, value) {
        return (this.allFilters[key] == value);
    }
    /* Function to filter elements by using their datasets and selected values */
    filterFunction() {
        /* Hide all elements */
        this.hideAll();
        this.allDataSets.forEach(dataSet => {
            /* Set flag for should hide element to false */
            let shouldShow = [];
            for (var [key, value] of Object.entries(this.allFilters)){
                shouldShow[key] = true;
            }
            for (var [key, value] of Object.entries(this.allFilters)) {
                if (value === null) continue;
                if (this.filterCheckboxInputs.includes(key)) {
                    shouldShow[key] = this.checkFilter(key, dataSet[key]);
                } else if (this.filterSelectInputs.includes(key)) {
                    shouldShow[key] = this.checkSelect(key, dataSet[key]);
                } else if (this.filterStartTextInputs.includes(key)) {
                    shouldShow[key] = this.textStartsWithFilter(key, dataSet[key])
                } else if (this.filterTextInputs.includes(key)) {
                    shouldShow[key] = this.textFilter(key, dataSet[key]);
                } else if (this.filterRadioInputs.includes(key)) {
                    shouldShow[key] = this.radioFilter(key, dataSet[key]);
                } else if (this.filterRangeInputs.includes(key)) {
                    if (this.allFilters[key][0] == this.allFilters[key][2] && this.allFilters[key][1] == this.allFilters[key][3]) continue;
                    shouldShow[key] = this.rangeFilter(key, dataSet[key]);
                }
            }
            if (Object.keys(shouldShow).every((key) => shouldShow[key])) {
                this.showThisItem(dataSet.index);
            }
        });
    }
    showAmountResults() {
        if (this.counterElement === null) return;
        this.counterElement.textContent = this.showCounter;
        return this.showCounter;
    }
    /* Check if all inputs are empty, if so, show all results */
    checkIfAllEmpty() {
        const isEmpty = Object.values(this.allFilters).every(x => (x === null || x === ''));
        if (isEmpty) {
            this.showAll();
            return true;
        } else {
            return false;
        }
    }
    /* Method to get all selected filters */
    getAllSelectedFilters() {
        this.allFilters = new Object;
        this.allInputs.forEach(input => {
            this.allFilters[input.dataset.filter] = null;
        })
    }
    /* Input change function callback */
    inputCallback() {
        /* Grab all selected values */
        this.getAllSelectedFilters();
        this.allInputs.forEach(input => {
            if (input.value == undefined || input.value == null || input.value == '') return;
            if (input.type == 'checkbox' && !input.checked) return;
            let filterKey = input.dataset.filter;
            if (this.allFilters[filterKey] == null) {
                this.allFilters[filterKey] = [];
            }
            if (input.type == 'radio' && this.filterRadioInputs.includes(input.dataset.filter)) {
                if (input.checked == true) {
                    this.allFilters[filterKey] = input.value;
                }
            } else if (input.multiple && (input.tagName == 'select' || input.tagName == 'SELECT')) {
                let multiSelectValues = Array.from(input.querySelectorAll('option:checked')).map(el => el.value);
                this.allFilters[filterKey].push(...multiSelectValues);
            } else if (input.multiple && input.type == 'range') {
                if (input.classList.contains('ghost')) return;
                this.allFilters[filterKey].push(...input.value.split(','));
                this.allFilters[filterKey].push(input.min);
                this.allFilters[filterKey].push(input.max);
            } else {
                this.allFilters[filterKey].push(input.value);
            }
            if (this.filterRadioInputs.includes(input.dataset.filter) && this.allFilters[filterKey].length == 0) {
                this.allFilters[filterKey] = null;
            }
        });
        /* Fire prefilterfunction before filters happen */
        if (this.modifySelectedFunction !== null) {
            this.allFilters = this.modifySelectedFunction(this.allFilters);
        }
        /* Some filter is selected, so perform the filter actions */
        this.filterFunction();
        if (this.showCounter === 0 && !this.checkIfAllEmpty(this.allFilters)) {
            this.showNoResultMessage();
        }
        this.showAmountResults();
        if (this.callBackFunction !== null) {
            this.callBackFunction();
        }
    }
}