import type { AWS } from '@serverless/typescript';

import responseSchema from '@functions/hello/schema/response';
import requestSchema from './src/functions/hello/schema/request';

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
    profile: '${opt:profile}',
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
            integration: "mock",
            request: {
              schema: {
                'application/json': requestSchema
              },
              template: {
                "application/json": "{ \"statusCode\": 503 }"
              },
            },
            response: {
              statusCodes: {
                "200": {
                  pattern: "200",
                  template: "{ \"status\": \"0\" }"
                },
                "500": {
                  pattern: "(4\\d{2})|(5\\d{2})",
                  template: "{ \"status\": \"9\" }"
                },
                "503": {
                  pattern: "(4\\d{2})|(5\\d{2})",
                  template: "{ \"status\": \"9\" }"
                }
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
          Schema: {
            $schema: "http://json-schema.org/draft-04/schema#",
            title: "HelloMaintenanceResponse",
            type: "object",
            properties: {
              status: {
                type: "string"
              }
            }
          }
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
                  Ref: 'ApiGatewayHelloPostErrorReponseModel'
                }
              }
            }
          ]
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
