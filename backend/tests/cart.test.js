const request = require("supertest");
const app = require("../app");

describe("Cart APIs", () => {

  test("Get cart without token", async () => {
    const response = await request(app)
      .get("/cart");

    expect([401, 403]).toContain(response.statusCode);
  });

});