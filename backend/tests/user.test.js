const request = require("supertest");
const app = require("../app");

describe("User APIs", () => {

  test("Get profile without token", async () => {
    const response = await request(app)
      .get("/auth/profile/test");

    expect([401, 403, 404]).toContain(response.statusCode);
  });

});