import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import supertest from 'supertest';
import {app} from '../server.js';

describe("Authentication tests", () => {
    it("should create a new user", async () => {
        const email = `test-${Date.now()}@example.com`;
        const response = await supertest(app)
            .post("/api/users/register")
            .send({ 
                 email,
                 password: "password", 
                 name: "Test User" , 
                 role: "user",});
        assert.equal(response.status, 201);

        console.log("Response body:", response.body); // Log the response body for debugging
    });

    describe("login tests", () => {
    it("should login successfully", async () => {
        const email = `test-${Date.now()}@example.com`;
        await supertest(app)
            .post("/api/users/register")
            .send({ email, password: "password", name: "Test User", role: "user" });
        const response = await supertest(app)
            .post("/api/users/login")
            .send({ 
                 email,
                 password: "password", 
                 
            
            })
        assert.equal(response.status, 200);

        console.log("Response body:", response.body); // Log the response body for debugging
    });
});
})