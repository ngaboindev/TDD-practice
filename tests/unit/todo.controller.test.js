const todoController = require("../../controllers/todo.controller");
const TodoModel = require("../../model/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json");
const allTodos = require("../mock-data/all-todos.json");

jest.mock("../../model/todo.model");

let req, res, next;
const todoId = "5f088f65893d7b370c81f8eb";
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

// Describe block for TodoController.getTodos
describe("TodoController.getTodos", () => {
  it("Should have getTodos function", () => {
    expect(typeof todoController.getTodos).toBe("function");
  });

  it("Should call TodoModel.find({})", async () => {
    await todoController.getTodos(req, res, next);
    expect(TodoModel.find).toHaveBeenCalledWith({});
  });

  it("Should response with status code 200 and all todos", async () => {
    TodoModel.find.mockReturnValue(allTodos);
    await todoController.getTodos(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allTodos);
  });

  it("Should handle errors in getTodos", async () => {
    const errorMessage = { message: "Error Finding" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.find.mockReturnValue(rejectedPromise);
    await todoController.getTodos(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

// Describe block fro TodoController.getTodoById
describe("TodoController.getTodoById", () => {
  it("Should have getTodoById", () => {
    expect(typeof todoController.getTodoById).toBe("function");
  });

  it("Should call TodoModel.findById with route parameters", async () => {
    req.params.todoId = todoId;
    await todoController.getTodoById(req, res, next);
    expect(TodoModel.findById).toBeCalledWith(todoId);
  });

  it("Should return json body and response code of 200", async () => {
    TodoModel.findById.mockReturnValue(newTodo);
    await todoController.getTodoById(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it("Should do error handling", async () => {
    const errorMessage = { message: "error finding todoModel" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findById.mockReturnValue(rejectedPromise);
    await todoController.getTodoById(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });

  it("Should return 404 if item doesnt exits", async () => {
    TodoModel.findById.mockReturnValue(null);
    await todoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

// Describe block for TodoController.createTodo
describe("TodoController.createTodo", () => {
  beforeEach(() => {
    req.body = newTodo;
  });

  it("Should have createTodo function", () => {
    expect(typeof todoController.createTodo).toBe("function");
  });

  it("Should call todoModel.create", () => {
    todoController.createTodo(req, res, next);
    expect(TodoModel.create).toBeCalledWith(newTodo);
  });

  it("Should return response code of 201", async () => {
    await todoController.createTodo(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("Should return json body in response", async () => {
    TodoModel.create.mockReturnValue(newTodo);
    await todoController.createTodo(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it("Should handle errors", async () => {
    const errorMessage = { message: "Done property missing" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.create.mockReturnValue(rejectedPromise);
    await todoController.createTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

// Describe block for TodoController.updateTodo
describe("TodoController.updateTodo", () => {
  it("Should have updateTodo function", () => {
    expect(typeof todoController.updateTodo).toBe("function");
  });
  it("Should update with TodoModel.findByIdAndUpdate", async () => {
    req.params.todoId = todoId;
    req.body = newTodo;
    await todoController.updateTodo(req, res, next);
    expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, {
      new: true,
      useFindAndModify: false,
    });
  });
  it("Should return response with json data and statusCode of 200", async () => {
    req.params.todoId = todoId;
    TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
    await todoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it("Should handle error", async () => {
    const errorMessage = { message: "Error" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    await todoController.updateTodo(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it("Should return 404 if todoId not exist", async () => {
    TodoModel.findByIdAndUpdate.mockReturnValue(null);
    await todoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

// Describe block for TodoController.deleteTodo
describe("TodoController.deleteTodo", () => {
  it("Should have deleteTodo function", () => {
    expect(typeof todoController.deleteTodo).toBe("function");
  });
  it("Should call findByIdAndDelete", async () => {
    req.params.todoId = todoId;
    await todoController.deleteTodo(req, res, next);
    expect(TodoModel.findByIdAndDelete).toBeCalledWith(todoId);
  });
  it("Should return 200 OK and deleted todomodel", async () => {
    TodoModel.findByIdAndDelete.mockReturnValue(newTodo);
    await todoController.deleteTodo(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newTodo);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("Should handle errors", async () => {
    const errorMessage = { message: "Error" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
    await todoController.deleteTodo(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it("Should handle 404", async () => {
    TodoModel.findByIdAndDelete.mockReturnValue(null);
    await todoController.deleteTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
