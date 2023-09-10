export class MissingApiKeyError extends Error {
  constructor() {
    super("Missing API key");
  }
}

export class SummonerNotFoundError extends Error {
  constructor() {
    super("Summoner not found");
  }
}
