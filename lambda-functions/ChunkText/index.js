exports.handler = async (event) => {
  const text = event.text;
  const chunkSize = 1000;

  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  return { chunks, key: event.key, bucket: event.bucket };
};
