import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: any) => {
  const result = await docClient.send(
    new GetCommand({ TableName: process.env.TABLE_NAME, Key: { id: event.id } })
  );
  return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
  };
};
