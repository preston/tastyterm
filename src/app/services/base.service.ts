import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/throw';


import {QuickTermService} from './tastyterm.service';
import {AuthenticationService} from './authentication.service';
import {Observable} from "rxjs/Observable";
import {retryWhen} from "rxjs/operators";
import {MonoTypeOperatorFunction} from "rxjs/interfaces";

@Injectable()
export abstract class BaseService {
  tokenPipe: MonoTypeOperatorFunction<any>;
  constructor(protected quickTermService: QuickTermService,
              protected http: HttpClient,
              protected authenticationService: AuthenticationService) {
    this.tokenPipe = retryWhen(
      attempts =>
        attempts
        //TODO: convert this .map operator to a .let See https://blog.angularindepth.com/rxjs-understanding-lettable-operators-fe74dda186d3?token=R-nlgPq_xAUL-D5q#ece0
          .map((res) => {
            return this.authenticationService.renewToken().subscribe((token)=>{
                if(token){
                  return Observable.of(token);
                } else {
                  return Observable.throw({error: 'No retry'});
                }
              },
              (error) => {
                return Observable.throw({error: error});
              })
          })
          .take(1)
    );
  }



  options() {
    // return this.quickTermService.requestOptions(false);
    return this.quickTermService.requestOptions(true);
  }
}
