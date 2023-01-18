import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { TastyTermService } from './tastyterm.service';
import { AuthenticationService } from './authentication.service';
// import { Observable } from "rxjs/Observable";
import { retryWhen, map } from "rxjs/operators";
// import { MonoTypeOperatorFunction } from "rxjs/interfaces";
import { from, of, Observable, MonoTypeOperatorFunction } from "rxjs";

@Injectable()
export abstract class BaseService {

	// tokenPipe: MonoTypeOperatorFunction<any>;

	constructor(protected tastyTermService: TastyTermService,
		protected http: HttpClient,
		protected authenticationService: AuthenticationService) {
		// this.tokenPipe = retryWhen(
		// 	//TODO: convert this .map operator to a .let See https://blog.angularindepth.com/rxjs-understanding-lettable-operators-fe74dda186d3?token=R-nlgPq_xAUL-D5q#ece0
		// 	map((res) => {
		// 		return this.authenticationService.renewToken().subscribe((token) => {
		// 			if (token) {
		// 				return of(token);
		// 			} else {
		// 				console.error('No retry');
		// 				// return Observable.throw({ error: 'No retry' });
		// 			}
		// 		}, (error: any) => {
		// 				console.error('Error: ' + error.toString());
		// 				// return Observable.throw({ error: error });
		// 			})
		// 	})
		// );
	}

	options() {
		// return this.tastyTermService.requestOptions(false);
		return this.tastyTermService.requestOptions(true);
	}

}
