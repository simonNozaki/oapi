import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";
import responseSchema from '@functions/hello/schema/response'

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export type HelloResponse = FromSchema<typeof responseSchema>

export const formatJSONResponse = (response: HelloResponse) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}
