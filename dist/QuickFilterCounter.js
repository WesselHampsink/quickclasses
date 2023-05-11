class QuickFilterCounter {
    constructor({ enableOnInputs = true, enableOnSelects = true, counterClass = 'counter', removeCounterFromSelected = true, }) {
        this._enableOnInputs = enableOnInputs;
        this._enableOnSelects = enableOnSelects;
        this._counterClass = counterClass;
        this._removeCounterFromSelected = removeCounterFromSelected;
    }
    init(QuickFilterClass) {
        this._QuickFilterClass = QuickFilterClass;
        this._allInputs = this._QuickFilterClass._allInputs;
        this._allResults = this._QuickFilterClass._allResults;
        this._allInputs.forEach((input) => {
            if (this._enableOnInputs &&
                input instanceof HTMLInputElement &&
                (input.type === 'checkbox' || input.type === 'radio')) {
                this.createCounterElement(this.getLabelByElement(input), this.resultsWhenChecked(input));
            }
            if (input instanceof HTMLInputElement && input.checked && this._removeCounterFromSelected) {
                this.removeOldCounter(this.getLabelByElement(input));
            }
            if (this._enableOnSelects && input instanceof HTMLSelectElement) {
                for (const option of input.options) {
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
        this._oldFilters = JSON.parse(JSON.stringify(this._QuickFilterClass._allFilters));
        const filterKey = (_a = select.dataset) === null || _a === void 0 ? void 0 : _a.filter;
        const filterValue = option.value == '' ? null : option.value;
        let amountWhenChecked = 0;
        // Append value to check to the filters object
        if (this._QuickFilterClass._allFilters[filterKey] === null && filterValue !== null) {
            this._QuickFilterClass._allFilters[filterKey] = [filterValue];
        }
        else if (filterValue === null) {
            this._QuickFilterClass._allFilters[filterKey] = null;
        }
        else {
            this._QuickFilterClass._allFilters[filterKey] = [filterValue];
        }
        this._QuickFilterClass.filterFunction();
        amountWhenChecked = this._QuickFilterClass._showCounter;
        // Reset to original value
        this._QuickFilterClass._allFilters = this._oldFilters;
        return amountWhenChecked;
    }
    resultsWhenChecked(input) {
        var _a;
        this._oldFilters = JSON.parse(JSON.stringify(this._QuickFilterClass._allFilters));
        const filterKey = (_a = input.dataset) === null || _a === void 0 ? void 0 : _a.filter;
        const filterValue = input.value == '' ? null : input.value;
        let amountWhenChecked = 0;
        // Append value to check to the filters object
        if ((this._QuickFilterClass._allFilters[filterKey] === null || (input === null || input === void 0 ? void 0 : input.type) === 'radio') &&
            filterValue !== null) {
            this._QuickFilterClass._allFilters[filterKey] = [filterValue];
        }
        else if (filterValue === null) {
            this._QuickFilterClass._allFilters[filterKey] = null;
        }
        else {
            this._QuickFilterClass._allFilters[filterKey].push(filterValue);
        }
        this._QuickFilterClass.filterFunction();
        amountWhenChecked = this._QuickFilterClass._showCounter;
        // Reset to original value
        this._QuickFilterClass._allFilters = this._oldFilters;
        return amountWhenChecked;
    }
    getLabelByElement(input) {
        const inputId = input === null || input === void 0 ? void 0 : input.id;
        if (inputId)
            return document.querySelector(`label[for="${inputId}"]`);
    }
    createCounterElementHTML(results) {
        const counterElement = document.createElement('span');
        counterElement.className = `${this._counterClass} _quick_counter`;
        counterElement.textContent = `(${results})`;
        return counterElement;
    }
    createCountElementOption(option, results) {
        this.removeOldCounter(option);
        option.append(this.createCounterElementHTML(results));
    }
    createCounterElement(label, results) {
        this.removeOldCounter(label);
        label.append(this.createCounterElementHTML(results));
    }
    removeOldCounter(element) {
        var _a;
        (_a = element.querySelector('._quick_counter')) === null || _a === void 0 ? void 0 : _a.remove();
    }
}
