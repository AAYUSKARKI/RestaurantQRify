import { prisma } from "@/common/lib/prisma";
import { UserResponse, CreateUser } from "./userModel";

export class UserRepository {
    async findUserByEmail(email: string): Promise<UserResponse | null> {
        return prisma.user.findUnique({ where: { email } });
    }

    async createUser(data: CreateUser): Promise<UserResponse> {
        return prisma.user.create({
             data,
             select: {
                 email: true,
                 name: true,
                 id: true,
                 role: true,
                 isActive: true
             }
        });
    }
}