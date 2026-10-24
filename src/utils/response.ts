import type { Response } from "express";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ResponseMeta {
  pagination?: Pagination;
  requestId?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: ResponseMeta;
}

export const successResponse = <T>(
  res: Response,
  message: string = "Success",
  statusCode: number = 200,
  data: T,
  meta?: ResponseMeta,
): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta && { meta }),
  });
};
