import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { getActivityByPersonIdViaTask } from '../repository/activityRepository'; // Importer la fonction
import { getAssemblyByPersonId } from '../repository/assemblyRepository'; // Importer la fonction
import { getLocationByPersonId } from '../repository/locationsRepository'; // Importer la fonction
import { getTaskByPersonId } from '../repository/taskRepository';
import {getPersonById} from "../repository/personRepository"; // Importer la fonction

dotenv.config();

const chatbotRouter = express.Router();
const assistant_id = String(process.env.ASST_ID);

const pollRunStatus = async (threadId: string, runId: string) => {
    const pollInterval = 2000; // 2 seconds
    const maxAttempts = 30; // maximum 60 seconds

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'OpenAI-Beta': 'assistants=v2'
            }
        });

        if (!runResponse.ok) {
            const error = await runResponse.text();
            throw new Error(`Error polling run status: ${error}`);
        }

        const runData = await runResponse.json();
        console.log("Polling run status:", runData.status);

        if (runData.status === 'completed') {
            return runData;
        } else if (runData.status === 'failed' || runData.status === 'cancelled') {
            console.error("Run failed or cancelled:", runData.last_error);
            throw new Error(`Run ${runId} failed or was cancelled: ${JSON.stringify(runData.last_error)}`);
        }

        await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error(`Run ${runId} did not complete within the expected time`);
};

const extractTextContent = (content: { map: (arg0: (item: any) => any) => any[]; text: { value: any; }; }) => {
    if (Array.isArray(content)) {
        return content.map(item => item.text?.value || '').join(' ');
    }
    return content.text?.value || content;
};

const fetchDataForUser = async (personId: string) => {
    const [activities, assemblies, locations, tasks, person] = await Promise.all([
        getActivityByPersonIdViaTask(personId),
        getAssemblyByPersonId(personId),
        getLocationByPersonId(personId),
        getTaskByPersonId(personId),
        getPersonById(personId)
    ]);

    return {
        activities,
        assemblies,
        locations,
        tasks,
        person
    };
};

chatbotRouter.post('/open', async (req, res) => {
    try {
        const { message, personId } = req.body;

        if (!message || !personId) {
            return res.status(400).send({ error: "Message and personId are required" });
        }

        const userData = await fetchDataForUser(personId);

        const threadResponse = await fetch('https://api.openai.com/v1/threads', {
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
            const error = await threadResponse.text();
            console.error("Error creating thread:", error);
            return res.status(500).send({ error: "Error creating thread" });
        }

        const threadData = await threadResponse.json();
        console.log("Thread created:", threadData);
        const threadId = threadData.id;

        const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
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
            const error = await runResponse.text();
            console.error("Error creating run:", error);
            return res.status(500).send({ error: "Error creating run" });
        }

        const runData = await runResponse.json();
        console.log("Run created:", runData);

        try {
            const completedRunData = await pollRunStatus(threadId, runData.id);

            const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'OpenAI-Beta': 'assistants=v2'
                }
            });

            if (!messagesResponse.ok) {
                const error = await messagesResponse.text();
                console.error("Error fetching messages:", error);
                return res.status(500).send({ error: "Error fetching messages" });
            }

            const messages = await messagesResponse.json();
            console.log("Messages fetched:", messages);

            const assistantMessage = messages.data.find((msg: { role: string; }) => msg.role === 'assistant');
            const content = extractTextContent(assistantMessage?.content) || 'No response';

            res.status(200).json({ response: content, threadId });
        } catch (pollError) {
            console.error("Error polling run status:", pollError);
            res.status(500).send({ error: pollError });
        }
    } catch (err) {
        console.error("Error in /open route:", err);
        res.status(500).send({ error: err });
    }
});

chatbotRouter.post('/continue', async (req, res) => {
    try {
        const { message, threadId, personId } = req.body;

        if (!message || !threadId || !personId) {
            return res.status(400).send({ error: "Message, threadId, and personId are required" });
        }

        const userData = await fetchDataForUser(personId);

        const messageResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'OpenAI-Beta': 'assistants=v2'
            },
            body: JSON.stringify({ role: "user", content: message })
        });

        if (!messageResponse.ok) {
            const error = await messageResponse.text();
            console.error("Error sending message:", error);
            return res.status(500).send({ error: "Error sending message" });
        }

        const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
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
            const error = await runResponse.text();
            console.error("Error creating run:", error);
            return res.status(500).send({ error: "Error creating run" });
        }

        const runData = await runResponse.json();
        console.log("Run created:", runData);

        try {
            const completedRunData = await pollRunStatus(threadId, runData.id);

            const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'OpenAI-Beta': 'assistants=v2'
                }
            });

            if (!messagesResponse.ok) {
                const error = await messagesResponse.text();
                console.error("Error fetching messages:", error);
                return res.status(500).send({ error: "Error fetching messages" });
            }

            const messages = await messagesResponse.json();
            console.log("Messages fetched:", messages);

            const assistantMessage = messages.data.find((msg: { role: string; }) => msg.role === 'assistant');
            const content = extractTextContent(assistantMessage?.content) || 'No response';

            res.status(200).json({ response: content });
        } catch (pollError) {
            console.error("Error polling run status:", pollError);
            res.status(500).send({ error: pollError });
        }
    } catch (err) {
        console.error("Error in /continue route:", err);
        res.status(500).send({ error: err });
    }
});

export default chatbotRouter;
