import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

import { QuickTermService } from './tastyterm.service';

@Injectable()
export abstract class BaseService {

    constructor(protected quickTermService: QuickTermService, protected http: HttpClient) {
    }

    options() {
        // return this.quickTermService.requestOptions(false);
        return this.quickTermService.requestOptions(true);
    }

}
