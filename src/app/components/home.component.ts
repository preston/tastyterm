import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormControl } from "@angular/forms";


// import { MatSlideToggleChange } from "@angular/material";



// Models
import { Parameters } from "../models/parameters";
import { Bundle } from "../models/bundle";
import { CodeSystem } from "../models/code_system";
import { Node } from "../models/node";
import { ValueSet } from "../models/value_set";
import { AuthEvent, AuthEventType } from "../models/auth_event";

import { ToastrService } from "ngx-toastr";

import { TastyTermService } from "../services/tastyterm.service";
import { CodeSystemService } from "../services/code_system.service";
import { ValueSetService } from "../services/value_set.service";
import { ConceptMapService } from "../services/concept_map.service";
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: "home",
  templateUrl: "../views/home.html",
  providers: []
})
export class HomeComponent implements OnInit {

  @ViewChild("codesearch") codesearch: FormControl | null = null;
  codeSearchInput: FormControl = new FormControl();
  // codeSearchString: string = "";
  searchResults: any[] = [];

  // The currently selected service, if any.
  codeSystem: CodeSystem | null = null;
  codeSystemBundle: Bundle<CodeSystem> | null = null;
  codeSystems: Array<CodeSystem> = [];
  valueSet: ValueSet | null = null;
  valueSetParameters: Parameters | null = null;
  // licenses: Array<License> = new Array<License>();
  // identityProviders: Array<IdentityProvider> = new Array<IdentityProvider>();
  //
  searchFilter: string = "";
  results: ValueSet | null = null;
  selectedTerm: string | null = null;
  resultLimit: number = HomeComponent.LIMITS[0];
  searching: boolean = false; // Used for visually indicating when a search is in progress.
  propertyTableHeader: string[] = ['code', 'value'];
  designationTableHeader: string[] = ['value', 'use', 'language'];
  graphType: string = '3D';
  public static LIMITS: Array<number> = [10, 50, 100];
  // status: Object;


  constructor(
    private authenticationService: AuthenticationService,
    private tastyTermService: TastyTermService,
    private codeSystemService: CodeSystemService,
    private valueSetService: ValueSetService,
    private conceptMapService: ConceptMapService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Inject("Window") private window: Window
  ) {
    // authenticationService.authEvents$.subscribe({
    //   next: (authEvent: AuthEvent) => this.handleAuthEvent(authEvent)
    // });
  }

  ngOnInit() {
    this.reloadCodeSystems();
    // this.processSmartLaunch().then((promiseResponse) => {
      // Subscribe to query parameters that let us link to specific terms
    //   this.activatedRoute.params.subscribe((params) => {
    //     if (params["termId"]) {
    //       this.selectAsValueSet(params["termId"]);
    //       this.selectedTerm = params["termId"];
    //     }
    //     if (params["graphType"]) {
    //       this.graphType = params["graphType"];
    //     }
    //   });
    // }).catch(((err) => {
    //   console.info('ngOnInit Error: ', console.log(err))
    // }));
    // this.searchFilter = 'right';
    // this.search();
  }

  ngAfterViewInit() {
    this.codeSearchInput.valueChanges
      // .distinctUntilChanged()
      // .filter(val => val)
      // .filter((val) => {
      //   if (val != '' && val.length > 2) {
      //     return true;
      //   } else {
      //     this.searchResults = null;
      //     return false;
      //   }
      // })
      // .debounceTime(300)
      .subscribe((searchString) => {
        if (this.codeSystem) {
          this.valueSetService
            .expand(this.codeSystem, searchString, this.resultLimit)
            .subscribe(d => {
              if (d?.expansion && d.expansion['contains']) {
                this.searchResults = d.expansion["contains"];
              }
            });
        }
      });
  }

  getLimits() {
    return HomeComponent.LIMITS;
  }

  // processSmartLaunch(): Promise<boolean> {
  //   return new Promise((resolve, reject) => {
  //     this.activatedRoute.queryParams.subscribe(params => {
  //       console.info("Checking for FHIR launch.");
  //       let code: string = params["code"];
  //       let state: string = params["state"];
  //       if (code && state) {
  //         // Set our code and state id in local storage for now
  //         // so we don't have to keep them in the url as we route
  //         // to other components
  //         localStorage.setItem(
  //           'code',
  //           code
  //         );
  //         localStorage.setItem(
  //           'stateId',
  //           state
  //         );
  //         // We should be receiving an authenticated launch!
  //         this.authenticationService.handleToken().subscribe((token) => {
  //           resolve(true);
  //         });

  //       } else {
  //         this.reloadCodeSystems().then((promiseResponse) => {
  //           resolve(true);
  //         }).catch((err) => {
  //           console.info("Loading codesystems failed...", err);
  //           reject(false)
  //         });
  //       }
  //     });
  //   });
  // }

  reloadCodeSystems() {
    // return new Promise((resolve, reject) => {
      this.codeSystemBundle = null;
      this.codeSystems = [];
      this.codeSystemService.bundle().subscribe(d => {
        this.codeSystemBundle = d;
        if (d.entry.length > 0) {
          this.codeSystems = d.entry.map(n => n.resource);// .entry.map(r => r["resource"]);
          console.log("CodeSystem entries: " + this.codeSystems.length);
          this.codeSystems.forEach(cs => {
            console.log(JSON.stringify(cs));
          })
          if (this.codeSystems.length > 0) {
            this.codeSystem = this.codeSystems[0];
            this.codeSystemChanged();
            this.toastrService.success(
              this.codeSystems.length + " code systems are available.",
              "Welcome!"
            );
            // resolve('Done');
          }
        } else {
          console.log("Server doesn't have any CodeSystem resources!");
          let errorMessage = 'It appears the server either doesn\'t support code system resources, or doesn\'t have any.';
          this.toastrService.warning(
            errorMessage, "We need to talk.."
          );
          this.codeSystems = [];
          // reject(errorMessage);
        }
      });
      this.search();
    // });
  }

  codeSystemChanged(): void {
    // this.codeSystem = codeSystem;
    this.valueSet = null;
    console.log("Selected: ");
    // console.log(JSON.stringify(this.codeSystem));
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
      if (this.codeSystem && vs.code) {
        this.codeSystemService
          .lookup(this.codeSystem, vs.code)
          .subscribe(params => {
            this.valueSetParameters = params; //new Parameters(params);
            // this.valueSetParameters.unpack();
            console.log("ValueSet Parameters:");
            console.log(this.valueSetParameters);
          });
      }
    }
  }

  update() {
    console.log(this.codeSystem);
  }

  nodeClicked(node: Node) {
    this.router.navigate(['/term/' + node.id, { graphType: this.graphType }]);
  }

  selectAsValueSet(incomingValue: string) {
    if(this.codeSystem) {
      this.valueSetService
      .expand(this.codeSystem, incomingValue, this.resultLimit)
      .subscribe(d => {
        let expansionResult = this.checkExpansion(d);
        expansionResult ? this.selectValueSet(expansionResult) : null;
        this.codeSearchInput.setValue(expansionResult.display);
      });
    }
  }

  resultSelected(event: Event) {
      event.target;
      //FIXME
      // this.router.navigate(['/term/' + selectEvent.option.value.code]);
  }

  // codeSearchInputDisplay(option): string {
  //   if (option) {
  //     return option.display ? option.display : option;
  //   }
  // }

  search() {
    if (this.validSearch()) {
      this.searching = true;
      this.valueSet = null;
      this.selectAsValueSet(this.searchFilter);
    } else {
      console.log("Invalid search ignored.");
      this.results = null;
      // this.loadInitialCodeSystems();
    }
  }

  checkExpansion(results: ValueSet) {
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

  handleAuthEvent(authEvent: AuthEvent) {
    switch (authEvent.type) {
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

  chartTypeToggled(event: Event) {
    if (this.graphType === '3D') {
      this.router.navigate(['/term/' + this.selectedTerm, { graphType: '2D' }]);
    } else {
      this.router.navigate(['/term/' + this.selectedTerm, { graphType: '3D' }]);
    }
  }

  logout() {
    // this.tastyTermService.logout().subscribe(d => {
    this.reloadCodeSystems();
    // 	console.log("Logout complete.");
    this.toastrService.success("See you next time!", "Logged out.");
    // });
  }
}
