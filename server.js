import http from "http";
// import { parse } from "path";
import url from "url";
import { TodoController } from "./controllers/todoController.js";
import { run } from "./TodosService.js";

const server = http.createServer();

const accesServer = {
  host: "localhost",
  port: 8080,
};

server.on("request", (request, response) => {
  const parsedUrl = url.parse(request.url, true);
  const idTodos = parsedUrl.query["id"] || "";

  if (parsedUrl.pathname !== "/todos") {
    response.end("This URL is invalid. Put /todos for a valid URL.");
  }

  if (parsedUrl.pathname === "/todos" && request.method === "GET") {
    if (idTodos) {
      TodoController.getTodo(idTodos, request, response);
    } else {
      TodoController.getTodos(request, response);
    }
  }

  if (parsedUrl.pathname === "/todos" && request.method === "POST") {
    TodoController.postTodo(request, response);
  }

  if (parsedUrl.pathname === "/todos" && request.method === "DELETE") {
    TodoController.deleteTodo(idTodos, request, response);
  }

  if (parsedUrl.pathname === "/todos" && request.method === "PATCH") {
    TodoController.patchTodo(idTodos, request, response);
  }
});

async function startServer() {
  await run();

  server.listen(accesServer.port, accesServer.host, () => {
    console.log(
      `Server is running on http://${accesServer.host}:${accesServer.port}`
    );
  });
}

startServer();
