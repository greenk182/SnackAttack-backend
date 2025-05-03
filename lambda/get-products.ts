import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyHandler } from 'aws-lambda';

const ddb = new DynamoDB({ region: 'us-east-1' });

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const params = {
      TableName: 'Products', // Ensure the table name is correct
    };

    const result = await ddb.scan(params);

    if (!result.Items || result.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No products found' }),
      };
    }

    // Convert DynamoDB result to a more usable format
    const products = result.Items.map(item => {
      return {
        id: item.id?.S ?? 'Unknown', // Default to 'Unknown' if id is undefined
        name: item.name?.S ?? 'Unnamed', // Default to 'Unnamed' if name is undefined
        price: item.price?.N ? parseFloat(item.price.N) : 0, // Default to 0 if price is undefined
        count: item.count?.N ? parseInt(item.count.N, 10) : 0, // Default to 0 if count is undefined
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
