import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, mergeMap, map } from 'rxjs/operators';
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

  getAllEvents(): Observable<any[]> {
    return this.getEventsByPage(1).pipe(
      mergeMap(data => {
        const totalPages = Math.ceil(data.data.totalCount / 30); // Berechnen der Gesamtseitenzahl
        const pageRequests: Observable<any>[] = [];
        console.log(pageRequests);
        for (let i = 2; i <= totalPages/50; i++) {
          pageRequests.push(this.getEventsByPage(i));
        }

        return forkJoin([of(data), ...pageRequests]).pipe(
          map(results => {
            return results.reduce((acc, response) => {
              // Prüfen, ob die Antwort das erwartete Format hat
              if (response.success && response.data && Array.isArray(response.data.events)) {
                return [...acc, ...response.data.events];
              } else {
                console.error('Unexpected response format:', response);
                return acc;
              }
            }, []);
          }),
          catchError(err => {
            console.error('Error fetching events:', err);
            return of([]); // Sie könnten hier auch throwError verwenden, um den Fehler an die Komponente weiterzugeben.
          })
        );
      }),
      catchError(err => {
        console.error('Error fetching the first page of events:', err);
        return throwError(err); // Fehler an die Komponente weiterleiten
      })
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

    // const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    return this.http.get<any[]>(url).pipe(
      map(results => {
        if (results.length > 0) {
          const firstResult = results[0];
          return {
            lat: firstResult.lat,
            lng: firstResult.lon
          };
        }
        throw new Error('No results found');
      })
    );
  }

  getAllLocations(): Observable<any[]> {
    return this.getLocationsByPage(1).pipe(
      mergeMap(data => {
        const totalPages = Math.ceil(data.data.totalCount / 30); // Berechnen der Gesamtseitenzahl
        const pageRequests: Observable<any>[] = [];
        console.log(pageRequests);
        for (let i = 2; i <= totalPages; i++) {
          pageRequests.push(this.getLocationsByPage(i));
        }

        return forkJoin([of(data), ...pageRequests]).pipe(
          map(results => {
            return results.reduce((acc, response) => {
              // Prüfen, ob die Antwort das erwartete Format hat
              if (response.success && response.data && Array.isArray(response.data.locations)) {
                return [...acc, ...response.data.locations];
              } else {
                console.error('Unexpected response format:', response);
                return acc;
              }
            }, []);
          }),
          catchError(err => {
            console.error('Error fetching locations:', err);
            return of([]); // Sie könnten hier auch throwError verwenden, um den Fehler an die Komponente weiterzugeben.
          })
        );
      }),
      catchError(err => {
        console.error('Error fetching the first page of locations:', err);
        return throwError(err); // Fehler an die Komponente weiterleiten
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

  private handleError(error: any): String {
    console.error('Ein Fehler ist aufgetreten:', error);
    return error;
  }
}
