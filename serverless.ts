import type { AWS } from '@serverless/typescript';

import responseSchema from '@functions/hello/schema/response';
import { maintenanceResponse, helloMaintenanceReponseSchema } from '@functions/hello/schema/maintenance-response';
import requestSchema from './src/functions/hello/schema/request';

// const httpApiRequest = new HttpApiRequest(process.env.STAGE);

const serverlessConfiguration: AWS = {
  service: 'oapi',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: [
    'serverless-webpack', 'serverless-offline'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    // profile: '${opt:profile}',
    region: 'ap-northeast-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
    logs: {
      restApi: {
        accessLogging: true,
        executionLogging: true,
        level: "INFO",
        fullExecutionData: true,
      }
    }
  },
  functions: {
    hello: {  
      handler: `src/functions/hello/handler.main`,
      events: [
        {
          http: {
            method: 'post',
            path: 'hello',
            request: {
              schema: {
                'application/json': requestSchema
              },
            },
            response: {
              statusCodes: {
                "200": {
                  pattern: "200",
                  template: "{ \"status\": \"0\" }"
                },
                "500": {
                  pattern: "500",
                  template: "{ \"status\": \"9\" }"
                },
                "503": {
                  pattern: "503",
                  template: JSON.stringify(maintenanceResponse),
                }
              }
            }
          }
        }
      ]
    },
    helloQuery: {
      handler: `src/functions/hello/handler.main`,
      events: [
        {
          http: {
            method: 'get',
            path: 'hello/get',
            request: {
              parameters: {
                querystrings: {
                  id: {
                    required: true,
                  }
                }
              }
            },
            response: {
              statusCodes: {
                "200": {}
              }
            }
          }
        }
      ]
    }
  },
  resources: {
    Resources: {
      ApiGatewayHelloPostReponseModel: {
        Type: 'AWS::ApiGateway::Model',
        Properties:{
          RestApiId: {
            Ref: 'ApiGatewayRestApi'
          },
          ContentType: "application/json",
          Name: "HelloReponse",
          Schema: responseSchema
        }
      },
      ApiGatewayHelloPostErrorReponseModel: {
        Type: 'AWS::ApiGateway::Model',
        Properties:{
          RestApiId: {
            Ref: 'ApiGatewayRestApi'
          },
          ContentType: "application/json",
          Name: "HelloErrorReponse",
          Schema: {
            $schema: "http://json-schema.org/draft-04/schema#",
            title: "HelloErrorResponse",
            type: "object",
            properties: {
              status: {
                type: "string"
              }
            }
          }
        }
      },
      ApiGatewayHelloPostMaintenanceReponseModel: {
        Type: 'AWS::ApiGateway::Model',
        Properties:{
          RestApiId: {
            Ref: 'ApiGatewayRestApi'
          },
          ContentType: "application/json",
          Schema: helloMaintenanceReponseSchema,
          Name: "HelloMaintenanceReponse"
        }
      }
    },
    extensions: {
      ApiGatewayMethodHelloPost: {
        Properties: {
          MethodResponses: [
            {
              StatusCode: '200',
              ResponseModels: {
                "application/json": {
                  Ref: 'ApiGatewayHelloPostReponseModel'
                }
              }
            },
            {
              StatusCode: '500',
              ResponseModels: {
                "application/json": {
                  Ref: 'ApiGatewayHelloPostErrorReponseModel'
                }
              }
            },
            {
              StatusCode: '503',
              ResponseModels: {
                "application/json": {
                  Ref: 'ApiGatewayHelloPostMaintenanceReponseModel'
                }
              }
            }
          ]
        }
      },
      ApiGatewayMethodHelloGetGet: {
        Properties: {
          MethodResponses: [
            {
              StatusCode: '200',
              ResponseModels: {
                "application/json": {
                  Ref: 'ApiGatewayHelloPostReponseModel'
                }
              }
            },
          ]
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
