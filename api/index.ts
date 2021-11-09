import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

// function getBody(req: IncomingMessage): Promise<string> {
//   return new Promise((resolve) => {
//     let body = "";
//     req.on("data", (chunk) => {
//       body += chunk;
//     });
//     req.on("end", () => {
//       resolve(body);
//     });
//   });
// }

export default async (req: VercelRequest, res: VercelResponse) => {
  const json = req.body;
  if (json == null || typeof json !== "object") {
    res.status(400).end();
    return;
  }

  const target = req.query.target as string;

  if (json?.sender?.login?.includes("[bot]")) {
    console.log("👻 skip: included [bot]");
    res.status(200).end();
    return;
  }

  try {
    console.log("OK: sending it to", target);
    const body = JSON.stringify(json);

    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      console.log("key", key, "value", value);
      if (typeof value === "string") {
        headers[key] = value;
      }
    }
    const result = await fetch(target, {
      headers,
      body,
      method: req.method,
    });

    if (result.ok) {
      console.log("✅ All good");
      res.status(201).end();
      return;
    }
    console.error("❌ Status", result.status);
    res.statusCode = 500;
    res.end();
    return;
  } catch (err) {
    res.statusCode = 500;
    res.end();
    return;
  }
};
