import { createServer, request } from "http";
import { existsSync, readFileSync, statSync } from "fs";

const WEB_SERVER = {
  HOST: "127.0.0.1",
  PORT: 3000,
} as const;

const APP_SERVER = {
  URL: "http://127.0.0.1:8080",
} as const;

createServer((req, res) => {
  // httpを使っていないときはごちゃごちゃやって取り出していた
  const { method, url, headers } = req;
  const responseFile = url?.endsWith("/") ? `.${url}index.html` : `.${url}`;

  if (
    method === "GET" ||
    !existsSync(responseFile) ||
    statSync(responseFile).isDirectory()
  ) {
    const taskWebAppRequest = request(APP_SERVER.URL, {
      method,
      path: url,
      headers,
    });

    taskWebAppRequest.on("response", (taskWebAppResponse) => {
      if (taskWebAppResponse.statusCode) {
        res.writeHead(taskWebAppResponse.statusCode);
      }
      taskWebAppResponse.on("data", (data) => {
        res.write(data);
      });
      taskWebAppResponse.on("end", () => {
        res.end();
      });
    });
    taskWebAppRequest.end();
    return;
  }

  const fileContent = readFileSync(responseFile);
  res.statusCode = 200;
  res.write(fileContent);
  res.end();
}).listen(WEB_SERVER.PORT, WEB_SERVER.HOST, () => {
  console.log(
    `Web server is running at http://${WEB_SERVER.HOST}:${WEB_SERVER.PORT}`
  );
});
