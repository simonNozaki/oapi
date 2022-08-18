/**
 * 実行環境
 */
export type Stage = "dev" | "production" | "maintenance";

/**
 * API Gatewayの統合モード
 */
export type Integration = "lambda" | "mock";

/**
 * HTTP APIリクエストテンプレートクラス
 */
export class HttpApiRequest {
  private readonly _stage: Stage;
  constructor (stage: string) {
    if (stage === "production" || stage === "maintenance") {
      this._stage = stage;
    }
    this._stage = "dev";
  }

  getIntegration(): Integration {
    if (this._stage === "maintenance") {
      return "mock";
    }
    return "lambda";
  }

  getApiRequestTemplate(): { [k: string]: string } | null {
    if (this._stage === "maintenance") {
      return {
        "application/json": "{ \"statusCode\": 503 }"
      };
    }
    return null;
  }
}

