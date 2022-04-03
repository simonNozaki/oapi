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
              }
            },
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
            { StatusCode: '500' }
          ]
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
