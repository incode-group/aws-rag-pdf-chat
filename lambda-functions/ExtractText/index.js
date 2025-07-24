import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import pdf from "pdf-parse";
import { Buffer } from "buffer";

const s3 = new S3Client();

export const handler = async (event) => {
  const { bucket, key } = event;

  const response = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const streamToBuffer = async (stream) =>
    Buffer.concat(await (async function* () {
      for await (const chunk of stream) yield chunk;
    })());

  const bodyBuffer = await streamToBuffer(response.Body);
  const text = await pdf(bodyBuffer);

  return { text: text.text, key, bucket };
};
