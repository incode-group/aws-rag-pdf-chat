export const handler = async (event) => {
  const { key } = event;

  const res = await fetch("https://mybackend.com/api/v1/update-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, status: "success" }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update status: ${res.status}`);
  }

  return { success: true, key };
};
