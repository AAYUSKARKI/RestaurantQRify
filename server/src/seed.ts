
import bcrypt from "bcrypt";
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "./generated/prisma/client";
const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
    await prisma.user.create({
        data: {
            name: "Alice Wong",
            email: "wongalish@gmail.com",
            password: await bcrypt.hash("password", 10),
            role: "ADMIN",
            isActive: true,
        },
    });
    console.log("Seeded admin user")
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
            