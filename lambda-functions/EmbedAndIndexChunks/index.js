import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

export const handler = async (event) => {
  const chunks = event.chunks;
  const namespace = "ns1";
  const indexName = process.env.PINECONE_INDEX_NAME;

  const index = pinecone.index(indexName).namespace(namespace);

  try {
    await pinecone.createIndexForModel({
      name: indexName,
      cloud: "aws",
      region: "us-east-1",
      embed: {
        model: "llama-text-embed-v2",
        fieldMap: { text: "chunk_text" },
      },
      waitUntilReady: true,
    });
  } catch (err) {
    if (err.name !== "PineconeConflictError") throw err;
  }

  const records = chunks.map((chunk, i) => ({
    id: `${event.key}-chunk-${i}`,
    chunk_text: chunk,
    file_key: event.key
  }));

  await index.upsertRecords(records);

  return { status: "indexed", key: event.key };
};
