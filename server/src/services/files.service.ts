import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import config from '../config';

const dynamoDB = new DynamoDBClient({
  region: config.awsRegion,
  credentials: {
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey,
  },
});

export const getFileInfo = async (key: string) => {
  const command = new GetItemCommand({
    TableName: 'file',
    Key: {
      fileKey: { S: key },
    },
  });

  const response = await dynamoDB.send(command);
  if (!response.Item) return null;

  return unmarshall(response.Item);
};
