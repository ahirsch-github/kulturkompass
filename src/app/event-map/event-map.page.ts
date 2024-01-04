import { Component, HostListener, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { KulturdatenService } from '../services/kulturdaten.service';
import { switchMap, forkJoin } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { LocationModalComponent } from '../components/location-modal/location-modal.component';

@Component({
  selector: 'app-event-map',
  templateUrl: './event-map.page.html',
  styleUrls: ['./event-map.page.scss'],
})

export class EventMapPage implements OnInit {
  map: any;
  constructor(private kulturdatenService: KulturdatenService, private modalController: ModalController) { }
  coordinatesList: any[] = [];
  bezirk = 'Mitte';
  selectedLocation: any;
  selectedRadius: number = 3;
  currentCircle: L.Circle | undefined;
  currentMarker: L.Marker | undefined;
  
  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initMap();
    setTimeout(() => this.map.invalidateSize(), 0);
    this.applyFilters();
  }

  async openLocationModal() {
    console.log('open location modal');
    const modal = await this.modalController.create({
      component: LocationModalComponent,
      cssClass: 'half-height-modal',
      componentProps: {
        'selectedLocation': this.selectedLocation || [52.5200, 13.4050],
        'selectedRadius': this.selectedRadius || 3
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.selectedLocation = data.location;
      this.selectedRadius = data.radius;
      console.log('new location', this.selectedLocation);
      console.log('new radius', this.selectedRadius);

      if (this.map && this.selectedLocation && this.selectedRadius) {
          if (this.currentMarker) {
            this.map.removeLayer(this.currentMarker);
          }
          if (this.currentCircle) {
            this.map.removeLayer(this.currentCircle);
          }

          this.currentMarker = L.marker(this.selectedLocation).addTo(this.map);
  
          this.currentCircle = L.circle(this.selectedLocation, {
            color: 'none',
            fillColor: 'none',
            fillOpacity: 0,
            radius: (this.selectedRadius || 0) * 1000,
            interactive: false
          }).addTo(this.map);

          const bounds = this.currentCircle.getBounds();
          const zoomLevel = this.map.getBoundsZoom(bounds);
        
          this.map.setView(this.selectedLocation, zoomLevel);
        }
    }
  }



  isFree: boolean = false;
  isToday: boolean = true;
  isTomorrow: boolean = false;

  onFreeFilterToggle(): void {
    this.isFree = !this.isFree;
    this.applyFilters();
  }

   onTodayFilterToggle(): void {
    this.isToday = true;
    this.isTomorrow = false;
    this.applyFilters();
  }

  onTomorrowFilterToggle(): void {
    this.isToday = false;
    this.isTomorrow = true;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.CircleMarker) {
        this.map.removeLayer(layer);
      }
    });
    this.coordinatesList = [];
    this.kulturdatenService.getEventsFilteredByChargeAndDay(this.isFree, this.isToday, this.isTomorrow).subscribe(filteredEvents => {
      const locationRequests = filteredEvents.data.events.map((event: any) => {
        return this.kulturdatenService.getLocationById(event.locations[0].referenceId)
          .pipe(
            switchMap((response) => {
              let location = response.data.location;
              return this.kulturdatenService.getCoordinates(location.address.streetAddress, location.address.addressLocality, location.address.postalCode);
            })
          );
      });

      forkJoin(locationRequests).subscribe((results: any) => {
        this.coordinatesList = results.filter((coordinates: { lat: number; lng: number; }) => coordinates.lat !== 0 || coordinates.lng !== 0);
        this.setMarkers();
        console.log(this.coordinatesList.length);
      });
    });
  }

  private setMarkers(): void {
    console.log(this.coordinatesList);
    this.coordinatesList.forEach((coord) => {
      console.log(coord);
      L.circleMarker(coord, {
        radius: 8,
        fillColor: "#473077",
        color: "#000",
        weight: 0,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(this.map);
    });
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [52.5200, 13.4050], // Koordinaten von Berlin
      zoom: 13,
      zoomControl: false,
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
    this.selectedLocation = e.latlng;

    L.marker(e.latlng).addTo(this.map);
  }

  private onLocationError = (e: any) => {
    console.error(e.message);
    this.selectedLocation = [52.5200, 13.4050];
    this.map.setView([52.5200, 13.4050], 13);
  }

  onSearchStart(data: any): void {
    if (data === '') {
      this.applyFilters();
      return;
    } else {
      // TODO: Implememt search
      this.applyFilters();
    }
  }
}