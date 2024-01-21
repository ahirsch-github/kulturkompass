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

  getFutureEvents(pageSize: number = 278, body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/events/search?pageSize=${pageSize}`, body, { headers: this.headers })
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
    return this.http.post(`${this.baseUrl}/events/search?pageSize=2000`, body, { headers: this.headers })
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

  getEventsFilteredByChargeAndDayAndAttractionIds(isFree: boolean, isToday: boolean, isTomorrow: boolean, attractionIds: string[]): Observable<any> {
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

    if (attractionIds?.length > 0) {
      filter['attractions.referenceId'] = { "$in": attractionIds };
    }
    
    const body = {
      searchFilter: filter
    };

    return this.http.post(`${this.baseUrl}/events/search?pageSize=300`, body, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  
  searchAttractionsByFilters(filters: any): Observable<any> {
    const body = {
      searchFilter: filters
    };
    return this.http.post(`${this.baseUrl}/attractions/search?pageSize=5000`, body, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  searchEventsbyFilters(dates: string[], times: string[], isFree: boolean, locations: string[], attractions: string[]): Observable<any> {
    let filters = [];
    
    if (dates.length > 0) {
      const dateFilters = dates.map(date => ({ 'schedule.startDate': date }));
      filters.push({ '$or': dateFilters });
    }
    
    if (times.length > 0) {
      const timeFilters = times.map(time => {
          const [startTime, endTime] = time.split(' - ');
          return { 'schedule.startTime': { $gte: startTime, $lt: endTime } };
      });
      filters.push({ '$or': timeFilters });
    }
    
    if (locations.length > 0) {
      filters.push({ 'locations.referenceId': { "$in": locations } });
    }

    if (attractions.length > 0) {
      filters.push({ 'attractions.referenceId': { "$in": attractions } });
    }
    
    if (isFree) {
      filters.push({ 'admission.ticketType': 'ticketType.freeOfCharge' });
    }
    
    const filter = filters.length > 1 ? { '$and': filters } : filters[0] || {};
    const body = { searchFilter: filter };

    console.log(body);
    
    return this.http.post(`${this.baseUrl}/events/search?pageSize=300`, body, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }
    
  
  searchLocationsByBoroughAndTag(borough: string[], accessibilityIds: string[]): Observable<any> {
    const filter: any = {};

    if (borough.length > 0 && accessibilityIds.length > 0) {
      filter['$and'] = [{ 'borough': { "$in": borough } }, { 'accessibility': { "$all": accessibilityIds } }];
    } else if (borough.length > 0) {
      filter['borough'] = { "$in": borough };
    } else if (accessibilityIds.length > 0) {
      filter['accessibility'] = { "$all": accessibilityIds };
    }

    const body = {
      searchFilter: filter
    };

    return this.http.post(`${this.baseUrl}/locations/search?pageSize=500`, body, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  searchAttractionByCategory(categories: string[]): Observable<any> {
    const body = {
      searchFilter: {
        tags: {
          "$in": categories
        }
      }
    };
    return this.http.post(`${this.baseUrl}/attractions/search?pageSize=5000`, body, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): String {
    console.error('Ein Fehler ist aufgetreten:', error);
    return error;
  }
}
