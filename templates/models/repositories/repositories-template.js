const { {name} } = "@prisma/client";
const { prisma } = "../../modules/prisma";
const { buildSqlToPrismaClosures } = "../../utils/helpers";

class {Name} {
    async get(id, select) {
        const res = await prisma.{name}.findFirst({
            where: { id },
            select,
        });
        return res;
    }

    async create(data) {
        const res = await prisma.{name}.create({ data });
        return res;
    }

    async update(id, data) {
        const res = await prisma.{name}.update({
            where: { id },
            data,
        });

        return res;
    }

    async updateAll(data) {
        const res = await prisma.{name}.updateMany({
            data,
        });

        return res;
    }

    async delete{Name}(id) {
        const res = await prisma.{name}.delete({
            where: { id },
        });

        return res;
    }

    async search(whereClosure, orderByClosure, limit = 10, skip = 0, select) {
        const { where, orderBy } = buildSqlToPrismaClosures(
            whereClosure,
            orderByClosure
        );
        const res = await prisma.{name}.findMany({
            where,
            orderBy,
            select,
            take: Number(limit || 10),
            skip: Number(skip || 0),
        });
        return res;
    }
}

module.exports = new {Name}();
