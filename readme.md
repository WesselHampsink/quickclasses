# Javascript classes that make filtering, pagination and sorting easy and quick.

_by Wessel Hampsink, see [dev.wesselhampsink.nl](https://dev.wesselhampsink.nl) for a demo_

# new QuickFilter({options})

_The QuickFilter class makes it easy to filter items based on their HTML data attributes._

QuickFilter uses data attributes to filter elements. Define options to filter the content you want. The QuickFilter class filters in both an AND & OR relationship, checkboxes, radio buttons or multiple select options will be filtered using an OR relationship. Whereas a text input combined with a (e.g.) checkbox will filter items based on an AND relationship. Use the demo below to check it out.

### HTML items requirements

**Every filterable item must have a `data-index` attribute defined with a unique value.** Furthermore, every filterable key shoud have a data-attribute on the main item as well. For example, if you want to filter a collection of posts by author and title, your items should have a structure similar to this.

```javascript
<div class="post-item" data-index="1" data-author="John Doe" data-title="Hello World Post">
  ...content...
</div>
```

If a post has multiple authors, or multiple filterable values, use commas to seperate the values.

### HTML filters requirements

**Every select and input element that you want to use for filtering must contain a `data-filter` attribute where the filterable key is defined.** For example, if we want to filter the post items by title (text input), and by author (checkbox input) the filters should be similar to the following.

```javascript
<input
type="text"
data-filter="title"
placeholder="Search by title../"
/>
<input
type="checkbox"
data-filter="author"
value="John Doe"
/>
<input
type="checkbox"
data-filter="author"
value="Lisa Johnson"
/>
```

QuickFilter supports the following types of filterable elements:

- `select`
- `select[multiple]`
- `input[type="text"]`
- `input[type="checkbox"]`
- `input[type="radio"]`
- `input[type="range"]`
- `input[type="range"][multiple]` See [multirange polyfill](http://projects.verou.me/multirange/) on how to implement this.

### Initialization and options

**To initialize the QuickFilter class, create a class instance and pass in the options object.** The options object provides options to select the filterable items, the filterable inputs and select elements, and other options to customize the functionality of the filter. An example of a easy initialization of the QuickFilter class to filter posts by author and search by title.

```javascript
new QuickFilter({
  filterCheckboxInputs: ['author'],
  filterTextInputs: ['title'],
  elementSelector: '[data-index]',
});
```

The default options object for the QuickFilter class is:

```javascript
{
  (elementSelector = '[data-index]'),
    (filterCheckboxInputs = []),
    (filterSelectInputs = []),
    (filterTextInputs = []),
    (filterRangeInputs = []),
    (filterRadioInputs = []),
    (filterStartTextInputs = []),
    (resultNumberSelector = null),
    (noResultMessage = null),
    (showDisplayProperty = 'block'),
    (hideDisplayProperty = 'none'),
    (callBackFunction = null),
    (modifySelectedFunction = null),
    (itemsScope = null);
}
```

For individual explanation of each option, please read the documentation carefully.

- `elementSelector`
  string String that will be used in a querySelectorAll to select the filterable items, defaults to `'[data-index]'`, every element that contains a `data-index` attribute.

`filterCheckboxInputs`
array Array of `input[type="checkbox"]` elements's `data-filter` attribute you want to use as a filter, array must contain string values of the `data-filter` attribute. Defaults to an empty array. Filter will refresh on every change of a `input[type="checkbox"]`.

`filterSelectInputs`
array Array of select elements's `data-filter` attribute you want to use as a filter, array must contain string values of the `data-filter` attribute of the `select` element. Defaults to empty array. Filter will refresh every on every change of the `select` element.

- `filterTextInputs`
  array Array of `input[type="text"]` elements's data-filter attribute you want to use as a filter, array must contain string values of the `data-filter` attribute of the `input[type="text"]` element. Defaults to empty array. _Filter will refresh on every keyup event of the `input`._

- `filterRangeInputs`
  array Array of `input[type="range"]` or `input[type="range"][multiple]` elements's `data-filter` attribute you want to use as a filter, array must contain string values of the `data-filter` attribute of the `input[type="range"]` or `input[type="range"][multiple]` element. Defaults to empty array. Filter will refresh on every change of the range input. Multiple range is supported, use: [multirange polyfill](http://projects.verou.me/multirange/) for this.

- `filterRadioInputs`
  array Array of `input[type="radio"]` (where the name is discernable) elements's `data-filter` attribute you want to use as a filter, array must contain string values of the `data-filter` attribute of the `input[type="radio"]` element. Defaults to empty array. Filter will refresh on every change of the `input`(s).

- `filterStartTextInputs`
  Similar to `filterTextInputs`, the difference is that the search string will be compared to the first characters of the items' value. (Useful for locations) See: `filterTextInputs`

- `resultNumberSelector`
  `string` String for `querySelector` of which the innerHTML will be set as the number of results after the items have been filtered. Defaults to null.

- `noResultMessage`
  `string` String for `querySelector`, element will be displayed when no results have been found after the filter has been applied. Make sure that this element is not visible by default. Defaults to null

- `showDisplayProperty`
  `string` Display property which each items should be given when it meets the filter criteria (for example: grid, block, flex). Defaults to `block`.

- `hideDisplayProperty`
  `string` Display property which each items should be given when it does not meet the filter criteria (for example: none, table, flex). Defaults to `none`.

- `callBackFunction`
  `function` Callback function that will be fired once all filters have been applied, this is the place where you can hook the QuickPagination and QuickFilterCounter functionalities:

```javascript
const paginateClass = new QuickPagination({});
const filterClass = new QuickFilter({
  callBackFunction: (QuickFilterClass) => {
    paginateClass.init();
  },
  // ...
});
```

Defaults to null.

- `modifySelectedFunction`
  `function` Function that can be used to modify selected filters, passes argument of object of selected filters which has to be returned. Tip: use this function to create a list of all selected filters. Defaults to `null`.

```javascript
function myModifyFunction(filters) {
  // ... do something ...
  return filters;
}
const filterClass = new QuickFilter({
  modifySelectedFunction: (allFilters) => {
    return myModifyFunction(allFilters);
  },
  // ...
});
```

- `itemsScope`
  `string` String of querySelector of in which all filterable items are located. Please use this option when also using QuickPagination, that way the QuickFilter class only filters items within scopes, and not the clones in the pages from QuickPagination. Defaults to null, which will means that the document will be used to select the filterable items from.

# new QuickPagination({options})

_The `QuickPagination` class makes it easy to create pages of very long lists of items._

`QuickPagination` class clones the HTML of items and stores them in pages elements. Its strength lies in the customizability of the pagination. You can select the amount of items to show per page, how many pagination links you want to display, show previous and next buttons, etc. Use the demo below to check it out.

### Initialization and options

To initialize the `QuickPagination` class, create a class instance and pass in the options object. See the next accordion for the options and defaults.

```javascript
new QuickPagination({
  pagesTarget: '#paged-posts',
});
```

The `QuickPagination` class provides options to customize the behavior of your pagination. The options object allows you to select where the pages should be displayed and which items to use. Furthermore, you can also customize the max amount of pagination links to be shown, the items per page, whether to show previous and next buttons, and many more. To create a simple instance of the `QuickPagination` class, use the following in your script after loading `QuickPagination.js`.

```javascript
new QuickPagination({
  pagesTarget: '#paged-posts',
  itemsPerPage: 8,
  itemsSelector: '#org-posts [data-index]',
});
```

The default options object for the `QuickPagination` class is:

```javascript
{
  pagesTarget,
    (itemsPerPage = 5),
    (itemsSelector = '[data-index]'),
    (paginationSelector = '#pagination'),
    (pageDisplayProperty = 'block'),
    (nextPrevButtons = false),
    (contentPrevButton = 'Previous'),
    (contentNextButton = 'Next'),
    (pageClasses = ['page', 'row']),
    (amountOfPrevNextItems = 1);
}
```

For an individual explanation of each option, please read the documentation carefully.

- `pagesTarget *`: String that will be used in a querySelector to define where the items and pagination will be displayed. (Required option)
- `itemsPerPage`: Number of items to show per page. Defaults to 5.
- `itemsSelector`: String that will be used in a querySelector that defines which items to use in the pagination lists. It is recommended to place your paginatable items in a defined element. Items will be duplicated to create pages; therefore, the original items will be hidden. Defaults to `[data-index]`.
- `paginationSelector`: String that will be used in a querySelector. In this element, the pagination links will be created. This element has to be outside the `pagesTarget`. Defaults to `#pagination`.
- `nextPrevButtons`: Boolean indicating whether to show the next and previous buttons or not. Defaults to false.
- `contentPrevButton`: String that will be used as the innerHTML of the previous button (if `nextPrevButtons` is set to true). Defaults to 'Previous'.
- `contentNextButton`: String that will be used as the innerHTML of the next button (if `nextPrevButtons` is set to true). Defaults to 'Next'.
- `pageClasses`: Array of strings, CSS classes that will be added to the pages. For styling and layout purposes mainly. Defaults to `['page', 'row']`.
- `amountOfPrevNextItems`: Number of pagination links to show besides the first, last, and active page. For example, when set to 1 and the active page is 5, pagination link 4 and 6 will be shown. Page links 2 and 3 will be replaced by an empty

# new QuickSorting({options})

_The `QuickSorting` class makes it easy to sort a list of items by numerical or alphabetical order._

`QuickSorting` class simplifies the sorting of your filtered or paginated items. It can sort items by numbers, letters, or randomize their order. Use the demo below to check it out.

## HTML Select requirements

The select element that triggers sorting must have certain attributes to define how the items should be sorted. Use data attributes to specify the sorting criteria, order, key to compare, and type. The data-key attribute defines the key to sort on (e.g., `title`). The value of this attribute must match the data attribute on the items to sort (e.g., `data-title="Lorem"`). The data-type attribute defines how the items should be sorted and can be either "NUM" or "CHAR". The data-order attribute defines whether the sorting should be ascending or descending, with possible values of "ASC" or "DESC". Here is an example of a select element that can sort items by title, the number of comments, and also has a random option (which shuffles all items randomly):

```html
<select name="sort" id="sort-select" class="form-select">
  <option selected value="count-asc" data-key="count" data-type="NUM" data-order="ASC">
    Number of comments (low to high)
  </option>
  <option value="count-desc" data-key="count" data-type="NUM" data-order="DESC">
    Number of comments (high to low)
  </option>
  <option value="title-desc" data-key="title" data-type="CHAR" data-order="DESC">Title (z to a)</option>
  <option value="title-asc" data-key="title" data-type="CHAR" data-order="ASC">Title (a to z)</option>
  <option value="random" data-key="random">Randomize!</option>
</select>
```

### Initialization and options

To initialize the `QuickSorting` class, create a class instance and pass in the options object. See the next accordion for the options and defaults.

```javascript
new QuickSorting({
  elementsSelector: '#org-posts [data-index]',
  parentElement: '#org-posts',
  sortSelectSelector: 'select[name="sort"]',
});
```

The `QuickSorting` class uses an options object to define its behavior. The options object allows you to select which items to sort, which select element to use as a trigger, and provides a callback functionality.

The default options object for the `QuickPagination` class is:

```javascript
{
    elementsSelector: '[data-index]',
    sortSelectSelector: 'select[name="sort"]',
    parentElement: null,
    callBackFunction: null
}
```

For an individual explanation of each option, please read the documentation carefully.

- `elementsSelector`
  string String that will be used in a querySelector to define what items to sort. (when combined with QuickPagination and QuickFilter, select the original items (not the duplicates in the pagination) Defaults to '[data-index]'.

- `sortSelectSelector`
  string String that will be used in a querySelector to select the select element of which the option defines how to sort the items. QuickSorting will add a eventlistener that will fire when the select element has changed. Defaults to 'select[name="sort"]'.

- `parentElement` \*required
  string String that will be used in a querySelector to select the parent element of the items, QuickSorting will empty this element when sorting is applied and will append the items in the desired order.

- `callBackFunction`
  function Callback function that will be fired once all filters have been applied, when using QuickSorting combined with QuickFilter, you can pass in an arrow function to call QuickFilter.inputCallback(), example:

```javascript
const filterClass = new QuickFilter({});
const sortingClass = new QuickSorting({
  callBackFunction: () => {
    filterClass.inputCallback();
  },
  // ...
});
```

Defaults to null

# new QuickFilterCounter({options})

The `QuickFilterCounter` class is an extension of the `QuickFilter` class that adds a counter to filter options. It provides functionality to display the number of results for each filter option based on the selected filters.

## Installation

To use `QuickFilterCounter`, you need to have the `QuickFilter` class installed and available in your project.

## Usage

1. Import the `QuickFilterCounter` class and create an instance:

   ```javascript
   import { QuickFilterCounter, QuickFilter } from 'quickclasses';

   const options = {
     enableOnInputs: true,
     enableOnSelects: true,
     counterClass: 'counter',
     removeCounterFromSelected: true,
   };

   const filterCounter = new QuickFilterCounter(options);
   ```

2. Initialize the `QuickFilterCounter` with an instance of the `QuickFilter` class:

   ```javascript
   new QuickFilter({
     // ...
     callBackFunction: (QuickFilterClass) => {
       filterCounter.init(QuickFilterClass);
     },
   });
   ```

3. The counter will be automatically added to the filter options based on the selected filters.

## Options

The `QuickFilterCounter` class accepts the following options in the constructor:

- `enableOnInputs` (boolean): Enable counting for filter inputs (checkboxes and radio buttons). Defaults to `true`.
- `enableOnSelects` (boolean): Enable counting for filter select elements. Defaults to `true`.
- `counterClass` (string): The CSS class name for the counter element. Defaults to `'counter'`.
- `QuickFilterClass` (QuickFilter): An instance of the `QuickFilter` class. Required.
- `removeCounterFromSelected` (boolean): Remove the counter from selected filter options. Defaults to `true`.

## Examples

Here's an example of how to use `QuickFilterCounter` with a `QuickFilter` instance:

```javascript
import { QuickFilter, QuickFilterCounter, QuickFilterCounterOptions } from 'quickclasses';

const options = {
  enableOnInputs: true,
  enableOnSelects: true,
  counterClass: 'counter',
  removeCounterFromSelected: true,
};

const filterCounter = new QuickFilterCounter(options);
const filterClass = new QuickFilter({
  //...
  callBackFunction: (QuickFilterClass) => {
    filterCounter.init(QuickFilterClass);
  },
});
```

## License

This project is licensed under the [MIT License](LICENSE).
