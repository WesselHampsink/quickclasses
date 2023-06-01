"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QuickSorting {
    constructor({ elementsSelector = '[data-index]', sortSelectSelector = 'select[name="sort"]', parentElement = null, callBackFunction = undefined, }) {
        var _a, _b, _c;
        this._elements = document.querySelectorAll(elementsSelector);
        if (this._elements === null)
            return;
        this._sortSelect = document.querySelector(sortSelectSelector);
        if (this._sortSelect === null)
            return;
        if (parentElement === null)
            return;
        this._parentElement = document.querySelector(parentElement);
        if (this._parentElement === null)
            this._parentElement === this._elements[0].parentElement;
        this._callBackFunction = callBackFunction;
        this.appendEvent();
        this._selectedValue = {
            key: ((_a = this._sortSelect.options[this._sortSelect.selectedIndex].dataset) === null || _a === void 0 ? void 0 : _a.key) || 'random',
            order: (_b = this._sortSelect.options[this._sortSelect.selectedIndex].dataset) === null || _b === void 0 ? void 0 : _b.order,
            type: (_c = this._sortSelect.options[this._sortSelect.selectedIndex].dataset) === null || _c === void 0 ? void 0 : _c.type,
        };
    }
    /**
     * Initialize quicksorting, use this function to sort all
     */
    init() {
        this.getSelectedValue();
        if (this._parentElement instanceof HTMLElement) {
            this._parentElement.innerHTML = '';
            this.sort().forEach((ele) => {
                var _a;
                (_a = this._parentElement) === null || _a === void 0 ? void 0 : _a.appendChild(ele);
            });
        }
        if (this._callBackFunction !== undefined) {
            this._callBackFunction();
        }
    }
    /**
     * Append event listener to select element, and fire init function when changed
     */
    appendEvent() {
        var _a;
        (_a = this._sortSelect) === null || _a === void 0 ? void 0 : _a.addEventListener('change', () => {
            this.init();
        });
    }
    /**
     * Method gets selected values from the select element
     * @returns {QuickSortingSelected} this._selectedValue object of selected value
     */
    getSelectedValue() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return (this._selectedValue = {
            key: ((_a = this._sortSelect) === null || _a === void 0 ? void 0 : _a.options[(_b = this._sortSelect) === null || _b === void 0 ? void 0 : _b.selectedIndex].dataset.key) || 'random',
            order: (_e = (_c = this._sortSelect) === null || _c === void 0 ? void 0 : _c.options[(_d = this._sortSelect) === null || _d === void 0 ? void 0 : _d.selectedIndex].dataset) === null || _e === void 0 ? void 0 : _e.order,
            type: (_h = (_f = this._sortSelect) === null || _f === void 0 ? void 0 : _f.options[(_g = this._sortSelect) === null || _g === void 0 ? void 0 : _g.selectedIndex].dataset) === null || _h === void 0 ? void 0 : _h.type,
        });
    }
    /**
     * Sorts items by the given selected order and key.
     * @returns {array} this.elements sorted
     */
    sort() {
        let searchKey = this._selectedValue.key;
        let sortOrder = this._selectedValue.order;
        let type = this._selectedValue.type;
        if (this._elements instanceof Array) {
            return Array.from(this._elements).sort((a, b) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                if (searchKey === 'random') {
                    return 0.5 - Math.random();
                }
                if (type === 'CHAR') {
                    if (sortOrder === 'ASC') {
                        return (_a = a.dataset) === null || _a === void 0 ? void 0 : _a[searchKey].localeCompare((_b = b.dataset) === null || _b === void 0 ? void 0 : _b[searchKey]);
                    }
                    else {
                        return (_c = b.dataset) === null || _c === void 0 ? void 0 : _c[searchKey].localeCompare((_d = a.dataset) === null || _d === void 0 ? void 0 : _d[searchKey]);
                    }
                }
                else if (type === 'NUM') {
                    if (sortOrder === 'ASC') {
                        return parseFloat((_e = a.dataset) === null || _e === void 0 ? void 0 : _e[searchKey]) - parseFloat((_f = b.dataset) === null || _f === void 0 ? void 0 : _f[searchKey]);
                    }
                    else {
                        return parseFloat((_g = b.dataset) === null || _g === void 0 ? void 0 : _g[searchKey]) - parseFloat((_h = a.dataset) === null || _h === void 0 ? void 0 : _h[searchKey]);
                    }
                }
            });
        }
        return [];
    }
}
exports.default = QuickSorting;
//# sourceMappingURL=QuickSorting.js.map