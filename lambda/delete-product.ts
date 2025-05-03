import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log(`Event: ${JSON.stringify(event)}`);
  const { id } = JSON.parse(event.body || '{}');


  const params = {
    TableName: 'Products',
    Key: { id }
  };

  console.log(`Attempting to delete: ${JSON.stringify(params)}`);

  await client.send(new DeleteCommand( params ));

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Product deleted" })
  };
};

