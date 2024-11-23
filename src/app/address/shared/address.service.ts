// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  
  private apiUrl = 'http://localhost:8080/schemas/dropdown-db' // Use the API URL from environment
  private apiUrls = 'http://localhost:8080/schemas/update-db' 
  private baseUrl = 'http://localhost:8080/schemas/download_select_query';
  private downloadDumpUrl = 'http://localhost:8080/schemas/dump/data/{dbIndex}';


  constructor(private http: HttpClient) {}

  getDropdownData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
 
  updateDatabase(payload: any): Observable<any> {
    return this.http.post('http://localhost:8080/schemas/update-db', payload); // Replace with your actual endpoint
  }
 
  downloadQueryResults(payload: any): Observable<Blob> {
    return this.http.post('http://localhost:8080/schemas/download_select_query', payload, {
      responseType: 'blob'
    });
  }

  downloadDatabaseDump(dbIndex: string): Observable<Blob> {
    const url = `http://localhost:8080/schemas/dump/data/${dbIndex}`; // Replace with your actual endpoint
    return this.http.post(url, {}, { responseType: 'blob' });
  }
}
