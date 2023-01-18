import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map, zip, zipWith } from 'rxjs/operators';
// import { zip } from 'rxjs/observable/zip';
import { Observable } from 'rxjs';

import { BaseService } from "./base.service";
import { TastyTermService } from './tastyterm.service';

import { Bundle } from '../models/bundle';
import { CodeSystem } from '../models/code_system';
import { ValueSet } from '../models/value_set';
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class ValueSetService extends BaseService {

  public static PATH: string = '/ValueSet';
  public static EXPAND: string = '/$expand';
  public static LOOKUP: string = '/$lookup';

  constructor(tastyTermService: TastyTermService,
    http: HttpClient,
    protected override authenticationService: AuthenticationService) {
    super(tastyTermService, http, authenticationService);
  }

  url(): string {
    return this.tastyTermService.url + ValueSetService.PATH;
  }

  // Essentially a search function
  expand(codeSystem: CodeSystem, filter: string, limit: number): Observable<ValueSet> {
    let opts = this.options();
    opts.params = opts.params.append('identifier', codeSystem.valueSet!);
    opts.params = opts.params.append('filter', filter);
    opts.params = opts.params.append('count', limit.toString());
    return this.http.get<ValueSet>(this.url() + ValueSetService.EXPAND, opts);
    // .pipe(this.tokenPipe,
    //   map(res => {
    //     return <ValueSet>res;
    //   }));
  }

  // Given a term code, we want to query for all parents and children.
  getParentsAndChildren(codeSystem: CodeSystem, term: string, limit: number) {

    // Due to our merging of observables below with the zip() function,
    // we have to unfortunately define the whole body for each call
    // even though they are ALMOST identical
    // (Feel free to offer suggestions for shortening this section)
    let bodyParents = {
      resourceType: 'Parameters',
      parameter: [
        {
          name: 'valueSet',
          resource: {
            resourceType: 'ValueSet',
            compose: {
              include: [{
                system: codeSystem.url,
                valueSet: [],
                filter: [{
                  property:
                    'expression',
                  op: '=',
                  value: '>! ' + term
                }],
                version: codeSystem.version
              }]
            }
          }
        },
        { name: 'count', valueInteger: limit }
      ]
    };
    let bodyChildren = {
      resourceType: 'Parameters',
      parameter: [
        {
          name: 'valueSet',
          resource: {
            resourceType: 'ValueSet',
            compose: {
              include: [{
                system: codeSystem.url,
                valueSet: [],
                filter: [{
                  property:
                    'expression',
                  op: '=',
                  value: '<! ' + term
                }],
                version: codeSystem.version
              }]
            }
          }
        },
        { name: 'count', valueInteger: limit }
      ]
    };

    // This looks funny, but all we are really doing is merging two
    // observables into one final response. When using this method,
    // the caller simply treats it as any other single observable.
    // See an example usage in code_visualizer.component.ts.
    return this.http.post<ValueSet>(this.url() + ValueSetService.EXPAND, bodyChildren);
    //zip(
    // this.http.post<ValueSet>(this.url() + ValueSetService.EXPAND, bodyParents),
    // this.http.post<ValueSet>(this.url() + ValueSetService.EXPAND, bodyChildren)
    // );
  }

  get(codeSystem: CodeSystem, code: string): Observable<ValueSet> {
    let opts = this.options();
    opts.params = opts.params.append('code', code);
    opts.params = opts.params.append('system', codeSystem.url!);
    opts.params = opts.params.append('version', codeSystem.version!);
    return this.http.get<ValueSet>(this.url() + '/' + ValueSetService.LOOKUP, opts);
    // .pipe(this.tokenPipe,
    //   map(res => {
    //     return <ValueSet>res;
    //   }));
  }
  getValueSetByCode(codeSystem: CodeSystem, code: string): Observable<ValueSet> {
    let opts = this.options();
    opts.params = opts.params.append('code', code);
    opts.params = opts.params.append('system', codeSystem.url!);
    opts.params = opts.params.append('version', codeSystem.version!);
    return this.http.get<ValueSet>(this.url() + '/' + ValueSetService.EXPAND, opts);
    // .pipe(this.tokenPipe,
    //   map(res => {
    //     return <ValueSet>res;
    //   }));
  }
}
