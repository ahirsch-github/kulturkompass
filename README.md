# kulturdaten

Kulturdaten is an open-source library demonstrating how to utilize the API of the kulturdaten.berlin API, which is a project of the Technologiestiftung Berlin (https://www.technologiestiftung-berlin.de), funded by the Senate Department for Culture and Social Cohesion, to discover events in Germany's capital, Berlin.

## Table of Contents
1. [General Info](#general-info)
2. [Technologies](#technologies)
3. [Prequesites](#Prequesites)
4. [Getting started](#getting-started)
5. [License](#license)

## General Info
***
Finding a comprehensive overview of all cultural events in Berlin can be challenging. The kulturdaten.berlin api provided by Technologiestiftung Berlin aims to create a central endpoint where all events are aggregated in one place. This project is an Ionic-based application designed for both web and mobile devices, including Android and iOS. The app allows users to list, search, and display events using various filters and also showcases them on a map.

### Screenshot
![Image text](https://www.united-internet.de/fileadmin/user_upload/Brands/Downloads/Logo_IONOS_by.jpg)


## Technologies
***
A list of technologies used within the project:

* [kulturdaten.berlin api](https://example.com): Version X.XX - A brief description about how this API is used in your project.
* [Ionic Framework](https://example.com): Version 12.3 - A popular open-source SDK for building performant, high-quality mobile and desktop apps using web technologies
* [Capacitor](https://example.com): Version X.XX - A cross-platform native runtime that makes it easy to build web apps that run natively on iOS, Android and the web.
* [Leaflet js](https://example.com): Version 2.34 - An open-source JavaScript library for mobile-friendly interactive maps.
* [OpenStreetMap](https://example.com): Version X.XX - A map of the world, free to use under an open license.
* [OpenStreetMap-Tiles](https://example.com): Version X.XX - A brief description about how these tiles are used in your project. https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png und https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png
* [Nominatim API](https://example.com): Version 1234 - A search engine for the OpenStreetMap database. This is the software that powers the Search box on the OpenStreetMap website.

## Prequesites
Node js installieren [Hier weitere prequesites einfügen, die sinnvoll sind hier zu erwähnen]

## Getting Started
***
### Installation
1. **Clone repository**
```
git clone https://github.com/ahirsch-github/kulturdaten.git
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
To start the app in a web environment:
``` 
ionic serve
```

To run the app on a mobile device:
* On an Android device:
```
ionic capacitor build android
```
To test the app on Android, you can use Android Studio or any other Android development tools.

* On iOS devices
```
ionic capacitor build ios
```
To test the app on iOS, you can use Xcode or any other iOS development tools.

## License
Kulturdaten is released under the MIT License. For more details, see the LICENSE file in the repository.