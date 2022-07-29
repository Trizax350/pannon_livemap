import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.module';
import { environment } from '../../environments/environment';

const API_URL = environment.production
  ? `${window.location.protocol}//${window.location.hostname}:${environment.API_PORT}`
  : `${environment.API_URL}:${environment.API_PORT}`;

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private baseUrl: string;

  constructor(private http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) { 
    this.baseUrl = baseUrl ? baseUrl : '';
  }

  getAllTagDataPonton(): Observable<Array<any>> {
    let url = this.baseUrl + '/get_tag_data_ponton';
    return this.http.get<any>(url);
  }

  getTagDataByID(id: number): Observable<Array<any>> {
    let url = this.baseUrl + '/get_data_by_id/'+id;
    return this.http.get<any>(url);
  }

  getAllTagsPonton(): Observable<Array<any>> {
    let url = this.baseUrl + '/list_all_tag_last_data_ponton';
    return this.http.get<any>(url);
  }

  getZonesPonton(): Observable<Array<any>> {
    let url = this.baseUrl + '/get_zones_ponton';
    return this.http.get<any>(url);
  }

  getAssetTrackPonton(): Observable<Array<any>> {
    let url = this.baseUrl + '/get_asset_track_ponton';
    return this.http.get<any>(url);
  }

  getZoneColorByID(id: number): Observable<Array<any>> {
    let url = this.baseUrl + '/get_zone_color_by_zone_id/'+id;
    return this.http.get<any>(url);
  }

  getMachineByID(id: number): Observable<Array<any>> {
    let url = this.baseUrl + '/get_machine_by_id/'+id;
    return this.http.get<any>(url);
  }
}
