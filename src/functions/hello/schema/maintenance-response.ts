export default {
  $schema: "http://json-schema.org/draft-04/schema#",
  title: "HelloResponse",
  type: "object",
  properties: {
    from: { type: "string" },
    to: { type: "string" },
    message: { type: "string" },
  }
}