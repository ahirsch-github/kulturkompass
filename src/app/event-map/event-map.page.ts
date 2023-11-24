import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-event-map',
  templateUrl: './event-map.page.html',
  styleUrls: ['./event-map.page.scss'],
})

export class EventMapPage implements OnInit {
  map: any;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initMap();
    setTimeout(() => this.map.invalidateSize(), 0);
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