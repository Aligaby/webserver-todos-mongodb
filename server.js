import http from "http";
import url from "url";
import { TodoController } from "./controllers/todoController.js";

const server = http.createServer();

const accesServer = {
  host: "localhost",
  port: 8080,
};

server.on("request", (request, response) => {
  const parsedUrl = url.parse(request.url, true);
  const idTodos = parsedUrl.query["id"];

  try {
    if (parsedUrl.pathname === "/todos" && request.method === "GET") {
      if (idTodos === "") {
        throw new Error("Insert a value to ID");
      } else if (idTodos && !isNaN(+idTodos)) {
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
  } catch (err) {
    response.end(`Attention, you have an error => ${err.message}`);
  }
});

server.listen(accesServer.port, accesServer.host, () => {
  console.log(
    `Server is running on http://${accesServer.host}:${accesServer.port}`
  );
});
