import { myData, today } from "../accessDbTodo.js";

function indexOfObjectInMyData(id) {
  return myData.findIndex((item) => item.id === +id);
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

async function getTodos(request, response) {
  // const todos = await databaseService.getTodos;
  response.setHeader("Content-Type", "application/json");
  response.writeHead(200);
  response.end(JSON.stringify(myData));
}

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
      bodyTodos.dueDate = today;
    }

    if (!bodyTodos.isComplete) {
      bodyTodos.isComplete = true;
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
  const findIndexMyId = indexOfObjectInMyData(idTodos);

  if (findIndexMyId === -1) {
    throw new Error(`ID number ${idTodos} does not exists `);
  } else {
    myData.splice(findIndexMyId, 1);
    response.end(`Choosed ID ${idTodos} was removed`);
  }
}

async function patchTodo(idTodos, request, response) {
  const findIndexMyId = indexOfObjectInMyData(idTodos);

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

export const TodoController = {
  getTodo,
  getTodos,
  postTodo,
  deleteTodo,
  patchTodo,
};
