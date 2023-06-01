import { QuickFilterCounterOptions, QuickFilterObject } from 'source';
import QuickFilter from './QuickFilter';
export default class QuickFilterCounter {
    _enableOnInputs: boolean;
    _enableOnSelects: boolean;
    _counterClass: string;
    _QuickFilterClass: QuickFilter;
    _allFilters: QuickFilterObject;
    _oldFilters: QuickFilterObject;
    _allInputs: NodeListOf<HTMLInputElement> | NodeListOf<HTMLSelectElement> | null;
    _allResults: NodeListOf<HTMLElement> | undefined;
    _allShown: HTMLElement[];
    _removeCounterFromSelected: boolean;
    constructor({ enableOnInputs, enableOnSelects, counterClass, removeCounterFromSelected, }: QuickFilterCounterOptions);
    init(QuickFilterClass: QuickFilter): void;
    resultsWhenCheckedSelect(select: HTMLSelectElement, option: HTMLOptionElement): number;
    resultsWhenChecked(input: HTMLInputElement): number;
    getLabelByElement(input: HTMLInputElement): HTMLLabelElement | null;
    createCounterElementHTML(results: number): HTMLSpanElement;
    createCountElementOption(option: HTMLOptionElement, results: number): void;
    createCounterElement(label: HTMLLabelElement | null, results: number): void;
    removeOldCounter(element: HTMLLabelElement | HTMLOptionElement | null): void;
}
