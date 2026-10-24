import AppError from "../../errors/app-error.js";
import { ERROR_CODES } from "../../errors/error-codes.js";
import { generateToken } from "../../utils/jwt.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import { userRepository } from "../user/user-repository.js";
import type { LoginInput, RegisterInput } from "./auth-schema.js";

const register = async (newUser: RegisterInput) => {
  const userExist = await userRepository.findByUsername(newUser.username);

  if (userExist) {
    throw new AppError("User already exist", 409, {
      code: ERROR_CODES.RESOURCE_CONFLICT,
    });
  }

  const emailExists = await userRepository.findByEmail(newUser.email);

  if (emailExists) {
    throw new AppError("Email already exist", 409, {
      code: ERROR_CODES.RESOURCE_CONFLICT,
    });
  }

  const hashedPassword = await hashPassword(newUser.password);

  const saveUser = await userRepository.create({
    ...newUser,
    password: hashedPassword,
  });

  return saveUser;
};

const login = async (user: LoginInput) => {
  const userExist = await userRepository.findByUsernameWithPassword(
    user.username,
  );

  if (!userExist) {
    throw new AppError("email dan password tidak valid", 401, {
      code: ERROR_CODES.INVALID_CREDENTIALS,
    });
  }

  const passwordMatch = await comparePassword(
    user.password,
    userExist.password,
  );

  if (!passwordMatch) {
    throw new AppError("email dan password tidak valid", 401, {
      code: ERROR_CODES.INVALID_CREDENTIALS,
    });
  }

  const token = generateToken({
    sub: userExist.id,
    username: userExist.username,
  });

  return { token };
};

export const authService = {
  login,
  register,
};
