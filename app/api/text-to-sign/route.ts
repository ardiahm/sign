export const runtime = "nodejs";
//

export async function POST(req: Request) {
  console.log("POST /api/text-to-sign route hit");
  const base = process.env.PY_API_URL?.trim();
  console.log("PY_API_URL:", base);
  if (!base) {
    console.log("PY_API_URL not set, returning 500");
    return new Response(JSON.stringify({ error: "PY_API_URL not set" }), {
      status: 500,
    });
  }

  let body: unknown = {};
  try {
    body = await req.json();
    console.log("Request body:", body);
  } catch (err) {
    console.log("Error parsing request body:", err);
  }

  const url = new URL("/text-to-gloss", base).toString();
  console.log("Constructed URL:", url);
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    console.log("Fetch response status:", r.status);
    const txt = await r.text();
    return new Response(txt, {
      status: r.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.log("Error during fetch:", err);
    return new Response(
      JSON.stringify({
        error: "Error contacting backend",
        details: String(err),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
