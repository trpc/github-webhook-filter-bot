import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

export default async (req: VercelRequest, res: VercelResponse) => {
  const json = req.body;
  if (json == null || typeof json !== "object") {
    res.status(400).end();
    return;
  }

  const target = req.query.target as string;

  const login = json?.sender?.login || "";
  if (login.includes("[bot]") || login.endsWith("-bot")) {
    console.log("👻 skip: included [bot]");
    res.status(200).end();
    return;
  }

  try {
    console.log("OK: sending it to", target);
    const body = JSON.stringify(json);

    const headers: Record<string, string> = {
      "content-type": "application/json",
    };
    for (const [key, value] of Object.entries(req.headers)) {
      if (
        typeof value === "string" &&
        (key.includes("github") ||
          key.includes("user-agent") ||
          key.includes("authorization"))
      ) {
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
    res.status(502).end();
    return;
  } catch (err) {
    res.status(502).end();
    return;
  }
};
