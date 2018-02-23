import { FhirBase } from './fhir_base';

export class Parameter extends FhirBase {
	// public resourceType: string = "Parameters";
	public name: string = null;

	constructor() {
		super();
		this.resourceType = "Parameter";
	}
}
