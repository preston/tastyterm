import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Headers, RequestOptions } from '@angular/http';

import { QuickTermService } from './tastyterm.service';

@Injectable()
export abstract class BaseService {

    constructor(protected quickTermService: QuickTermService, protected http: Http) {
    }

    options(): RequestOptions {
        // return this.quickTermService.requestOptions(false);
        return this.quickTermService.requestOptions(true);
    }

}
