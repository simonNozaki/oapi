/**
 * メンテナンスレスポンススキーマ
 */
export const helloMaintenanceReponseSchema = {
  $schema: "http://json-schema.org/draft-04/schema#",
  title: "HelloResponse",
  type: "object",
  properties: {
    from: { type: "string" },
    to: { type: "string" },
    message: { type: "string" },
  }
}

const baseDatetime = new Date();
const toDatetime = baseDatetime;
toDatetime.setHours(baseDatetime.getHours() + 3);

/**
 * メンテナンスレスポンス
 */
export const maintenanceResponse = {
  from: baseDatetime.toISOString(),
  to: toDatetime.toISOString(),
  message: `
  システムアップデートのためサービスを停止しています。
  お客様にはご不便をおかけしますが、メンテナンス終了まで今しばらくお待ちください。
  `,
}
