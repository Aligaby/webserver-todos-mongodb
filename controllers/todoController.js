import { collections } from "../TodosService.js";

const date = new Date();
const [month, day, year] = [
  date.getMonth() + 1,
  date.getDate() + 2,
  date.getFullYear(),
];
const today = `${day}.${month}.${year}`;

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

async function getTodos(request, response) {
  try {
    const todos = await collections.myData.find({}).toArray();
    response.setHeader("Content-Type", "application/json");
    response.writeHead(200);
    response.end(JSON.stringify(todos));
  } catch (err) {
    response.end(`Attention, you have an error => ${err.message}`);
  }
}

async function getTodo(idTodos, request, response) {
  try {
    const searchInArray = await collections.myData.findOne({ id: +idTodos });

    if (!searchInArray) {
      throw new Error("This ID is not exists");
    }

    response.setHeader("Content-Type", "application/json");
    response.writeHead(200);
    response.end(JSON.stringify(searchInArray));
  } catch (err) {
    response.end(`Attention, you have an error => ${err.message}`);
  }
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
      bodyTodos.dueDate = new Date(today);
    }

    if (!bodyTodos.isComplete) {
      bodyTodos.isComplete = true;
    }

    const newId = await collections.myData.count({});
    const newTodo = {
      id: newId + 1,
      title: bodyTodos.title,
      description: bodyTodos.description,
      dueData: bodyTodos.dueDate,
      isComplete: bodyTodos.isComplete,
    };

    await collections.myData.insertOne(newTodo);
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(newTodo));
  } catch (err) {
    response.end(`ATTENTION => ${err.message}`);
  }
}

async function deleteTodo(idTodos, request, response) {
  try {
    const findIndexMyId = await collections.myData.deleteOne({ id: +idTodos });
    const isDeleted = findIndexMyId.deletedCount > 0;

    if (!isDeleted) {
      throw new Error(`ID [ ${idTodos} ] does not exist.`);
    }

    response.end(`You deleted ID = ${idTodos}`);
  } catch (err) {
    response.end(`ATTENTION => ${err.message}`);
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
  getTodos,
  getTodo,
  postTodo,
  deleteTodo,
  patchTodo,
};
