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
const topicRepository_1 = require("../repository/topicRepository");
const topic_validation_1 = require("./validators/topic-validation");
const topicRouter = express_1.default.Router();
topicRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const topics = yield (0, topicRepository_1.getAllTopic)();
        res.status(200).json(topics);
    }
    catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
topicRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const topic = yield (0, topicRepository_1.getTopicById)(req.params.id);
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        res.status(200).json(topic);
    }
    catch (error) {
        console.error('Error fetching topic by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
topicRouter.post("/:topicId/next-round-or-end", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { topicId } = req.params;
    try {
        yield (0, topicRepository_1.proceedToNextRoundOrEndVoting)(topicId);
        res.status(200).json({ message: "Processed successfully." });
    }
    catch (error) {
        console.error("Error processing next round or end voting:", error);
        res.status(500).json({ error: "Failed to process next round or end voting." });
    }
}));
topicRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    const { error, value } = topic_validation_1.TopicValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const topicRequest = value;
    try {
        const newTopic = yield (0, topicRepository_1.createTopic)(topicRequest);
        res.status(201).json(newTopic);
    }
    catch (error) {
        console.error('Error creating topic:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
topicRouter.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: Check all argument validation
    // TODO: Write the service rules
    try {
        const { id } = req.params;
        const updatedTopic = yield (0, topicRepository_1.updateTopic)(id, req.body);
        if (!updatedTopic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        res.status(200).json(updatedTopic);
    }
    catch (error) {
        console.error('Error updating topic:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
topicRouter.post('/:topicId/vote', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { topicId } = req.params;
        const { choiceId, personId } = req.body;
        const result = yield (0, topicRepository_1.submitVote)(personId, topicId, choiceId);
        res.json(result);
    }
    catch (error) {
        console.error('Failed to submit vote:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
topicRouter.get('/:topicId/results', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { topicId } = req.params;
    try {
        const results = yield (0, topicRepository_1.calculateVotes)(topicId);
        res.json(results);
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
}));
topicRouter.post('/vote', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { personId, topicId, choiceId } = req.body;
        const vote = yield (0, topicRepository_1.submitVote)(personId, topicId, choiceId);
        res.json(vote);
    }
    catch (error) {
        res.status(500).json({ error: 'Error submitting vote' });
    }
}));
exports.default = topicRouter;
