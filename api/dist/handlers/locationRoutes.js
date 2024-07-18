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
const locationsRepository_1 = require("../repository/locationsRepository");
const location_validation_1 = require("./validators/location-validation");
const generate_validation_message_1 = require("./validators/generate-validation-message");
const index_1 = require("../index");
const locationRouter = express_1.default.Router();
locationRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const locations = yield (0, locationsRepository_1.getAllLocation)();
        res.status(200).json(locations);
    }
    catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
locationRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const location = yield (0, locationsRepository_1.getLocationById)(req.params.id);
        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }
        res.status(200).json(location);
    }
    catch (error) {
        console.error('Error fetching location by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route pour obtenir une localisation par l'ID de l'utilisateur
locationRouter.get('/person/:personId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const personId = req.params.personId;
        const personLocations = yield (0, locationsRepository_1.getLocationByPersonId)(personId);
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
locationRouter.patch('/person/:personId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = location_validation_1.LocationUpdateValidation.validate(req.body);
        if (validationResult.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
            return;
        }
        const personId = req.params.personId;
        const updateData = req.body;
        const updatedLocation = (0, locationsRepository_1.updateLocationByPersonId)(personId, updateData);
        if (!updatedLocation) {
            return res.status(404).json({ error: 'Person not found' });
        }
        res.status(200).json(updatedLocation);
    }
    catch (error) {
        console.error('Error updating user location:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
locationRouter.post('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const locationData = {
            address: req.body.address,
            country: req.body.country,
            city: req.body.city,
            postalCode: req.body.postalCode,
            type: req.body.type,
            capacity: req.body.capacity,
            status: req.body.status,
        };
        const newLocation = yield (0, locationsRepository_1.createLocation)(locationData, email);
        res.status(201).json(newLocation);
    }
    catch (error) {
        console.error('Error creating locations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
locationRouter.patch('/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const updatedLocation = req.body;
    try {
        // Find the location associated with the user ID
        const location = yield (0, locationsRepository_1.findLocationByUserId)(userId);
        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }
        // Update the location with the provided data
        const updatedLocationData = yield index_1.prisma.location.update({
            where: {
                id: location.id,
            },
            data: updatedLocation,
        });
        res.status(200).json(updatedLocationData);
    }
    catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
locationRouter.post('/business', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const locationData = {
            address: req.body.address,
            country: req.body.country,
            city: req.body.city,
            postalCode: req.body.postalCode,
            type: req.body.type,
            capacity: req.body.capacity,
            status: req.body.status,
        };
        const newLocation = yield (0, locationsRepository_1.createBusinessLocation)(locationData);
        res.status(201).json(newLocation);
    }
    catch (error) {
        console.error('Error creating business location:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
locationRouter.delete('/location/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const locationId = req.params.id;
        const isUsed = yield (0, locationsRepository_1.isLocationUsed)(locationId);
        if (isUsed) {
            return res.status(400).json({ error: 'Cannot delete location as it is still in use' });
        }
        yield (0, locationsRepository_1.deleteLocation)(locationId);
        res.status(200).json({ message: 'Location deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting location:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = locationRouter;
