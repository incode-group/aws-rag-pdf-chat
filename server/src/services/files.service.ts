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

export const getAIResponse = async (query: string, fileKey: string) => {
  const indexName = 'some-index';
  const namespace = 'ns1';
  const pineconeIndex = pc.index(indexName).namespace(namespace);

  const dummyVector = Array(1024).fill(0);

  const queryResponse = await pineconeIndex.query({
    topK: 1000,
    filter: {
      file_key: { $eq: fileKey },
    },
    vector: dummyVector,
    includeMetadata: true,
  });

  let reportText = '';
  if (queryResponse.matches && queryResponse.matches.length > 0) {
    const sortedMatches = queryResponse.matches.sort((a, b) => {
      const getChunkNum = (id: string) =>
        parseInt(id.split('-chunk-')[1] || '0');
      return getChunkNum(a.id) - getChunkNum(b.id);
    });

    reportText = sortedMatches
      .map((match) => match.metadata?.chunk_text)
      .join(' ');
  } else {
    return `No report found for the key: ${fileKey}. Please check the key and try again.`;
  }

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
          Users attach PDFs. You are a helpful assistant that can answer queries about the provided PDF content.
          Here is the content: ${reportText}.
          Here is the user query: ${query}.
          `,
        },
      ],
    },
  ];

  const responseStream = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let responseText = '';
  for await (const chunk of responseStream) {
    responseText += chunk.text;
  }

  return responseText;
};
