import { Injectable } from "@angular/core";
import {HttpHeaders, HttpClient, HttpParams} from '@angular/common/http';
import 'rxjs/add/operator/map';


@Injectable()
export class QuickTermService {

  public url: string;
  public launch: string;

  // public static JWT_LAUNCH_KEY: string = 'jwt';
  public static STORAGE_BEARER_TOKEN_KEY: string = 'token';

  constructor(protected http: HttpClient) {
  }

  public requestOptions(includeBearerToken: boolean) {
    let headers = new HttpHeaders({ 'Accept': 'application/json' });
    if (includeBearerToken) {
      headers.append('Authorization', 'Bearer ' + localStorage.getItem(QuickTermService.STORAGE_BEARER_TOKEN_KEY));
      headers.append('Accept', 'Accept: application/json+fhir');
    }
    let params = new HttpParams();
    // return new RequestOptions({ headers: headers, withCredentials: true, params: params });
    return { headers: headers, withCredentials: false, params: params };
  }


  // logout() {
  //     let status = this.http.delete(this.sessionsUrl(), this.requestOptions(true)).map(res => res.json());
  //     return status;
  // }

  // status() {
  //     let status = this.http.get(this.statusUrl(), this.requestOptions(true)).map(res => res.json());
  //     return status;
  // }
}
