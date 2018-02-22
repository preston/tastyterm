import {Component} from '@angular/core';

@Component({
    selector: 'api',
    templateUrl: '/api.html'
})
export class ApiComponent {

    verses: Object[] = [];

    stringify(obj: any): string {
        return JSON.stringify(obj, null, "\t").trim();
    }

}
