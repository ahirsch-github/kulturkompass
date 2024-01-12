import { ModalController } from '@ionic/angular';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { BerlinBezirkeLatLng } from 'src/app/enums/berlin-bezirke-latlng';

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
  @Input() showDistrictFilter!: boolean | true;

  constructor(private modalCtrl: ModalController) {}
  
  ngOnInit() {
    if (!this.selectedRadius) {
      this.selectedRadius = 3;
    }
    console.log(this.selectedLocation);
    console.log(this.selectedRadius);
  }

  ngAfterViewInit() {
    setTimeout(() => this.initMap(), 300);
    // this.waitForModal().then(() => this.initMap());
  }

  waitForModal(): Promise<void> {
    return new Promise(resolve => {
      const checkVisibility = () => {
        if (this.isModalOpen()) {
          resolve();
        } else {
          setTimeout(checkVisibility, 100);
        }
      };
      checkVisibility();
    });
  }

  isModalOpen(): any {
    const modal = document.querySelector('ion-modal');
    return modal && getComputedStyle(modal).display !== 'none';
  }

  initMap(): void {
    if (!this.selectedLocation) {
      this.selectedLocation = [52.5200, 13.4050]; // Berlin Mitte
    }
  
    this.map = L.map('modal-map').setView(this.selectedLocation, 13);
    this.map.zoomControl.remove();
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
  
    this.setMarkerAndRadius(this.selectedLocation, this.selectedRadius);
  
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.selectedLocation = e.latlng;
      this.setMarkerAndRadius(this.selectedLocation, this.selectedRadius);
    });
  }
  
  setMarkerAndRadius(location: any, radius: any): void {
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
    }
    if (this.currentCircle) {
      this.map.removeLayer(this.currentCircle);
    }
  
    // TODO: make Marker #473077 and more matching to the design
    this.currentMarker = L.marker(location).addTo(this.map);
  
    this.currentCircle = L.circle(location, {
      color: '#473077',
      fillColor: '#8974b4',
      fillOpacity: 0.3,
      radius: (this.selectedRadius || 0) * 1000,
      interactive: false
    }).addTo(this.map);
  
    const bounds = this.currentCircle.getBounds();
    const zoomLevel = this.map.getBoundsZoom(bounds);
  
    this.map.setView(location, zoomLevel);
  }
  

  confirmLocation(): void {
    this.modalCtrl.dismiss({
      location: this.selectedLocation,
      radius: this.selectedRadius
    });
  }

  closeModal(): void {
    this.modalCtrl.dismiss();
  }

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
    console.log('use current location');
    this.map.locate();
    this.map.on('locationfound', this.onLocationFound);
    this.map.on('locationerror', this.onLocationError);
  }

  private onLocationFound = (e: { accuracy: any; latlng: L.LatLngExpression; }) => {
    this.selectedLocation = e.latlng;
    this.setMarkerAndRadius(this.selectedLocation, this.selectedRadius);
  }

  private onLocationError = (e: any) => {
    console.error(e.message);
    this.setMarkerAndRadius([52.5200, 13.4050], this.selectedRadius);
  }

}
