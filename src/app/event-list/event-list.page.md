# EventListPage

The `EventListPage` is responsible for displaying a list of attractions and providing a search and filter functionality by using the components `SearchBarComponent` and `FilterMenuComponent`.

## Properties

- `idsToFilter`: An array of strings that holds the ids of the events to be filtered.
- `allEventsListed`: A boolean indicating whether all events are listed.
- `numberOfEvents`: A number representing the total number of events.
- `attractions`: An object that holds the attractions associated with the events.
- `searchTerm`: A string that holds the value entered by the user in the search bar.
- `filters`: An object that holds the selected filter options. It includes:
  - `dates`: An array of selected dates.
  - `times`: An array of selected times.
  - `categories`: An array of selected categories.
  - `accessibilities`: An array of selected accessibilities.
  - `boroughs`: An array of selected boroughs.
  - `isFreeOfChargeSelected`: A boolean indicating whether the free of charge option is selected.
  - `selectedLocation`: The selected location.
  - `selectedRadius`: The selected radius.
- `selectedCategoryNames`: An array of selected category names.
- `selectedAccessibilityNames`: An array of selected accessibility names.
- `isLoading`: A boolean indicating whether the page is in the loading state.
- `isReloading`: A boolean indicating whether the page is in the reloading state.

## Dependencies

- `KulturdatenService`: A service for fetching cultural data.
- `DatePipe`: A pipe for transforming dates.
- `ModalController`: A service for controlling modals.

## Usage

The `EventListPage` is a page component and should be declared in your app routing module.