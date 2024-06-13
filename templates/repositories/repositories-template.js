const { users } = "@prisma/client";
const { prisma } = "../../modules/prisma";
const { buildSqlToPrismaClosures } = "../../utils/helpers";

class Users {
    async get(id, select) {
        const res = await prisma.users.findFirst({
            where: { id },
            select,
        });
        return res;
    }

    async create(data) {
        const res = await prisma.users.create({ data });
        return res;
    }

    async update(id, data) {
        const res = await prisma.users.update({
            where: { id },
            data,
        });

        return res;
    }

    async updateAll(data) {
        const res = await prisma.users.updateMany({
            data,
        });

        return res;
    }

    async delete(id) {
        const res = await prisma.users.delete({
            where: { id },
        });

        return res;
    }

    async search(whereClosure, orderByClosure, select, limit = 10, skip = 0) {
        const { where, orderBy } = buildSqlToPrismaClosures(
            whereClosure,
            orderByClosure
        );
        const res = await prisma.users.findMany({
            where,
            orderBy,
            select: select ? { ...selectDefault, ...select } : selectDefault,
            take: Number(limit || 10),
            skip: Number(skip || 0),
        });
        return res;
    }
}

export default new Users();
