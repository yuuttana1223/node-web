import { existsSync, readFileSync } from "fs";
import net from "net";

const SERVER = {
  HOST: "127.0.0.1",
  PORT: 3000,
} as const;

// 接続されたら何をするかを設定
net
  .createServer((socket) => {
    console.log("クライアントからの接続を確認しました! 🎉");
    // データを受け取ったら何をするかを設定
    socket.on("data", (data) => {
      const httpRequest = data.toString();
      const requestLine = httpRequest.split("\n")[0];
      console.log(requestLine);
      const path = requestLine.split(" ")[1];
      // ルートパスの場合はindex.htmlを返す
      const responseFile = path.endsWith("/")
        ? `.${path}index.html`
        : `.${path}`;

      if (!existsSync(responseFile)) {
        // 改行を入れないとブラウザが読み込めない
        const httpResponse = `HTTP/1.1 404 Not Found
Content-Length: 0

`;
        socket.write(httpResponse);
        return;
      }

      const fileContent = readFileSync(responseFile);
      const httpResponse = `HTTP/1.1 200 OK
Content-Length: ${fileContent.length}

${fileContent}`;
      socket.write(httpResponse);
    });
    socket.on("close", () => {
      console.log("クライアントから切断されました");
    });
  })
  .listen(SERVER.PORT, SERVER.HOST, () => {
    console.log("サーバーを起動しました");
    console.log(`Server: ${SERVER.HOST}:${SERVER.PORT}`);
  });
