import { FhirBase } from './fhir_base';
import { Parameter } from './parameter';

export class Parameters extends FhirBase {

	// Raw FHIR nastyness.
	// public parameter: Array<Parameter> = [];

	// Unpackaged stuff.
	public display: string | null = null;
	public version: string | null = null;
	public name: string | null = null;
	public designations: {use: {code: string, display: string, system: string}, language: string}[] = [];
	public properties: Array<Object> = [];

	constructor(protected parameters: Array<Parameter>) {
		super();
		this.resourceType = "Parameters";
		this.unpack(this.parameters);
	}

	public getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
		return o[propertyName]; // o[propertyName] is of type T[K]
	}

	// partToObject(part: Array<Object>): Object {
	// 	let d = {};
	// 	for (let p of part) {
	// 		if (p.hasOwnProperty('valueCode')) {
	// 			// let k: string keyof p = 'valueCode';
	// 			p['name' as keyof Object];
	// 			p['valueCode' as keyof Object];
	// 			this.getProperty(p, 'valueCoding');
	// 			p.name = this.getProperty(p, 'valueCoding');
	// 			Object.values[]
	// 			// d[p['name']] = p['valueCode'];
	// 			// p.set('name', p.getOwnPropertyDescriptors('valueCode'));
	// 		} else if (p.hasOwnProperty('valueCoding')) {
	// 			d[p['name']] = p['valueCoding'];
	// 		} else if (p.hasOwnProperty('valueString')) {
	// 			d[p['name']] = p['valueString'];
	// 		} else if (p.hasOwnProperty('valueBoolean')) {
	// 			d[p['name']] = p['valueBoolean'];
	// 		} else {
	// 			console.warn("Ignoring part value type for: " + d);
	// 		}
	// 		// if (typeof p['valueCode'] != 'undefined') {
	// 		// 	d[p['name']] = p['valueCode'];
	// 		// } else if (typeof p['valueCoding'] != 'undefined') {
	// 		// 	d[p['name']] = p['valueCoding'];
	// 		// } else if (typeof p['valueString'] != 'undefined') {
	// 		// 	d[p['name']] = p['valueString'];
	// 		// } else if (typeof p['valueBoolean'] != 'undefined') {
	// 		// 	d[p['name']] = p['valueBoolean'];
	// 		// } else {
	// 		// 	console.warn("Ignoring part value type for: " + d);
	// 		// }
	// 	}
	// 	return d;
	// }

	unpack(params: Array<Parameter>) {
		console.log("Unpacking...");
		// params.values
		for (let p of params) {
			switch (p.name) {
				case 'name':
					this.name = p['valueString' as keyof Parameter];
					break;
				case 'version':
					this.version = p['valueString' as keyof Parameter];
					break;
				case 'display':
					this.display = p['valueString' as keyof Parameter];
					break;
				// case 'designation':
				// 	let d = this.partToObject(p['part' as keyof Parameter]);
				// 	this.designations.push(d);
				// 	break;
				// case 'property':
				// 	let newProp = this.partToObject(p['part']);
				// 	this.properties.push(newProp);
				// 	break;
				default:
					console.warn('Not sure what to do with: ' + p.name);
					break;
			}
		}
	}
}
