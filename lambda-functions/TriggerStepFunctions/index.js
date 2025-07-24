import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const sfn = new SFNClient();
const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

export const handler = async (event) => {
  const record = event.Records[0];
  const bucket = record.s3.bucket.name;
  const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

  const tableName = process.env.DYNAMODB_TABLE_NAME;

  try {
    const putCommand = new PutCommand({
      TableName: tableName,
      Item: {
        fileKey: key,
        status: 'pending',
        timestamp: new Date().toISOString(),
      },
    });
    await ddbDocClient.send(putCommand);
    console.log(`Successfully saved initial status for file: ${key}`);
  } catch (error) {
    console.error("Error saving to DynamoDB:", error);
    throw error;
  }

  const input = JSON.stringify({ bucket, key });

  await sfn.send(new StartExecutionCommand({
    stateMachineArn: process.env.STEP_FUNCTION_ARN,
    input,
  }));

  console.log(`Step Function started for file: ${key}`);
};