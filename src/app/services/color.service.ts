import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.module';
import { color } from '../coloroptions/color.model';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  private baseUrl: string;

  constructor(private http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) { 
    this.baseUrl = baseUrl ? baseUrl : '';
  }

  getColorOptions(): Observable<Array<color>> {
    let url = this.baseUrl + '/list_all_color_options';
    return this.http.get<any>(url);
  }

  postColorOption(data: any){
    let url = this.baseUrl + '/post_color_option';
    return this.http.post<any>(url, data);
  }

  putColorOption(data: any, id: number){
    let url = this.baseUrl + '/update_color_option_by_id/'+id;
    return this.http.put<any>(url, data);
  }

  getColorOptionByID(id: number): Observable<Array<color>> {
    let url = this.baseUrl + '/get_color_option_by_id/'+id;
    return this.http.get<any>(url);
  }

  deleteColorOption(id: number){
    let url = this.baseUrl + '/delete_color_option_by_id/'+id;
    return this.http.delete<any>(url);
  }
}
