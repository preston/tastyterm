// Core
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Environment build settings.
import { environment } from '../../environments/environment';

// RxsJS imports
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

// Services
import {QuickTermService} from "./tastyterm.service";
import {Headers, RequestOptions} from "@angular/http";

// Models
import { AuthEvent, AuthEventType } from "../models/auth_event";
import {Observable} from "rxjs/Observable";

@Injectable()
export class AuthenticationService {
  // A special observable called a Subject that allows
  // us to broadcast events to many subscribers.
  // See more here: http://reactivex.io/rxjs/manual/overview.html#subject
  // We will use this single stream for all types of auth events.
  authEvents$ = new Subject();

  constructor(private quickTermService: QuickTermService,
              protected http: HttpClient) {
    this.authEvents$.subscribe({
      next: (v) => console.log('Auth event: ' + JSON.stringify(v))
    });
  }

  getToken (code, state) {
    // Load our OAuth parameters stored in the session.
    let tmp = JSON.parse(localStorage[state]);
    this.quickTermService.url = tmp.serviceUri;

    let tokenUri = tmp.tokenUri;
    let clientId = tmp.clientId;
    let secret = tmp.secret;
    let redirectUri = tmp.redirectUri;

    // Prep the token exchange call parameters
    let body =
      "grant_type=authorization_code" +
      "&code=" +
      code +
      "&redirect_uri=" +
      encodeURI(redirectUri) +
      "&client_id=" +
      clientId;
    let opts = {
      headers: new HttpHeaders().append(
        "Content-Type",
        "application/x-www-form-urlencoded"
      )
    };
    this.http
      .post(tokenUri, body, opts)
      .subscribe(resp => {
        // should get back the access token and the patient ID
        let accessToken = resp["access_token"];
        let patientId = resp["patient"];
        localStorage.setItem(
          QuickTermService.STORAGE_BEARER_TOKEN_KEY,
          accessToken
        );
        this.emitAuthEvent(AuthEventType.TOKEN_ACQUIRED,{
          token:QuickTermService.STORAGE_BEARER_TOKEN_KEY
        });
      });
  }

  private logout(){
    localStorage.removeItem(QuickTermService.STORAGE_BEARER_TOKEN_KEY);
    this.emitAuthEvent(AuthEventType.LOGOUT,{});
  };

  private emitAuthEvent(type, data){
    this.authEvents$.next(new AuthEvent(type,data));
  }
}
