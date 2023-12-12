# Code Smells

### book-search.component.html:

- Variables name should be more meaningful.
  eg.: `b` variable in SearchForm of book-search component should be more descriptive. Instead of that we can use it as `book` for better understanding.

- Using custom methods to format date can be avoided by replacing that with Angular's built in Date pipe. Angular pipes removes unnecessary calculations and DOM updates as the result is cached for same input (memoization) where as in case of methods, the calculations will happen every time when the template is rendered.

- Added `ngSubmit` to ensures that the form doesn't submit when the handler code throws (which is the default behavior of submit) and causes an actual http post request. HTML `submit` event tries to POST the form to the current URL. `ngSubmit` prevents default submit event by returning false.

- Removed unwanted properties from `removeFromReadingListSucceeded` and `addToReadingListSucceeded` actions.


### book.search.component.ts:

- The subscription made on store.select() in ngOnInit() is never unsubscribed which might lead to potential memory leaks. Hence, added `async` pipe in the template which unsubscribes when component is torn down.

### books.selectors.ts: 
- Variable 'state' implicitly has an 'any' type, but better we must specify its correct datatype.


## Function Renaming

- The actions `failedRemoveFromReadingList`, `confirmedRemoveFromReadingList`, `failedAddToReadingList` and `confirmedAddToReadingList` has no implementations either in effects or reducers. It'll be better if we remove it.


## Test Case Descriptions

Updated incorrect test case descriptions in various files to provide meaningful and accurate descriptions related to their functionality.


# Accessibility issues

### From Lighthouse report:

- Buttons do not have accessible names. Fixed it by adding `aria-label` attribute.

- Adjusted background and foreground colors to achieve sufficient contrast ratio between them. 

- Enhanced the styling of button elements to improve keyboard navigation and usability.

### Manually detected:

- Added `alt` attribute to `img` tags as it specifies an alternate text for image in case the image is not loaded.

- Added `aria-label` attribute with appropriate value in the elements wherever required to make accessible for screen readers.

- Elements not redirecting should not be wrapped in `<a>` tag. replaced with `<button>`

- The book content in search result tile is not readable. Focus directly moves to "Want to Read" button after search icon. Enabled to enhance the keyboard navigation to read book details.

# Improvements

- For better user experience, a spinner can be added when awaiting API response.

- Appropriate error messages should be displayed to user in case of API failure. 

- Can make the application responsive for smaller screens like mobiles and tablets by using media queries as it is a popular tailoring technique.

- To clear search results, clear button can be added in order to improve UX.