import { QuickFilterCounterOptions, QuickFilterObject } from 'source';
import QuickFilter from './QuickFilter';

export default class QuickFilterCounter {
  _enableOnInputs: boolean;
  _enableOnSelects: boolean;
  _counterClass: string;
  _QuickFilterClass!: QuickFilter;
  _allFilters: QuickFilterObject;
  _oldFilters!: QuickFilterObject;
  _allInputs!: NodeListOf<HTMLInputElement> | NodeListOf<HTMLSelectElement> | null;
  _allResults!: NodeListOf<HTMLElement> | undefined;
  _allShown: HTMLElement[] = [];
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
    this._allFilters = {};
  }

  init(QuickFilterClass: QuickFilter) {
    this._QuickFilterClass = QuickFilterClass;
    this._allInputs = this._QuickFilterClass._allInputs;
    this._allResults = this._QuickFilterClass._allResults;
    this._allInputs?.forEach((input: HTMLInputElement | HTMLSelectElement) => {
      if (
        this._enableOnInputs &&
        input instanceof HTMLInputElement &&
        (input.type === 'checkbox' || input.type === 'radio')
      ) {
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

  resultsWhenCheckedSelect(select: HTMLSelectElement, option: HTMLOptionElement): number {
    this._oldFilters = JSON.parse(JSON.stringify(this._QuickFilterClass._allFilters));
    const filterKey = select.dataset?.filter;
    if (filterKey === undefined) return 0;
    const filterValue = option.value == '' ? null : option.value;
    let amountWhenChecked = 0;
    // Append value to check to the filters object
    if (this._QuickFilterClass._allFilters[filterKey] === null && filterValue !== null) {
      this._QuickFilterClass._allFilters[filterKey] = [filterValue];
    } else if (filterValue === null) {
      this._QuickFilterClass._allFilters[filterKey] = null;
    } else {
      this._QuickFilterClass._allFilters[filterKey] = [filterValue];
    }
    this._QuickFilterClass.filterFunction();
    amountWhenChecked = this._QuickFilterClass._showCounter;
    // Reset to original value
    this._QuickFilterClass._allFilters = this._oldFilters;
    return amountWhenChecked;
  }

  resultsWhenChecked(input: HTMLInputElement): number {
    this._oldFilters = JSON.parse(JSON.stringify(this._QuickFilterClass._allFilters));
    const filterKey = input.dataset?.filter;
    if (filterKey === undefined) return 0;
    const filterValue = input.value == '' ? null : input.value;
    let amountWhenChecked = 0;
    // Append value to check to the filters object
    if (
      (this._QuickFilterClass._allFilters[filterKey] === null || input?.type === 'radio') &&
      filterValue !== null
    ) {
      this._QuickFilterClass._allFilters[filterKey] = [filterValue];
    } else if (filterValue === null) {
      this._QuickFilterClass._allFilters[filterKey] = null;
    } else {
      this._QuickFilterClass._allFilters[filterKey]?.push(filterValue);
    }
    this._QuickFilterClass.filterFunction();
    amountWhenChecked = this._QuickFilterClass._showCounter;
    // Reset to original value
    this._QuickFilterClass._allFilters = this._oldFilters;
    return amountWhenChecked;
  }

  getLabelByElement(input: HTMLInputElement): HTMLLabelElement | null {
    const inputId = input?.id;
    if (inputId) return document.querySelector(`label[for="${inputId}"]`);
    return null;
  }

  createCounterElementHTML(results: number): HTMLSpanElement {
    const counterElement: HTMLSpanElement = document.createElement('span');
    counterElement.className = `${this._counterClass} _quick_counter`;
    counterElement.textContent = `(${results})`;
    return counterElement;
  }

  createCountElementOption(option: HTMLOptionElement, results: number) {
    this.removeOldCounter(option);
    option.append(this.createCounterElementHTML(results));
  }

  createCounterElement(label: HTMLLabelElement | null, results: number) {
    if (label !== null) {
      this.removeOldCounter(label);
      label.append(this.createCounterElementHTML(results));
    }
  }

  removeOldCounter(element: HTMLLabelElement | HTMLOptionElement | null) {
    if (element === null) return;
    element.querySelector('._quick_counter')?.remove();
  }
}
