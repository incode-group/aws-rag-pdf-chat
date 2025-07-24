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

  const searchResults = await pineconeIndex.searchRecords({
    query: {
      topK: 5,
      inputs: { text: query },
      filter: {
        file_key: { $eq: fileKey },
      },
    },
    rerank: {
      model: 'bge-reranker-v2-m3',
      topN: 5,
      rankFields: ['chunk_text'],
    },
  });

  let reportText = '';
  const hits = searchResults.result.hits;

  if (hits && hits.length > 0) {
    const sortedMatches = hits.sort((a, b) => {
      const getChunkNum = (id: string) =>
        parseInt(id.split('-chunk-')[1] || '0');
      return getChunkNum(a._id) - getChunkNum(b._id);
    });

    reportText = sortedMatches
      .map((match) => (match.fields as { chunk_text: string }).chunk_text)
      .join(' ');
  } else {
    return `No relevant content found for the key: ${fileKey}. Please check the key and try again.`;
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
            Here is the content: ${reportText}
            Here is the user query: ${query}
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
