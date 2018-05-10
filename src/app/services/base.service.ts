import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/throw';


import {QuickTermService} from './tastyterm.service';
import {AuthenticationService} from './authentication.service';

@Injectable()
export abstract class BaseService {

  constructor(protected quickTermService: QuickTermService,
              protected http: HttpClient,
              protected authenticationService: AuthenticationService) {
  }

  options() {
    // return this.quickTermService.requestOptions(false);
    return this.quickTermService.requestOptions(true);
  }
}
