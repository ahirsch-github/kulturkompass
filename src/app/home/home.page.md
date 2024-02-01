# HomePage

The `HomePage` is responsible for displaying a list of events. It provides functionality for loading events based on user preferences and opening the `QuestionnaireComponent` to change these preferences.

## Properties

- `eventCat`: An object that holds the user's preferences for event categories, accessibility, costs, and boroughs.
- `events`: An array that holds the list of events.
- `attractions`: An array that holds the list of attractions.
- `availableTags`: An array that holds the list of available tags.
- `page`: A number that holds the current page number for pagination.
- `isPersonalized`: A boolean indicating whether the events are personalized based on user preferences.
- `isLoading`: A boolean indicating whether the page is in the loading state.
- `idsToFilter`: An array of strings that holds the ids of the events to be filtered.

## Dependencies

- `ModalController`: A service for controlling modals.
- `CookieService`: A service for handling cookies.
- `KulturdatenService`: A service for fetching cultural data.
- `DatePipe`: A pipe for transforming dates.

## Usage

The `HomePage` is a page component and should be declared in your app routing module.