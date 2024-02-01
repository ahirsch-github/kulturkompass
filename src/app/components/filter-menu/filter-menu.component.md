# FilterMenuComponent

The `FilterMenuComponent` is responsible for providing a user interface to filter events based on various criteria such as categories, accessibilities, boroughs, times, and whether the event is free of charge.

## Inputs

- `filters`: An object containing the initial filter settings. If the user has already filtered the events, the object contains his selection. The object contains the parameters `accessibilities, categories, boroughs, times, isFreeOfChargeSelected`.

## Outputs

When closing the modal, following values are returned:

- `selectedDates`: An array of selected dates.
- `selectedTimes`: An array of selected times.
- `selectedCategories`: An array of selected categories, each category is an object with `id` and `name` properties.
- `selectedBoroughs`: An array of selected boroughs, each borough is an object with a `name` property.
- `selectedAccessibilities`: An array of selected accessibilities, each accessibility is an object with `id` and `name` properties.
- `isFreeOfChargeSelected`: A boolean indicating whether the 'free of charge' option is selected.
- `selectedLocation`: The selected location.
- `selectedRadius`: The selected radius.