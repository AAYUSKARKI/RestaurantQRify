import { StatusCodes } from "http-status-codes";
import type { UserResponse, CreateUser } from "./userModel";
import { UserRepository } from "./userRepository";
import { ServiceResponse } from "@/common/utils/serviceResponse";
import bcrypt from "bcrypt";

export class UserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository = new UserRepository()) {
        this.userRepository = userRepository;
    }

    async createUser(data: CreateUser): Promise<ServiceResponse<UserResponse | null>> {
        try{
            const userExists = await this.userRepository.findUserByEmail(data.email);
            if(userExists) {
                return ServiceResponse.failure("User already exists", null, StatusCodes.CONFLICT);
            }

            const hashedPassword = await bcrypt.hash(data.password, 10);
            const user = await this.userRepository.createUser({...data, password: hashedPassword});
            return ServiceResponse.success<UserResponse>("User created successfully", user);
        } catch (error) {
            console.error("Error creating user:", error);
            return ServiceResponse.failure("Error creating user", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export const userService = new UserService();