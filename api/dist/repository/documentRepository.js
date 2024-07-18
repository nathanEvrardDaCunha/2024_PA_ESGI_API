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
exports.updatePersonDocument = exports.updateDocument = exports.createZipFromDocuments = exports.updateFolderPaths = exports.createPersonDocumentsFromGroup = exports.createDocument = exports.addDocumentToGroup = exports.getDocumentsByUser = exports.getDocumentById = exports.getAllDocument = void 0;
const archiver_1 = __importDefault(require("archiver"));
const axios_1 = __importDefault(require("axios"));
const index_1 = require("../index");
function getAllDocument() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.document.findMany();
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Error fetching documents:', error.message);
            }
            else {
                console.error('Error fetching documents:', error);
            }
            throw error;
        }
    });
}
exports.getAllDocument = getAllDocument;
function getDocumentById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.document.findUnique({ where: { id } });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Error fetching document by ID:', error.message);
            }
            else {
                console.error('Error fetching document by ID:', error);
            }
            throw error;
        }
    });
}
exports.getDocumentById = getDocumentById;
/*
export async function getDocumentsByUser(userId: string) {
    try {
        // Récupérer les documents créés par l'utilisateur
        const createdDocuments = await prisma.document.findMany({
            where: { authorId: userId },
        });

        // Récupérer les groupes auxquels l'utilisateur appartient
        const userGroups = await prisma.groupMembership.findMany({
            where: { personId: userId },
            select: { groupId: true },
        });

        const groupIds = userGroups.map((membership) => membership.groupId);

        // Récupérer les documents associés aux groupes de l'utilisateur
        const groupDocuments = await prisma.document.findMany({
            where: {
                groups: {
                    some: { id: { in: groupIds } },
                },
            },
        });

        // Combiner les documents créés et ceux des groupes
        const allDocuments = [...createdDocuments, ...groupDocuments];

        // Supprimer les doublons (au cas où un document est à la fois créé et attribué via un groupe)
        const uniqueDocuments = allDocuments.filter(
            (doc, index, self) => index === self.findIndex((d) => d.id === doc.id)
        );

        return uniqueDocuments;
    } catch (error) {
        console.error('Error fetching documents by user:', error);
        throw error;
    }
}*/
function getDocumentsByUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Récupérer les documents créés par l'utilisateur
            const createdDocuments = yield index_1.prisma.document.findMany({
                where: { authorId: userId },
                include: {
                    accessors: {
                        where: { personId: userId },
                        select: { path: true },
                    },
                },
            });
            // Récupérer les groupes auxquels l'utilisateur appartient
            const userGroups = yield index_1.prisma.groupMembership.findMany({
                where: { personId: userId },
                select: { groupId: true },
            });
            const groupIds = userGroups.map((membership) => membership.groupId);
            // Récupérer les documents associés aux groupes de l'utilisateur
            const groupDocuments = yield index_1.prisma.document.findMany({
                where: {
                    groups: {
                        some: { id: { in: groupIds } },
                    },
                },
                include: {
                    accessors: {
                        where: { personId: userId },
                        select: { path: true },
                    },
                },
            });
            // Combiner les documents créés et ceux des groupes
            const allDocuments = [...createdDocuments, ...groupDocuments];
            // Supprimer les doublons (au cas où un document est à la fois créé et attribué via un groupe)
            const uniqueDocuments = allDocuments.filter((doc, index, self) => index === self.findIndex((d) => d.id === doc.id));
            // Ajouter le path au document
            const documentsWithPath = uniqueDocuments.map(doc => {
                var _a;
                return (Object.assign(Object.assign({}, doc), { path: ((_a = doc.accessors[0]) === null || _a === void 0 ? void 0 : _a.path) || '' }));
            });
            return documentsWithPath;
        }
        catch (error) {
            console.error('Error fetching documents by user:', error);
            throw error;
        }
    });
}
exports.getDocumentsByUser = getDocumentsByUser;
function addDocumentToGroup(groupId, documentId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.group.update({
                where: { id: groupId },
                data: {
                    documents: {
                        connect: { id: documentId },
                    },
                },
            });
        }
        catch (error) {
            console.error('Error adding document to group:', error);
            throw error;
        }
    });
}
exports.addDocumentToGroup = addDocumentToGroup;
function createDocument(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, description, fileUrl, type, authorId } = data;
        if (!title || !description || !fileUrl || !type || !authorId) {
            throw new Error('Missing required fields');
        }
        const documentData = {
            title: title + "." + type,
            description,
            fileUrl,
            type,
            author: { connect: { id: authorId } },
            creationDate: new Date(),
            lastModified: new Date(),
            status: 'active',
            accessLevel: 'private',
            version: 1,
        };
        try {
            const document = yield index_1.prisma.document.create({ data: documentData });
            // Créer une entrée PersonDocument pour l'auteur
            const path = `/documents/`; // Chemin basé sur l'ID du document, peut être ajusté selon les besoins
            yield index_1.prisma.personDocument.create({
                data: {
                    personId: authorId,
                    documentId: document.id,
                    path: path,
                },
            });
            return document;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Error creating document:', error.message);
            }
            else {
                console.error('Error creating document:', error);
            }
            throw error;
        }
    });
}
exports.createDocument = createDocument;
function createPersonDocumentsFromGroup(groupId, documentId, path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const groupMembers = yield index_1.prisma.groupMembership.findMany({
                where: { groupId: groupId },
                include: { person: true },
            });
            const personDocuments = groupMembers.map(member => ({
                personId: member.personId,
                documentId: documentId,
                path: path,
            }));
            const createdPersonDocuments = yield index_1.prisma.personDocument.createMany({
                data: personDocuments,
                skipDuplicates: true, // ignore doublon
            });
            console.log(`Created ${createdPersonDocuments.count} PersonDocument entries.`);
        }
        catch (error) {
            console.error('Error creating PersonDocument entries:', error);
        }
        finally {
            yield index_1.prisma.$disconnect();
        }
    });
}
exports.createPersonDocumentsFromGroup = createPersonDocumentsFromGroup;
function updateFolderPaths(oldPath, newPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const documents = yield index_1.prisma.personDocument.findMany({
            where: {
                path: {
                    startsWith: oldPath,
                },
            },
        });
        for (const doc of documents) {
            const updatedPath = doc.path.replace(oldPath, newPath);
            yield index_1.prisma.personDocument.updateMany({
                where: { documentId: doc.documentId, personId: doc.personId },
                data: { path: updatedPath },
            });
        }
    });
}
exports.updateFolderPaths = updateFolderPaths;
;
const addFilesToArchive = (archive, documents, rootFolder) => __awaiter(void 0, void 0, void 0, function* () {
    const addedFiles = []; // Array to track added files
    for (const doc of documents) {
        if (!doc.fileUrl) {
            console.warn(`Document ${doc.title} does not have a fileUrl`);
            continue;
        }
        const response = yield axios_1.default.get(doc.fileUrl, { responseType: 'stream' });
        // Remove the root folder from the path
        let relativePath = doc.path.replace(rootFolder, '');
        if (relativePath.startsWith('/')) {
            relativePath = relativePath.substring(1);
        }
        // Remove the initial folder part from the relative path to avoid nesting in the archive
        const pathParts = relativePath.split('/');
        pathParts.shift();
        relativePath = pathParts.join('/');
        // Adjust the file path to ensure the folder structure is maintained
        const filePath = relativePath ? `${relativePath}/${doc.title}` : `${doc.title}`;
        archive.append(response.data, { name: filePath });
        // Track the added file
        addedFiles.push(filePath);
    }
    // Debugging output to show the content of the archive
    console.log("Files added to archive:", addedFiles);
});
const createZipFromDocuments = (documents, res, rootFolder) => __awaiter(void 0, void 0, void 0, function* () {
    const archive = (0, archiver_1.default)('zip', {
        zlib: { level: 9 }
    });
    archive.on('error', function (err) {
        throw err;
    });
    res.attachment(`${rootFolder}.zip`);
    archive.pipe(res);
    yield addFilesToArchive(archive, documents, rootFolder);
    yield archive.finalize();
});
exports.createZipFromDocuments = createZipFromDocuments;
function updateDocument(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.document.update({
                where: { id },
                data,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Error updating document:', error.message);
            }
            else {
                console.error('Error updating document:', error);
            }
            throw error;
        }
    });
}
exports.updateDocument = updateDocument;
function updatePersonDocument(documentId, personId, path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.personDocument.updateMany({
                where: { documentId, personId },
                data: { path },
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Error updating document:', error.message);
            }
            else {
                console.error('Error updating document:', error);
            }
            throw error;
        }
    });
}
exports.updatePersonDocument = updatePersonDocument;
