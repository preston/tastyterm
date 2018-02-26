import { Component, Output, Inject, OnInit } from '@angular/core';

import { Bundle } from '../models/bundle';
import { OperationOutcome } from '../models/operation_outcome';
import { CodeSystem } from '../models/code_system';
import { ConceptMap } from '../models/concept_map';
import { ValueSet } from '../models/value_set';
import { AuditEvent } from '../models/audit_event';

import { ToasterModule, ToasterService } from 'angular2-toaster/angular2-toaster';

import { SlideComponent, CarouselComponent, CarouselModule } from 'ngx-bootstrap';


import { QuickTermService } from '../services/tastyterm.service';
import { CodeSystemService } from '../services/code_system.service';
import { ValueSetService } from '../services/value_set.service';
import { ConceptMapService } from '../services/concept_map.service';

// import {XmlExporterCodeSystem} from '../codeSystems/xml_exporter.service';

import { Http, RequestOptions, RequestOptionsArgs, Headers } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { access } from 'fs';
import { Parameters } from '../models/parameters';

@Component({
	selector: 'home',
	templateUrl: '/home.html',
	providers: [CarouselModule]

})
export class HomeComponent implements OnInit {

	// The currently selected service, if any.
	codeSystem: CodeSystem;
	codeSystemBundle: Bundle<CodeSystem>;
	codeSystems: Array<CodeSystem> = new Array<CodeSystem>();
	valueSet: ValueSet;
	valueSetParameters: Parameters;
	// licenses: Array<License> = new Array<License>();
	// identityProviders: Array<IdentityProvider> = new Array<IdentityProvider>();
	//
	searchFilter: string = '';
	results: ValueSet = null;
	resultLimit: number = HomeComponent.LIMITS[0];
	searching: boolean = false;

	public static LIMITS: Array<number> = [10, 50, 100];
	// status: Object;
	public static FALLBACK_SERVER: string = "https://ontoserver.hspconsortium.org/fhir";

	constructor(private quickTermService: QuickTermService,
		private codeSystemService: CodeSystemService,
		private valueSetService: ValueSetService,
		private conceptMapService: ConceptMapService,
		private toasterService: ToasterService,
		private activatedRoute: ActivatedRoute,
		private http: Http,
		@Inject('Window') private window: Window) {
	}

	ngOnInit() {
		this.processSmartLaunch();
	}

	getLimits() {
		return HomeComponent.LIMITS;
	}

	processSmartLaunch(): void {
		console.log("Checking for FHIR launch.");
		this.activatedRoute.queryParams.subscribe(params => {
			// for (let p in params) {
			// 	console.log(p);
			// }
			console.log("Checking for FHIR launch.");
			let code: string = params['code'];
			let state: string = params['state'];
			if (code && state) {
				// We should be receiving an authenticated launch!
				// Load our OAuth parameters stored in the session.
				let tmp = JSON.parse(localStorage[state]);
				this.quickTermService.url = tmp.serviceUri;

				let tokenUri = tmp.tokenUri;
				let clientId = tmp.clientId;
				let secret = tmp.secret;
				let redirectUri = tmp.redirectUri;

				// Prep the token exchange call parameters
				let body = 'grant_type=authorization_code'
					+ '&code=' + code
					+ '&redirect_uri=' + encodeURI(redirectUri)
					+ '&client_id=' + clientId;
				let opts = new RequestOptions();
				opts.headers = new Headers();
				opts.headers.append('Content-Type', 'application/x-www-form-urlencoded');
				this.http.post(tokenUri, body, opts).map(resp => resp.json()).subscribe(resp => {
					// should get back the access token and the patient ID
					let accessToken = resp['access_token'];
					let patientId = resp['patient'];
					localStorage.setItem(QuickTermService.STORAGE_BEARER_TOKEN_KEY, accessToken);
					this.reloadCodeSystems();
				});
			} else {
				// We're starting in standalone mode, and need a fallback server.
				// Just a reasonable default! This is overriden on SMART launch.
				this.quickTermService.url = HomeComponent.FALLBACK_SERVER;
				this.reloadCodeSystems();
			}
		})
	}


	reloadCodeSystems() {
		this.codeSystemBundle = null;
		this.codeSystems = null;
		this.codeSystemService.bundle().subscribe(d => {
			this.codeSystemBundle = d;
			if (d.total > 0) {
				this.codeSystems = d.entry.map(r => r['resource']);
				console.log("CodeSystem entries: " + this.codeSystems.length);
				if (this.codeSystems.length > 0) {
					this.codeSystem = this.codeSystems[0];
					this.codeSystemChanged();
					this.toasterService.pop('success', 'Welcome!', this.codeSystems.length + ' code systems are available.');
				}
			} else {
				console.log("Server doesn't have any CodeSystem resources!");
				this.toasterService.pop('warning', 'We need to talk..', "It appears the server either doesn't support code system resources, or doesn't have any.");
				this.codeSystems = [];
			}
		});
		this.search();
	}

	codeSystemChanged(): void {
		// this.codeSystem = codeSystem;
		this.valueSet = null;
		console.log("Selected: " + this.codeSystem.name);
		console.log(this.codeSystem);
		this.search();
	}

	unselectValueSet() {
		this.valueSet = null;
		this.valueSetParameters = null;
		console.log("Unselected ValueSet.");
	}
	partValue(p: any) {
		return p['value'] || p['valueCode'] || p['valueCoding'] || p['valueString'] || p['valueBoolean'];
	}

	selectValueSet(vs: ValueSet) {
		if (this.valueSet == vs) {
			this.unselectValueSet();
		} else {
			this.valueSet = vs;
			console.log("ValueSet selected:");
			// this.valueSetService.get(this.codeSystem, vs.code).subscribe(vs => {
			this.codeSystemService.lookup(this.codeSystem, vs.code).subscribe(params => {
				this.valueSetParameters = params;
				// this.valueSetParameters.unpack();
				console.log("ValueSet Parameters:");
				console.log(this.valueSetParameters);
			});

			// TODO Figure out what to do with required "target" parameter.
			// this.conceptMapService.translate(this.codeSystem, vs.code).subscribe(vs => {
			// 	this.valueSet = vs;
			// 	console.log("ValueSet selected:");
			// 	console.log(this.valueSet);
			// });
		}
	}

	update() {
		console.log(this.codeSystem);
	}

	search() {
		if (this.validSearch()) {
			this.searching = true;
			this.valueSet = null;
			this.valueSetService.expand(this.codeSystem, this.searchFilter, this.resultLimit).subscribe(d => {
				this.results = d;
				this.searching = false;
				console.log(d);
			});
		} else {
			console.log("Invalid search ignored.");
			this.results = null;
			// this.loadInitialCodeSystems();
		}
	}

	validSearch() {
		return this.searchFilter.length > 2;
	}

	logout() {
		localStorage.removeItem(QuickTermService.STORAGE_BEARER_TOKEN_KEY);
		// this.quickTermService.logout().subscribe(d => {
		this.reloadCodeSystems();
		// 	console.log("Logout complete.");
		this.toasterService.pop('success', 'Logged out.', 'See you next time!');
		// });
	}


}
