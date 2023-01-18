export enum AuthEventType {
  GENERIC = "GENERIC",
  LOGOUT = "LOGOUT",
  LOGIN = "LOGIN",
  TOKEN_ACQUIRED = "TOKEN_ACQUIRED",
  EXPIRED = "EXPIRED",
}

export class AuthEvent {
  public type: AuthEventType;
  public payload: any;

  constructor(public _type: AuthEventType,
    public _payload: any) {

    this.type = _type;
    this.payload = _payload;
  }
}
