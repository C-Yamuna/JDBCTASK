// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  
  private apiUrl = 'http://localhost:8080/schemas/dropdown-db' // Use the API URL from environment
  private apiUrls = 'http://localhost:8080/schemas/update-db' 
  private baseUrl = 'http://localhost:8080/schemas/download_query_results';

  constructor(private http: HttpClient) {}

  getDropdownData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateDatabase(payload: any): Observable<any> {
    return this.http.post('http://localhost:8080/schemas/update-db', payload); // Replace with your actual endpoint
  }

  // downloadQueryResults(queryPayload: { sqlQuery: string, databases: any[] }): Observable<Blob> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   return this.http.post(`${this.baseUrl}`, queryPayload, {
  //     headers: headers,
  //     responseType: 'blob' // Expecting binary data (CSV)
  //   });
  // }
  downloadQueryResults(payload: any): Observable<Blob> {
    return this.http.post('http://localhost:8080/schemas/download_query_results', payload, {
      responseType: 'blob'
    });
  }
}
