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
exports.updateAssemblyWithPersons = exports.updateAssembly = exports.getAssemblyByPersonId = exports.calculateAssemblyVotes = exports.createAssembly = exports.getAssemblyById = exports.getAllAssembly = void 0;
const index_1 = require("../index");
function getAllAssembly() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.generalAssembly.findMany();
        }
        catch (error) {
            console.error('Error fetching assemblies:', error);
            throw error;
        }
    });
}
exports.getAllAssembly = getAllAssembly;
function getAssemblyById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.generalAssembly.findUnique({ where: { id },
                include: {
                    surveys: true,
                    topics: true,
                }, });
        }
        catch (error) {
            console.error('Error fetching assembly by ID:', error);
            throw error;
        }
    });
}
exports.getAssemblyById = getAssemblyById;
function createAssembly(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const topicsData = data.topics ? data.topics.map(topicData => ({
                label: topicData.label,
                description: topicData.description,
                status: topicData.status,
                isAnonyme: topicData.isAnonyme,
                modality: topicData.modality,
                quorum: topicData.quorum,
                currentRound: topicData.currentRound,
                totalRounds: topicData.totalRounds,
                choices: topicData.choices ? {
                    create: topicData.choices.map(choiceData => ({
                        description: choiceData.description,
                        round: 1
                    }))
                } : undefined
            })) : [];
            const surveysData = data.surveys ? data.surveys.map(surveyData => ({
                title: surveyData.title,
                description: surveyData.description,
                questions: {
                    create: surveyData.questions.map(questionData => ({
                        label: questionData.label,
                        type: questionData.type,
                        options: questionData.options,
                    }))
                }
            })) : [];
            const newAssembly = yield index_1.prisma.generalAssembly.create({
                data: {
                    meetingDate: data.meetingDate,
                    status: data.status,
                    outcome: data.outcome,
                    creationDate: data.creationDate,
                    endingDate: data.endingDate,
                    topics: {
                        create: topicsData
                    },
                    surveys: {
                        create: surveysData
                    },
                    person: data.person ? {
                        connect: data.person.map((id) => ({ id }))
                    } : undefined,
                    activity: data.activityId ? { connect: { id: data.activityId } } : undefined
                },
                include: {
                    person: true,
                    topics: {
                        include: {
                            choices: true
                        }
                    },
                    surveys: {
                        include: {
                            questions: true
                        }
                    }
                }
            });
            return newAssembly;
        }
        catch (error) {
            console.error('Error creating assembly:', error);
            throw error;
        }
    });
}
exports.createAssembly = createAssembly;
const calculateAssemblyVotes = (assemblyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assembly = yield index_1.prisma.generalAssembly.findUnique({
            where: { id: assemblyId },
            include: {
                topics: {
                    include: {
                        choices: {
                            include: {
                                voters: true
                            }
                        }
                    }
                }
            }
        });
        if (!assembly) {
            throw new Error('Assembly not found.');
        }
        const results = assembly.topics.map(topic => ({
            id: topic.id,
            topicLabel: topic.label,
            topicDescription: topic.description,
            choices: topic.choices.map(choice => ({
                id: choice.id,
                round: choice.round,
                description: choice.description,
                voteCount: choice.voters.length
            })),
            currentRound: topic.currentRound,
            totalRounds: topic.totalRounds,
            quorum: topic.quorum,
        }));
        return results;
    }
    catch (error) {
        console.error('Error calculating votes:', error);
        throw error;
    }
});
exports.calculateAssemblyVotes = calculateAssemblyVotes;
const getAssemblyByPersonId = (personId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assemblies = yield index_1.prisma.generalAssembly.findMany({
            where: {
                person: {
                    some: {
                        id: personId
                    }
                }
            },
            include: {
                topics: {
                    include: {
                        choices: true
                    }
                }
            }
        });
        return assemblies;
    }
    catch (error) {
        console.error('Failed to fetch assemblies:', error);
        throw new Error('Failed to fetch assemblies');
    }
});
exports.getAssemblyByPersonId = getAssemblyByPersonId;
function updateAssembly(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.generalAssembly.update({
                where: { id },
                data: {
                    meetingDate: data.meetingDate,
                    status: data.status,
                    outcome: data.outcome,
                    creationDate: data.creationDate,
                    endingDate: data.endingDate,
                    person: data.person ? { connect: data.person.map((personId) => ({ id: personId })) } : undefined,
                    topics: data.topics ? { connect: data.topics.map((topicId) => ({ id: topicId })) } : undefined,
                    activity: data.activityId ? { connect: { id: data.activityId } } : undefined,
                },
            });
        }
        catch (error) {
            console.error('Error updating assembly:', error);
            throw error;
        }
    });
}
exports.updateAssembly = updateAssembly;
function updateAssemblyWithPersons(assemblyId, personIds) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.generalAssembly.update({
                where: { id: assemblyId },
                data: {
                    person: {
                        connect: personIds.map(id => ({ id }))
                    }
                },
                include: {
                    person: true
                }
            });
        }
        catch (error) {
            console.error('Error updating assembly:', error);
            throw error;
        }
    });
}
exports.updateAssemblyWithPersons = updateAssemblyWithPersons;
