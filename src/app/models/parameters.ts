import { FhirBase } from './fhir_base';
import { Parameter } from './parameter';

export class Parameters extends FhirBase {

	// Raw FHIR nastyness.
	// public parameter: Array<Parameter> = [];

	// Unpackaged stuff.
	public display: string;
	public version: string;
	public name: string;
	public designations: Array<Object> = [];
	public properties: Array<Object> = [];

	constructor(protected parameters: Array<Parameter>) {
		super();
		this.resourceType = "Parameters";
		this.unpack(this.parameters);
	}
	partToObject(part: Array<Object>): Object {
		let d = {};
		for (let p of part) {
			if (typeof p['valueCode'] != 'undefined') {
				d[p['name']] = p['valueCode'];
			} else if (typeof p['valueCoding'] != 'undefined') {
				d[p['name']] = p['valueCoding'];
			} else if (typeof p['valueString'] != 'undefined') {
				d[p['name']] = p['valueString'];
			} else if (typeof p['valueBoolean'] != 'undefined') {
				d[p['name']] = p['valueBoolean'];
			} else {
				console.warn("Ignoring part value type for: " + d);
			}
		}
		return d;
	}
	unpack(params: Array<Parameter>) {
		console.log("Unpacking...");
		for (let p of params['parameter']) {
			switch (p.name) {
				case 'name':
					this.name = p['valueString'];
					break;
				case 'version':
					this.version = p['valueString'];
					break;
				case 'display':
					this.display = p['valueString'];
					break;
				case 'designation':
					let d = this.partToObject(p['part']);
					this.designations.push(d);
					break;
				case 'property':
					let newProp = this.partToObject(p['part']);
					this.properties.push(newProp);
					break;
				default:
					console.warn('Not sure what to do with: ' + p.name);
					break;
			}
		}
	}
}
