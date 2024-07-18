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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assemblyRepository_1 = require("../repository/assemblyRepository");
const general_assembly_validation_1 = require("./validators/general-assembly-validation");
const index_1 = require("../index");
const assemblyRouter = express_1.default.Router();
assemblyRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const assemblies = yield (0, assemblyRepository_1.getAllAssembly)();
        res.status(200).json(assemblies);
    }
    catch (error) {
        console.error('Error fetching assemblies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
assemblyRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const assembly = yield (0, assemblyRepository_1.getAssemblyById)(req.params.id);
        if (!assembly) {
            return res.status(404).json({ error: 'Assembly not found' });
        }
        res.status(200).json(assembly);
    }
    catch (error) {
        console.error('Error fetching assembly by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
assemblyRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validez les données de la requête
        const { error, value } = general_assembly_validation_1.GeneralAssemblyValidation.validate(req.body);
        if (error) {
            // Si les données ne sont pas valides, renvoyez une réponse 400 Bad Request avec le message d'erreur
            return res.status(400).json({ error: error.details[0].message });
        }
        const generalAssemblyRequest = value;
        // Les données sont valides, créez l'assemblée
        const newAssembly = yield (0, assemblyRepository_1.createAssembly)(generalAssemblyRequest);
        res.status(201).json(newAssembly);
    }
    catch (error) {
        console.error('Error creating assembly:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
assemblyRouter.post('/:assemblyId/link-people', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { assemblyId } = req.params;
    const { personIds } = req.body;
    try {
        const updatedAssembly = yield (0, assemblyRepository_1.updateAssemblyWithPersons)(assemblyId, personIds);
        res.status(200).json(updatedAssembly);
    }
    catch (error) {
        console.error('Failed to link people to assembly:', error);
        res.status(500).send('Failed to link people to assembly.');
    }
}));
assemblyRouter.get('/:assemblyId/topics', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { assemblyId } = req.params;
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
                },
                person: true
            }
        });
        if (!assembly) {
            return res.status(404).json({ error: 'Assembly not found' });
        }
        const topicsWithVoters = assembly.topics.map(topic => (Object.assign(Object.assign({}, topic), { choices: topic.choices.map(choice => (Object.assign(Object.assign({}, choice), { voters: choice.voters || [] }))) })));
        res.status(200).json(Object.assign(Object.assign({}, assembly), { topics: topicsWithVoters }));
    }
    catch (error) {
        console.error('Failed to fetch topics:', error);
        res.status(500).json({ error: 'Failed to fetch topics' });
    }
}));
assemblyRouter.get('/:assemblyId/topics/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { assemblyId } = req.params;
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
                },
                person: true
            }
        });
        if (!assembly) {
            return res.status(404).json({ error: 'Assembly not found' });
        }
        const topicsWithVoters = assembly.topics.map(topic => (Object.assign(Object.assign({}, topic), { choices: topic.choices.map(choice => (Object.assign(Object.assign({}, choice), { voters: choice.voters || [] }))) })));
        res.status(200).json(Object.assign(Object.assign({}, assembly), { topics: topicsWithVoters }));
    }
    catch (error) {
        console.error('Failed to fetch topics:', error);
        res.status(500).json({ error: 'Failed to fetch topics' });
    }
}));
assemblyRouter.get('/:assemblyId/filtered-topics/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { assemblyId } = req.params;
    try {
        const assembly = yield index_1.prisma.generalAssembly.findUnique({
            where: { id: assemblyId },
            include: {
                topics: {
                    where: {
                        status: {
                            not: 'finished'
                        }
                    },
                    include: {
                        choices: {
                            include: {
                                voters: true
                            }
                        }
                    }
                },
                person: true
            }
        });
        if (!assembly) {
            return res.status(404).json({ error: 'Assembly not found' });
        }
        // Filtrer les choices dont le currentRound est différent de celui du topic associé
        const filteredTopics = assembly.topics.map(topic => (Object.assign(Object.assign({}, topic), { choices: topic.choices.filter(choice => choice.round === topic.currentRound) })));
        // Préparer les topics avec les voters
        const topicsWithVoters = filteredTopics.map(topic => (Object.assign(Object.assign({}, topic), { choices: topic.choices.map(choice => (Object.assign(Object.assign({}, choice), { voters: choice.voters || [] }))) })));
        res.status(200).json(Object.assign(Object.assign({}, assembly), { topics: topicsWithVoters }));
    }
    catch (error) {
        console.error('Failed to fetch topics:', error);
        res.status(500).json({ error: 'Failed to fetch topics' });
    }
}));
assemblyRouter.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: Check all argument validation
    // TODO: Write the service rules
    try {
        const { id } = req.params;
        const updatedAssembly = yield (0, assemblyRepository_1.updateAssembly)(id, req.body);
        if (!updatedAssembly) {
            return res.status(404).json({ error: 'Assembly not found' });
        }
        res.status(200).json(updatedAssembly);
    }
    catch (error) {
        console.error('Error updating assembly:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
assemblyRouter.get('/:assemblyId/results', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { assemblyId } = req.params;
    try {
        const results = yield (0, assemblyRepository_1.calculateAssemblyVotes)(assemblyId);
        res.json(results);
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
}));
assemblyRouter.get('/person/:personId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const personId = req.params.personId;
        const personLocations = yield (0, assemblyRepository_1.getAssemblyByPersonId)(personId);
        if (!personLocations) {
            return res.status(404).json({ error: 'No locations found for the user' });
        }
        res.status(200).json(personLocations);
    }
    catch (error) {
        console.error('Error fetching locations by user ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
assemblyRouter.get('/:assemblyId/survey', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { assemblyId } = req.params;
    try {
        const survey = yield index_1.prisma.survey.findMany({
            where: {
                assemblyId: assemblyId,
            },
            include: {
                questions: true,
            }
        });
        if (!survey) {
            return res.status(404).json({ error: 'Survey not found' });
        }
        res.status(200).json(survey);
    }
    catch (error) {
        console.error('Error fetching survey:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = assemblyRouter;
