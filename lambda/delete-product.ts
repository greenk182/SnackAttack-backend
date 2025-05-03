import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters?.id;

  await client.send(new DeleteCommand({
    TableName: process.env.TABLE_NAME!,
    Key: { id }
  }));

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Product deleted" })
  };
};

