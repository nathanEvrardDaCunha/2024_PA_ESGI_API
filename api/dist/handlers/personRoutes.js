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
const personRepository_1 = require("../repository/personRepository");
const person_validation_1 = require("./validators/person-validation");
const personRouter = express_1.default.Router();
const generate_validation_message_1 = require("./validators/generate-validation-message");
personRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const persons = yield (0, personRepository_1.getAllPerson)();
        res.status(200).json(persons);
    }
    catch (error) {
        console.error('Error fetching persons:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
personRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const person = yield (0, personRepository_1.getPersonById)(req.params.id);
        if (!person) {
            return res.status(404).json({ error: 'Person not found' });
        }
        res.status(200).json(person);
    }
    catch (error) {
        console.error('Error fetching person by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
personRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const newPerson = yield (0, personRepository_1.createPerson)(req.body);
        res.status(201).json(newPerson);
    }
    catch (error) {
        console.error('Error creating person:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
personRouter.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: Check all argument validation
    // TODO: Write the service rules
    try {
        const validationResult = person_validation_1.PersonUpdateValidation.validate(req.body);
        if (validationResult.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
            return;
        }
        const { id } = req.params;
        const updateData = req.body;
        const updatedPerson = yield (0, personRepository_1.updatePerson)(id, updateData);
        if (!updatedPerson) {
            return res.status(404).json({ error: 'Person not found' });
        }
        res.status(200).json(updatedPerson);
    }
    catch (error) {
        console.error('Error updating person:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
personRouter.post("/auth/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = person_validation_1.PersonValidation.validate(req.body);
        if (validationResult.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
            return;
        }
        const personRequest = validationResult.value;
        const result = yield (0, personRepository_1.registerUser)(personRequest);
        res.status(201).send(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}));
personRouter.post("/auth/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = person_validation_1.LoginPersonValidation.validate(req.body);
        if (validationResult.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
            return;
        }
        const loginRequest = validationResult.value;
        const result = yield (0, personRepository_1.loginUser)(loginRequest);
        res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}));
personRouter.post("/admin/auth/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = person_validation_1.LoginPersonValidation.validate(req.body);
        if (validationResult.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
            return;
        }
        const loginRequest = validationResult.value;
        const result = yield (0, personRepository_1.loginAdmin)(loginRequest);
        res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}));
personRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedPerson = yield (0, personRepository_1.deletePersonById)(id);
        if (deletedPerson) {
            res.sendStatus(204); // Successful deletion, no content to send back
        }
        else {
            res.sendStatus(404); // Person not found
        }
    }
    catch (error) {
        console.error('Error deleting person:', error);
        res.sendStatus(500); // Internal Server Error
    }
}));
personRouter.delete('/admin/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedPerson = yield (0, personRepository_1.deletePersonById)(id);
        if (deletedPerson) {
            res.sendStatus(204); // Successful deletion, no content to send back
        }
        else {
            res.sendStatus(404); // Person not found
        }
    }
    catch (error) {
        console.error('Error deleting person:', error);
        res.sendStatus(500); // Internal Server Error
    }
}));
exports.default = personRouter;
