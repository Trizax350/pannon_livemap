import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.module';
import { asset } from '../asset-track/asset.model';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  private baseUrl: string;

  constructor(private http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) { 
    this.baseUrl = baseUrl ? baseUrl : '';
  }

  getAssets(): Observable<Array<asset>> {
    let url = this.baseUrl + '/get_asset_track_ponton';
    return this.http.get<any>(url);
  }
}
