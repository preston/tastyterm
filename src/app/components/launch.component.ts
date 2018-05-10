import {
  Component,
  OnInit,
  ViewEncapsulation,
  ElementRef,
  Input,
  Output,
  SimpleChanges,
  EventEmitter,
  ViewChild
} from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { QuickTermService } from '../services/tastyterm.service';

import { environment } from '../../environments/environment';

@Component({
  selector: "",
  template: `<div #launchElement id="launchElement"> This is the launch component </div>`
})
export class LaunchComponent implements OnInit {
  clientId: string;
  secret: string = null;
  serviceUri: string;
  launchContextId: string;
  scope: string;
  state: string;
  launchUri: string;
  redirectUri: string;
  conformanceUri: string;
  constructor(private element: ElementRef,
              private quickTermService: QuickTermService,
              protected http: HttpClient) {
    this.clientId = environment.TASTYTERM_OAUTH_CLIENT_ID;
    this.serviceUri = this.getUrlParameter("iss");
    this.launchContextId = this.getUrlParameter("launch");
    this.scope = [
      "launch",
      "openid",
      "profile",
      "offline_access"
    ].join(" ");
    this.state = Math.round(Math.random() * 100000000).toString();
    this.launchUri = window.location.protocol + "//" + window.location.host + window.location.pathname;
    this.redirectUri = this.launchUri.replace("launch", "");
    this.conformanceUri = this.serviceUri + "/metadata";
  }

  ngOnChanges(changes: SimpleChanges) {

  }
  ngOnInit() {
    this.http.get(this.conformanceUri, this.quickTermService.requestOptions(false))
      .subscribe((response:any) => {
      console.log(response);
      let authUri, tokenUri = '';
      let smartExtension = response.rest[0].security.extension.filter(function (e) {
        return (e.url === "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris");
      });
      smartExtension[0].extension.forEach(function (arg, index, array) {
        if (arg.url === "authorize") {
          authUri = arg.valueUri;
        } else if (arg.url === "token") {
          tokenUri = arg.valueUri;
        }
      });
      // retain a couple parameters in the session for later use
      localStorage[this.state] = JSON.stringify({
        clientId: this.clientId,
        serviceUri: this.serviceUri,
        redirectUri: this.redirectUri,
        tokenUri: tokenUri
      });
      // finally, redirect the browser to the authorizatin server and pass the needed
      // parameters for the authorization request in the URL
      window.location.href = authUri + "?" +
        "response_type=code&" +
        "client_id=" + encodeURIComponent(this.clientId) + "&" +
        "scope=" + encodeURIComponent(this.scope) + "&" +
        "redirect_uri=" + encodeURIComponent(this.redirectUri) + "&" +
        "aud=" + encodeURIComponent(this.serviceUri) + "&" +
        "launch=" + this.launchContextId + "&" +
        "state=" + this.state;
    });
  }
  ngAfterViewInit(){

  }
  getUrlParameter(sParam) {
    let sPageURL = window.location.search.substring(1);
    let sURLVariables = sPageURL.split('&');
    for (let i = 0; i < sURLVariables.length; i++) {
      let sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) {
        let res = sParameterName[1].replace(/\\+/g, '%20');
        return decodeURIComponent(res);
      }
    }
  }
}
