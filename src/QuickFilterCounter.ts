type QuickFilterCounterOptions = {
  enableOnInputs: boolean;
  enableOnSelects: boolean;
  counterClass: string;
  QuickFilterClass: QuickFilter;
  removeCounterFromSelected: boolean;
};

class QuickFilterCounter {
  _enableOnInputs: boolean;
  _enableOnSelects: boolean;
  _counterClass: string;
  _QuickFilterClass: QuickFilter;
  _allFilters: QuickFilterObject;
  _oldFilters: QuickFilterObject;
  _allInputs: NodeListOf<HTMLInputElement> | NodeListOf<HTMLSelectElement>;
  _allResults: NodeListOf<HTMLElement>;
  _allShown: HTMLElement[];
  _removeCounterFromSelected: boolean;

  constructor({
    enableOnInputs = true,
    enableOnSelects = true,
    counterClass = 'counter',
    removeCounterFromSelected = true,
  }: QuickFilterCounterOptions) {
    this._enableOnInputs = enableOnInputs;
    this._enableOnSelects = enableOnSelects;
    this._counterClass = counterClass;
    this._removeCounterFromSelected = removeCounterFromSelected;
  }

  init(QuickFilterClass: QuickFilter) {
    this._QuickFilterClass = QuickFilterClass;
    this._allInputs = this._QuickFilterClass._allInputs;
    this._allResults = this._QuickFilterClass._allResults;
    this._allInputs.forEach((input: HTMLInputElement | HTMLSelectElement) => {
      if (
        this._enableOnInputs &&
        input instanceof HTMLInputElement &&
        (input.type === 'checkbox' || input.type === 'radio')
      ) {
        this.createCounterElement(this.getLabelByElement(input), this.resultsWhenChecked(input));
      }
      if (input instanceof HTMLInputElement && input.checked && this._removeCounterFromSelected) {
        this.removeOldCounterFromLabel(this.getLabelByElement(input));
      }
    });
  }

  resultsWhenChecked(input: HTMLInputElement): number {
    this._oldFilters = JSON.parse(JSON.stringify(this._QuickFilterClass._allFilters));
    const filterKey = input.dataset?.filter;
    const filterValue = input.value == '' ? null : input.value;
    let amountWhenChecked = 0;
    // Append value to check to the filters object
    if ((this._QuickFilterClass._allFilters[filterKey] === null || input?.type === 'radio') && filterValue !== null) {
      this._QuickFilterClass._allFilters[filterKey] = [filterValue];
    } else if (filterValue === null) {
      this._QuickFilterClass._allFilters[filterKey] = null;
    } else {
      this._QuickFilterClass._allFilters[filterKey].push(filterValue);
    }
    this._QuickFilterClass.filterFunction();
    amountWhenChecked = this._QuickFilterClass._showCounter;
    // Reset to original value
    this._QuickFilterClass._allFilters = this._oldFilters;
    return amountWhenChecked;
  }

  getLabelByElement(input: HTMLInputElement): HTMLLabelElement {
    const inputId = input?.id;
    if (inputId) return document.querySelector(`label[for="${inputId}"]`);
  }

  createCounterElement(label: HTMLLabelElement, results: number) {
    this.removeOldCounterFromLabel(label);
    const counterElement: HTMLSpanElement = document.createElement('span');
    counterElement.className = `${this._counterClass} _quick_counter`;
    counterElement.textContent = `(${results})`;
    label.append(counterElement);
  }

  removeOldCounterFromLabel(label: HTMLLabelElement) {
    label.querySelector('._quick_counter')?.remove();
  }
}
