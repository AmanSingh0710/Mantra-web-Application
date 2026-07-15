const request = require("supertest");
const app = require("../app");

describe("Order APIs", () => {

  test("Get orders without token", async () => {
    const response = await request(app)
      .get("/order");

    expect([401, 403]).toContain(response.statusCode);
  });

});