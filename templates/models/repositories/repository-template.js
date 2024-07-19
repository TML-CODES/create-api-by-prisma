const { replace_here } = "@prisma/client";
const { prisma } = "../../modules/prisma";
const { buildSqlToPrismaClosures } = "../../utils/helpers";

class Replace_Here {
    async get(id, select) {
        const res = await prisma.replace_here.findFirst({
            where: { id },
            select,
        });
        return res;
    }

    async create(data) {
        const res = await prisma.replace_here.create({ data });
        return res;
    }

    async update(id, data) {
        if(data.id){
            delete data.id;
        }
        const res = await prisma.replace_here.update({
            where: { id },
            data,
        });

        return res;
    }

    async updateAll(data) {
        const res = await prisma.replace_here.updateMany({
            data,
        });

        return res;
    }

    async deleteReplace_Here(id) {
        const res = await prisma.replace_here.delete({
            where: { id },
        });

        return res;
    }

    async search(whereClosure, orderByClosure, limit = 10, skip = 0, select) {
        const { where, orderBy } = buildSqlToPrismaClosures(
            whereClosure,
            orderByClosure
        );
        const res = await prisma.replace_here.findMany({
            where,
            orderBy,
            select,
            take: Number(limit || 10),
            skip: Number(skip || 0),
        });
        return res;
    }
}

module.exports = new Replace_Here();
