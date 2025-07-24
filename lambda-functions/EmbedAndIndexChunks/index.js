// embedAndIndexChunks.js
const { Pinecone } = require("@pinecone-database/pinecone");

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

exports.handler = async (event) => {
  const chunks = event.chunks;
  const namespace = "ns1";

  const index = pinecone.index(process.env.PINECONE_INDEX_NAME).namespace(namespace);

  // ensure index exists
  try {
    await pinecone.createIndexForModel({
      name: process.env.PINECONE_INDEX_NAME,
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

  // format and upsert chunks
  const records = chunks.map((chunk, i) => ({
    id: `${event.key}-chunk-${i}`,
    chunk_text: chunk,
  }));

  await index.upsertRecords(records);

  return { status: "indexed", key: event.key };
};
