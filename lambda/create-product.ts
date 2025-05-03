import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyHandler } from 'aws-lambda';

const ddb = new DynamoDB({ region: 'us-east-1' });

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { name, description, imageUrl, price, count } = JSON.parse(event.body || '{}');

    if (!name || !description || !imageUrl || !price || !count) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields: name, price, desc, imageUrl, or count' }),
      };
    }

    const params = {
      TableName: 'Products', // Ensure the table name is correct
      Item: {
        id: { S: `${Date.now()}` }, // Using timestamp as unique ID
        name: { S: name },
        description: { S: description },
        imageUrl: { S: imageUrl },
        price: { N: price.toString() },
        count: { N: count.toString() },
      },
    };

    await ddb.putItem(params);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Product created successfully' }),
    };
  } catch (error) {
    console.error('Error creating product:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
