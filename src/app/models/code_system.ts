 import {FhirBase} from './fhir_base';

 export class CodeSystem extends FhirBase {
	public name: string;
	public url: string;
	public version: string;
	public copyright: string;
	public publisher: string;
	public valueSet: string;
	public caseSensitive: boolean;
	public experimental: boolean;
	public versionNeeded: false;
	public status: string;
	public content: string;
}
