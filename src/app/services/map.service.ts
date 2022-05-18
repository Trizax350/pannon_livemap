import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private baseUrl: string;

  constructor(private http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) { 
    this.baseUrl = baseUrl ? baseUrl : '';
  }

  getAllTags(): Observable<Array<any>> {
    let url = this.baseUrl + '/list_all_tag_last_data';
    return this.http.get<any>(url);
  }
}
