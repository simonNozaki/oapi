/**
 * 実行環境
 */
export type Stage = "dev" | "production" | "maintenance";

/**
 * HTTP APIリクエストテンプレートクラス
 */
export class HttpApiRequest {
  private readonly _stage: Stage;
  constructor (stage: string) {
    if (stage === "dev" || stage === "production" || stage === "maintenance") {
      this._stage = stage;
    }
    throw new Error('環境変数が指定のものではありません');
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

