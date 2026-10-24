// tests/auth/auth-middleware.test.ts

import { describe, expect, it, beforeEach, afterAll } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

import app from "../../../src/app.ts";
import { db } from "../../../src/db/index.ts";
import { users } from "../../../src/db/schema/users.ts";
import { appConfig } from "../../../src/config/app-config.ts";
import { hashPassword } from "../../../src/utils/password.ts";

describe("Auth Middleware", () => {
  beforeEach(async () => {
    await db.delete(users);
  });

  afterAll(async () => {
    await db.delete(users);
  });

  describe("Authorization Header", () => {
    it("should reject request without authorization header", async () => {
      const response = await request(app).get("/api/test/protected");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("UNAUTHORIZED");
    });

    it("should reject authorization header without Bearer type", async () => {
      const token = jwt.sign(
        {
          sub: 1,
          username: "test_user",
          roleId: 1,
        },
        appConfig.JWT_SECRET,
        {
          expiresIn: "1h",
        },
      );

      const response = await request(app)
        .get("/api/test/protected")
        .set("Authorization", `Basic ${token}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("UNAUTHORIZED");
    });

    it("should reject authorization header without token", async () => {
      const response = await request(app)
        .get("/api/test/protected")
        .set("Authorization", "Bearer");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("UNAUTHORIZED");
    });
  });

  describe("JWT", () => {
    it("should reject invalid token", async () => {
      const response = await request(app)
        .get("/api/test/protected")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("UNAUTHORIZED");
    });

    it("should reject expired token", async () => {
      const token = jwt.sign(
        {
          sub: 1,
          username: "test_user",
          roleId: 1,
        },
        appConfig.JWT_SECRET,
        {
          expiresIn: -1,
        },
      );

      const response = await request(app)
        .get("/api/test/protected")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("UNAUTHORIZED");
    });

    it("should allow access with valid token", async () => {
      const password = "1234567890";
      const user = {
        username: "test_user",
        name: "Test User",
        password: await hashPassword(password),
        roleId: 1,
      };

      await db.insert(users).values(user);

      // 2. Login
      const loginResponse = await request(app).post("/api/auth/login").send({
        username: "test_user",
        password: "1234567890",
      });

      expect(loginResponse.status).toBe(200);

      const token = loginResponse.body.data.token;

      // 3. Access protected route
      const response = await request(app)
        .get("/api/test/protected")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
