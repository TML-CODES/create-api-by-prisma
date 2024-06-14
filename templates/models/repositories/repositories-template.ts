import { {name} } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { prisma } from "../../modules/prisma";
import { buildSqlToPrismaClosures } from "../../utils/helpers";

class {Name} {
    async get<T extends Prisma.{name}FindManyArgs>(
        id: string, 
        select?: Prisma.SelectSubset<T, Prisma.{name}FindManyArgs>['select']
    ) {
        const res = await prisma.{name}.findFirst({ 
            where: { id }, 
            select
        });
        return res;
    }

    async create(data: {name}) {
        const res = await prisma.{name}.create({ data });
        return res;
    }
    
    async update(id: string, data: {name}) {
        const res = await prisma.{name}.update({
            where: { id },
            data
        });

        return res;
    }

    async delete{Name}(id: string) {
        const res = await prisma.{name}.delete({
            where: { id }
        });

        return res;
    }

    async search<T extends Prisma.{name}FindManyArgs>(
        where?: Prisma.SelectSubset<T, Prisma.{name}FindManyArgs>['where'], 
        orderByClosure?: string | Prisma.SelectSubset<T, Prisma.{name}FindManyArgs>['orderBy'],
        limit = 10,
        skip = 0,
        select?: Prisma.SelectSubset<T, Prisma.{name}FindManyArgs>['select']
    ) {
        const { orderBy } = buildSqlToPrismaClosures(orderByClosure);
        const res = await prisma.{name}.findMany({
            where,
            orderBy: orderBy || { createdAt: 'desc' },
            select,
            take: Number(limit || 10),
            skip: Number(skip || 0)
        });
        return res;
    }
}

export default new {Name}();