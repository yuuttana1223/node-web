import { createServer } from "http";
import { StatusCodes } from "http-status-codes";

const SERVER = {
  HOST: "127.0.0.1",
  PORT: 8080,
} as const;

const tasks = [
  {
    title: "フロントエンドの実装",
    createdAt: new Date(),
  },
  {
    title: "サーバサイドの実装",
    createdAt: new Date(),
  },
];

const getTasksHTML = () => {
  const tasksHTML = tasks
    .map((task) => {
      return `
      <tr>
      <td>${task.title}</td>
      <td>${task.createdAt}</td>
    </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
  <html lang="ja">
  <head>
    <meta charset="utf-8" />
    <title>tasks</title>
  </head>
  <body>
    <h1>タスク一覧</h1>
    <table>
      <thead>
        <tr>
          <th>タイトル</th>
          <th>作成日時</th>
        </tr>
      </thead>
      <tbody>
        ${tasksHTML}
      </tbody>
    </table>
  </body>
</html>
    `;
};

createServer((request, response) => {
  // httpを使っていないときはごちゃごちゃやって取り出していた
  const path = request.url;
  if (path === "/tasks") {
    response.writeHead(StatusCodes.OK);
    const responseBody = getTasksHTML();
    response.write(responseBody);
    response.end();
    return;
  }

  response.writeHead(StatusCodes.NOT_FOUND);
  response.end();
}).listen(SERVER.PORT, SERVER.HOST, () => {
  console.log(
    `Application server running at http://${SERVER.HOST}:${SERVER.PORT}/`
  );
});
