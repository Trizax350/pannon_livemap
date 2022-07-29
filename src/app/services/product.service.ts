import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.module';
import { product } from '../product/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl: string;

  constructor(private http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) { 
    this.baseUrl = baseUrl ? baseUrl : '';
  }

  getProduct(): Observable<Array<product>> {
    let url = this.baseUrl + '/list_all_product';
    return this.http.get<any>(url);
  }

  postProduct(data: any){
    let url = this.baseUrl + '/post_product';
    return this.http.post<any>(url, data);
  }

  putProduct(data: any, id: number){
    let url = this.baseUrl + '/update_product_by_id/'+id;
    return this.http.put<any>(url, data);
  }

  getProductByID(id: number): Observable<Array<product>> {
    let url = this.baseUrl + '/get_product_by_id/'+id;
    return this.http.get<any>(url);
  }

  deleteProduct(id: number){
    let url = this.baseUrl + '/delete_product_by_id/'+id;
    return this.http.delete<any>(url);
  }

  getAllTagIDPonton(){
    let url = this.baseUrl + '/get_all_tag_id_ponton';
    return this.http.get<any>(url);
  }
}
