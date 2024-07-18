"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTopic = exports.proceedToNextRoundOrEndVoting = exports.calculateVotes = exports.submitVote = exports.createTopic = exports.getTopicById = exports.getAllTopic = void 0;
const index_1 = require("../index");
function getAllTopic() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.topic.findMany();
        }
        catch (error) {
            console.error('Error fetching topics:', error);
            throw error;
        }
    });
}
exports.getAllTopic = getAllTopic;
function getTopicById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.topic.findUnique({ where: { id } });
        }
        catch (error) {
            console.error('Error fetching topic by ID:', error);
            throw error;
        }
    });
}
exports.getTopicById = getTopicById;
function createTopic(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Vérification que `data.choices` est un tableau avant de l'utiliser
            const choicesData = data.choices ? data.choices.map(choice => (Object.assign(Object.assign({}, choice), { round: 1 }))) : [];
            return yield index_1.prisma.topic.create({
                data: Object.assign(Object.assign({}, data), { quorum: data.quorum, choices: {
                        create: choicesData
                    } }),
                include: {
                    choices: true
                }
            });
        }
        catch (error) {
            console.error('Error creating topic:', error);
            throw error;
        }
    });
}
exports.createTopic = createTopic;
const submitVote = (personId, topicId, choiceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topic = yield index_1.prisma.topic.findUnique({
            where: { id: topicId },
            select: { currentRound: true }
        });
        if (!topic) {
            throw new Error('Topic not found');
        }
        const existingVote = yield index_1.prisma.choice.findFirst({
            where: {
                topicId,
                round: topic.currentRound,
                voters: {
                    some: { id: personId }
                }
            }
        });
        if (existingVote) {
            throw new Error('You have already voted on this topic.');
        }
        const vote = yield index_1.prisma.choice.update({
            where: { id: choiceId },
            data: {
                voters: { connect: { id: personId } },
                voteCount: { increment: 1 }
            }
        });
        yield checkQuorumAndProceed(topicId);
        return vote;
    }
    catch (error) {
        console.error('Error submitting vote:', error);
        throw error;
    }
});
exports.submitVote = submitVote;
const calculateVotes = (topicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topic = yield index_1.prisma.topic.findUnique({
            where: { id: topicId },
            include: {
                choices: {
                    include: {
                        voters: true
                    }
                }
            }
        });
        if (!topic) {
            throw new Error('Topic not found.');
        }
        const results = topic.choices.map(choice => ({
            description: choice.description,
            voteCount: choice.voters.length
        }));
        return results;
    }
    catch (error) {
        console.error('Error calculating votes:', error);
        throw error;
    }
});
exports.calculateVotes = calculateVotes;
const proceedToNextRoundOrEndVoting = (topicId) => __awaiter(void 0, void 0, void 0, function* () {
    const topic = yield index_1.prisma.topic.findUnique({
        where: { id: topicId },
        include: {
            generalAssembly: {
                include: {
                    person: true
                }
            }
        }
    });
    if (!topic)
        throw new Error('Topic not found.');
    if (!topic.generalAssembly)
        throw new Error('General Assembly not found.');
    // Récupérer les choix du round actuel
    const choices = yield index_1.prisma.choice.findMany({
        where: { topicId: topic.id, round: topic.currentRound },
        include: { voters: true }
    });
    const totalVoters = topic.generalAssembly.person.length;
    const totalVotes = choices.reduce((acc, choice) => acc + choice.voters.length, 0);
    const quorumReached = (totalVotes / totalVoters) >= (topic.quorum / 100);
    if (quorumReached) {
        if (topic.currentRound < topic.totalRounds) {
            // Filtrer les choix pour garder les meilleurs
            const topChoices = getTopChoices(choices);
            // Créer de nouveaux choix pour le round suivant
            const newChoicesData = topChoices.map(choice => ({
                description: choice.description,
                round: topic.currentRound + 1,
                voteCount: 0,
                topicId: topic.id
            }));
            yield index_1.prisma.$transaction([
                // Créer les nouveaux choix pour le round suivant
                index_1.prisma.choice.createMany({
                    data: newChoicesData
                }),
                // Mettre à jour le round actuel du topic
                index_1.prisma.topic.update({
                    where: { id: topicId },
                    data: { currentRound: topic.currentRound + 1 }
                })
            ]);
        }
        else {
            // Fin du vote, traiter les résultats
            yield finalizeVoting(topicId);
        }
    }
});
exports.proceedToNextRoundOrEndVoting = proceedToNextRoundOrEndVoting;
const checkQuorumAndProceed = (topicId) => __awaiter(void 0, void 0, void 0, function* () {
    const topic = yield index_1.prisma.topic.findUnique({
        where: { id: topicId },
        include: {
            choices: {
                include: { voters: true },
                where: { round: { equals: 1 } }
            },
            generalAssembly: { include: { person: true } }
        }
    });
    if (!topic)
        throw new Error('Topic not found.');
    if (!topic.generalAssembly)
        throw new Error('General Assembly not found.');
    const totalVoters = topic.generalAssembly.person.length;
    const totalVotes = topic.choices.reduce((acc, choice) => acc + choice.voters.length, 0);
    const quorumReached = (totalVotes / totalVoters) >= 1;
    if (quorumReached) {
        if (topic.currentRound < topic.totalRounds) {
            const topChoices = getTopChoices(topic.choices);
            const newChoicesData = topChoices.map(choice => ({
                description: choice.description,
                round: topic.currentRound + 1,
                voteCount: 0,
                topicId: topic.id
            }));
            yield index_1.prisma.$transaction([
                index_1.prisma.choice.createMany({
                    data: newChoicesData
                }),
                index_1.prisma.topic.update({
                    where: { id: topicId },
                    data: { currentRound: topic.currentRound + 1 }
                })
            ]);
        }
        else {
            // Fin du vote, traiter les résultats
            yield finalizeVoting(topicId);
        }
    }
});
const getTopChoices = (choices) => {
    const sortedChoices = choices.sort((a, b) => b.voteCount - a.voteCount);
    return sortedChoices.slice(0, 2);
};
const finalizeVoting = (topicId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Finalizing voting for topic ${topicId}`);
    yield index_1.prisma.topic.update({
        where: { id: topicId },
        data: {
            status: "finished"
        }
    });
});
function updateTopic(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updateData = {
                label: data.label,
                description: data.description,
                status: data.status,
                isAnonyme: data.isAnonyme,
                modality: data.modality,
            };
            if (data.choices) {
                updateData["choices"] = {
                    updateMany: data.choices.map(choice => ({
                        where: { id: choice.id },
                        data: Object.assign({}, data),
                    })),
                };
            }
            return yield index_1.prisma.topic.update({
                where: { id },
                data: updateData,
                include: {
                    choices: true,
                },
            });
        }
        catch (error) {
            console.error('Error updating topic:', error);
            throw error;
        }
    });
}
exports.updateTopic = updateTopic;
