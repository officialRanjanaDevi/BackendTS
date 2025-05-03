
export interface IJwt_payload {
  sub: string;
  claim: string;
  iss: string;
  aud: string;
  iat: number;
  exp: number;
}
