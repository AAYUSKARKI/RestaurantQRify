import { prisma } from "@/common/lib/prisma";
import { TableResponse, CreateTable } from "./tableModel";

export class TableRepository {
    async createTable(data: CreateTable): Promise<TableResponse> {
        return prisma.table.create({
             data,
             select: {
                 id: true,
                 name: true,
                 seats: true,
                 status: true,
                 assignedTo: true,
             }
        });
    }

    async assignTableToWaiter(tableId: string, waiterId: string): Promise<TableResponse> {
        return prisma.table.update({
             where: { id: tableId },
             data: { assignedTo: waiterId },
             select: {
                 id: true,
                 name: true,
                 seats: true,
                 status: true,
                 assignedTo: true,
             }
        });
    }
}