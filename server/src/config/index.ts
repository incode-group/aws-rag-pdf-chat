import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  awsRegion: string;
  awsBucketName: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  pineconeApiKey: string;
  geminiApiKey: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  awsRegion: process.env.AWS_REGION!,
  awsBucketName: process.env.AWS_BUCKET_NAME!,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  pineconeApiKey: process.env.PINECONE_API_KEY!,
  geminiApiKey: process.env.GEMINI_API_KEY!,
};

export default config;
