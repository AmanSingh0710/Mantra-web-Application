const request = require("supertest");
const app = require("../app");

describe("Product APIs", () => {
  test("Get all products", async () => {
    const response = await request(app).get("/products");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("products");
    expect(response.body).toHaveProperty("totalProducts");
  });
});