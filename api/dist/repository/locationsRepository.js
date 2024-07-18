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
exports.deleteLocation = exports.isLocationUsed = exports.findLocationByUserId = exports.updateLocation = exports.createBusinessLocation = exports.createLocation = exports.findPersonByEmail = exports.updateLocationByPersonId = exports.getLocationByPersonId = exports.getLocationById = exports.getAllLocation = void 0;
const index_1 = require("../index");
function getAllLocation() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.location.findMany();
        }
        catch (error) {
            console.error('Error fetching locations:', error);
            throw error;
        }
    });
}
exports.getAllLocation = getAllLocation;
function getLocationById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.location.findUnique({ where: { id } });
        }
        catch (error) {
            console.error('Error fetching location by ID:', error);
            throw error;
        }
    });
}
exports.getLocationById = getLocationById;
const getLocationByPersonId = (personId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Utiliser Prisma pour trouver la localisation de l'utilisateur
        const person = yield index_1.prisma.person.findUnique({
            where: {
                id: personId,
            },
            include: {
                location: true, // Inclure les informations de localisation pour l'utilisateur
            },
        });
        if (!person) {
            throw new Error('User not found');
        }
        // Récupérer la localisation associée à l'utilisateur
        const personLocation = person.location;
        return personLocation;
    }
    catch (error) {
        // Gérer les erreurs
        throw new Error(`Error fetching locations by user ID: ${error}`);
    }
});
exports.getLocationByPersonId = getLocationByPersonId;
const updateLocationByPersonId = (personId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Utiliser Prisma pour trouver la localisation de l'utilisateur
        const person = yield index_1.prisma.person.update({
            where: {
                id: personId
            },
            data: {
                location: {
                    update: data,
                }
            },
            include: {
                location: true, // Inclure les informations de localisation pour l'utilisateur
            },
        });
        if (!person) {
            throw new Error('User not found');
        }
        // Récupérer la localisation associée à l'utilisateur
        const personLocation = person.location;
        return personLocation;
    }
    catch (error) {
        // Gérer les erreurs
        throw new Error(`Error fetching locations by user ID: ${error}`);
    }
});
exports.updateLocationByPersonId = updateLocationByPersonId;
function findPersonByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.person.findUnique({ where: { email } });
        }
        catch (error) {
            console.error('Error finding person by email:', error);
            throw error;
        }
    });
}
exports.findPersonByEmail = findPersonByEmail;
function createLocation(data, email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const person = yield findPersonByEmail(email);
            if (!person) {
                throw new Error('Person not found');
            }
            const existingLocation = yield index_1.prisma.location.findFirst({
                where: {
                    address: data.address,
                    postalCode: data.postalCode,
                    country: data.country,
                },
            });
            if (existingLocation) {
                // Connect the user to the existing location
                yield index_1.prisma.location.update({
                    where: { id: existingLocation.id },
                    data: {
                        person: {
                            connect: { id: person.id },
                        },
                    },
                });
                return existingLocation;
            }
            else {
                // Create a new location and add the user to it
                const newLocation = yield index_1.prisma.location.create({
                    data: Object.assign(Object.assign({}, data), { person: {
                            connect: { id: person.id },
                        } }),
                });
                return newLocation;
            }
        }
        catch (error) {
            console.error('Error creating location:', error);
            throw error;
        }
    });
}
exports.createLocation = createLocation;
function createBusinessLocation(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existingLocation = yield index_1.prisma.location.findFirst({
                where: {
                    address: data.address,
                    postalCode: data.postalCode,
                    country: data.country,
                },
            });
            if (existingLocation) {
                const updatedLocation = yield index_1.prisma.location.update({
                    where: { id: existingLocation.id },
                    data: Object.assign({}, data),
                });
                return updatedLocation;
            }
            else {
                const newLocation = yield index_1.prisma.location.create({
                    data: Object.assign({}, data),
                });
                return newLocation;
            }
        }
        catch (error) {
            console.error('Error creating business location:', error);
            throw error;
        }
    });
}
exports.createBusinessLocation = createBusinessLocation;
function updateLocation(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.location.update({
                where: { id },
                data,
            });
        }
        catch (error) {
            console.error('Error updating location:', error);
            throw error;
        }
    });
}
exports.updateLocation = updateLocation;
function findLocationByUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const person = yield index_1.prisma.person.findUnique({
                where: {
                    id: userId,
                },
                include: {
                    location: true,
                },
            });
            if (!person) {
                return null;
            }
            return person.location;
        }
        catch (error) {
            console.error('Error finding location by user ID:', error);
            throw error;
        }
    });
}
exports.findLocationByUserId = findLocationByUserId;
function isLocationUsed(locationId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isUsedByPerson = yield index_1.prisma.person.findFirst({
                where: { locationId },
            });
            const isUsedByActivity = yield index_1.prisma.activity.findFirst({
                where: { location: { some: { id: locationId } } },
            });
            const isUsedByEquipment = yield index_1.prisma.equipment.findFirst({
                where: { location: { some: { id: locationId } } },
            });
            return !!(isUsedByPerson || isUsedByActivity || isUsedByEquipment);
        }
        catch (error) {
            console.error('Error checking location usage:', error);
            throw error;
        }
    });
}
exports.isLocationUsed = isLocationUsed;
function deleteLocation(locationId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield index_1.prisma.location.delete({
                where: { id: locationId },
            });
        }
        catch (error) {
            console.error('Error deleting location:', error);
            throw error;
        }
    });
}
exports.deleteLocation = deleteLocation;
