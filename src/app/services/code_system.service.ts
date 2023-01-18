import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from "./base.service";

import { TastyTermService } from './tastyterm.service';

import { Bundle } from "../models/bundle";
import { Parameter } from "../models/parameter";
import { Parameters } from "../models/parameters";
import { AuthenticationService } from "./authentication.service";
import { CodeSystem } from "../models/code_system";

@Injectable()
export class CodeSystemService extends BaseService {

  public static PATH: string = '/CodeSystem';
  public static LOOKUP: string = '/$lookup';

  constructor(tastyTermService: TastyTermService,
    http: HttpClient,
    authenticationService: AuthenticationService) {
    super(tastyTermService, http, authenticationService);
  }

  url(): string {
    return this.tastyTermService.url + CodeSystemService.PATH;
  }

  bundle(): Observable<Bundle<CodeSystem>> {
    return this.http.get<Bundle<CodeSystem>>(this.url(), this.options());
    // return get
    //   .pipe(this.tokenPipe,
    //     map((res: Bundle<CodeSystem>) => {
    //       return <Bundle<CodeSystem>>res;
    //     }));
  }

  // Gets details of a specific code.
  lookup(codeSystem: CodeSystem, code: string): Observable<Parameters> {
    let opts = this.options();
    opts.params = opts.params.append('code', code);
    opts.params = opts.params.append('system', codeSystem.url!);
    opts.params = opts.params.append('version', codeSystem.version!);

    let obs = this.http.get<Parameters>(this.url() + CodeSystemService.LOOKUP, opts);
      // .pipe(this.tokenPipe,
      //   map((res: Parameter[]) => {
      //     return <Parameter[]>res;
      //   }));
    return obs;
  }

}
