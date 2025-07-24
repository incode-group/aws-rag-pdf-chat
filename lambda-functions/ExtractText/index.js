const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const pdf = require("pdf-parse");

exports.handler = async (event) => {
  const bucket = event.bucket;
  const key = event.key;

  const s3Object = await s3.getObject({ Bucket: bucket, Key: key }).promise();
  const text = await pdf(s3Object.Body);

  return { text: text.text, key, bucket };
};
