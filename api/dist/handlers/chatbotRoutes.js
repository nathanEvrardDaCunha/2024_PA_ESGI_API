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
const dotenv_1 = __importDefault(require("dotenv"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const activityRepository_1 = require("../repository/activityRepository"); // Importer la fonction
const assemblyRepository_1 = require("../repository/assemblyRepository"); // Importer la fonction
const locationsRepository_1 = require("../repository/locationsRepository"); // Importer la fonction
const taskRepository_1 = require("../repository/taskRepository");
const personRepository_1 = require("../repository/personRepository"); // Importer la fonction
dotenv_1.default.config();
const chatbotRouter = express_1.default.Router();
const assistant_id = String(process.env.ASST_ID);
const pollRunStatus = (threadId, runId) => __awaiter(void 0, void 0, void 0, function* () {
    const pollInterval = 2000; // 2 seconds
    const maxAttempts = 30; // maximum 60 seconds
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const runResponse = yield (0, node_fetch_1.default)(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'OpenAI-Beta': 'assistants=v2'
            }
        });
        if (!runResponse.ok) {
            const error = yield runResponse.text();
            throw new Error(`Error polling run status: ${error}`);
        }
        const runData = yield runResponse.json();
        console.log("Polling run status:", runData.status);
        if (runData.status === 'completed') {
            return runData;
        }
        else if (runData.status === 'failed' || runData.status === 'cancelled') {
            console.error("Run failed or cancelled:", runData.last_error);
            throw new Error(`Run ${runId} failed or was cancelled: ${JSON.stringify(runData.last_error)}`);
        }
        yield new Promise(resolve => setTimeout(resolve, pollInterval));
    }
    throw new Error(`Run ${runId} did not complete within the expected time`);
});
const extractTextContent = (content) => {
    var _a;
    if (Array.isArray(content)) {
        return content.map(item => { var _a; return ((_a = item.text) === null || _a === void 0 ? void 0 : _a.value) || ''; }).join(' ');
    }
    return ((_a = content.text) === null || _a === void 0 ? void 0 : _a.value) || content;
};
const fetchDataForUser = (personId) => __awaiter(void 0, void 0, void 0, function* () {
    const [activities, assemblies, locations, tasks, person] = yield Promise.all([
        (0, activityRepository_1.getActivityByPersonIdViaTask)(personId),
        (0, assemblyRepository_1.getAssemblyByPersonId)(personId),
        (0, locationsRepository_1.getLocationByPersonId)(personId),
        (0, taskRepository_1.getTaskByPersonId)(personId),
        (0, personRepository_1.getPersonById)(personId)
    ]);
    return {
        activities,
        assemblies,
        locations,
        tasks,
        person
    };
});
chatbotRouter.post('/open', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message, personId } = req.body;
        if (!message || !personId) {
            return res.status(400).send({ error: "Message and personId are required" });
        }
        const userData = yield fetchDataForUser(personId);
        const threadResponse = yield (0, node_fetch_1.default)('https://api.openai.com/v1/threads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'OpenAI-Beta': 'assistants=v2'
            },
            body: JSON.stringify({
                messages: [
                    { role: "user", content: message }
                ]
            })
        });
        if (!threadResponse.ok) {
            const error = yield threadResponse.text();
            console.error("Error creating thread:", error);
            return res.status(500).send({ error: "Error creating thread" });
        }
        const threadData = yield threadResponse.json();
        console.log("Thread created:", threadData);
        const threadId = threadData.id;
        const runResponse = yield (0, node_fetch_1.default)(`https://api.openai.com/v1/threads/${threadId}/runs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'OpenAI-Beta': 'assistants=v2'
            },
            body: JSON.stringify({
                assistant_id: assistant_id,
                instructions: `Essaye de répondre à la requête de l'utilisateur avec les données suivantes :
                               Données des activités : ${JSON.stringify(userData.activities)}
                               Données des assemblées : ${JSON.stringify(userData.assemblies)}
                               Données des localisations : ${JSON.stringify(userData.locations)}
                               Données des tâches : ${JSON.stringify(userData.tasks)}
                               Données de la personne : ${JSON.stringify(userData.person)}`
            })
        });
        if (!runResponse.ok) {
            const error = yield runResponse.text();
            console.error("Error creating run:", error);
            return res.status(500).send({ error: "Error creating run" });
        }
        const runData = yield runResponse.json();
        console.log("Run created:", runData);
        try {
            const completedRunData = yield pollRunStatus(threadId, runData.id);
            const messagesResponse = yield (0, node_fetch_1.default)(`https://api.openai.com/v1/threads/${threadId}/messages`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'OpenAI-Beta': 'assistants=v2'
                }
            });
            if (!messagesResponse.ok) {
                const error = yield messagesResponse.text();
                console.error("Error fetching messages:", error);
                return res.status(500).send({ error: "Error fetching messages" });
            }
            const messages = yield messagesResponse.json();
            console.log("Messages fetched:", messages);
            const assistantMessage = messages.data.find((msg) => msg.role === 'assistant');
            const content = extractTextContent(assistantMessage === null || assistantMessage === void 0 ? void 0 : assistantMessage.content) || 'No response';
            res.status(200).json({ response: content, threadId });
        }
        catch (pollError) {
            console.error("Error polling run status:", pollError);
            res.status(500).send({ error: pollError });
        }
    }
    catch (err) {
        console.error("Error in /open route:", err);
        res.status(500).send({ error: err });
    }
}));
chatbotRouter.post('/continue', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message, threadId, personId } = req.body;
        if (!message || !threadId || !personId) {
            return res.status(400).send({ error: "Message, threadId, and personId are required" });
        }
        const userData = yield fetchDataForUser(personId);
        const messageResponse = yield (0, node_fetch_1.default)(`https://api.openai.com/v1/threads/${threadId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'OpenAI-Beta': 'assistants=v2'
            },
            body: JSON.stringify({ role: "user", content: message })
        });
        if (!messageResponse.ok) {
            const error = yield messageResponse.text();
            console.error("Error sending message:", error);
            return res.status(500).send({ error: "Error sending message" });
        }
        const runResponse = yield (0, node_fetch_1.default)(`https://api.openai.com/v1/threads/${threadId}/runs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'OpenAI-Beta': 'assistants=v2'
            },
            body: JSON.stringify({
                assistant_id: assistant_id,
                instructions: `Répondre à la requête de l'utilisateur avec les données suivantes :
                               Données des activités : ${JSON.stringify(userData.activities)}
                               Données des assemblées : ${JSON.stringify(userData.assemblies)}
                               Données des localisations : ${JSON.stringify(userData.locations)}
                               Données des tâches : ${JSON.stringify(userData.tasks)}
                               Données de la personne : ${JSON.stringify(userData.person)}`
            })
        });
        if (!runResponse.ok) {
            const error = yield runResponse.text();
            console.error("Error creating run:", error);
            return res.status(500).send({ error: "Error creating run" });
        }
        const runData = yield runResponse.json();
        console.log("Run created:", runData);
        try {
            const completedRunData = yield pollRunStatus(threadId, runData.id);
            const messagesResponse = yield (0, node_fetch_1.default)(`https://api.openai.com/v1/threads/${threadId}/messages`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'OpenAI-Beta': 'assistants=v2'
                }
            });
            if (!messagesResponse.ok) {
                const error = yield messagesResponse.text();
                console.error("Error fetching messages:", error);
                return res.status(500).send({ error: "Error fetching messages" });
            }
            const messages = yield messagesResponse.json();
            console.log("Messages fetched:", messages);
            const assistantMessage = messages.data.find((msg) => msg.role === 'assistant');
            const content = extractTextContent(assistantMessage === null || assistantMessage === void 0 ? void 0 : assistantMessage.content) || 'No response';
            res.status(200).json({ response: content });
        }
        catch (pollError) {
            console.error("Error polling run status:", pollError);
            res.status(500).send({ error: pollError });
        }
    }
    catch (err) {
        console.error("Error in /continue route:", err);
        res.status(500).send({ error: err });
    }
}));
exports.default = chatbotRouter;
