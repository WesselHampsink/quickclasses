// import {QuickFilter, QuickPagination, QuickSorting} from './QuickClasses.export.min.js';

let slideUp=(e,t=500)=>{e.style.transitionProperty="height, margin, padding",e.style.transitionDuration=t+"ms",e.style.boxSizing="border-box",e.style.height=e.offsetHeight+"px",e.offsetHeight,e.style.overflow="hidden",e.style.height=0,e.style.paddingTop=0,e.style.paddingBottom=0,e.style.marginTop=0,e.style.marginBottom=0,window.setTimeout(()=>{e.style.display="none",e.style.removeProperty("height"),e.style.removeProperty("padding-top"),e.style.removeProperty("padding-bottom"),e.style.removeProperty("margin-top"),e.style.removeProperty("margin-bottom"),e.style.removeProperty("overflow"),e.style.removeProperty("transition-duration"),e.style.removeProperty("transition-property")},t)},slideDown=(e,t=500)=>{e.style.removeProperty("display");let o=window.getComputedStyle(e).display;"none"===o&&(o="block"),e.style.display=o;let r=e.offsetHeight;e.style.overflow="hidden",e.style.height=0,e.style.paddingTop=0,e.style.paddingBottom=0,e.style.marginTop=0,e.style.marginBottom=0,e.offsetHeight,e.style.boxSizing="border-box",e.style.transitionProperty="height, margin, padding",e.style.transitionDuration=t+"ms",e.style.height=r+"px",e.style.removeProperty("padding-top"),e.style.removeProperty("padding-bottom"),e.style.removeProperty("margin-top"),e.style.removeProperty("margin-bottom"),window.setTimeout(()=>{e.style.removeProperty("height"),e.style.removeProperty("overflow"),e.style.removeProperty("transition-duration"),e.style.removeProperty("transition-property")},t)};var slideToggle=(e,t=500)=>"none"===window.getComputedStyle(e).display?slideDown(e,t):slideUp(e,t);function createAccordionEvent(){document.querySelectorAll("#demo .accordion-button").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault(),e.classList.toggle("collapsed"),e.classList.toggle("show"),slideToggle(e.parentElement.nextElementSibling,200),e.parentElement.nextElementSibling.classList.toggle("collapse"),e.parentElement.nextElementSibling.classList.toggle("show")})})};

function createDefaultAccordionEvent(){document.querySelectorAll("#documentation .accordion-button").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault(),e.classList.toggle("collapsed"),e.classList.toggle("show"),slideToggle(e.parentElement.nextElementSibling,200),e.parentElement.nextElementSibling.classList.toggle("collapse"),e.parentElement.nextElementSibling.classList.toggle("show")})})};
createDefaultAccordionEvent();

const paginateClass = new QuickPagination({
    pagesTarget: '#paged-posts',
    itemsPerPage: 6,
    itemsSelector: '#org-posts [data-index]',
    pageDisplayProperty: 'flex',
    paginationSelector: '.pagination',
    nextPrevButtons: true,
    amountOfPrevNextItems: 2,
    pageClasses: ['page', 'row']
})
/* Create QuickFilter class */
const filterClass = new QuickFilter({
    filterCheckboxInputs: ['name'],
    filterSelectInputs: ['firstletter'],
    filterTextInputs: ['text', 'commenters'],
    filterRangeInputs: ['count'],
    resultNumberSelector: '#number-results',
    noResultMessage: '#no-results',
    elementSelector: '[data-index]',
    itemsScope: '#org-posts',
    resultNumberSelector: '#counter',
    callBackFunction: () => {
        paginateClass.init();
        createAccordionEvent();
    }
});
/* Create QuickeSort class */
const sortClass = new QuickSorting({
    elementsSelector: '#org-posts [data-index]',
    parentElement: '#org-posts',
    callBackFunction: () => {
        filterClass.inputCallback();
    }
})