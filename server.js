import http from "http";
import url from "url";
// import { accessDb } from "./dbConnect";
import { getTodos } from "./components/getTodos";

const server = http.createServer();

const myData = [
  {
    id: 0,
    title: "Title 0",
    description: "Description 0",
    dueDate: "unknown",
    isComplete: false,
  },
];

const accesServer = {
  host: "localhost",
  port: 8080,
};

function indexOfObjectInMyData(id) {
  return (findIndexMyId = myData.findIndex((item) => item.id === +id));
}

function requestOnBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error(`Attention => Wrong Request JSON`));
      }
    });
  });
}

function getTodo(idTodos, request, response) {
  const searchInArray = myData.filter((item) => item.id === +idTodos);

  if (searchInArray.length === 0) {
    throw new Error("This ID is not exists");
  }

  response.setHeader("Content-Type", "application/json");
  response.writeHead(200);
  response.end(JSON.stringify(searchInArray));
}

// function getTodos(request, response) {
//   response.setHeader("Content-Type", "application/json");
//   response.writeHead(200);
//   response.end(JSON.stringify(myData));
// }

async function postTodo(request, response) {
  try {
    const bodyTodos = await requestOnBody(request);

    if (!bodyTodos.title) {
      throw new Error("You must insert TITLE");
    }

    if (!bodyTodos.description) {
      throw new Error("You must insert DESCRIPTION");
    }

    if (!bodyTodos.dueDate) {
      bodyTodos.dueDate = "unknown";
    }

    if (!bodyTodos.isComplete) {
      bodyTodos.isComplete = false;
    }

    const newTodo = {
      id: myData.length,
      title: bodyTodos.title,
      description: bodyTodos.description,
      dueData: bodyTodos.dueDate,
      isComplete: bodyTodos.isComplete,
    };

    myData.push(newTodo);
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(myData.slice(-1)));
  } catch (err) {
    response.end(`ATTENTION => ${err.message}`);
  }
}

function deleteTodo(idTodos, request, response) {
  indexOfObjectInMyData(idTodos);

  if (findIndexMyId === -1) {
    throw new Error(`ID number ${idTodos} does not exists `);
  } else {
    myData.splice(findIndexMyId, 1);
    response.end(`Choosed ID ${idTodos} was removed`);
  }
}

async function patchTodo(idTodos, request, response) {
  indexOfObjectInMyData(idTodos);

  try {
    const myIdObject = await requestOnBody(request);
    const bodyTodos = myData[findIndexMyId];

    const newTodo = {
      title: bodyTodos.title,
      description: bodyTodos.description,
    };

    if (myIdObject.title) {
      newTodo["title"] = myIdObject.title;
    }
    if (myIdObject.description) {
      newTodo["description"] = myIdObject.description;
    }

    myData[findIndexMyId] = { ...myData[findIndexMyId], ...newTodo };
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(myData[findIndexMyId]));
  } catch (err) {
    response.end(`Don't send correct data => ${err}`);
  }
}

server.on("request", (request, response) => {
  const parsedUrl = url.parse(request.url, true);
  const idTodos = parsedUrl.query["id"];

  try {
    if (parsedUrl.pathname === "/todos" && request.method === "GET") {
      if (idTodos === "") {
        throw new Error("Insert a value to ID");
      } else if (idTodos && !isNaN(+idTodos)) {
        getTodo(idTodos, request, response);
      } else {
        getTodos(request, response);
      }
    }

    if (parsedUrl.pathname === "/todos" && request.method === "POST") {
      postTodo(request, response);
    }

    if (parsedUrl.pathname === "/todos" && request.method === "DELETE") {
      deleteTodo(idTodos, request, response);
    }

    if (parsedUrl.pathname === "/todos" && request.method === "PATCH") {
      patchTodo(idTodos, request, response);
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
