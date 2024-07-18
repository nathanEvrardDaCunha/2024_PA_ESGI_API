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
exports.getDocumentsByFolderPath = void 0;
const express_1 = __importDefault(require("express"));
const documentRepository_1 = require("../repository/documentRepository");
const index_1 = require("../index");
const document_validation_1 = require("./validators/document-validation");
const auth_middleware_1 = require("./middleware/auth-middleware");
const documentRouter = express_1.default.Router();
function checkPermissions(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let userId = req.userId;
        const documentId = req.params.id;
        const document = yield index_1.prisma.document.findUnique({
            where: { id: documentId },
            include: { groups: { include: { members: true } }, author: true },
        });
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        const isAuthorized = document.authorId === userId || document.groups.some(group => group.members.some(member => member.personId === userId));
        if (isAuthorized) {
            next();
        }
        else {
            res.status(403).json({ error: 'Access denied' });
        }
    });
}
documentRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const document = yield (0, documentRepository_1.getAllDocument)();
        res.status(200).json(document);
    }
    catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
const getDocumentsByFolderPath = (userId, folderPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const personDocuments = yield index_1.prisma.personDocument.findMany({
            where: {
                personId: userId,
                path: {
                    startsWith: folderPath,
                },
            },
            include: {
                document: true,
            },
        });
        const documents = personDocuments.map(pd => ({
            id: pd.document.id,
            title: pd.document.title,
            creationDate: pd.document.creationDate,
            lastModified: pd.document.lastModified,
            type: pd.document.type,
            description: pd.document.description,
            accessLevel: pd.document.accessLevel,
            version: pd.document.version,
            status: pd.document.status,
            fileUrl: pd.document.fileUrl,
            authorId: pd.document.authorId,
            path: pd.path, // Include the path from PersonDocument
        }));
        for (const doc of documents) {
            console.log(" folderPath:" + folderPath + " document:" + doc.path);
            //	folderPath:/new document:/new/doc2
            //  folderPath:/new document:/new/maj2/doc2
        }
        return documents;
    }
    catch (error) {
        console.error('Error fetching documents:', error);
        throw new Error('Could not fetch documents');
    }
});
exports.getDocumentsByFolderPath = getDocumentsByFolderPath;
documentRouter.get('/folder/:folderPath/download', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { folderPath } = req.params;
        const decodedFolderPath = decodeURIComponent(folderPath);
        const userId = req.headers['user-id']; // Assuming userId is passed in headers
        console.log(`Download request for folder: ${decodedFolderPath} by user: ${userId}`);
        const documents = yield (0, exports.getDocumentsByFolderPath)(userId, decodedFolderPath);
        yield (0, documentRepository_1.createZipFromDocuments)(documents, res, decodedFolderPath.split('/').pop());
    }
    catch (error) {
        console.error('Error downloading folder:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
documentRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const validationResult = document_validation_1.DocumentValidation.validate(req.body);
    if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.details[0].message });
    }
    try {
        const documentRequest = validationResult.value;
        console.log(documentRequest);
        const newDocument = yield (0, documentRepository_1.createDocument)(documentRequest);
        res.status(201).json(newDocument);
    }
    catch (error) {
        console.error('Error creating document:', error);
        if (error instanceof Error) {
            console.error('Error creating document:', error.message);
            if (error.message === 'Missing required fields') {
                res.status(400).json({ error: 'Missing required fields' });
            }
            else {
                res.status(500).json({ error: 'Internal Server Error', message: error.message });
            }
        }
        else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}));
documentRouter.get('/user/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const documents = yield (0, documentRepository_1.getDocumentsByUser)(userId);
        res.status(200).json(documents);
    }
    catch (error) {
        console.error('Error fetching user documents:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route pour accéder à un document avec vérification des permissions
documentRouter.get('/:id', auth_middleware_1.authenticateUser, checkPermissions, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userId = req.userId;
    const { error } = document_validation_1.DocumentValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const documentId = req.params.id;
    try {
        const document = yield index_1.prisma.document.findUnique({ where: { id: documentId } });
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.status(200).json(document);
    }
    catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
documentRouter.patch('/:documentId/path', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: Check all argument validation
    // TODO: Write the service rules
    try {
        const { documentId } = req.params;
        const { personId, path } = req.body;
        console.log(documentId);
        const updatedDocument = yield (0, documentRepository_1.updatePersonDocument)(documentId, personId, path);
        if (!updatedDocument) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.status(200).json(updatedDocument);
    }
    catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
documentRouter.patch('/folders/:path(*)', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { path } = req.params;
    const { newPath } = req.body;
    if (!newPath) {
        return res.status(400).json({ error: 'New path is required' });
    }
    try {
        yield (0, documentRepository_1.updateFolderPaths)(path, newPath);
        res.status(200).json({ message: 'Folder paths updated successfully' });
    }
    catch (error) {
        console.error('Error updating folder paths:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
documentRouter.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: Check all argument validation
    // TODO: Write the service rules
    try {
        const { id } = req.params;
        const updatedDocument = yield (0, documentRepository_1.updateDocument)(id, req.body);
        if (!updatedDocument) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.status(200).json(updatedDocument);
    }
    catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = documentRouter;
