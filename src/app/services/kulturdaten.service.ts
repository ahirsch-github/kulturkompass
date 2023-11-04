import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class KulturdatenService {

  private readonly baseUrl: string = 'https://kulturdaten-api-staging.onrender.com/api';

  constructor(private http: HttpClient) { }

  getEvents(page: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/events?page=${page}`)
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