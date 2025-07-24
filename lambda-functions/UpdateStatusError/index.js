import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

export const handler = async (event) => {
  const key = event.key;
  const errorInfo = event.error || "No error details provided";
  const tableName = process.env.DYNAMODB_TABLE_NAME;

  if (!key) {
    throw new Error("File key not found in the event payload.");
  }

  try {
    const updateCommand = new UpdateCommand({
      TableName: tableName,
      Key: {
        fileKey: key,
      },
      UpdateExpression: "set #status = :status, #error = :error, #updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#status": "status",
        "#error": "error",
        "#updatedAt": "updatedAt"
      },
      ExpressionAttributeValues: {
        ":status": "error",
        ":error": JSON.stringify(errorInfo),
        ":updatedAt": new Date().toISOString(),
      },
      ReturnValues: "ALL_NEW",
    });

    await ddbDocClient.send(updateCommand);
    console.log(`Successfully updated status to 'error' for file: ${key}`);
  } catch (error) {
    console.error("Error updating DynamoDB:", error);
    throw error;
  }

  return { error: true, key };
};