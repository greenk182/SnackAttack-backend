import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as path from 'path';

export class StoreBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const table = new Table(this, 'ProductsTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billingMode: cdk.aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      tableName: 'Products',
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT for production
    });

    // Create Product Lambda
    const createProductFn = new NodejsFunction(this, 'CreateProductFunction', {
      entry: path.join(__dirname, '../lambda/create-product.ts'),
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
      environment: {
        TABLE_NAME: table.tableName,
      },
    });
    table.grantWriteData(createProductFn);

    // Get Products Lambda
    const getProductsFn = new NodejsFunction(this, 'GetProductsFunction', {
      entry: path.join(__dirname, '../lambda/get-products.ts'),
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
      environment: {
        TABLE_NAME: table.tableName,
      },
    });
    table.grantReadData(getProductsFn);

    // HTTP API
    const httpApi = new HttpApi(this, 'StoreApi', {
      apiName: 'store-api',
    });

    // Integrations
    const createProductIntegration = new HttpLambdaIntegration(
      'CreateProductIntegration',
      createProductFn
    );

    const getProductsIntegration = new HttpLambdaIntegration(
      'GetProductsIntegration',
      getProductsFn
    );

    // Routes
    httpApi.addRoutes({
      path: '/products',
      methods: [HttpMethod.POST],
      integration: createProductIntegration,
    });

    httpApi.addRoutes({
      path: '/products',
      methods: [HttpMethod.GET],
      integration: getProductsIntegration,
    });

    // Output API URL
    new cdk.CfnOutput(this, 'HttpApiUrl', {
      value: httpApi.url!,
    });
  }
}
