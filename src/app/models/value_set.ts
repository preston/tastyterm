export class ValueSet {

  public code: string | null = null;
  public experimental: boolean | null = null;
  public name: string | null = null;
  public status: string | null = null;
  public url: string | null = null;
  public version: string | null = null;
  public immutable: boolean | null = null;
  public purpose: string | null = null;
  public copyright: string | null = null;

  public expansion: {contains: any[]} = {contains: []};

}
