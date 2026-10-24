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
        fullName: "Test User",
        email: "test@example.com",
        password: "1234567890",
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
          fullName: "Test User",
          email: "test@example.com",
          password: "1234567890",
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
        fullName: "Test User",
        email: "test@example.com",
        password: "1234567",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("VALIDATION_ERROR");
      expect(response.body.errors[0]).toMatchObject({
        field: "password",
        code: "too_small",
      });
    });

    it("should reject fullName less than 3 characters", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "test_user",
        fullName: "ab",
        email: "test@example.com",
        password: "1234567890",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("VALIDATION_ERROR");
      expect(response.body.errors[0]).toMatchObject({
        field: "fullName",
        code: "too_small",
      });
    });

    it("should reject fullName more than 255 characters", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          username: "test_user",
          fullName: "a".repeat(256),
          email: "test@example.com",
          password: "1234567890",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("VALIDATION_ERROR");
      expect(response.body.errors[0]).toMatchObject({
        field: "fullName",
        code: "too_big",
      });
    });

    it("should reject email that is not valid", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "test_user",
        fullName: "Test User",
        email: "bukan-email",
        password: "1234567890",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("VALIDATION_ERROR");
      expect(response.body.errors[0]).toMatchObject({
        field: "email",
      });
    });

    it("should reject when email is missing", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "test_user",
        fullName: "Test User",
        password: "1234567890",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("VALIDATION_ERROR");
      expect(response.body.errors[0]).toMatchObject({
        field: "email",
      });
    });
  });

  it("should reject user already exist", async () => {
    const password = "1234567890";
    const user = {
      username: "test_user",
      fullName: "Test User",
      email: "test@example.com",
      password: await hashPassword(password),
    };

    await db.insert(users).values(user);
    const response = await request(app)
      .post("/api/auth/register")
      .send({ ...user, password: password });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe("RESOURCE_CONFLICT");
  });

  it("should reject email already exist", async () => {
    const password = "1234567890";

    await db.insert(users).values({
      username: "test_user",
      fullName: "Test User",
      email: "test@example.com",
      password: await hashPassword(password),
    });

    const response = await request(app).post("/api/auth/register").send({
      username: "test_user_lain",
      fullName: "Test User",
      email: "test@example.com",
      password: password,
    });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe("RESOURCE_CONFLICT");
  });

  describe("POST /api/auth/register", () => {
    describe("Success", () => {
      it("should register a new user successfully", async () => {
        const response = await request(app).post("/api/auth/register").send({
          username: "test_user",
          fullName: "Test User",
          email: "test@example.com",
          password: "1234567890",
        });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);

        expect(response.body.data).toMatchObject({
          username: "test_user",
          fullName: "Test User",
          email: "test@example.com",
        });

        expect(response.body.data).not.toHaveProperty("password");
      });
    });
  });
});
