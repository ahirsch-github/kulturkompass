import { Component, HostListener, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { KulturdatenService } from '../services/kulturdaten.service';
import { switchMap, forkJoin, map } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { LocationModalComponent } from '../components/location-modal/location-modal.component';
import { BerlinBezirkeLatLng } from '../enums/berlin-bezirke-latlng';
import { BerlinBezirke } from '../enums/berlin-bezirke';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-map',
  templateUrl: './event-map.page.html',
  styleUrls: ['./event-map.page.scss'],
})

export class EventMapPage implements OnInit {
  map: any;
  constructor(private kulturdatenService: KulturdatenService, private modalController: ModalController, private datePipe: DatePipe) { }
  coordinatesList: any[] = [];
  bezirk = BerlinBezirke['mitte'];
  selectedLocation: any;
  selectedRadius: number = 3;
  currentCircle: L.Circle | undefined;
  currentMarker: L.Marker | undefined;
  eventsList: any[] = [];
  defaultLocation: any = [52.5200, 13.4050];
  isFree: boolean = false;
  isToday: boolean = true;
  isTomorrow: boolean = false;

  // Map zum Speichern des aktuellen Indexes für jedes Event-Set basierend auf dem Schlüssel
  private carouselIndexMap: Map<string, number> = new Map<string, number>();

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initMap();
    setTimeout(() => this.map.invalidateSize(), 0);
  }

  async openLocationModal() {
    const modal = await this.modalController.create({
      component: LocationModalComponent,
      cssClass: 'half-height-modal',
      componentProps: {
        'selectedLocation': this.selectedLocation || this.defaultLocation,
        'selectedRadius': this.selectedRadius || 3
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.selectedLocation = data.location;
      this.selectedRadius = data.radius;

      this.setBezirk();

      if (this.map && this.selectedLocation && this.selectedRadius) {
          if (this.currentMarker) {
            this.map.removeLayer(this.currentMarker);
          }
          if (this.currentCircle) {
            this.map.removeLayer(this.currentCircle);
          }

          this.currentCircle = L.circle(this.selectedLocation, {
            color: '#473077',
            fillColor: '#473077',
            fillOpacity: 0.2,
            radius: (this.selectedRadius || 0)  * 1000,
            interactive: false
          }).addTo(this.map);

          const bounds = this.currentCircle.getBounds();
          const zoomLevel = this.map.getBoundsZoom(bounds);

          let bezirkName = '';
          for (const bezirk in BerlinBezirkeLatLng) {
            const [lat, lng] = BerlinBezirkeLatLng[bezirk];
            if (lat === this.selectedLocation.lat && lng === this.selectedLocation.lng) {
              bezirkName = bezirk;
              console.log(bezirkName);
              break;
            }
          }          
          this.map.setView(this.selectedLocation, zoomLevel);
          this.applyFilters();
        }
    }
  }

  setBezirk() {
    let bezirkName = '';
      for (const bezirk in BerlinBezirkeLatLng) {
        const [lat, lng] = BerlinBezirkeLatLng[bezirk];
        if (lat === this.selectedLocation[0] && lng === this.selectedLocation[1]) {
          bezirkName = bezirk;
          this.bezirk = BerlinBezirke[bezirkName];
          break;
        }
      }
      if (bezirkName === '') {
        console.log('no bezirk');
        this.bezirk = 'Ausgewählter Standort';
      }
  }

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
    this.setLocationAndRadius();

    this.coordinatesList = [];
    this.eventsList = [];
    this.kulturdatenService.getEventsFilteredByChargeAndDay(this.isFree, this.isToday, this.isTomorrow).subscribe(filteredEvents => {
      const locationRequests = filteredEvents.data.events.map((event: any) => {
        return this.kulturdatenService.getLocationById(event.locations[0].referenceId)
          .pipe(
            switchMap((response) => {
              let location = response.data.location;
              return this.kulturdatenService.getCoordinates(location.address.streetAddress, location.address.addressLocality, location.address.postalCode)
                .pipe(
                  map(coordinates => ({
                    eventTitle: event.attractions[0].referenceLabel.de,
                    eventStartDate: event.schedule.startDate,
                    eventStart: event.schedule.startTime,
                    eventLocationTitle: location.title.de,
                    lat: coordinates.lat,
                    lng: coordinates.lng
                  }))
                );
            })
          );
      });

      forkJoin(locationRequests).subscribe((results: any) => {
        const eventsList: any[] = results as any[];
        this.eventsList = eventsList.filter(eventInfo => {
          return (eventInfo.lat !== 0 || eventInfo.lng !== 0) && this.isWithinRadius(eventInfo);
        });
        this.setMarkers();
      });
    });
  }

  setLocationAndRadius(): void {
    if (this.selectedRadius) {
      this.currentCircle = L.circle(this.selectedLocation, {
        radius: this.selectedRadius * 1000,
        color: '#473077',
        weight: 2,
        fillColor: 'none',
        fillOpacity: 0.9,
        interactive: false
      }).addTo(this.map);    
      const bounds = this.currentCircle.getBounds();
      const zoomLevel = this.map.getBoundsZoom(bounds);
      this.map.setView(this.selectedLocation, zoomLevel);
    }
  }

  isWithinRadius(eventCoordinates: { lat: number; lng: number; }) {
    const center = L.latLng(this.selectedLocation);
    const eventLocation = L.latLng(eventCoordinates.lat, eventCoordinates.lng);
    const distance = center.distanceTo(eventLocation); // Distanz in Metern
    return distance <= this.selectedRadius * 1000; // Umwandlung von km in Meter
  }

  eventsByLocation: Map<string, any[]> = new Map<string, any[]>();

  private setMarkers(): void {
    this.eventsByLocation = new Map();

    this.eventsList.forEach((event: any) => {
      const key = `${event.lat}-${event.lng}`;
      if (!this.eventsByLocation.has(key)) {
        this.eventsByLocation.set(key, []);
      }
      let eventsAtLocation = this.eventsByLocation.get(key);
      if (eventsAtLocation) {
        eventsAtLocation.push(event);
      }
    });

    this.eventsByLocation.forEach((events, key) => {
      const [lat, lng] = key.split('-');
      const marker = L.circleMarker([parseFloat(lat), parseFloat(lng)], {
        radius: 8,
        fillColor: "#473077",
        color: "#000",
        weight: 0,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(this.map);

      let popupContent: string[] = [];
      events.forEach((event: any) => {
        popupContent.push(`
          <h6>${event.eventTitle}</h6>
          <b>Wann?</b> ${this.formatDate(event.eventStartDate) + ', ' + this.formatTime(event.eventStart) + ' Uhr'}</br>
          <b>Wo? </b>${event.eventLocationTitle}</br>
          <hr>
        `);
      });

      
      const popup = L.popup({
        className: 'custom-popup',
        closeButton: false
      }).setContent(`
          <div id="popup-${key}" class="popup-container">
          <div class="carousel-content" id="popupContent">
            ${popupContent[0]}
          </div>
          ${popupContent.length > 1 ? `
          <div class="carousel-controls">
            <ion-icon name="chevron-back-outline" class="carousel-control prev disabled" id="prev-${key}"><</ion-icon>
            <ion-icon name="chevron-forward-outline" class="carousel-control next" id="next-${key}">></ion-icon>
          </div>
          ` : ''}
        </div>
      `);

      this.map.on('popupopen', (e: any) => {
        const key = e.popup._source._latlng.lat + '-' + e.popup._source._latlng.lng;

        let prevButton = document.getElementById(`prev-${key}`);
        if (prevButton) {
          prevButton.removeEventListener('click', () => this.prevEvent(key));
          prevButton.addEventListener('click', () => this.prevEvent(key));
        }
        let nextButton = document.getElementById(`next-${key}`);
        if (nextButton) {
          nextButton.removeEventListener('click', () => this.nextEvent(key));
          nextButton.addEventListener('click', () => this.nextEvent(key));
        }
        this.carouselIndexMap.set(key, 0);
      });
      marker.bindPopup(popup);
    });
  }

  prevEvent(key: string): void {
    const currentIndex = this.carouselIndexMap.get(key) || 0;
    const events = this.eventsByLocation.get(key);
    if (events && currentIndex <= events.length - 1) {
      if (currentIndex > 0) {
        const nextIndex = currentIndex - 1;
        this.carouselIndexMap.set(key, nextIndex);
        this.updateCarouselContent(key, events[nextIndex]);
      }
    }
  }

  nextEvent(key: string): void {
    const currentIndex = this.carouselIndexMap.get(key) || 0;
    const events = this.eventsByLocation.get(key);
    if (events && currentIndex < events.length - 1) {
      const nextIndex = currentIndex + 1;
      this.carouselIndexMap.set(key, nextIndex);
      this.updateCarouselContent(key, events[nextIndex]);
    }
  }

  updateCarouselContent(key: string, event: any): void {
    const popupElement = document.getElementById(`popup-${key}`);
    if (popupElement) {
      const contentElement = popupElement.querySelector('.carousel-content');
      if (contentElement) {
        contentElement.innerHTML = `
          <h6>${event.eventTitle}</h6>
          <b>Wann?</b> ${this.formatDate(event.eventStartDate) + ', ' + this.formatTime(event.eventStart) + ' Uhr'}</br>
          <b>Wo? </b>${event.eventLocationTitle}</br>
          <hr>
        `;
      }
    }

    const prevButton = document.getElementById(`prev-${key}`);
    if (prevButton) {
      if (this.carouselIndexMap.get(key) === 0) {
        prevButton.classList.add('disabled');
      } else {
        prevButton.classList.remove('disabled');
      }
    }

    const nextButton = document.getElementById(`next-${key}`);
    if (nextButton) {
      let eventsAtLocation = this.eventsByLocation.get(key);
      if (eventsAtLocation && this.carouselIndexMap.get(key) === eventsAtLocation.length - 1) {
        nextButton.classList.add('disabled');
      } else {
        nextButton.classList.remove('disabled');
      }
    }
  }
  

  private initMap(): void {
    this.map = L.map('map', {
      center: this.defaultLocation,
      zoomControl: false,
    });

    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 11,
      attribution: '© OpenStreetMap contributors'
    });

    tiles.addTo(this.map);

    // Attempt to locate the user
    this.map.locate({setView: true, maxZoom: 13});

    // Event when location is found
    this.map.on('locationfound', this.onLocationFound);

    // Event for location error
    this.map.on('locationerror', this.onLocationError);
  }

  private onLocationFound = (e: { accuracy: any; latlng: L.LatLngExpression; }) => {
    this.selectedLocation = e.latlng;
    this.applyFilters();
    this.setBezirk();
  }
  
  private onLocationError = (e: any) => {
    console.error(e.message);
    this.selectedLocation = this.defaultLocation;
    this.applyFilters();
    this.setBezirk();
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

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd.MM.yyyy') || '';
  }

  formatTime(time: string): string {
    return time.substr(0, 5) || '';
  }
}