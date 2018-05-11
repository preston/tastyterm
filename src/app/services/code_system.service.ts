import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { BaseService } from "./base.service";

import { QuickTermService } from './tastyterm.service';

import { Bundle } from "../models/bundle";
import { Parameter } from "../models/parameter";
import { CodeSystem } from "../models/code_system";
import { ValueSet } from "../models/value_set";
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/retryWhen';
import {catchError} from "rxjs/operators";
import {AuthenticationService} from "./authentication.service";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/take";
import "rxjs/add/operator/concat";
import "rxjs/add/operator/zip";
import "rxjs/add/observable/range";

@Injectable()
export class CodeSystemService extends BaseService {

  public static PATH: string = '/CodeSystem';
  public static LOOKUP: string = '/$lookup';

  constructor(quickTermService: QuickTermService,
              http: HttpClient,
              authenticationService: AuthenticationService) {
    super(quickTermService, http, authenticationService);
  }

  url(): string {
    return this.quickTermService.url + CodeSystemService.PATH;
  }

  bundle(): Observable<Bundle<CodeSystem>> {
    return this.http.get(this.url(), this.options())
      .pipe(this.tokenPipe)
      .map((res) => {
        return <Bundle<CodeSystem>> res;
      });
  }

  // Gets details of a specific code.
  lookup(codeSystem: CodeSystem, code: string): Observable<Parameter[]> {
    let opts = this.options();
    opts.params = opts.params.append('code', code);
    opts.params = opts.params.append('system', codeSystem.url);
    opts.params = opts.params.append('version', codeSystem.version);

    let obs = this.http.get(this.url() + CodeSystemService.LOOKUP, opts)
      .pipe(this.tokenPipe)
      .map((res) => {
        return <Parameter[]> res;
      });
    return obs;
  }

}
