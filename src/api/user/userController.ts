import { Request, RequestHandler, Response } from "express";
import { ServiceResponse, handleServiceResponse } from "@/common/utils/serviceResponse";
import { CreateUserSchema, UserResponse } from "./userModel";
import { userService } from "./userService";
import { StatusCodes } from "http-status-codes";

class UserController {
    public createUser: RequestHandler = async (req: Request, res: Response) => {
        const data = CreateUserSchema.parse(req.body);
        const serviceResponse: ServiceResponse<UserResponse | null> = await userService.createUser(data);
        return handleServiceResponse(serviceResponse, res);
    }
}

export const userController = new UserController();