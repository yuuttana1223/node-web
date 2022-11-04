import { createServer } from "http";
import { existsSync, readFileSync } from "fs";

const SERVER = {
  HOST: "127.0.0.1",
  PORT: 3000,
} as const;

createServer((request, response) => {
  // httpを使っていないときはごちゃごちゃやって取り出していた
  const path = request.url;
  const responseFile = path?.endsWith("/") ? `.${path}index.html` : `.${path}`;

  if (!existsSync(responseFile)) {
    response.statusCode = 404;
    response.end();
    return;
  }

  const fileContent = readFileSync(responseFile);
  response.statusCode = 200;
  response.write(fileContent);
  response.end();
}).listen(SERVER.PORT, SERVER.HOST);
