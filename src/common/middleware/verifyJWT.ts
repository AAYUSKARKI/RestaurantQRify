import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { ServiceResponse, handleServiceResponse } from "@/common/utils/serviceResponse";
import { UserRepository } from "@/api/user/userRepository";
import { redisClient } from "../lib/redis";

const userRepository = new UserRepository();

interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return handleServiceResponse(
        ServiceResponse.failure("Access token is missing or invalid", null, StatusCodes.UNAUTHORIZED),
        res
      );
    }

    const accessToken = authHeader.split(" ")[1];
    const TOKEN_PREFIX = 'revoked:access:'
    const key = `${TOKEN_PREFIX}${accessToken}`;
    const isBlacklistedToken = await redisClient.get(key);

    if (isBlacklistedToken) {
      return handleServiceResponse(
        ServiceResponse.failure("Token is blacklisted", null, StatusCodes.UNAUTHORIZED),
        res
      );
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string) as JWTPayload;

    const user = await userRepository.findById(decoded.userId);

    if (!user) {
      return handleServiceResponse(
        ServiceResponse.failure("User not found", null, StatusCodes.UNAUTHORIZED),
        res
      );
    }

    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      return handleServiceResponse(
        ServiceResponse.failure("Invalid token format", null, StatusCodes.UNAUTHORIZED),
        res
      );
    }

    if (error.name === "TokenExpiredError") {
      return handleServiceResponse(
        ServiceResponse.failure("Token has expired", null, StatusCodes.UNAUTHORIZED),
        res
      );
    }
    console.error("JWT Verification Error:", error);
    return handleServiceResponse(
      ServiceResponse.failure("Authentication failed", null, StatusCodes.UNAUTHORIZED),
      res
    );
  }
};