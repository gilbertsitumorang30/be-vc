import { describe, expect, it, beforeEach, afterAll } from "vitest";
import request from "supertest";

import app from "../../../src/app.ts";
import { db } from "../../../src/db/index.ts";
import { users } from "../../../src/db/schema/users.ts";
import { hashPassword } from "../../../src/utils/password.ts";

describe("POST /auth/register", () => {
  beforeEach(async () => {
    await db.delete(users);
  });

  afterAll(async () => {
    await db.delete(users);
  });
  describe("Validation", () => {
    it("should reject username less than 5 characters", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "jho",
        name: "Test User",
        password: "1234567890",
        roleId: 1,
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("VALIDATION_ERROR");
      expect(response.body.errors[0]).toMatchObject({
        field: "username",
        code: "too_small",
      });
    });

    it("should reject username more than 50 characters", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          username: "a".repeat(51),
          name: "Test User",
          password: "1234567890",
          roleId: 1,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("VALIDATION_ERROR");
      expect(response.body.errors[0]).toMatchObject({
        field: "username",
        code: "too_big",
      });
    });

    it("should reject password less than 8 characters", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "test_user",
        name: "Test User",
        password: "1234567",
        roleId: 1,
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("VALIDATION_ERROR");
      expect(response.body.errors[0]).toMatchObject({
        field: "password",
        code: "too_small",
      });
    });

    it("should reject name less than 3 characters", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "test_user",
        name: "ab",
        password: "1234567890",
        roleId: 1,
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("VALIDATION_ERROR");
      expect(response.body.errors[0]).toMatchObject({
        field: "name",
        code: "too_small",
      });
    });

    it("should reject name more than 100 characters", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          username: "test_user",
          name: "a".repeat(101),
          password: "1234567890",
          roleId: 1,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("VALIDATION_ERROR");
      expect(response.body.errors[0]).toMatchObject({
        field: "name",
        code: "too_big",
      });
    });

    it("should reject roleId that is not an integer", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "test_user",
        name: "Test User",
        password: "1234567890",
        roleId: 1.5,
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("VALIDATION_ERROR");
      expect(response.body.errors[0]).toMatchObject({
        field: "roleId",
        code: "invalid_type",
      });
    });

    it("should reject roleId that is not positive", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "test_user",
        name: "Test User",
        password: "1234567890",
        roleId: 0,
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("VALIDATION_ERROR");
      expect(response.body.errors[0]).toMatchObject({
        field: "roleId",
        code: "too_small",
      });
    });
  });

  it("should reject user already exist", async () => {
    const password = "1234567890";
    const user = {
      username: "test_user",
      name: "Test User",
      password: await hashPassword(password),
      roleId: 1,
    };

    await db.insert(users).values(user);
    const response = await request(app)
      .post("/api/auth/register")
      .send({ ...user, password: password });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe("RESOURCE_CONFLICT");
  });

  describe("POST /api/auth/register", () => {
    describe("Success", () => {
      it("should register a new user successfully", async () => {
        const response = await request(app).post("/api/auth/register").send({
          username: "test_user",
          name: "Test User",
          password: "1234567890",
          roleId: 1,
        });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);

        expect(response.body.data).toMatchObject({
          username: "test_user",
          name: "Test User",
          roleId: 1,
        });

        expect(response.body.data).not.toHaveProperty("password");
      });
    });
  });
});
