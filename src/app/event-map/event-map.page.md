# EventMapPage

The `EventMapPage` is responsible for displaying a map with events by markers on the app. It provides functionality for filtering and searching through the events, and for handling user location.

## Properties

- `bezirk`: An object that holds the Berlin district data.
- `selectedLocation`: An object that holds the selected location coordinates.
- `selectedRadius`: A number that holds the selected radius for the map view.
- `currentCircle`: An instance of the Leaflet Circle object.
- `currentMarker`: An instance of the Leaflet Marker object.
- `eventsList`: An array that holds the list of events.
- `defaultLocation`: An array that holds the default location coordinates.
- `isFree`: A boolean indicating whether the event is free of charge.
- `isToday`: A boolean indicating whether the event is happening today.
- `isTomorrow`: A boolean indicating whether the event is happening tomorrow.
- `markerClusterGroup`: An instance of the Leaflet MarkerClusterGroup object.
- `attractionIds`: An array that holds the ids of the attractions.
- `isModalOpen`: A boolean indicating whether the modal is open.
- `eventsByLocation`: A map that holds the events by location.
- `carouselIndexMap`: A private map that holds the carousel index.

## Dependencies

- `KulturdatenService`: A service for fetching cultural data.
- `DatePipe`: A pipe for transforming dates.
- `ModalController`: A service for controlling modals.

## Usage

The `EventMapPage` is a page component and should be declared in your app routing module.