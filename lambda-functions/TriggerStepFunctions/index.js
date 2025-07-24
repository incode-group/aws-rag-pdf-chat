import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";

const sfn = new SFNClient();

export const handler = async (event) => {
  const record = event.Records[0];
  const bucket = record.s3.bucket.name;
  const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

  if (!key.endsWith(".pdf")) {
    console.log("Not a PDF file. Skipping.");
    return;
  }

  const input = JSON.stringify({ bucket, key });

  await sfn.send(new StartExecutionCommand({
    stateMachineArn: process.env.STEP_FUNCTION_ARN,
    input,
  }));

  console.log(`Step Function started for file: ${key}`);
};
