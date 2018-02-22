import { Component, Output, Inject, OnInit } from '@angular/core';

import { Bundle } from '../models/bundle';
import { OperationOutcome } from '../models/operation_outcome';
import { CodeSystem } from '../models/code_system';
import { ConceptMap } from '../models/concept_map';
import { ValueSet } from '../models/value_set';
import { AuditEvent } from '../models/audit_event';

import { ToasterModule, ToasterService } from 'angular2-toaster/angular2-toaster';

import { SlideComponent, CarouselComponent, CarouselModule } from 'ngx-bootstrap';

import { CodeSystemService } from '../services/code_system.service';
import { ValueSetService } from '../services/value_set.service';
import { QuickTermService } from '../services/quickterm.service';

// import {XmlExporterCodeSystem} from '../codeSystems/xml_exporter.service';

import { Http, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { access } from 'fs';

@Component({
	selector: 'home',
	templateUrl: '/home.html',
	providers: [CarouselModule]

})
export class HomeComponent implements OnInit {

	// The currently selected service, if any.
	codeSystem: CodeSystem = null;
	codeSystemBundle: Bundle<CodeSystem> = null;
	codeSystems: Array<CodeSystem> = new Array<CodeSystem>();
	// licenses: Array<License> = new Array<License>();
	// identityProviders: Array<IdentityProvider> = new Array<IdentityProvider>();
	//
	searchFilter: string = '';
	results: ValueSet = null;
	resultLimit: number = HomeComponent.LIMITS[0];

	public static LIMITS: Array<number> = [10, 50, 100];
	// status: Object;

	constructor(private quickTermService: QuickTermService,
		private codeSystemService: CodeSystemService,
		private valueSetService: ValueSetService,
		private toasterService: ToasterService,
		private activatedRoute: ActivatedRoute,
		private http: Http,
		@Inject('Window') private window: Window) {
	}

	ngOnInit() {
		// Just a reasonable default. Overriden on SMART launch!
		this.quickTermService.url = "https://ontoserver.hspconsortium.org/fhir";
		this.processSmartLaunch();
		this.reload();
		// this.detectJwtLaunch();
	}
	getLimits() {
		return HomeComponent.LIMITS;
	}
	processSmartLaunch(): void {
		console.log("Checking for FHIR launch.");
		this.activatedRoute.queryParams.subscribe(params => {
			for (let p in params) {
				console.log(p);
			}
			console.log("Checking for FHIR launch.");
			let code: string = params['code'];
			let state: string = params['state'];
			if (code && state) {

				// load the app parameters stored in the session
				var tmp = JSON.parse(sessionStorage[state]);  // load app session
				var tokenUri = tmp.tokenUri;
				var clientId = tmp.clientId;
				var secret = tmp.secret;
				var serviceUri = tmp.serviceUri;
				var redirectUri = tmp.redirectUri;

				// Prep the token exchange call parameters
				var data = {
					code: code,
					grant_type: 'authorization_code',
					redirect_uri: redirectUri,
					client_id: clientId
				}
				let d = new FormData();
				// obtain authorization token from the authorization service using the authorization code
				// let opts = new RequestOptions();
				// let args = new RequestOp();
				// opts.params = new URLSearchParams();
				// opts.
				d.append('code', code);
				d.append('grant_type', 'authorization_code');
				d.append('redirect_uri', redirectUri);
				d.append('client_id', clientId);
				this.http.post(tokenUri, JSON.stringify(data)).map(resp => resp.json()).subscribe(resp => {
					// should get back the access token and the patient ID
					let accessToken = resp['access_token'];
					let patientId = resp['patient'];
					localStorage.setItem(QuickTermService.LOCAL_STORAGE_JWT_KEY, accessToken);

					// and now we can use these to construct standard FHIR
					// REST calls to obtain patient resources with the
					// SMART on FHIR-specific authorization header...
					// Let's, for example, grab the patient resource and
					// print the patient name on the screen
					var url = serviceUri + "/CodeSystem"; //  + patientId;
					this.http.get(url).subscribe(r2 => {
						console.log("FINALLY: " + r2)
					});
					// $.ajax({
					// 	url: url,
					// 	type: "GET",
					// 	dataType: "json",
					// 	headers: {
					// 		"Authorization": "Bearer " + accessToken
					// 	},
					// }).done(function (pt) {
					// 	var name = pt.name[0].given.join(" ") + " " + pt.name[0].family.join(" ");
					// 	document.body.innerHTML += "<h3>Patient: " + name + "</h3>";
					// });
				});

			}
		})
	}


	reload() {
		this.loadCodeSystems();
	}

	loadCodeSystems() {
		this.codeSystemBundle = null;
		this.codeSystems = null;
		this.codeSystemService.bundle().subscribe(d => {
			this.codeSystemBundle = d;
			this.codeSystems = d.entry.map(r => r['resource']);
			console.log("CodeSystem entries: " + this.codeSystems.length);
			if (this.codeSystems.length > 0) {
				this.selectCodeSystem(this.codeSystems[0]);
			}
		});
	}

	// loadInitialCodeSystems() {
	// 	this.serviceCodeSystem.published().subscribe(d => {
	// 		this.codeSystems = d['entry'];
	// 	});
	// }

	selectCodeSystem(codeSystem: CodeSystem): void {
		console.log(codeSystem);
		this.codeSystem = codeSystem;
		console.log("Selected: " + this.codeSystem);
	}

	update() {
		console.log(this.codeSystem);
	}
	search() {
		if (this.validSearch()) {
			this.valueSetService.expand(this.codeSystem, this.searchFilter, this.resultLimit).subscribe(d => {
				this.results = d
				console.log(d);
			});
		} else {
			console.log("Invalid search ignored.");
			// this.loadInitialCodeSystems();
		}
	}

	validSearch() {
		return this.searchFilter.length > 2;
	}

	// logout() {
	// 	localStorage.removeItem(QuickTermCodeSystem.LOCAL_STORAGE_JWT_KEY);
	// 	// this.quickTermService.logout().subscribe(d => {
	// 		this.loadCodeSystems();
	// 	// 	console.log("Logout complete.");
	// 		this.toasterCodeSystem.pop('success', 'Logged out.', 'See you next time!');
	// 	// });
	// }


}
