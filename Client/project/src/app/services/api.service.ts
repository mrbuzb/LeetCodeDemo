import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:5272/api';

  constructor(private http: HttpClient) {}

  private getHeaders(contentType: string = 'application/json', auth: boolean = true): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': contentType
    });

    if (auth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    

    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
      params: httpParams
    }).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.error || 'API request failed');
        }
        return response.data!;
      })
    );
  }



  patch<T>(endpoint: string, data: any): Observable<T> {
  return this.http.patch<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data, {
    headers: this.getHeaders()
  }).pipe(
    map(response => {
      if (!response.success) {
        // throw new Error(response.error || 'API request failed');
      }
      return response.data!;
    })
  );
}

  /**
   * POST method for APIs that return ApiResponse<T>
   */
  post<T>(
    endpoint: string,
    data: any,
    auth: boolean = true,
    contentType: string = 'application/json'
  ): Observable<T> {
    const headers = this.getHeaders(contentType, auth);
    return this.http.post<ApiResponse<T>>(
      `${this.baseUrl}${endpoint}`,
      data,
      { headers }
    ).pipe(
      map(response => {
        return response.data!;
      })
    );
  }

  /**
   * POST method for raw JSON responses (not wrapped in ApiResponse<T>)
   */
  postRaw<T>(
    endpoint: string,
    data: any,
    auth: boolean = true,
    contentType: string = 'application/json'
  ): Observable<T> {
    const headers = this.getHeaders(contentType, auth);
    return this.http.post<T>(
      `${this.baseUrl}${endpoint}`,
      data,
      { headers }
    );
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.error || 'API request failed');
        }
        return response.data!;
      })
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.error || 'API request failed');
        }
        return response.data!;
      })
    );
  }
}
