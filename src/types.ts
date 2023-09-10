export interface SummonerResponse {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export interface FetchResponse {
  json(): Promise<SummonerResponse>;
}

type Stringified<T> = string & {
  [P in keyof T]: { "_ value": T[P] };
};

export interface LambdaResponse {
  statusCode: number;
  body: Stringified<Partial<SummonerResponse>>;
}
