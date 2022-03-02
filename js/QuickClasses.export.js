/* QuickFilter Class, used to hide, show get and filter */
export class QuickFilter {
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
/** QuickSorting Class */
export class QuickSorting {
    constructor({
        elementsSelector = '[data-index]',
        sortSelectSelector = 'select[name="sort"]',
        parentElement = null,
        callBackFunction = null
    }) {
        this.elements = document.querySelectorAll(elementsSelector);
        if (this.elements === null) return;
        this.sortSelect = document.querySelector(sortSelectSelector);
        if (this.sortSelect === null) return;
        this.parentElement = document.querySelector(parentElement);
        if (this.parentElement === null) return;
        this.callBackFunction = callBackFunction;
        this.appendEvent();
        this.selectedValue = {
            key: this.sortSelect.options[this.sortSelect.selectedIndex].dataset.key,
            order: this.sortSelect.options[this.sortSelect.selectedIndex].dataset.order,
            type: this.sortSelect.options[this.sortSelect.selectedIndex].dataset.type
        }
    }
    /**
     * Initialize quicksorting, use this function to sort all
     */
    init() {
        this.getSelectedValue();
        this.parentElement.innerHTML = '';
        this.sort().forEach(ele => {
            this.parentElement.appendChild(ele);
        })
        if (this.callBackFunction !== null) {
            this.callBackFunction();
        }
    }
    /**
     * Append event listener to select element, and fire init function when changed
     */
    appendEvent() {
        this.sortSelect.addEventListener('change', () => {
            this.init();
        })
    }
    /**
     * Method gets selected values from the select element
     * @returns {object} this.selectedValue object of selected value
     */
    getSelectedValue() {
        return this.selectedValue = {
            key: this.sortSelect.options[this.sortSelect.selectedIndex].dataset.key,
            order: this.sortSelect.options[this.sortSelect.selectedIndex].dataset.order,
            type: this.sortSelect.options[this.sortSelect.selectedIndex].dataset.type
        }
    }
    /**
     * Sorts items by the given selected order and key.
     * @returns {array} this.elements sorted
     */
    sort() {
        let searchKey = this.selectedValue.key;
        let sortOrder = this.selectedValue.order;
        let type = this.selectedValue.type;
        return [...this.elements].sort((a, b) => {
            if (searchKey === 'random') {
                return .5 - Math.random();
            }
            if (type === 'CHAR') {
                if (sortOrder === 'ASC') {
                    return a.dataset[searchKey].localeCompare(b.dataset[searchKey]);
                } else {
                    return b.dataset[searchKey].localeCompare(a.dataset[searchKey]);
                }
            } else if (type === 'NUM') {
                if (sortOrder === 'ASC') {
                    return parseFloat(a.dataset[searchKey]) - parseFloat(b.dataset[searchKey]);
                } else {
                    return parseFloat(b.dataset[searchKey]) - parseFloat(a.dataset[searchKey]);
                }
            }
        })
    }
}
/** QuickPagination Class */
export class QuickPagination {
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