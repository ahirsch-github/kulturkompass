# Kulturkompass

Kulturkompass is an open-source library demonstrating how to utilize the API of the kulturdaten.berlin API, which is a project of the [Technologiestiftung Berlin](https://www.technologiestiftung-berlin.de), funded by the Senate Department for Culture and Social Cohesion, to discover events in Berlin.

## Table of Contents
1. [General Info](#general-info)
2. [Technologies](#technologies)
3. [Prerequisites](#Prerequisites)
4. [Getting started](#getting-started)
5. [License](#license)

## General Info
Finding a comprehensive overview of all cultural events in Berlin can be challenging. The kulturdaten.berlin API, provided by Technologiestiftung Berlin, aims to aggregate all events in one place, offering a central endpoint for discovery. This Ionic-based application supports both web and mobile devices, allowing users to list, search, and display events with various filters and map views.

### Screenshot
![Image text](https://www.united-internet.de/fileadmin/user_upload/Brands/Downloads/Logo_IONOS_by.jpg)


## Technologies
A list of technologies used within the project:

- [kulturdaten.berlin API](https://www.kulturdaten.berlin/): Fetches event data across Berlin.
- [Ionic](https://ionicframework.com/): Framework for developing mobile and web apps.
- [Capacitor](https://capacitorjs.com/): Native runtime for running web apps on iOS, Android, and the web.
- [Leaflet](https://leafletjs.com/): Enables interactive map features within the app.
- [OpenStreetMap](https://www.openstreetmap.org): Base map for event locations.
- [OpenStreetMap-Tiles](https://stadiamaps.com/products/map-tiles/): Provides map tiles for OpenStreetMap data.
- [Nominatim](https://nominatim.openstreetmap.org): Geocoding service to convert addresses into geographic coordinates.

## Prerequisites
- Node.js: Required for npm commands and project setup. You can download it from the official [Node.js website](https://nodejs.org/).

- npm: Node.js package manager. It is installed automatically with Node.js. You can check the version of npm by running `npm -v` in the terminal or command prompt.

- Ionic CLI: The command-line interface for Ionic, used to create, build, test, and deploy Ionic apps. After installing Node.js and npm, install the Ionic CLI globally with `npm install -g @ionic/cli`.

- Android Studio (for Android development): Provides the necessary tools to compile and run Android applications if you plan to test the app on Android devices. Download and installation instructions are available on the [Android Studio website](https://developer.android.com/studio).

- Xcode (for iOS development): Necessary for compiling and testing iOS applications if you intend to run the app on iOS devices. Xcode can be downloaded from the [Mac App Store](https://apps.apple.com/de/app/xcode/id497799835?mt=12) or the [Apple Developer website](https://developer.apple.com/xcode/).

## Getting Started
### Installation
1. **Clone the repository**
```
git clone https://github.com/ahirsch-github/kulturkompass.git
```
2. **Install dependencies**

```
npm install
```
3. **Install ionic CLI**
```
npm install -g @ionic/cli
```
### Start the App
* **Web environment**:
``` 
ionic serve
```

To run the app on a mobile device:
* **Android devices**:
```
ionic capacitor build android
```
To test the app on Android, you can use Android Studio or any other Android development tools.

* **iOS devices**:
```
ionic capacitor build ios
```
To test the app on iOS, you can use Xcode or any other iOS development tools.

## License
Kulturdaten is released under the [MIT License](/LICENSE).