import QuickFilter from './QuickFilter';
import QuickFilterCounter from './QuickFilterCounter';
import QuickPagination from './QuickPagination';
import QuickSorting from './QuickSorting';

export type QuickFilterCounterOptions = {
  enableOnInputs: boolean;
  enableOnSelects: boolean;
  counterClass: string;
  QuickFilterClass: QuickFilter;
  removeCounterFromSelected: boolean;
};

export type CssDisplayProperty =
  | 'block'
  | 'inline'
  | 'inline-block'
  | 'flex'
  | 'inline-flex'
  | 'grid'
  | 'inline-grid'
  | 'flow-root'
  | 'none'
  | 'contents'
  | 'table'
  | 'table-row'
  | 'list-item'
  | 'inherit'
  | 'initial'
  | 'revert'
  | 'revert-layer'
  | 'unset';

export interface QuickFilterOptions {
  itemsSelector: string;
  elementSelector: string | undefined;
  filterCheckboxInputs: string[] | undefined;
  filterSelectInputs: string[] | undefined;
  filterTextInputs: string[] | undefined;
  filterRangeInputs: string[] | undefined;
  filterRadioInputs: string[] | undefined;
  filterStartTextInputs: string[] | undefined;
  resultNumberSelector: string | undefined;
  noResultMessage: string | undefined;
  showDisplayProperty: CssDisplayProperty;
  hideDisplayProperty: CssDisplayProperty;
  callBackFunction: ((arg0: QuickFilter) => void) | undefined;
  modifySelectedFunction: ((object: QuickFilterObject) => QuickFilterObject) | null;
  itemsScope: string | null | Document;
  keyupDebounce: number;
}

export type QuickFilterValue = string[] | null;
export type QuickFilterObjectKey = string;

export type DebounceEventCallback = () => void;
export type DebounceExecutable = () => void;

export type QuickFilterObject = {
  [key: QuickFilterObjectKey]: QuickFilterValue;
};

export type QuickSortingOrder = 'ASC' | 'DESC' | null;
export type QuickSortingType = 'CHAR' | 'NUM' | null;
export type QuickSortingSelected = {
  key: 'random' | string;
  order: QuickSortingOrder;
  type: QuickSortingType;
};

export type QuickSortingOptions = {
  itemsSelector: string | undefined;
  elementsSelector: string | undefined;
  sortSelectSelector: string;
  parentElement: null | string;
  callBackFunction: undefined | (() => void);
};

export interface QuickPaginationOptions {
  pagesTarget: string | null;
  itemsPerPage: number;
  itemsSelector: string;
  paginationSelector: string;
  selectorSuffix: string;
  pageDisplayProperty: CssDisplayProperty;
  nextPrevButtons: boolean;
  contentPrevButton: string;
  contentNextButton: string;
  pageClasses: string[];
  amountOfPrevNextItems: number;
}

export { QuickFilter, QuickFilterCounter, QuickPagination, QuickSorting };
