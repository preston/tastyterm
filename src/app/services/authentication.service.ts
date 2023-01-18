// Core
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';


// RxsJS imports
import { map } from 'rxjs/operators';
import { of, Observable, Subject } from "rxjs";

// Services
import { TastyTermService } from "./tastyterm.service";

// Models
import { AuthEvent, AuthEventType } from "../models/auth_event";
import { ToastrService } from "ngx-toastr";

interface Tokens {
	token: string;
	refreshToken: string;
}
interface RespTokens {
	access_token: string;
	refresh_token: string;
}

@Injectable()
export class AuthenticationService {
	// A special observable called a Subject that allows
	// us to broadcast events to many subscribers.
	// See more here: http://reactivex.io/rxjs/manual/overview.html#subject
	// We will use this single stream for all types of auth events.
	authEvents$ = new Subject();

	constructor(private tastyTermService: TastyTermService,
		protected http: HttpClient,
		private ToastrService: ToastrService) {
		this.authEvents$.subscribe({
			next: (v) => console.log('Auth event: ' + JSON.stringify(v))
		});
	}

	protected requestToken(type: string): Observable<Tokens> {
		// Get our code and state from local storage
		let code: string = localStorage["code"];
		let stateId: string = localStorage["stateId"];
		let state: string = localStorage[stateId];
		// Load our OAuth parameters stored in the session.
		let tmp = JSON.parse(state);
		let tokenUri = tmp.tokenUri;
		let clientId = tmp.clientId;
		let secret = tmp.secret;
		let redirectUri = tmp.redirectUri;
		// Prep the token exchange call parameters
		let body =
			"grant_type=" + type +
			"&code=" +
			code +
			"&redirect_uri=" +
			encodeURI(redirectUri) +
			"&client_id=" +
			clientId;
		body = body.concat(type === 'refresh_token' ? "&refresh_token="
			+ localStorage.getItem('refresh_token') : '');
		let opts = {
			headers: new HttpHeaders().append(
				"Content-Type",
				"application/x-www-form-urlencoded"
			)
		};
		// return this.http
		//   .post(tokenUri, body, opts).
		//   .map(resp => {
		//     return ({ token: resp["access_token"], refreshToken: resp["refresh_token"] });
		//   });

		let resp = this.http.post<RespTokens>(tokenUri, body, opts);
		let obs = resp.pipe<Tokens>(map<RespTokens, Tokens>(r => { return { token: r.access_token, refreshToken: r.refresh_token } }));
		return obs;
	}
	public handleToken(): Observable<any> {
		// Get our code and state from local storage
		let code: string = localStorage["code"];
		let stateId: string = localStorage["stateId"];
		let state: string = localStorage[stateId];
		let obs!: Observable<any>;
		// Set our Service URL based on the state we get form storage.
		// If we do not have a valid state, redirect back to the launch component,
		// to re initiate the auth process.
		if (state) {
			this.tastyTermService.url = JSON.parse(state).serviceUri;
			// Let's find out if we still have a valid access token...
			let localStorageToken = this.checkForToken();
			if (!localStorageToken) {
				this.requestToken('authorization_code').subscribe((tokens) => {
					this.setToken(tokens);
					obs = of(tokens.token);
				});
			} else {
				let eventData = { [TastyTermService['STORAGE_BEARER_TOKEN_KEY']]: localStorageToken };
				this.emitAuthEvent(AuthEventType.TOKEN_ACQUIRED, eventData);
				obs = of(localStorageToken);
			}
		} else {
			this.ToastrService.warning(
				'We could not authenticate this session. Please relaunch the app in SMART-on-FHIR mode.',
				'Authentication Error'
			);
			obs = of('We could not authenticate this session. Please relaunch the app in SMART-on-FHIR mode.');
		}
		return obs;
	}

	setToken(tokens: Tokens) {
		localStorage.setItem(
			TastyTermService.STORAGE_BEARER_TOKEN_KEY,
			tokens.token
		);
		localStorage.setItem(
			'refresh_token',
			tokens.refreshToken
		);
		let eventData = { [TastyTermService['STORAGE_BEARER_TOKEN_KEY']]: tokens.token };
		this.emitAuthEvent(AuthEventType.TOKEN_ACQUIRED, eventData);
	}

	renewToken() {
		// return this.requestToken('refresh_token').map((tokens) => {
		//   this.setToken(tokens)
		//   return tokens.token;
		// });
		let rt = this.requestToken('refresh_token');
		return rt.pipe(map(tokens => {
			this.setToken(tokens)
			return tokens.token;
		}));
	}

	checkForToken() {
		return localStorage.getItem(TastyTermService.STORAGE_BEARER_TOKEN_KEY)
			? localStorage.getItem(TastyTermService.STORAGE_BEARER_TOKEN_KEY)
			: false;
	}
	private logout() {
		localStorage.removeItem(TastyTermService.STORAGE_BEARER_TOKEN_KEY);
		this.emitAuthEvent(AuthEventType.LOGOUT, {});
	};

	private emitAuthEvent(type: AuthEventType, data: { [x: string]: string; }) {
		this.authEvents$.next(new AuthEvent(type, data));
	}
}

