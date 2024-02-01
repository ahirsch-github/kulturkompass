import { ModalController, isPlatform } from '@ionic/angular';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { BerlinBezirkeLatLng } from 'src/app/enums/berlin-bezirke-latlng';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-location-modal',
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.scss'],
})
export class LocationModalComponent implements OnInit {
  map: any;
  currentCircle: L.Circle | undefined;
  currentMarker: L.Marker | undefined;
  @Input() selectedLocation: L.LatLngExpression | undefined;
  @Input() selectedRadius: number | undefined;
  defaultLocation: L.LatLngExpression = [52.5200, 13.4050];

  constructor(private modalCtrl: ModalController) {}
  
  ngOnInit() {
    if (!this.selectedRadius) {
      this.selectedRadius = 3;
    }
  }

  ngAfterViewInit() {
    // make sure that the map is correctly initialized 
    setTimeout(() => this.initMap(), 300);
  }

  /**
   * Initializes the map and sets up the necessary configurations.
   */
  initMap(): void {
    if (!this.selectedLocation) {
      this.selectedLocation = this.defaultLocation;
    }
  
    this.map = L.map('modal-map').setView(this.selectedLocation, 13);
    this.map.zoomControl.remove();

    // check if the user has currently selected dark mode as his color scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let tiles;

    if (prefersDark) {
      tiles = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 11,
        attribution: '© OpenStreetMap, © Stadia Maps'
      });
    } else {
      tiles = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 11,
        attribution: '© OpenStreetMap contributors, © Stadia Maps'
      });
    }
    tiles.addTo(this.map);
  
    this.setMarkerAndRadius(this.selectedLocation, this.selectedRadius);
  
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.selectedLocation = e.latlng;
      this.setMarkerAndRadius(this.selectedLocation, this.selectedRadius);
    });
  }
  
  /**
   * Sets the marker and radius on the map based on the given location and radius.
   * Removes the previous marker and circle if they exist.
   * @param location The location coordinates where the marker should be placed.
   * @param radius The radius in kilometers for the circle around the marker.
   */
  setMarkerAndRadius(location: any, radius: any): void {
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
    }
    if (this.currentCircle) {
      this.map.removeLayer(this.currentCircle);
    }
  
    var purpleIcon = L.icon({
      iconUrl: 'assets/icon/marker-pin.svg',
      iconSize:     [25, 25],
      iconAnchor:   [12, 12],
    });

    this.currentMarker = L.marker(location, {icon: purpleIcon}).addTo(this.map);
  
    this.currentCircle = L.circle(location, {
      color: '#473077',
      fillColor: '#8974b4',
      fillOpacity: 0.2,
      radius: (this.selectedRadius || 0) * 1000,
      interactive: false
    }).addTo(this.map);
  
    const bounds = this.currentCircle.getBounds();
    const zoomLevel = this.map.getBoundsZoom(bounds);
  
    this.map.setView(location, zoomLevel);
  }

  /**
   * Handles the change event of the radius input.
   * @param event - The event object containing the new radius value.
   */
  onRadiusChange(event: any): void {
    this.selectedRadius = event.detail.value;
    
    if (this.currentCircle) {
      this.map.removeLayer(this.currentCircle);
    }

    if (this.selectedLocation) {
      this.currentCircle = L.circle(this.selectedLocation, {
        color: '#473077',
        fillColor: '#8974b4',
        fillOpacity: 0.3,
        radius: (this.selectedRadius || 0) * 1000,
        interactive: false
      }).addTo(this.map);
        
      const bounds = this.currentCircle.getBounds();
      const zoomLevel = this.map.getBoundsZoom(bounds);
    
      this.map.setView(this.selectedLocation, zoomLevel); 
    } 
  }

  onMapClick(e: L.LeafletMouseEvent): void {
    this.selectedLocation = e.latlng;
  }

  /**
   * Handles the selection change event.
   * @param event - The event object containing the selected value.
   * @returns void
   */
  onSelectionChange(event: any): void {
    let bezirkkey = event.detail.value;

    if (bezirkkey === 'mitte') {
      this.selectedLocation = BerlinBezirkeLatLng['mitte'] as L.LatLngExpression;
    } else if (bezirkkey === 'friedrichshain') {
      this.selectedLocation = BerlinBezirkeLatLng['friedrichshain'] as L.LatLngExpression;
    } else if (bezirkkey === 'pankow') {
      this.selectedLocation = BerlinBezirkeLatLng['pankow'] as L.LatLngExpression;
    } else if (bezirkkey === 'charlottenburg') {
      this.selectedLocation = BerlinBezirkeLatLng['charlottenburg'] as L.LatLngExpression;
    } else if (bezirkkey === 'spandau') {
      this.selectedLocation = BerlinBezirkeLatLng['spandau'] as L.LatLngExpression;
    } else if (bezirkkey === 'steglitz') {
      this.selectedLocation = BerlinBezirkeLatLng['steglitz'] as L.LatLngExpression;
    } else if (bezirkkey === 'tempelhof') {
      this.selectedLocation = BerlinBezirkeLatLng['tempelhof'] as L.LatLngExpression;
    } else if (bezirkkey === 'neukoelln') {
      this.selectedLocation = BerlinBezirkeLatLng['neukoelln'] as L.LatLngExpression;
    } else if (bezirkkey === 'treptow') {
      this.selectedLocation = BerlinBezirkeLatLng['treptow'] as L.LatLngExpression;
    } else if (bezirkkey === 'marzahn') {
      this.selectedLocation = BerlinBezirkeLatLng['marzahn'] as L.LatLngExpression;
    } else if (bezirkkey === 'lichtenberg') {
      this.selectedLocation = BerlinBezirkeLatLng['lichtenberg'] as L.LatLngExpression;
    } else if (bezirkkey === 'reinickendorf') {
      this.selectedLocation = BerlinBezirkeLatLng['reinickendorf'] as L.LatLngExpression;
    }
    this.setMarkerAndRadius(this.selectedLocation, this.selectedRadius);
  }

  useCurrentLocation(): void {
    this.getLocation();
  }

  /**
   * Retrieves the current location.
   * If the platform is hybrid, it uses Geolocation.getCurrentPosition() to get the position.
   * If the platform is not hybrid, it uses the map to locate the user's position.
   */
  async getLocation() {
    let position: any;

    if (isPlatform('hybrid')) {
      position = await Geolocation.getCurrentPosition();
      if (position) {
        this.selectedLocation = [position.coords.latitude, position.coords.longitude];
      } else {
        this.selectedLocation = this.defaultLocation;
      }
      this.setMarkerAndRadius(this.selectedLocation, this.selectedRadius);

    } else {
      this.map.locate();
      this.map.on('locationfound', this.onLocationFound);
      this.map.on('locationerror', this.onLocationError);
    }
  }
  
  /**
   * Callback function triggered when a location is found.
   * @param e - The event object containing the accuracy and latlng properties.
   */
  private onLocationFound = (e: { accuracy: any; latlng: L.LatLngExpression; }) => {
    this.selectedLocation = e.latlng;
    this.setMarkerAndRadius(this.selectedLocation, this.selectedRadius);
  }

  /**
   * Handles the error that occurs during location retrieval.
   * @param e - The error object.
   */
  private onLocationError = (e: any) => {
    console.error(e.message);
    this.setMarkerAndRadius([52.5200, 13.4050], this.selectedRadius);
  }

  /**
   * Close modal and save selection
   */
  confirmLocation(): void {
    this.modalCtrl.dismiss({
      location: this.selectedLocation,
      radius: this.selectedRadius
    });
  }

  /**
   * Close modal without saving the selection
   */
  closeModal(): void {
    this.modalCtrl.dismiss();
  }

}
