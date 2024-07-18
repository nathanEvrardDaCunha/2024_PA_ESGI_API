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
const equipmentsRepository_1 = require("../repository/equipmentsRepository");
const equipmentRouter = express_1.default.Router();
equipmentRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const equipments = yield (0, equipmentsRepository_1.getAllEquipment)();
        res.status(200).json(equipments);
    }
    catch (error) {
        console.error('Error fetching equipments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
equipmentRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const equipment = yield (0, equipmentsRepository_1.getEquipmentById)(req.params.id);
        if (!equipment) {
            return res.status(404).json({ error: 'Equipment not found' });
        }
        res.status(200).json(equipment);
    }
    catch (error) {
        console.error('Error fetching equipment by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
equipmentRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const newEquipment = yield (0, equipmentsRepository_1.createEquipment)(req.body);
        res.status(201).json(newEquipment);
    }
    catch (error) {
        console.error('Error creating equipment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
equipmentRouter.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: Check all argument validation
    // TODO: Write the service rules
    try {
        const { id } = req.params;
        const updatedEquipment = yield (0, equipmentsRepository_1.updateEquipment)(id, req.body);
        if (!updatedEquipment) {
            return res.status(404).json({ error: 'Equipment not found' });
        }
        res.status(200).json(updatedEquipment);
    }
    catch (error) {
        console.error('Error updating equipment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = equipmentRouter;
