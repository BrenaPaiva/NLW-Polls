"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameRoutes = void 0;
const prisma_1 = require("../lib/prisma");
const authenticate_1 = require("../plugins/authenticate");
const zod_1 = require("zod");
const evaluateUserRankingUsecase_1 = require("../usecases/evaluateUserRankingUsecase");
async function gameRoutes(fastify) {
    fastify.get("/pools/:id/games", { onRequest: [authenticate_1.authenticate] }, async (request) => {
        const getPoolParams = zod_1.z.object({
            id: zod_1.z.string(),
        });
        const { id: poolId } = getPoolParams.parse(request.params);
        const games = await prisma_1.prisma.game.findMany({
            orderBy: {
                date: "desc",
            },
            include: {
                guesses: {
                    where: {
                        participant: {
                            userId: request.user.sub,
                            poolId,
                        },
                    },
                },
            },
        });
        const currentDate = new Date();
        return {
            games: games.map((game) => {
                return {
                    ...game,
                    guess: game.guesses.length > 0 ? game.guesses[0] : null,
                    guesses: undefined,
                    isOver: game.date < currentDate,
                };
            }),
        };
    });
    fastify.get("/pools/:id/ranking", { onRequest: [authenticate_1.authenticate] }, async (request) => {
        const getPoolParams = zod_1.z.object({
            id: zod_1.z.string(),
        });
        const { id: poolId } = getPoolParams.parse(request.params);
        const participants = await prisma_1.prisma.participant.findMany({
            select: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
                guesses: {
                    select: {
                        id: true,
                        firstTeamPoints: true,
                        secondTeamPoints: true,
                        createdAt: true,
                        game: {
                            select: {
                                date: true,
                                result: {
                                    select: {
                                        firstTeamPoints: true,
                                        secondTeamPoints: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            where: {
                poolId,
            },
        });
        const preparedUserData = participants.map((participantItem) => {
            return {
                id: participantItem.user.id,
                name: participantItem.user.name,
                avatarUrl: participantItem.user.avatarUrl,
                attemps: participantItem.guesses.map((guessItem) => {
                    let gameResult = null;
                    if (guessItem.game.result) {
                        gameResult = {
                            firstTeamPoints: guessItem.game.result.firstTeamPoints,
                            secondTeamPoints: guessItem.game.result.secondTeamPoints,
                        };
                    }
                    return {
                        guessSubmission: {
                            firstTeamPoints: guessItem.firstTeamPoints,
                            secondTeamPoints: guessItem.secondTeamPoints,
                        },
                        gameResult,
                    };
                }),
            };
        });
        const computedScoreUsers = evaluateUserRankingUsecase_1.EvaluateUserRankingUseCase.execute(preparedUserData);
        computedScoreUsers.sort((a, b) => {
            if (a.score > b.score) {
                return -1;
            }
            if (a.score < b.score) {
                return 1;
            }
            if (a.attemps.length > b.attemps.length) {
                return -1;
            }
            if (a.attemps.length < b.attemps.length) {
                return 1;
            }
            return a.name < b.name ? 1 : -1;
        });
        return {
            ranking: computedScoreUsers.map((computedItem, idx) => ({
                position: idx + 1,
                ...computedItem,
                attemps: undefined,
            })),
        };
    });
}
exports.gameRoutes = gameRoutes;
