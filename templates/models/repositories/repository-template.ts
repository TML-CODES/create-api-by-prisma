import { replace_here } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { prisma } from "../../modules/prisma";
import { buildSqlToPrismaClosures } from "../../utils/helpers";

class Replace_Here {
    async get<T extends Prisma.replace_hereFindManyArgs>(
        id: string, 
        select?: Prisma.SelectSubset<T, Prisma.replace_hereFindManyArgs>['select']
    ) {
        const res = await prisma.replace_here.findFirst({ 
            where: { id }, 
            select
        });
        return res;
    }

    async create(data: replace_here) {
        const res = await prisma.replace_here.create({ data });
        return res;
    }
    
    async update(id: string, data: replace_here) {
        const res = await prisma.replace_here.update({
            where: { id },
            data
        });

        return res;
    }

    async deleteReplace_Here(id: string) {
        const res = await prisma.replace_here.delete({
            where: { id }
        });

        return res;
    }

    async search<T extends Prisma.replace_hereFindManyArgs>(
        where?: Prisma.SelectSubset<T, Prisma.replace_hereFindManyArgs>['where'], 
        orderByClosure?: string | Prisma.SelectSubset<T, Prisma.replace_hereFindManyArgs>['orderBy'],
        limit = 10,
        skip = 0,
        select?: Prisma.SelectSubset<T, Prisma.replace_hereFindManyArgs>['select']
    ) {
        const { orderBy } = buildSqlToPrismaClosures(orderByClosure);
        const res = await prisma.replace_here.findMany({
            where,
            orderBy: orderBy || { createdAt: 'desc' },
            select,
            take: Number(limit || 10),
            skip: Number(skip || 0)
        });
        return res;
    }
}

export default new Replace_Here();