"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const prisma_1 = require("../lib/prisma");
async function userRoutes(fastify) {
    fastify.get("/users/count", async () => {
        const count = await prisma_1.prisma.user.count();
        return { count };
    });
}
exports.userRoutes = userRoutes;
