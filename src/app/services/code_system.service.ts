import {Injectable} from "@angular/core";
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

import {BaseService} from "./base.service";

import {QuickTermService} from './quickterm.service';

import {Bundle} from "../models/bundle";
import {CodeSystem} from "../models/code_system";

@Injectable()
export class CodeSystemService extends BaseService {

    public static PATH: string = '/CodeSystem';

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

}
