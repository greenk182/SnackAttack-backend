import { DynamoDBClient, PutItemCommand  } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (event: any) => {
      const body = JSON.parse(event.body);

    const command = new PutItemCommand({
            TableName: process.env.TABLE_NAME!,
        Item: {
                  productId: { S: body.productId  },
                  name: { S: body.name  },
                  price: { N: body.price.toString()  },
                  category: { S: body.category  },
                  count: { N: body.count.toString()  },
        },
    });

      await client.send(command);

    return {
            statusCode: 200,
            body: JSON.stringify({ message: "Product saved"  }),
    };
};

