export class Bundle<T> {
	public total: number | undefined;
	public entry: {fullUrl: string, resource: T}[] = [];// | undefined;
}
