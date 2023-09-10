import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { SummonerResponse, FetchResponse, LambdaResponse } from "./types";
import { MissingApiKeyError, SummonerNotFoundError } from "./errors";

const RIOT_API_KEY = process.env.RIOT_API_KEY;

const hasApiKey = E.fromPredicate(
  (key: string | undefined): key is string => !!key,
  () => new MissingApiKeyError()
);

const constructUrl = (baseUrl: string, summonerName: string): string => `${baseUrl}${encodeURIComponent(summonerName)}`;

export const fetchSummoner = (summonerName: string, gameBaseUrl: string): TE.TaskEither<Error, SummonerResponse> =>
  pipe(
    RIOT_API_KEY,
    hasApiKey,
    TE.fromEither,
    TE.chain(() =>
      TE.tryCatch(
        () =>
          fetch(constructUrl(gameBaseUrl, summonerName), {
            headers: { "X-Riot-Token": RIOT_API_KEY! },
          }) as Promise<FetchResponse>,
        (reason) => new Error(String(reason))
      )
    ),
    TE.chain((response) =>
      TE.tryCatch(
        () => response.json(),
        (reason) => new Error(String(reason))
      )
    ),
    TE.chain((summoner) => (summoner.id ? TE.right(summoner) : TE.left(new SummonerNotFoundError())))
  );
