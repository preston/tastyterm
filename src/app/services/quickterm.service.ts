import {Injectable} from "@angular/core";
import {Headers, RequestOptions} from '@angular/http';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class QuickTermService {

  public url: string;
  public launch: string;

	// public static JWT_LAUNCH_KEY: string = 'jwt';
	public static LOCAL_STORAGE_JWT_KEY: string = 'jwt';

    constructor(protected http: Http) {
    }

	public requestOptions(includeBearerToken: boolean): RequestOptions {
		let headers = new Headers({ 'Accept': 'application/json' });
		if (includeBearerToken) {
			headers.append('Authorization', 'Bearer ' + localStorage.getItem(QuickTermService.LOCAL_STORAGE_JWT_KEY));
      headers.append('Accept', 'Accept: application/json+fhir');
		}
    let params = new URLSearchParams();
		return new RequestOptions({ headers: headers, withCredentials: true , params: params});
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
