const request = require("supertest");
const app = require("../app");

describe("Category APIs", () => {

  test("Get categories without token", async () => {
    const response = await request(app)
      .get("/categories");

    expect([401, 403]).toContain(response.statusCode);
  });

});