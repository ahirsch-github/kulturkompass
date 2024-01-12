import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, mergeMap, map, tap } from 'rxjs/operators';
import { Observable, forkJoin, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KulturdatenService {

  private readonly baseUrl: string = 'https://kulturdaten-api-staging.onrender.com/api';
  private readonly headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });
  constructor(private http: HttpClient) { }

  getEvents(): Observable<any> {
    return this.http.get(`${this.baseUrl}/events`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getEventsByPage(page: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/events?page=${page}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getEventsByAttractionIds(attractionIds: string[], page: number): Observable<any> {
    const body = {
      searchFilter: {
        "attractions.referenceId": {
            "$in": attractionIds
        }
      }
    };
    return this.http.post(`${this.baseUrl}/events/search?page=${page}`, body, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  searchAttractionsbyTag(tag: string[]): Observable<any> {
    const body = {
      searchFilter: {
        tags: {
          "$in": tag
        }
      }
    };
    return this.http.post(`${this.baseUrl}/attractions/search`, body, { headers: this.headers })
      .pipe(
        catchError(this.handleError) // Stelle sicher, dass du eine handleError-Methode hast
      );
  }

  searchAttractions(searchTerm: string): Observable<any> {
    const body = {
      searchFilter: {
        $or: [
          {
            "title.de": {
              $regex: searchTerm,
              $options: 'i'
            }
          },
          {
            "description.de": {
              $regex: searchTerm,
              $options: 'i'
            }
          }
        ]
      }
    };
    return this.http.post(`${this.baseUrl}/attractions/search?pageSize=5000`, body, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getAttractions(page: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/attractions?page=${page}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAttractionById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/attractions/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getLocations(): Observable<any> {
    return this.http.get(`${this.baseUrl}/locations`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCoordinates(street: string, city: string, postalCode: string): Observable<any> {

    const proxyUrl = 'https://thingproxy.freeboard.io/fetch/';

    const targetUrl = `https://nominatim.openstreetmap.org/search?street=${street.replace(/ /g, '+')}&city=${city.replace(/ /g, '+')}&postalcode=${postalCode}&format=json`;

    const url = proxyUrl + targetUrl;

    return this.http.get<any[]>(url).pipe(
      map(results => {
        if (results && results.length > 0) {
          const firstResult = results[0];
          return {
            lat: firstResult.lat,
            lng: firstResult.lon
          };
        }
        return { lat: 0, lng: 0 };
      })
    );
  }

  getLocationsByPage(page: number): Observable<any> {
    console.log('getLocationsByPage');
    return this.http.get(`${this.baseUrl}/locations?page=${page}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getLocationById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/locations/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getOrganizations(page: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/organizations?page=${page}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getEventsFilteredByChargeAndDay(isFree: boolean, isToday: boolean, isTomorrow: boolean): Observable<any> {
    const date = new Date();
    const today = date.toISOString().split('T')[0];
    date.setDate(date.getDate() + 1);
    const tomorrow = date.toISOString().split('T')[0];
  
    const filter: any = {};
  
    if (isFree) {
      filter['admission.ticketType'] = 'ticketType.freeOfCharge';
    }
    if (isToday) {
      filter['schedule.startDate'] = today;
    } else if (isTomorrow) {
      filter['schedule.startDate'] = tomorrow;
    }
  
    const body = {
      searchFilter: filter
    };
    return this.http.post(`${this.baseUrl}/events/search?pageSize=300`, body, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  

  private handleError(error: any): String {
    console.error('Ein Fehler ist aufgetreten:', error);
    return error;
  }
}
