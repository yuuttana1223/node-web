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
      console.log(`クライアントから「${data}」を受信しました`);
      // 受け取ったデータをそのまま送り返す
      socket.write(data);
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
