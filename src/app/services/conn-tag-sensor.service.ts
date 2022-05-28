import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.module';
import { conntagsensor } from '../conntagsensor/conntagsensor.model';

@Injectable({
  providedIn: 'root'
})
export class ConnTagSensorService {

  private baseUrl: string;

  constructor(private http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) { 
    this.baseUrl = baseUrl ? baseUrl : '';
  }

  getConntagsensor(): Observable<Array<conntagsensor>> {
    let url = this.baseUrl + '/list_all_conn_tag_sensor';
    return this.http.get<any>(url);
  }

  postConntagsensor(data: any){
    let url = this.baseUrl + '/post_conn_tag_sensor';
    return this.http.post<any>(url, data);
  }

  putConntagsensor(data: any, id: number){
    let url = this.baseUrl + '/update_conn_tag_sensor_by_id/'+id;
    return this.http.put<any>(url, data);
  }

  getConntagsensorItemByID(id: number): Observable<Array<conntagsensor>> {
    let url = this.baseUrl + '/get_conn_tag_sensor_by_id/'+id;
    return this.http.get<any>(url);
  }

  deleteConntagsensorItem(id: number){
    let url = this.baseUrl + '/delete_conn_tag_sensor_by_id/'+id;
    return this.http.delete<any>(url);
  }
}
