import net from "net";

const SERVER = {
  HOST: "127.0.0.1",
  PORT: 3000,
} as const;

const helloResponse = `HTTP/1.1 200 OK
content-length: 152

<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>hello</title>
  </head>
  <body>
    <h1>hello</h1>
  </body>
</html>
`;

// 接続されたら何をするかを設定
net
  .createServer((socket) => {
    console.log("クライアントからの接続を確認しました! 🎉");
    // データを受け取ったら何をするかを設定
    socket.on("data", (data) => {
      // const httpRequest = data.toString();
      // const requestLine = httpRequest.split("\n")[0];
      console.log(`クライアントから「${data}」を受信しました`);
      socket.write(helloResponse);
      console.log(`クライアントに「${data}」を送り返します`);
    });
    socket.on("close", () => {
      console.log("クライアントから切断されました");
    });
  })
  .listen(SERVER.PORT, SERVER.HOST, () => {
    console.log("サーバーを起動しました");
    console.log(`Server: ${SERVER.HOST}:${SERVER.PORT}`);
  });
