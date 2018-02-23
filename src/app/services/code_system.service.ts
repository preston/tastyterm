import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { BaseService } from "./base.service";

import { QuickTermService } from './quickterm.service';

import { Bundle } from "../models/bundle";
import { Parameters } from "../models/parameters";
import { CodeSystem } from "../models/code_system";
import { ValueSet } from "../models/value_set";

@Injectable()
export class CodeSystemService extends BaseService {

    public static PATH: string = '/CodeSystem';
    public static LOOKUP: string = '/$lookup';

    constructor(quickTermService: QuickTermService, http: Http) {
        super(quickTermService, http);
    }

    url(): string {
        return this.quickTermService.url + CodeSystemService.PATH;
    }

    bundle(): Observable<Bundle<CodeSystem>> {
        let obs = this.http.get(this.url(), this.options()).map(res => res.json());
        return obs;
    }

    // Gets details of a specific code.
    lookup(codeSystem: CodeSystem, code: string): Observable<Parameters> {
        let opts = this.options();
        opts.params.append('code', code);
        opts.params.append('system', codeSystem.url);
        opts.params.append('version', codeSystem.version);

        let obs = this.http.get(this.url() + CodeSystemService.LOOKUP, opts).map(res => new Parameters(res.json()));
        return obs;
    }

}
