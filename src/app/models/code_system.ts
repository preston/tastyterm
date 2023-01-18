 import {FhirBase} from './fhir_base';

 export class CodeSystem extends FhirBase {
	public name: string | null = null;
	public description: string | null = null;
	public hierarchyMeaning: string | null = null;
	public compositional: string | null = null;
	public url: string | null = null;
	public version: string | null = null;
	public copyright: string | null = null;
	public publisher: string | null = null;
	public valueSet: string | null = null;
	public caseSensitive: boolean | undefined;
	public experimental: boolean | undefined;
	public versionNeeded: boolean | undefined;
	public status: string | null = null;
	public content: string | null = null;
}
