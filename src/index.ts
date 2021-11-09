import { IncomingMessage, ServerResponse } from "http";
import { envsafe, url } from "envsafe";
import { URL } from "url";
import fetch from "node-fetch";
const env = envsafe({
  WEBHOOK_TARGET_URL: url(),
});

function getBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      resolve(body);
    });
  });
}

export default async (req: IncomingMessage, res: ServerResponse) => {
  const bodyStr = await getBody(req);
  let json: any;
  let url: URL;
  try {
    json = JSON.parse(bodyStr);
    url = new URL(req.url!);
  } catch (err) {
    res.statusCode = 400;
    res.end();
    return;
  }

  if (
    json?.issue?.user?.login?.includes("[bot]") ||
    json?.pull_request?.user?.login?.includes("[bot]")
  ) {
    res.statusCode = 204;
    res.end();
    return;
  }
  const target = url.searchParams.get("target")!;

  try {
    const result = await fetch(target, {
      headers: {
        ...(req.headers as any),
      },
      body: bodyStr,
      method: "POST",
    });

    if (result.ok) {
      res.statusCode = 201;
      res.end();
      return;
    }
    res.statusCode = 500;
    res.end();
    return;
  } catch (err) {
    res.statusCode = 500;
    res.end();
    return;
  }
};
