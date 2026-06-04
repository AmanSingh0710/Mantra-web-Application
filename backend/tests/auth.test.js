const request = require("supertest");
const app = require("../app");

describe("Auth APIs", () => {

    test("Login without credentials", async () => {
        const response = await request(app)
            .post("/auth/login")
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe(
            "Email and password are required"
        );
    });

    test("Register without required fields", async () => {
        const response = await request(app)
            .post("/auth/register")
            .field("name", "");

        expect(response.statusCode).not.toBe(500);
    });

});