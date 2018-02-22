import {Injectable} from "@angular/core";
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

import {BaseService} from "./base.service";

import {QuickTermService} from './quickterm.service';

import {Bundle} from "../models/bundle";
import {ConceptMap} from "../models/concept_map";

@Injectable()
export class ConceptMapService extends BaseService {

    public static PATH: string = '/ConceptMap';

    constructor(quicktermService: QuickTermService, http: Http) {
        super(quicktermService, http);
    }

    // url(conceptMap: ConceptMap): string {
    //     return ConceptMapService.PATH + '/' + conceptMap.id;
    // }

    bundle(): Observable<Bundle<ConceptMap>> {
        let obs = this.http.get(ConceptMapService.PATH, this.options()).map(res => res.json());
        return obs;
    }
    // index(service: Service) {
    //     let conceptMaps = this.http.get(this.url(service), this.options()).map(res => res.json());
    //     return conceptMaps;
    // }

	// create(conceptMap: ConceptMap) {
  //       let obs = this.http.post(this.url(service), { 'conceptMap': conceptMap }, this.options()).map(res => res.json());
  //       return obs;
	// }
  //
	// update(conceptMap: ConceptMap) {
	// 	let obs = this.http.put(conceptMap.id, { 'conceptMap': conceptMap }, this.options()).map(res => res.json());
  //       return obs;
	// }
  //
	// delete(conceptMap: ConceptMap) {
	// 	let obs = this.http.delete(conceptMap.id, this.options()).map(res => res.json());
  //       return obs;
	// }
}
