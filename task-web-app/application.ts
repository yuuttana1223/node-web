import { createServer } from "http";
import { StatusCodes } from "http-status-codes";

const SERVER = {
  HOST: "127.0.0.1",
  PORT: 8080,
} as const;

type Task = {
  title: string;
  createdAt: Date;
};

const tasks: Task[] = [
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
  const { url, method } = request;
  if (method === "GET" && url === "/tasks") {
    response.writeHead(StatusCodes.OK);
    const responseBody = getTasksHTML();
    response.write(responseBody);
    response.end();
    return;
  }
  if (method === "POST" && url === "/tasks") {
    let requestBody = "";
    request.on("data", (data) => {
      requestBody += data;
    });
    request.on("end", () => {
      const [_titleKey, title] = requestBody.split("=");
      tasks.push({
        title,
        createdAt: new Date(),
      });

      // postでHTMLを返すのはおかしいのでリダイレクトする
      response.writeHead(StatusCodes.SEE_OTHER, {
        Location: "/tasks",
      });
      response.end();
    });
    return;
  }
  if (method === "GET" && url === "/api/tasks") {
    response.writeHead(StatusCodes.OK, {
      "Content-Type": "application/json",
    });
    const responseBody = JSON.stringify(tasks);
    response.write(responseBody);
    response.end();
    return;
  }

  if (method === "POST" && url === "/api/tasks") {
    let requestBody = "";
    request.on("data", (data) => {
      // stringに変換しないとBuffer型になってしまう
      // +=で無理やりstringにもできる 例 requestBody += data
      requestBody = data.toString();
    });

    request.on("end", () => {
      const { title }: Task = JSON.parse(requestBody);
      if (!title || title.length < 1 || title.length > 20) {
        response.writeHead(StatusCodes.BAD_REQUEST);
        response.end();
        return;
      }
      const newTask = {
        title,
        createdAt: new Date(),
      };
      tasks.push(newTask);
      response.writeHead(StatusCodes.CREATED, {
        "Content-Type": "application/json",
      });
      const responseBody = JSON.stringify(newTask);
      response.write(responseBody);
      response.end();
    });
    return;
  }

  if (method === "GET" && url === "/set-cookie-sample") {
    response.writeHead(StatusCodes.OK, {
      // response.setHeader("Set-Cookie", "name=alice");と同じ意味
      // nameではなく、session-idを入れることが多い
      // 今後リクエストヘッダーに毎回name=aliceを入れる必要がなくなる(勝手に送信される)
      "Set-Cookie": "name=alice",
    });
    response.write("set cookie");
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
