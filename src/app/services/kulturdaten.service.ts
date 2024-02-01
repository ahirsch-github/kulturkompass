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

  /**
   * Retrieves events from the server.
   * @returns An observable that emits the events data.
   */
  getEvents(): Observable<any> {
    return this.http.get(`${this.baseUrl}/events`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Retrieves events by page number.
   * @param page - The page number to retrieve events from.
   * @returns An Observable that emits the response from the server.
   */
  getEventsByPage(page: number): Observable<any> {
    const body = {
      inTheFuture: true
    };

    return this.http.post(`${this.baseUrl}/events/search?&page=${page}`, body, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Retrieves events based on attraction IDs and page number.
   * 
   * @param attractionIds - An array of attraction IDs.
   * @param page - The page number.
   * @returns An Observable that emits the response containing the events.
   */
  getEventsByAttractionIds(attractionIds: string[], page: number): Observable<any> {
    const today = new Date().toISOString().split('T')[0];
    const body = {
      searchFilter: {
        "$and": [
          {
            "attractions.referenceId": {
              "$in": attractionIds
            }
          },
          {
            "schedule.startDate": {
              "$gte": today
            }
          }
        ]
      }
    };
    
    return this.http.post(`${this.baseUrl}/events/search?pageSize=2000`, body, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Retrieves events filtered by charge, day, and attraction IDs.
   * 
   * @param isFree - Indicates whether the event is free of charge.
   * @param isToday - Indicates whether the event is scheduled for today.
   * @param isTomorrow - Indicates whether the event is scheduled for tomorrow.
   * @param attractionIds - An array of attraction IDs to filter the events by.
   * @returns An observable that emits the filtered events.
   */
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

  /**
   * Searches events based on the provided filters.
   * 
   * @param dates - An array of dates to filter events by.
   * @param times - An array of times to filter events by.
   * @param isFree - A boolean indicating whether to filter events by free admission.
   * @param locations - An array of locations to filter events by.
   * @param attractions - An array of attractions to filter events by.
   * @returns An Observable that emits the search results.
   */
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

    const today = new Date().toISOString().split('T')[0];

    filters.push({ 'schedule.startDate': { "$gte": today } });
    
    const filter = filters.length > 1 ? { '$and': filters } : filters[0] || {};
    const body = { searchFilter: filter };
    
    return this.http.post(`${this.baseUrl}/events/search?pageSize=300`, body, { headers: this.headers })
      .pipe(catchError(this.handleError));
  } 

  /**
   * Retrieves attractions from the server.
   * @param page The page number to retrieve.
   * @returns An Observable that emits the response from the server.
   */
  getAttractions(page: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/attractions?page=${page}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Searches for attractions based on the provided search term. The search term is matched against the title and description of the attraction.
   * @param searchTerm The term to search for.
   * @returns An Observable that emits the search results.
   */
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

  /**
   * Searches for attractions based on the specified categories.
   * @param categories - An array of category names to filter attractions by.
   * @returns An Observable that emits the search results.
   */
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
  
  /**
   * Searches attractions based on the provided filters.
   * @param filters - The filters to apply to the search.
   * @returns An Observable that emits the search results.
   */
  searchAttractionsByFilters(filters: any): Observable<any> {
    const body = {
      searchFilter: filters
    };
    return this.http.post(`${this.baseUrl}/attractions/search?pageSize=5000`, body, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Retrieves an attraction by its ID.
   * @param id - The ID of the attraction.
   * @returns An Observable that emits the attraction data.
   */
  getAttractionById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/attractions/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Retrieves the locations from the server.
   * @returns An Observable that emits the locations data.
   */
  getLocations(): Observable<any> {
    return this.http.get(`${this.baseUrl}/locations`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Retrieves the coordinates (latitude and longitude) for a given address. It uses the OpenStreetMap Nominatim API.
   * @param street - The street name.
   * @param city - The city name.
   * @param postalCode - The postal code.
   * @returns An Observable that emits an object containing the latitude and longitude.
   */
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

  /**
   * Retrieves the location information by its ID.
   * @param id The ID of the location.
   * @returns An Observable that emits the location information.
   */
  getLocationById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/locations/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  /**
   * Searches locations by borough and accessibility tags.
   * 
   * @param borough - An array of borough names to filter the locations by.
   * @param accessibilityIds - An array of accessibility tag IDs to filter the locations by.
   * @returns An Observable that emits the search results.
   */
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

  private handleError(error: any): String {
    console.error('Ein Fehler ist aufgetreten:', error);
    return error;
  }
}
