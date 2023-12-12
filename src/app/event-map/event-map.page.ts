import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { KulturdatenService } from '../services/kulturdaten.service';

@Component({
  selector: 'app-event-map',
  templateUrl: './event-map.page.html',
  styleUrls: ['./event-map.page.scss'],
})

export class EventMapPage implements OnInit {
  map: any;
  constructor(private kulturdatenService: KulturdatenService) { }
  
  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initMap();
    setTimeout(() => this.map.invalidateSize(), 0);
    // this.loadLocationsAndSetMarkers();
  }

  private loadLocationsAndSetMarkers(): void {
    console.log('loadLocationsAndSetMarkers');
    this.kulturdatenService.getAllLocations().subscribe(locations => {
      let i = 0;
      locations.forEach((location: any) => {
        if (i > 0) {
          return;
        }
        i++;
        console.log(location);

        // lookup coordinates for 1. location
        
  
        // Geocoding-Service aufrufen, um Koordinaten zu erhalten
        this.kulturdatenService.getCoordinates("Schlossplatz 1, 10178 Berlin")
          .subscribe(coordinates => {
            console.log(coordinates);
            const marker = L.marker([coordinates.lat, coordinates.lng]).addTo(this.map);
            marker.bindPopup(location.title); // Ersetzen Sie location.title mit dem tatsächlichen Namen des Ortes
          });
      });
    });
  }
  

  private loadEventsAndSetMarkers(): void {
    console.log('loadEventsAndSetMarkers');
    this.kulturdatenService.getAllEvents().subscribe(events => {
      events.forEach((event: any) => {
        console.log(event);
        this.kulturdatenService.getLocationById(event.locations.referenceId).subscribe(location => {
          // Nehmen Sie an, dass location Koordinaten in der Form { lat: number, lng: number } hat
          const marker = L.marker([location.lat, location.lng]).addTo(this.map);
          marker.bindPopup(event.name); // Ersetzen Sie event.name mit dem tatsächlichen Namen des Events
        });
      });
    });
  }

  private initMap(): void {
    // Center Map in Berlin
    this.map = L.map('map', {
      center: [52.5200, 13.4050], // Koordinaten von Berlin
      zoom: 13
    });

    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    });

    tiles.addTo(this.map);

    // Attempt to locate the user
    this.map.locate({setView: true, maxZoom: 16});

    // Event when location is found
    this.map.on('locationfound', this.onLocationFound);

    // Event for location error
    this.map.on('locationerror', this.onLocationError);
  }

  private onLocationFound = (e: { accuracy: any; latlng: L.LatLngExpression; }) => {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(this.map)
      .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(this.map);
  }

  private onLocationError = (e: any) => {
    // Log the error or inform the user
    console.error(e.message);

    // Center and zoom the map on Berlin
    this.map.setView([52.5200, 13.4050], 13);
  }
}