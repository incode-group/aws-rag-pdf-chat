import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { Pinecone } from '@pinecone-database/pinecone';
import config from '../config';
import { GoogleGenAI } from '@google/genai';

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

const pc = new Pinecone({
  apiKey: config.pineconeApiKey,
});
const ai = new GoogleGenAI({
  apiKey: config.geminiApiKey,
});

export const getAIResponse = async (query: string, key: string) => {
  const indexName = 'some-index';
  const pineconeIndex = pc.index(indexName).namespace('ns1');

  const result = await pineconeIndex.fetch([key]);

  const config = {
    responseMimeType: 'text/plain',
  };
  const model = 'gemini-2.5-pro';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `
          You are a helpful assistant that can answer queries about the provided report.
          Here is the report: ${JSON.stringify(result)}.
          Here is the query: ${query}.
          `,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let responseText = '';
  for await (const chunk of response) {
    responseText += chunk.text;
  }

  return responseText;
};
