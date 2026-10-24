import { describe, expect, it, beforeEach, afterAll } from "vitest";
import request from "supertest";

import app from "../../../src/app.ts";
import { db } from "../../../src/db/index.ts";
import { users } from "../../../src/db/schema/users.ts";
import { hashPassword } from "../../../src/utils/password.ts";

describe("POST /auth/login", () => {
  beforeEach(async () => {
    await db.delete(users);
  });

  afterAll(async () => {
    await db.delete(users);
  });

  describe("Validation", () => {
    it("should reject username less than 5 characters", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: "jho",
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

    it("should reject password less than 8 characters", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: "test_user",
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
  });

  describe("Authentication", () => {
    it("should reject when username does not exist", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: "test_user",
        password: "1234567890",
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("INVALID_CREDENTIALS");
    });

    it("should reject when password is incorrect", async () => {
      const password = "1234567890";

      await db.insert(users).values({
        username: "test_user",
        name: "Test User",
        password: await hashPassword(password),
        roleId: 1,
      });

      const response = await request(app).post("/api/auth/login").send({
        username: "test_user",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("INVALID_CREDENTIALS");
    });
  });

  describe("Success", () => {
    it("should login successfully", async () => {
      const password = "1234567890";

      await db.insert(users).values({
        username: "test_user",
        name: "Test User",
        password: await hashPassword(password),
        roleId: 1,
      });

      const response = await request(app).post("/api/auth/login").send({
        username: "test_user",
        password,
      });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.token).toEqual(expect.any(String));

      expect(response.body.data.user).toMatchObject({
        username: "test_user",
        name: "Test User",
        roleId: 1,
      });

      expect(response.body.data.user).not.toHaveProperty("password");
    });
  });
});
