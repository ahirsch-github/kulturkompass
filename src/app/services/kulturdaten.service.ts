import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


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

  getEvents(page: number): Observable<any> {
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

  getLocations(page: number): Observable<any> {
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
