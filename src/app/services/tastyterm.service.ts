import { Injectable } from "@angular/core";
import {HttpHeaders, HttpClient, HttpParams} from '@angular/common/http';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

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
      // Headers object is immutable so we must set it anew.
      // See https://angular.io/guide/http#update-headers
      headers = headers
        .set('Authorization', 'Bearer ' + localStorage.getItem(QuickTermService.STORAGE_BEARER_TOKEN_KEY))
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
