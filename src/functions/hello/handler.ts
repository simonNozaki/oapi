import 'source-map-support/register';

import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { when } from '@libs/when'

import schema from './schema/request';
import { APIGatewayProxyResult } from 'aws-lambda';

const operator = ["add",  "sub", "multiple", "divide"] as const

type Operator = typeof operator[number]

const isOperator = (arg: string): arg is Operator => {
  return operator.some((o) => arg === o)
}

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event): Promise<APIGatewayProxyResult> => {

  console.log(event);
  if (!event.body.operator || !isOperator(event.body.operator)) {
    return {
      statusCode: 400,
      body: JSON.stringify({})
    }
  }

  const result: number = when(event.body.operator)
    .on((o) => o === "add", () => event.body.value1 + event.body.value2)
    .on((o) => o === "sub", () => event.body.value1 - event.body.value2)
    .on((o) => o === "multiple", () => event.body.value1 * event.body.value2)
    .on((o) => o === "divide", () => event.body.value1 / event.body.value2)
    .otherwise(() => { throw new Error('') })
  
  return formatJSONResponse({
    computed: result
  })
}

export const main = middyfy(hello);
