import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.module';
import { machine } from '../machine/machine.model';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  private baseUrl: string;

  constructor(private http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) { 
    this.baseUrl = baseUrl ? baseUrl : '';
  }

  getMachine(): Observable<Array<machine>> {
    let url = this.baseUrl + '/list_all_machines';
    return this.http.get<any>(url);
  }

  postMachine(data: any){
    let url = this.baseUrl + '/post_machine';
    return this.http.post<any>(url, data);
  }

  putMachine(data: any, id: number){
    let url = this.baseUrl + '/update_machine_by_id/'+id;
    return this.http.put<any>(url, data);
  }

  getMachineItemByID(id: number): Observable<Array<machine>> {
    let url = this.baseUrl + '/get_machine_by_id/'+id;
    return this.http.get<any>(url);
  }

  deleteMachineItem(id: number){
    let url = this.baseUrl + '/delete_machine_by_id/'+id;
    return this.http.delete<any>(url);
  }

  getAllTagIDPonton(){
    let url = this.baseUrl + '/get_all_tag_id_ponton';
    return this.http.get<any>(url);
  }
}
