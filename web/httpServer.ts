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
    method !== "GET" || // GETメソッドは対象外
    !existsSync(responseFile) || // ファイルが存在しない
    statSync(responseFile).isDirectory() // ディレクトリかどうか(ファイルではないことの確認)
  ) {
    const taskWebAppRequest = request(APP_SERVER.URL, {
      method,
      path: url,
      headers,
    });

    req.on("data", (data) => {
      taskWebAppRequest.write(data);
    });

    taskWebAppRequest.on("response", (taskWebAppResponse) => {
      Object.entries(taskWebAppResponse.headers).forEach(([key, value]) => {
        if (value) {
          res.setHeader(key, value);
        }
      });
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

    // リクエストのデータの受取が完了するとendイベントが発火する
    req.on("end", () => {
      // アプリケーション・サーバーへのリクエストを終了する
      taskWebAppRequest.end();
    });
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
