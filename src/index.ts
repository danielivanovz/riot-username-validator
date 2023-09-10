import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import { fetchSummoner } from "./operations";
import { BASE_URLS } from "./config";
import { LambdaResponse } from "./types";

const handler = (event: { summonerName: string; game: keyof typeof BASE_URLS }): Promise<LambdaResponse> =>
  pipe(
    fetchSummoner(event.summonerName, BASE_URLS[event.game]),
    TE.fold(
      (error) => async () => ({
        statusCode: 400,
        body: JSON.stringify({ valid: false, reason: error.message }),
      }),
      (summoner) => async () => {
        const isVerified = !!summoner.id;
        return {
          statusCode: 200,
          body: JSON.stringify({ valid: isVerified, summoner: isVerified ? summoner : null }),
        };
      }
    )
  )();

const response = await handler({ summonerName: "Koalas", game: "LOL" });

console.log(response);

export default handler;
