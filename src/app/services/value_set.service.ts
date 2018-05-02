import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { zip } from 'rxjs/observable/zip';
import { Observable } from 'rxjs/Observable';

import { BaseService } from "./base.service";
import { QuickTermService } from './tastyterm.service';

import { Bundle } from '../models/bundle';
import { CodeSystem } from '../models/code_system';
import { ValueSet } from '../models/value_set';

@Injectable()
export class ValueSetService extends BaseService {

  public static PATH: string = '/ValueSet';
  public static EXPAND: string = '/$expand';
  public static LOOKUP: string = '/$lookup';

  constructor(quickTermService: QuickTermService, http: HttpClient) {
      super(quickTermService, http);
  }

  url(): string {
      return this.quickTermService.url + ValueSetService.PATH;
  }

  // Essentially a search function
  expand(codeSystem: CodeSystem, filter: string, limit: number): Observable<ValueSet> {
    let opts = this.options();
    opts.params = opts.params.append('identifier', codeSystem.valueSet);
    opts.params = opts.params.append('filter', filter);
    opts.params = opts.params.append('count', limit.toString());
    return this.http.get(this.url() + ValueSetService.EXPAND, opts).map((res) => {
      return <ValueSet> res;
    });
  }

  // Given a term code, we want to query for all parents and children.
  getParentsAndChildren(codeSystem: CodeSystem, term: string, limit: number): any {

    // Due to our merging of observables below with the zip() function,
    // we have to unfortunately define the whole body for each call
    // even though they are ALMOST identical
    // (Feel free to offer suggestions for shortening this section)
    let bodyParents = {
      resourceType:'Parameters',
      parameter:[
        {
          name:'valueSet',
          resource:{
            resourceType:'ValueSet',
            compose:{
              include:[{
                system: codeSystem.url,
                valueSet:[],
                filter:[{
                  property:
                    'expression',
                  op:'=',
                  value:'>! ' + term
                }],
                version: codeSystem.version
              }]
            }
          }
        },
        { name:'count', valueInteger: limit }
      ]
    };
    let bodyChildren = {
      resourceType:'Parameters',
      parameter:[
        {
          name:'valueSet',
          resource:{
            resourceType:'ValueSet',
            compose:{
              include:[{
                system: codeSystem.url,
                valueSet:[],
                filter:[{
                  property:
                    'expression',
                  op:'=',
                  value:'<! ' + term
                }],
                version: codeSystem.version
              }]
            }
          }
        },
        { name:'count', valueInteger: limit }
      ]
    };

    // This looks funny, but all we are really doing is merging two
    // observables into one final response. When using this method,
    // the caller simply treats it as any other single observable.
    // See an example usage in code_visualizer.component.ts.
    return zip(
      this.http.post(this.url() + ValueSetService.EXPAND, bodyParents),
      this.http.post(this.url() + ValueSetService.EXPAND, bodyChildren)
    );
  }

  get(codeSystem: CodeSystem, code: string): Observable<ValueSet> {
    let opts = this.options();
    opts.params = opts.params.append('code', code);
    opts.params = opts.params.append('system', codeSystem.url);
    opts.params = opts.params.append('version', codeSystem.version);
    return this.http.get(this.url() + '/' + ValueSetService.LOOKUP, opts).map((res) => {
      return <ValueSet> res;
    });
  }
  getValueSetByCode(codeSystem: CodeSystem, code: string): Observable<ValueSet> {
    let opts = this.options();
    opts.params = opts.params.append('code', code);
    opts.params = opts.params.append('system', codeSystem.url);
    opts.params = opts.params.append('version', codeSystem.version);
    return this.http.get(this.url() + '/' + ValueSetService.EXPAND, opts).map((res) => {
      return <ValueSet> res;
    });
  }
}
