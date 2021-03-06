class QuickPagination {
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
        amountOfPrevNextItems = 1
    }) {
        this.chunks = [];
        this.perPage = itemsPerPage;
        this.itemsSelector = itemsSelector;
        this.pagesTarget = document.querySelector(pagesTarget);
        this.paginationElement = document.querySelector(paginationSelector);
        this.nextPrevButtons = nextPrevButtons;
        this.pageDisplay = pageDisplayProperty;
        this.currentPage = 1;
        this.amountOfPages = 0;
        this.amountOfPrevNextItems = amountOfPrevNextItems;
        this.originalItems = Array.prototype.slice.call(document.querySelectorAll(this.itemsSelector));
        this.contentPrevButton = contentPrevButton;
        this.contentNextButton = contentNextButton;
        this.pageClasses = pageClasses;
        document.querySelector(this.itemsSelector).parentElement.style.display = 'none';
        this.init();
    }
    /**
     * init method to fire all methods
     */
    init() {
        this.currentPage = 1;
        this.getItems();
        this.createChunks();
        this.appendPages();
        this.createPagination();
        this.addClickEvents();
    }
    /**
     * createPagination method calls methods to create the pagination elements
     * @param {boolean} callReplaceNumbers
     * @param {function} inbetweenFunction
     * @returns {boolean} true
     */
    createPagination() {
        this.createPageNav();
        if (this.nextPrevButtons) {
            this.createNextPrev();
        }
        return true;
    }
    getOriginalItems() {
        return this.originalItems = Array.prototype.slice.call(document.querySelectorAll(this.itemsSelector));
    }
    /**
     * getItems method returns all visible items 
     * @returns {object} this.visItems
     */
    getItems() {
        this.visItems = this.getOriginalItems().filter((element) => {
            return (element.style.display != 'none')
        })
        return this.visItems;
    }
    /**
     * createChunks method creates chunks of the visible items, per this.perPage
     * @returns {array} chunks
     */
    createChunks() {
        this.chunks = [];
        let i = 0;
        let n = this.visItems.length;
        while (i <= n) {
            this.chunks.push(this.visItems.slice(i, i += this.perPage));
        }
        if (this.chunks[this.chunks.length - 1].length === 0) {
            this.chunks.pop();
        }
        this.amountOfPages = this.chunks.length;
        return this.chunks;
    }
    /**
     * createAnchorTag method creates anchor tag for the pagination list item
     * @param {number} i 
     * @param {bool} datapageanchortag add data-page-anchor-tag 
     * @returns {HTMLAnchorElement} anchorTag
     */
    createAnchorTag(i, datapageanchortag) {
        const anchorTag = document.createElement('a');
        anchorTag.classList.add('page-link');
        anchorTag.setAttribute('href', '#page-' + i);
        anchorTag.setAttribute('aria-label', 'Page ' + i);
        anchorTag.setAttribute('data-page-number', i);
        if (datapageanchortag) {
            anchorTag.setAttribute('data-page-anchor-tag', i);
        }
        anchorTag.textContent = i;
        return anchorTag;
    }
    /**
     * createListItem method creates list item element, with anchor tag
     * @param {number} i 
     * @param {bool} datapageanchortag add data-page-anchor-tag 
     * @returns {HTMLLIElement} numPage
     */
    createListItem(i, datapageanchortag) {
        const numPage = document.createElement('li');
        numPage.classList.add('page-item');
        numPage.appendChild(this.createAnchorTag(i, datapageanchortag))
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
        this.paginationElement.innerHTML = '';
        let numList = document.createElement('ol');
        numList.classList.add('pagination');
        //numList.classList.add('justify-content-center');
        numList.classList.add('flex-wrap');
        for (let i = 0; i < this.chunks.length; i++) {
            numList.appendChild(this.createListItem(i + 1, true));
        }
        this.paginationElement.appendChild(numList);
        return numList;
    }
    /**
     * createPage method creates a page for every chunk
     * @param {number} index 
     * @returns {HTMLDivElement} page
     */
    createPage(i) {
        let numPage = document.createElement('div');
        for (let i = 0; i < this.pageClasses.length; i++) {
            numPage.classList.add(this.pageClasses[i]);
        }
        numPage.id = 'page-' + (i + 1);
        numPage.dataset.page = i + 1;
        numPage.style.display = 'none';
        this.chunks[i].forEach((element) => {
            numPage.appendChild(element.cloneNode(true));
        });
        return numPage;
    }
    /**
     * appendPages method appends pages to the pagesTarget div
     * @returns {HTMLElement} this.pagesTarget
     */
    appendPages() {
        this.pagesTarget.querySelectorAll('[data-page]').forEach((page) => {
            page.remove();
        });
        for (let i = 0; i < this.chunks.length; i++) {
            this.pagesTarget.appendChild(this.createPage(i))
        }
        return this.pagesTarget;
    }
    /**
     * hideAllPages method hides all generated pages within scope
     */
    hideAllPages() {
        this.pagesTarget.querySelectorAll('[data-page]').forEach((page) => {
            page.style.display = 'none';
        })
    }
    /**
     * removeActiveLinks removes all active pagination links
     */
    removeActiveLinks() {
        this.paginationElement.querySelectorAll('[data-page-anchor-tag]').forEach(pageEl => {
            pageEl.parentNode.classList.remove('active');
        })
    }
    /**
     * showPage method to show the right page based on the 
     * @param {HTMLElement} anchor 
     */
    showPage(anchor, index) {
        if (anchor.getAttribute('aria-disabled')) return;
        this.hideAllPages();
        this.removeActiveLinks();
        if (anchor.parentNode.id !== 'pagination-next-button' && anchor.parentNode.id !== 'pagination-prev-button') {
            anchor.parentNode.classList.add('active');
            this.pagesTarget.querySelector('[data-page="' + anchor.dataset.pageAnchorTag + '"]').style.display = this.pageDisplay;
            this.currentPage = parseInt(anchor.dataset.pageAnchorTag);
        } else {
            this.paginationElement.querySelector('[data-page-anchor-tag="' + index + '"]').parentNode.classList.add('active');
            this.pagesTarget.querySelector('[data-page="' + index + '"]').style.display = this.pageDisplay;
            this.currentPage = parseInt(index);
        }
        this.replaceNumbersWithDots();
        this.checkCanClickNextPrev();
    }
    /**
     * addClickEvents method to append click events to paginators and forces check previous and next button if active
     */
    addClickEvents() {
        this.paginationElement.querySelectorAll('a').forEach((anchor) => {
            if (parseInt(anchor.dataset.pageAnchorTag) === this.currentPage) {
                this.showPage(anchor);
            }
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                if (!anchor.dataset.pageAnchorTag && this.nextPrevButtons) {
                    this.showPage(anchor, this.currentPage + parseInt(anchor.dataset.pageNumber));
                } else {
                    this.showPage(anchor);
                }
            })
        })
    }
    /**
     * setContentAndIdForListItem sets the content for previous and next button defaults to Previous and Next
     * @param {*} item 
     * @returns {HTMLLIElement} item
     */
    setContentAndIdForListItem(item, nextOrPrev) {
        item.id = 'pagination-' + nextOrPrev + '-button';
        if (nextOrPrev === 'next') {
            item.children[0].innerHTML = this.contentNextButton;
        }
        if (nextOrPrev === 'prev') {
            item.children[0].innerHTML = this.contentPrevButton;
        }
        return item;
    }
    /**
     * enableListItem enables disabled buttons
     */
    enableListItem() {
        if (this.nextPrevButtons === false) return;
        let prevButton = this.paginationElement.children[0].firstChild;
        let nextButton = this.paginationElement.children[0].lastChild;
        prevButton.classList.remove('disabled');
        nextButton.classList.remove('disabled');
        prevButton.children[0].removeAttribute('aria-disabled');
        nextButton.children[0].removeAttribute('aria-disabled');
    }
    /**
     * disableListItem adds disabled class to page list item
     * @param {*} item 
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
     * @returns {bool} 
     */
    canClickNextPrev(index) {
        if (index < 1 || index > this.amountOfPages) {
            return false;
        }
        return true;
    }
    /**
     * checkCanClinkNextPrev methods tries if next or prev button can be clicked or not (canClickNextPrev), in that case, fires disableListItem
     */
    checkCanClickNextPrev() {
        if (this.nextPrevButtons === false) return;
        this.enableListItem();
        if (!this.canClickNextPrev(this.currentPage - 1)) {
            this.disableListItem(this.prevButton);
        }
        if (!this.canClickNextPrev(this.currentPage + 1)) {
            this.disableListItem(this.nextButton);
        }
    }
    /**
     * createNextPrev methods creates the next and previous buttons and appends/prepends them
     */
    createNextPrev() {
        this.prevButton = this.setContentAndIdForListItem(this.createListItem('-1', false), 'prev');
        this.nextButton = this.setContentAndIdForListItem(this.createListItem('+1', false), 'next');
        this.paginationElement.children[0].prepend(this.prevButton);
        this.paginationElement.children[0].append(this.nextButton);
    }
    /**
     * calculateInReach method calculates wether given index is in the range of amount of next and prev items
     * @param {number} index 
     * @returns {boolean} true/false
     */
    calculateInReach(index) {
        if (index === this.chunks.length || index === 1) {
            return true;
        } else {
            return ((index - (this.currentPage - this.amountOfPrevNextItems)) * (index - (this.currentPage + this.amountOfPrevNextItems)) <= 0);
        }
    }
    /**
     * Shows all page item elements
     */
    showAllPaginationElements() {
        this.paginationElement.children[0].childNodes.forEach(element => {
            element.style.display = 'list-item';
        })
    }
    /**
     * removeAllDotElements removes all empty page links, to reset its state
     */
    removeAllDotElements() {
        this.paginationElement.querySelectorAll('.empty-page-link').forEach(element => {
            element.remove();
        })
    }
    /**
     * replaceElementsWithDots method hides all pagination elements that should not be visible and fires event to remove and add dotElements
     * @param {array} numsBefore 
     * @param {array} numsAfter 
     */
    replaceElementsWithDots(numsBefore, numsAfter) {
        if (numsBefore.length > 0) {
            this.paginationElement.children[0].insertBefore(this.createEmptyListItem(), numsBefore[0].parentNode);
            for (let i = 0; i < numsBefore.length; i++) {
                numsBefore[i].parentNode.style.display = 'none';
            }
        }
        if (numsAfter.length > 0) {
            this.paginationElement.children[0].insertBefore(this.createEmptyListItem(), numsAfter[numsAfter.length - 1].parentNode);
            for (let i = 0; i < numsAfter.length; i++) {
                numsAfter[i].parentNode.style.display = 'none';
            }
        }
    }
    /**
     * replaceNumbersWithDots method replaces pagination items with dots
     */
    replaceNumbersWithDots() {
        if (this.amountOfPrevNextItems === false) return;
        let numsBefore = [];
        let numsAfter = [];
        this.paginationElement.querySelectorAll('[data-page-anchor-tag]').forEach((item) => {
            let itemIndex = parseInt(item.dataset.pageAnchorTag);
            if (!this.calculateInReach(itemIndex)) {
                if (itemIndex < this.currentPage) {
                    numsBefore.push(item);
                } else {
                    numsAfter.push(item);
                }
            }
        })
        this.removeAllDotElements();
        this.showAllPaginationElements();
        if (numsBefore.length > 0 || numsAfter.length > 0) {
            this.replaceElementsWithDots(numsBefore, numsAfter);
        }
    }
}