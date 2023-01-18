import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { BaseService } from "./base.service";

import { TastyTermService } from './tastyterm.service';

import { Bundle } from "../models/bundle";
import { ConceptMap } from "../models/concept_map";
import { Parameters } from "../models/parameters";
import { CodeSystem } from "../models/code_system";
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class ConceptMapService extends BaseService {

	public static PATH: string = '/ConceptMap';
	public static TRANSLATE: string = '/$translate';

	constructor(tastyTermService: TastyTermService,
		http: HttpClient,
		protected override authenticationService: AuthenticationService) {
		super(tastyTermService, http, authenticationService);
	}

	url(): string {
		return this.tastyTermService.url + ConceptMapService.PATH;
	}

	bundle(): Observable<Bundle<ConceptMap>> {
		let obs = this.http.get<Bundle<ConceptMap>>(ConceptMapService.PATH, this.options());
			// .pipe(this.tokenPipe,
			// 	map(res => {
			// 		return <Bundle<ConceptMap>>res;
			// 	}));
		return obs;
	}

	translate(codeSystem: CodeSystem, code: string) {
		// TODO
		// 		code:444436002
		// system:http://snomed.info/sct
		// target:https://www.tga.gov.au/australian-register-therapeutic-goods?fhir_vs
		// url:http://snomed.info/sct?fhir_cm=11000168105
		// version:http://snomed.info/sct/32506021000036107/version/20180131
		let opts = this.options();
		opts.params = opts.params.append('code', code);
		opts.params = opts.params.append('system', codeSystem.url!);
		opts.params = opts.params.append('version', codeSystem.version!);
		opts.params = opts.params.append('source', codeSystem.valueSet!);

		let obs = this.http.get<Parameters>(this.url() + ConceptMapService.TRANSLATE, opts);
			// .pipe(this.tokenPipe,
			// 	map((res) => {
			// 		return <Parameters>res
			// 	}));
		return obs;
		// let conceptMaps = this.http.get(this.url(service), this.options()).map(res => res.json());
		// return conceptMaps;
	}

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
