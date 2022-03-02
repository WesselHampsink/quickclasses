# Javascript classes that make filtering, pagination and sorting easy and quick.

_by Wessel Hampsink, see [dev.wesselhampsink.nl](https://dev.wesselhampsink.nl) for a demo_

# new QuickFilter({options})
_The QuickFilter class makes it easy to filter items based on their HTML data attributes._

QuickFilter uses data attributes to filter elements. Define options to filter the content you want. The QuickFilter class filters in both an AND & OR relationship, checkboxes, radio buttons or multiple select options will be filtered using an OR relationship. Whereas a text input combined with a (e.g.) checkbox will filter items based on an AND relationship. Use the demo below to check it out.

### HTML items requirements
**Every filterable item must have a `data-index` attribute defined with a unique value.** Furthermore, every filterable key shoud have a data-attribute on the main item as well. For example, if you want to filter a collection of posts by author and title, your items should have a structure similar to this.

```sh
<div
class="post-item"
data-index="1"
data-author="John Doe"
data-title="Hello World Post"
>
...content...
</div>
```
If a post has multiple authors, or multiple filterable values, use commas to seperate the values.

### HTML filters requirements
**Every select and input element that you want to use for filtering must contain a `data-filter` attribute where the filterable key is defined.** For example, if we want to filter the post items by title (text input), and by author (checkbox input) the filters should be similar to the following.
```sh
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
```sh
new QuickFilter({
  filterCheckboxInputs: ['author'],
  filterTextInputs: ['title'],
  elementSelector: '[data-index]'
});
```
The default options object for the QuickFilter class is:
```sh
{
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
`function` Callback function that will be fired once all filters have been applied, when using QuickFilter combined with QuickPagination, you can pass in a arrow function to call QuickPagination.init(), example:
```sh
const paginateClass = new QuickPagination({...})
const filterClass = new QuickFilter({
  callBackFunction: () => {
      paginateClass.init();
  },
  ...
});
```
Defaults to null.

- `modifySelectedFunction`
`function` Function that can be used to modify selected filters, passes argument of object of selected filters which has to be returned. Tip: use this function to create a list of all selected filters. Defaults to `null`.

```sh
function myModifyFunction(filters) {
  ... do something ...
  return filters;
}
const filterClass = new QuickFilter({
    modifySelectedFunction: (allFilters) => {
    return myModifyFunction(allFilters);
  },
  ...
});
```

- `itemsScope`
`string` String of querySelector of in which all filterable items are located. Please use this option when also using QuickPagination, that way the QuickFilter class only filters items within scopes, and not the clones in the pages from QuickPagination. Defaults to null, which will means that the document will be used to select the filterable items from.
