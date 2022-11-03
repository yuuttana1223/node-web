import { Socket } from "net";

const SERVER = {
  HOST: "127.0.0.1",
  PORT: 3000,
} as const;

// 通信の出入り口を準備
const socket = new Socket();
// IPアドレスとポート番号を指定してサーバーに接続
socket.connect(SERVER.PORT, SERVER.HOST, () => {
  console.log(`Server: ${SERVER.HOST}:${SERVER.PORT}へ接続しました。`);
});

// 標準入力からデータを受け取ったら何をするかを設定
process.stdin.on("data", (data) => {
  console.log(`${data}の入力を確認しました。`);
  socket.write(data);
  console.log("サーバーに向けてメッセージを送信しました。");
});

// 通信の出入り口からデータを受け取ったら、何をするかを設定
socket.on("data", (data) => {
  console.log(`「${data}」をサーバーから受信しました。`);
});
