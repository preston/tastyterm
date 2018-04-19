import { Component, Output, Inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import * as fs from 'fs';

import { environment } from '../../environments/environment';

// Models
import { Parameters } from "../models/parameters";
import { Bundle } from "../models/bundle";
import { OperationOutcome } from "../models/operation_outcome";
import { CodeSystem } from "../models/code_system";
import { ConceptMap } from "../models/concept_map";
import { ValueSet } from "../models/value_set";
import { AuditEvent } from "../models/audit_event";
import { AuthEvent, AuthEventType } from "../models/auth_event";

import {
  ToasterModule,
  ToasterService
} from "angular2-toaster/angular2-toaster";

import {
  SlideComponent,
  CarouselComponent,
  CarouselModule
} from "ngx-bootstrap";

import { QuickTermService } from "../services/tastyterm.service";
import { CodeSystemService } from "../services/code_system.service";
import { ValueSetService } from "../services/value_set.service";
import { ConceptMapService } from "../services/concept_map.service";
import { AuthenticationService } from '../services/authentication.service';

// import {XmlExporterCodeSystem} from '../codeSystems/xml_exporter.service';

import {
  Http,
  RequestOptions,
  RequestOptionsArgs,
  Headers
} from "@angular/http";


@Component({
  selector: "home",
  templateUrl: "../views/home.pug",
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
  searchFilter: string = "";
  results: ValueSet = null;
  resultLimit: number = HomeComponent.LIMITS[0];
  searching: boolean = false; // Used for visually indicating when a search is in progress.

  public static LIMITS: Array<number> = [10, 50, 100];
  // status: Object;
  public static FALLBACK_SERVER: string = "https://ontoserver.hspconsortium.org/fhir";


  constructor(
    private authenticationService: AuthenticationService,
    private quickTermService: QuickTermService,
    private codeSystemService: CodeSystemService,
    private valueSetService: ValueSetService,
    private conceptMapService: ConceptMapService,
    private toasterService: ToasterService,
    private activatedRoute: ActivatedRoute,
    private http: Http,
    @Inject("Window") private window: Window
  ) {
    authenticationService.authEvents$.subscribe({
      next: (authEvent:AuthEvent) => this.handleAuthEvent(authEvent)
    });
  }

  ngOnInit() {
    this.processSmartLaunch();
    // this.searchFilter = 'right';
    // this.search();

    // Showing how we can read environment specific config in the UI,
    // that is generated at build time by Angular CLI.
    console.log("OAUTH_CLIENT_ID", environment.TASTYTERM_OAUTH_CLIENT_ID);
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
      let code: string = params["code"];
      let state: string = params["state"];
      if (code && state) {
        // We should be receiving an authenticated launch!
        this.authenticationService.getToken(code, state);
      } else {
        // We're starting in standalone mode, and need a fallback server.
        // Just a reasonable default! This is overriden on SMART launch.
        this.quickTermService.url = HomeComponent.FALLBACK_SERVER;
        this.reloadCodeSystems();
      }
    });
  }

  reloadCodeSystems() {
    this.codeSystemBundle = null;
    this.codeSystems = null;
    this.codeSystemService.bundle().subscribe(d => {
      this.codeSystemBundle = d;
      if (d.total > 0) {
        this.codeSystems = d.entry.map(r => r["resource"]);
        console.log("CodeSystem entries: " + this.codeSystems.length);
        if (this.codeSystems.length > 0) {
          this.codeSystem = this.codeSystems[0];
          this.codeSystemChanged();
          this.toasterService.pop(
            "success",
            "Welcome!",
            this.codeSystems.length + " code systems are available."
          );
        }
      } else {
        console.log("Server doesn't have any CodeSystem resources!");
        this.toasterService.pop(
          "warning",
          "We need to talk..",
          "It appears the server either doesn't support code system resources, or doesn't have any."
        );
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
    return (
      p["value"] ||
      p["valueCode"] ||
      p["valueCoding"] ||
      p["valueString"] ||
      p["valueBoolean"]
    );
  }

  selectValueSet(vs: ValueSet) {
    if (this.valueSet == vs) {
      this.unselectValueSet();
    } else {
      this.valueSet = vs;
      console.log("ValueSet selected:");
      // this.valueSetService.get(this.codeSystem, vs.code).subscribe(vs => {
      this.codeSystemService
        .lookup(this.codeSystem, vs.code)
        .subscribe(params => {
          this.valueSetParameters = new Parameters(params);
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

  nodeClicked(node) {
    this.valueSetService
      .expand(this.codeSystem, node.id, this.resultLimit)
      .subscribe(d => {
        let expansionResult = this.checkExpansion(d);
        expansionResult ? this.selectValueSet(expansionResult) : null;
      });
  }
  search() {
    if (this.validSearch()) {
      this.searching = true;
      this.valueSet = null;
      this.valueSetService
        .expand(this.codeSystem, this.searchFilter, this.resultLimit)
        .subscribe(d => {
          let expansionResult = this.checkExpansion(d);
          expansionResult ? this.selectValueSet(expansionResult) : null;
        });
    } else {
      console.log("Invalid search ignored.");
      this.results = null;
      // this.loadInitialCodeSystems();
    }
  }

  checkExpansion(results){
    this.results = results;
    this.searching = false;
    console.log("Search results:");
    console.log(results);
    // TypeScript really needs safe navigation. :(
    if (
      this.results.expansion &&
      this.results.expansion["contains"] &&
      this.results.expansion["contains"].length > 0
    ) {
      // console.log("Setting default ValueSet selection to:");
      // console.log(this.valueSet);
      return this.results.expansion["contains"][0];
    } else {
      return false;
    }
  }

  validSearch() {
    return this.searchFilter.length > 2;
  }

  handleAuthEvent(authEvent: AuthEvent){
    switch(authEvent.type){
      case AuthEventType.LOGOUT:
        console.log("LOGOUT event fired.");
        this.logout();
        break;
      case AuthEventType.TOKEN_ACQUIRED:
        console.log("TOKEN_ACQUIRED event fired.");
        this.reloadCodeSystems();
        break;
    }
  }
  logout() {
    // this.quickTermService.logout().subscribe(d => {
    this.reloadCodeSystems();
    // 	console.log("Logout complete.");
    this.toasterService.pop("success", "Logged out.", "See you next time!");
    // });
  }
}
