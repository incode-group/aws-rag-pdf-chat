import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import pdf from "pdf-parse/lib/pdf-parse.js";
import { Buffer } from "buffer";

const s3 = new S3Client();

export const handler = async (event) => {
  const { bucket, key } = event;

  const response = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));

  const streamToBuffer = async (stream) => {
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  };

  const bodyBuffer = await streamToBuffer(response.Body);
  const text = await pdf(bodyBuffer);

  return { text: text.text, key, bucket };
};
