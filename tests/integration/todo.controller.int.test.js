const request = require("supertest");
const app = require("../../app");

const newTodo = require("../mock-data/new-todo.json");

const endpointUrl = "/todos/";
let firstTodo, newTodoId;
const nonExistingId = "5f088f65893d7b370c81f9eb";
const testData = { title: "Make integration test for PUT", done: true };

describe(endpointUrl, () => {
  test("GET" + endpointUrl, async () => {
    const response = await request(app).get(endpointUrl);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].done).toBeDefined();
    firstTodo = response.body[0];
  });

  test("GET by id" + endpointUrl + ":todoId", async () => {
    const response = await request(app).get(endpointUrl + firstTodo._id);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstTodo.title);
    expect(response.body.done).toBe(firstTodo.done);
  });

  test("GET todo by id doesnt exist", async () => {
    const response = await request(app).get(endpointUrl + nonExistingId);
    expect(response.statusCode).toBe(404);
  });

  it("POST ", async () => {
    const response = await request(app).post(endpointUrl).send(newTodo);

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
    newTodoId = response.body._id;
  });

  it("PUT" + endpointUrl, async () => {
    const response = await request(app)
      .put(endpointUrl + newTodoId)
      .send(testData);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(testData.title);
    expect(response.body.done).toBe(testData.done);
  });

  test("PUT 404", async () => {
    const res = await request(app)
      .put(endpointUrl + nonExistingId)
      .send(testData);
    expect(res.statusCode).toBe(404);
  });

  test("HTTP DELETE", async () => {
    const res = await request(app)
      .delete(endpointUrl + newTodoId)
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(testData.title);
    expect(res.body.done).toBe(testData.done);
  });

  test("HTTP DELETE 404", async () => {
    const res = await request(app)
      .delete(endpointUrl + nonExistingId)
      .send();
    expect(res.statusCode).toBe(404);
  });

  it("Should return 500 on malform data" + endpointUrl, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .send({ title: "Missing done" });
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message: "Todo validation failed: done: Path `done` is required.",
    });
  });
});
