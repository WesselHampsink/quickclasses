/* Class that can sort items based on a given dropdown option */
class QuickSorting {
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