import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { BaseService } from "./base.service";
import { QuickTermService } from './tastyterm.service';

import { Bundle } from '../models/Bundle';
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

    // get(id: string) {
    //     let platform = this.http.get(this.url() + '/' + id, this.options()).map(res => res.json());
    //     return platform;
    // }


  //   create(valueSet: ValueSet) {
  //       let obs = this.http.post(this.url(), { 'valueSet': valueSet }, this.options()).map(res => res.json());
  //       return obs;
  //   }
  //
	// update(valueSet: ValueSet) {
	// 	let obs = this.http.put(this.url() + '/' + valueSet.id, { 'valueSet': valueSet }, this.options()).map(res => res.json());
  //       return obs;
	// }
  //
	// delete(valueSet: ValueSet) {
	// 	let obs = this.http.delete(this.url() + '/' + valueSet.id, this.options()).map(res => res.json());
  //       return obs;
	// }
}
