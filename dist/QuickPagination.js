"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QuickPagination {
    /**
     * Paginate class to create quick pagination
     * @param {object} {] object of options
     */
    constructor({ pagesTarget, itemsPerPage = 5, itemsSelector = '[data-index]', paginationSelector = '#pagination', pageDisplayProperty = 'block', nextPrevButtons = false, contentPrevButton = 'Previous', contentNextButton = 'Next', pageClasses = ['page', 'row'], amountOfPrevNextItems = 1, }) {
        var _a;
        this._chunks = [];
        this._visItems = [];
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
        const parentElement = (_a = document === null || document === void 0 ? void 0 : document.querySelector(this._itemsSelector)) === null || _a === void 0 ? void 0 : _a.parentElement;
        if ((parentElement === null || parentElement === void 0 ? void 0 : parentElement.style) !== undefined) {
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
        return (this._originalItems = Array.prototype.slice.call(document.querySelectorAll(this._itemsSelector)));
    }
    /**
     * getItems method returns all visible items
     * @returns {Array<HTMLElement>} this._visItems
     */
    getItems() {
        this._visItems = this.getOriginalItems().filter((element) => {
            return element.style.display != 'none';
        });
        return this._visItems;
    }
    /**
     * createChunks method creates chunks of the visible items, per this._perPage
     * @returns {Array<HTMLElement[]>} this._chunks
     */
    createChunks() {
        this._chunks = [];
        let i = 0;
        let n = this._visItems.length;
        while (i <= n) {
            const slicedVisItems = this._visItems.slice(i, (i += this._perPage));
            this._chunks.push(slicedVisItems);
        }
        if (this._chunks[this._chunks.length - 1].length === 0) {
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
        const anchorTag = document.createElement('a');
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
    createListItem(i, datapageanchortag) {
        const numPage = document.createElement('li');
        numPage.classList.add('page-item');
        numPage.appendChild(this.createAnchorTag(i, datapageanchortag));
        return numPage;
    }
    /**
     * createEmptyListItem method creates empty list item element, with empty anchor tag
     * @returns {HTMLLIElement} noPage
     */
    createEmptyListItem() {
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
    createPageNav() {
        if (this._paginationElement === null)
            return;
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
    createPage(i) {
        let numPage = document.createElement('div');
        for (let i = 0; i < this._pageClasses.length; i++) {
            numPage.classList.add(this._pageClasses[i]);
        }
        numPage.id = 'page-' + (i + 1);
        numPage.dataset.page = `${i + 1}`;
        numPage.style.display = 'none';
        this._chunks[i].forEach((element) => {
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
        (_a = this._pagesTarget) === null || _a === void 0 ? void 0 : _a.querySelectorAll('[data-page]').forEach((page) => {
            page.remove();
        });
        for (let i = 0; i < this._chunks.length; i++) {
            (_b = this._pagesTarget) === null || _b === void 0 ? void 0 : _b.appendChild(this.createPage(i));
        }
        return this._pagesTarget;
    }
    /**
     * hideAllPages method hides all generated pages within scope
     */
    hideAllPages() {
        var _a, _b;
        (_b = (_a = this._pagesTarget) === null || _a === void 0 ? void 0 : _a.querySelectorAll('[data-page]')) === null || _b === void 0 ? void 0 : _b.forEach((page) => {
            if (page instanceof HTMLElement) {
                page.style.display = 'none';
            }
        });
    }
    /**
     * removeActiveLinks removes all active pagination links
     */
    removeActiveLinks() {
        var _a;
        (_a = this._paginationElement) === null || _a === void 0 ? void 0 : _a.querySelectorAll('[data-page-anchor-tag]').forEach((pageEl) => {
            var _a;
            (_a = pageEl === null || pageEl === void 0 ? void 0 : pageEl.parentElement) === null || _a === void 0 ? void 0 : _a.classList.remove('active');
        });
    }
    /**
     * showPage method to show the right page based on the
     * @param {HTMLElement} anchor
     * @param {number} index
     */
    showPage(anchor, index) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (anchor.getAttribute('aria-disabled'))
            return;
        this.hideAllPages();
        this.removeActiveLinks();
        if (((_a = anchor === null || anchor === void 0 ? void 0 : anchor.parentElement) === null || _a === void 0 ? void 0 : _a.id) !== 'pagination-next-button' &&
            ((_b = anchor === null || anchor === void 0 ? void 0 : anchor.parentElement) === null || _b === void 0 ? void 0 : _b.id) !== 'pagination-prev-button') {
            (_c = anchor === null || anchor === void 0 ? void 0 : anchor.parentElement) === null || _c === void 0 ? void 0 : _c.classList.add('active');
            const pageEl = (_d = this._pagesTarget) === null || _d === void 0 ? void 0 : _d.querySelector('[data-page="' + anchor.dataset.pageAnchorTag + '"]');
            if (pageEl instanceof HTMLElement) {
                pageEl.style.display = this._pageDisplay;
            }
            this._currentPage = parseInt(((_e = anchor === null || anchor === void 0 ? void 0 : anchor.dataset) === null || _e === void 0 ? void 0 : _e.pageAnchorTag) || '0');
        }
        else {
            (_h = (_g = (_f = this._paginationElement) === null || _f === void 0 ? void 0 : _f.querySelector('[data-page-anchor-tag="' + index + '"]')) === null || _g === void 0 ? void 0 : _g.parentElement) === null || _h === void 0 ? void 0 : _h.classList.add('active');
            const pageEl = (_j = this._pagesTarget) === null || _j === void 0 ? void 0 : _j.querySelector('[data-page="' + index + '"]');
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
        (_a = this._paginationElement) === null || _a === void 0 ? void 0 : _a.querySelectorAll('a').forEach((anchor) => {
            var _a;
            if (parseInt(((_a = anchor === null || anchor === void 0 ? void 0 : anchor.dataset) === null || _a === void 0 ? void 0 : _a.pageAnchorTag) || '0') === this._currentPage) {
                this.showPage(anchor, this._currentPage);
            }
            anchor.addEventListener('click', (e) => {
                var _a;
                e.preventDefault();
                if (!anchor.dataset.pageAnchorTag && this._nextPrevButtons) {
                    this.showPage(anchor, this._currentPage + parseInt(((_a = anchor === null || anchor === void 0 ? void 0 : anchor.dataset) === null || _a === void 0 ? void 0 : _a.pageNumber) || '0'));
                }
                else {
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
        item.id = 'pagination-' + nextOrPrev + '-button';
        if (nextOrPrev === 'next') {
            item.children[0].innerHTML = this._contentNextButton;
        }
        if (nextOrPrev === 'prev') {
            item.children[0].innerHTML = this._contentPrevButton;
        }
        return item;
    }
    /**
     * enableListItem enables disabled buttons
     */
    enableListItem() {
        var _a, _b;
        if (this._nextPrevButtons === false)
            return;
        let nextButton = (_a = this._paginationElement) === null || _a === void 0 ? void 0 : _a.children[0].lastElementChild;
        let prevButton = (_b = this._paginationElement) === null || _b === void 0 ? void 0 : _b.children[0].firstElementChild;
        prevButton === null || prevButton === void 0 ? void 0 : prevButton.classList.remove('disabled');
        nextButton === null || nextButton === void 0 ? void 0 : nextButton.classList.remove('disabled');
        prevButton === null || prevButton === void 0 ? void 0 : prevButton.children[0].removeAttribute('aria-disabled');
        nextButton === null || nextButton === void 0 ? void 0 : nextButton.children[0].removeAttribute('aria-disabled');
    }
    /**
     * disableListItem adds disabled class to page list item
     * @param {HTMLLIElement} item
     * @returns {HTMLLIElement} item
     */
    disableListItem(item) {
        item.children[0].setAttribute('aria-disabled', 'true');
        item.classList.add('disabled');
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
        var _a, _b;
        this._prevButton = this.setContentAndIdForListItem(this.createListItem('-1', false), 'prev');
        this._nextButton = this.setContentAndIdForListItem(this.createListItem('+1', false), 'next');
        (_a = this._paginationElement) === null || _a === void 0 ? void 0 : _a.children[0].prepend(this._prevButton);
        (_b = this._paginationElement) === null || _b === void 0 ? void 0 : _b.children[0].append(this._nextButton);
    }
    /**
     * calculateInReach method calculates wether given index is in the range of amount of next and prev items
     * @param {number} index
     * @returns {boolean} true/false
     */
    calculateInReach(index) {
        if (index === this._chunks.length || index === 1) {
            return true;
        }
        else {
            return ((index - (this._currentPage - this._amountOfPrevNextItems)) *
                (index - (this._currentPage + this._amountOfPrevNextItems)) <=
                0);
        }
    }
    /**
     * Shows all page item elements
     */
    showAllPaginationElements() {
        var _a;
        (_a = this._paginationElement) === null || _a === void 0 ? void 0 : _a.children[0].childNodes.forEach((element) => {
            if (element instanceof HTMLElement) {
                element.style.display = 'list-item';
            }
        });
    }
    /**
     * removeAllDotElements removes all empty page links, to reset its state
     */
    removeAllDotElements() {
        var _a;
        (_a = this._paginationElement) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.empty-page-link').forEach((element) => {
            element.remove();
        });
    }
    /**
     * replaceElementsWithDots method hides all pagination elements that should not be visible and fires event to remove and add dotElements
     * @param {array} numsBefore
     * @param {array} numsAfter
     */
    replaceElementsWithDots(numsBefore, numsAfter) {
        var _a, _b;
        if (numsBefore.length > 0) {
            (_a = this._paginationElement) === null || _a === void 0 ? void 0 : _a.children[0].insertBefore(this.createEmptyListItem(), numsBefore[0].parentNode);
            for (let i = 0; i < numsBefore.length; i++) {
                numsBefore[i].parentNode.style.display = 'none';
            }
        }
        if (numsAfter.length > 0) {
            (_b = this._paginationElement) === null || _b === void 0 ? void 0 : _b.children[0].insertBefore(this.createEmptyListItem(), numsAfter[numsAfter.length - 1].parentNode);
            for (let i = 0; i < numsAfter.length; i++) {
                numsAfter[i].parentNode.style.display = 'none';
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
        (_a = this._paginationElement) === null || _a === void 0 ? void 0 : _a.querySelectorAll('[data-page-anchor-tag]').forEach((item) => {
            var _a;
            if (item instanceof HTMLElement) {
                let itemIndex = parseInt(((_a = item === null || item === void 0 ? void 0 : item.dataset) === null || _a === void 0 ? void 0 : _a.pageAnchorTag) || '0');
                if (!this.calculateInReach(itemIndex)) {
                    if (itemIndex < this._currentPage) {
                        numsBefore.push(item);
                    }
                    else {
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
exports.default = QuickPagination;
//# sourceMappingURL=QuickPagination.js.map