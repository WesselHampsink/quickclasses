import { CssDisplayProperty, QuickPaginationOptions } from './index';

export default class QuickPagination {
  _chunks: Array<HTMLElement[]> = [];
  _perPage: number;
  _itemsSelector: string;
  _pagesTarget: HTMLElement | null;
  _paginationElement: HTMLElement | null;
  _nextPrevButtons: boolean;
  _pageDisplay: CssDisplayProperty;
  _currentPage: number;
  _amountOfPages: number;
  _amountOfPrevNextItems: number;
  _originalItems: Array<HTMLElement>;
  _contentPrevButton: string;
  _contentNextButton: string;
  _pageClasses: string[];
  _visItems: HTMLElement[] | [] = [];
  _nextButton!: HTMLLIElement;
  _prevButton!: HTMLLIElement;

  /**
   * Paginate class to create quick pagination
   * @param {object} {] object of options
   */
  constructor({
    pagesTarget,
    itemsPerPage = 5,
    itemsSelector = '[data-index]',
    paginationSelector = '#pagination',
    pageDisplayProperty = 'block',
    nextPrevButtons = false,
    contentPrevButton = 'Previous',
    contentNextButton = 'Next',
    pageClasses = ['page', 'row'],
    amountOfPrevNextItems = 1,
  }: QuickPaginationOptions) {
    this._chunks = [];
    this._perPage = itemsPerPage;
    this._itemsSelector = itemsSelector;
    this._pagesTarget = document.querySelector(pagesTarget);
    this._paginationElement = document.querySelector(paginationSelector);
    this._nextPrevButtons = nextPrevButtons;
    this._pageDisplay = pageDisplayProperty;
    this._currentPage = 1;
    this._amountOfPages = 0;
    this._amountOfPrevNextItems = amountOfPrevNextItems;
    this._originalItems = Array.prototype.slice.call(document.querySelectorAll(this._itemsSelector));
    this._contentPrevButton = contentPrevButton;
    this._contentNextButton = contentNextButton;
    this._pageClasses = pageClasses;
    const parentElement = document?.querySelector(this._itemsSelector)?.parentElement;
    if (parentElement?.style !== undefined) {
      parentElement.style.display = 'none';
    }
    this.init();
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
  createPagination(): boolean {
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
  getOriginalItems(): HTMLElement[] {
    return (this._originalItems = Array.prototype.slice.call(document.querySelectorAll(this._itemsSelector)));
  }

  /**
   * getItems method returns all visible items
   * @returns {Array<HTMLElement>} this._visItems
   */
  getItems(): HTMLElement[] {
    this._visItems = this.getOriginalItems().filter((element) => {
      return element.style.display != 'none';
    });
    return this._visItems;
  }

  /**
   * createChunks method creates chunks of the visible items, per this._perPage
   * @returns {Array<HTMLElement[]>} this._chunks
   */
  createChunks(): Array<HTMLElement[]> | [] {
    this._chunks = [];
    let i = 0;
    let n = this._visItems.length;
    while (i <= n) {
      const slicedVisItems: HTMLElement[] = this._visItems.slice(i, (i += this._perPage));
      this._chunks.push(slicedVisItems);
    }
    if (this._chunks[this._chunks?.length - 1]?.length === 0) {
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
  createAnchorTag(i: string, datapageanchortag: boolean): HTMLAnchorElement {
    const anchorTag: HTMLAnchorElement = document.createElement('a');
    anchorTag.classList.add('page-link');
    anchorTag.setAttribute('href', `#page-${i}`);
    anchorTag.setAttribute('aria-label', `Page${i}`);
    anchorTag.setAttribute('data-page-number', i);
    if (datapageanchortag) {
      anchorTag.setAttribute('data-page-anchor-tag', i);
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
  createListItem(i: string, datapageanchortag: boolean): HTMLLIElement {
    const numPage = document.createElement('li');
    numPage.classList.add('page-item');
    numPage.appendChild(this.createAnchorTag(i, datapageanchortag));
    return numPage;
  }

  /**
   * createEmptyListItem method creates empty list item element, with empty anchor tag
   * @returns {HTMLLIElement} noPage
   */
  createEmptyListItem(): HTMLLIElement {
    const noLink = document.createElement('a');
    noLink.classList.add('page-link');
    noLink.setAttribute('aria-disabled', 'true');
    noLink.setAttribute('href', '#');
    noLink.textContent = '...';
    const noPage = document.createElement('li');
    noPage.classList.add('empty-page-link');
    noPage.classList.add('disabled');
    noPage.classList.add('page-item');
    noPage.appendChild(noLink);
    return noPage;
  }

  /**
   * createPageNav method creates a <ol> element with a link for every chunk, empties the paginationElement and places the new pagination
   * @returns {HTMLOListElement} numList
   */
  createPageNav(): HTMLOListElement | void {
    if (this._paginationElement === null) return;
    this._paginationElement.innerHTML = '';
    let numList = document.createElement('ol');
    numList.classList.add('pagination');
    //numList.classList.add('justify-content-center');
    numList.classList.add('flex-wrap');
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
  createPage(i: number): HTMLDivElement {
    let numPage: HTMLDivElement = document.createElement('div');
    for (let i = 0; i < this._pageClasses.length; i++) {
      numPage.classList.add(this._pageClasses[i] ?? '');
    }
    numPage.id = 'page-' + (i + 1);
    numPage.dataset.page = `${i + 1}`;
    numPage.style.display = 'none';
    this._chunks[i]?.forEach((element) => {
      numPage.appendChild(element.cloneNode(true));
    });
    return numPage;
  }

  /**
   * appendPages method appends pages to the pagesTarget div
   * @returns {HTMLElement} this._pagesTarget
   */
  appendPages(): HTMLElement | null {
    this._pagesTarget?.querySelectorAll('[data-page]').forEach((page) => {
      page.remove();
    });
    for (let i = 0; i < this._chunks.length; i++) {
      this._pagesTarget?.appendChild(this.createPage(i));
    }
    return this._pagesTarget;
  }

  /**
   * hideAllPages method hides all generated pages within scope
   */
  hideAllPages() {
    this._pagesTarget?.querySelectorAll('[data-page]')?.forEach((page: Element) => {
      if (page instanceof HTMLElement) {
        page.style.display = 'none';
      }
    });
  }

  /**
   * removeActiveLinks removes all active pagination links
   */
  removeActiveLinks() {
    this._paginationElement?.querySelectorAll('[data-page-anchor-tag]').forEach((pageEl) => {
      pageEl?.parentElement?.classList.remove('active');
    });
  }

  /**
   * showPage method to show the right page based on the
   * @param {HTMLElement} anchor
   * @param {number} index
   */
  showPage(anchor: HTMLElement, index: number) {
    if (anchor.getAttribute('aria-disabled')) return;
    this.hideAllPages();
    this.removeActiveLinks();
    if (
      anchor?.parentElement?.id !== 'pagination-next-button' &&
      anchor?.parentElement?.id !== 'pagination-prev-button'
    ) {
      anchor?.parentElement?.classList.add('active');
      const pageEl: Element | null | undefined = this._pagesTarget?.querySelector(
        '[data-page="' + anchor.dataset.pageAnchorTag + '"]',
      );
      if (pageEl instanceof HTMLElement) {
        pageEl.style.display = this._pageDisplay;
      }
      this._currentPage = parseInt(anchor?.dataset?.pageAnchorTag || '0');
    } else {
      this._paginationElement
        ?.querySelector('[data-page-anchor-tag="' + index + '"]')
        ?.parentElement?.classList.add('active');
      const pageEl: Element | null | undefined = this._pagesTarget?.querySelector(
        '[data-page="' + index + '"]',
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
    this._paginationElement?.querySelectorAll('a').forEach((anchor) => {
      if (parseInt(anchor?.dataset?.pageAnchorTag || '0') === this._currentPage) {
        this.showPage(anchor, this._currentPage);
      }
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        if (!anchor.dataset.pageAnchorTag && this._nextPrevButtons) {
          this.showPage(anchor, this._currentPage + parseInt(anchor?.dataset?.pageNumber || '0'));
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
  setContentAndIdForListItem(item: HTMLLIElement, nextOrPrev: 'next' | 'prev'): HTMLLIElement {
    item.id = 'pagination-' + nextOrPrev + '-button';
    if (nextOrPrev === 'next' && item.children[0] !== undefined) {
      item.children[0].innerHTML = this._contentNextButton;
    }
    if (nextOrPrev === 'prev' && item.children[0] !== undefined) {
      item.children[0].innerHTML = this._contentPrevButton;
    }
    return item;
  }

  /**
   * enableListItem enables disabled buttons
   */
  enableListItem() {
    if (this._nextPrevButtons === false) return;
    if (
      this._paginationElement?.children[0]?.lastElementChild !== undefined &&
      this._paginationElement?.children[0].firstElementChild !== undefined
    ) {
      let nextButton: Element | null = this._paginationElement?.children[0].lastElementChild;
      let prevButton: Element | null = this._paginationElement?.children[0].firstElementChild;
      prevButton?.classList.remove('disabled');
      nextButton?.classList.remove('disabled');
      if (prevButton?.children[0] !== undefined && nextButton?.children[0] !== undefined) {
        prevButton?.children[0].removeAttribute('aria-disabled');
        nextButton?.children[0].removeAttribute('aria-disabled');
      }
    }
  }

  /**
   * disableListItem adds disabled class to page list item
   * @param {HTMLLIElement} item
   * @returns {HTMLLIElement} item
   */
  disableListItem(item: HTMLLIElement): HTMLLIElement {
    item.children[0]?.setAttribute('aria-disabled', 'true');
    item.classList.add('disabled');
    return item;
  }

  /**
   * canClickNextPrev method checks wether next and previous button can be clicked
   * @param {number} index
   * @returns {boolean}
   */
  canClickNextPrev(index: number): boolean {
    if (index < 1 || index > this._amountOfPages) {
      return false;
    }
    return true;
  }

  /**
   * checkCanClinkNextPrev methods tries if next or prev button can be clicked or not (canClickNextPrev), in that case, fires disableListItem
   */
  checkCanClickNextPrev() {
    if (this._nextPrevButtons === false) return;
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
    this._prevButton = this.setContentAndIdForListItem(this.createListItem('-1', false), 'prev');
    this._nextButton = this.setContentAndIdForListItem(this.createListItem('+1', false), 'next');
    if (this._paginationElement?.children[0] !== undefined) {
      this._paginationElement?.children[0].prepend(this._prevButton);
      this._paginationElement?.children[0].append(this._nextButton);
    }
  }

  /**
   * calculateInReach method calculates wether given index is in the range of amount of next and prev items
   * @param {number} index
   * @returns {boolean}
   */
  calculateInReach(index: number): boolean {
    if (index === this._chunks.length || index === 1) {
      return true;
    } else {
      return (
        (index - (this._currentPage - this._amountOfPrevNextItems)) *
          (index - (this._currentPage + this._amountOfPrevNextItems)) <=
        0
      );
    }
  }

  /**
   * Shows all page item elements
   */
  showAllPaginationElements() {
    this._paginationElement?.children[0]?.childNodes.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.display = 'list-item';
      }
    });
  }

  /**
   * removeAllDotElements removes all empty page links, to reset its state
   */
  removeAllDotElements() {
    this._paginationElement?.querySelectorAll('.empty-page-link').forEach((element) => {
      element.remove();
    });
  }

  /**
   * replaceElementsWithDots method hides all pagination elements that should not be visible and fires event to remove and add dotElements
   * @param {array} numsBefore
   * @param {array} numsAfter
   */
  replaceElementsWithDots(numsBefore: Array<any>, numsAfter: Array<any>) {
    if (numsBefore.length > 0) {
      this._paginationElement?.children[0]?.insertBefore(
        this.createEmptyListItem(),
        numsBefore[0].parentNode,
      );
      for (let i = 0; i < numsBefore.length; i++) {
        numsBefore[i].parentNode.style.display = 'none';
      }
    }
    if (numsAfter.length > 0) {
      this._paginationElement?.children[0]?.insertBefore(
        this.createEmptyListItem(),
        numsAfter[numsAfter.length - 1].parentNode,
      );
      for (let i = 0; i < numsAfter.length; i++) {
        numsAfter[i].parentNode.style.display = 'none';
      }
    }
  }

  /**
   * replaceNumbersWithDots method replaces pagination items with dots
   */
  replaceNumbersWithDots() {
    let numsBefore: HTMLElement[] = [];
    let numsAfter: HTMLElement[] = [];
    this._paginationElement?.querySelectorAll('[data-page-anchor-tag]').forEach((item: Element) => {
      if (item instanceof HTMLElement) {
        let itemIndex = parseInt(item?.dataset?.pageAnchorTag || '0');
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
}
