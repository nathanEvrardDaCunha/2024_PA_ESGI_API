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
exports.updateDonation = exports.getDonationsByUserId = exports.createDonation = exports.getDonationById = exports.getAllDonation = void 0;
const index_1 = require("../index");
function getAllDonation() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.donation.findMany();
        }
        catch (error) {
            console.error('Error fetching donations:', error);
            throw error;
        }
    });
}
exports.getAllDonation = getAllDonation;
function getDonationById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.donation.findUnique({ where: { id } });
        }
        catch (error) {
            console.error('Error fetching donation by ID:', error);
            throw error;
        }
    });
}
exports.getDonationById = getDonationById;
function createDonation(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.donation.create({ data });
        }
        catch (error) {
            console.error('Error creating donation:', error);
            throw error;
        }
    });
}
exports.createDonation = createDonation;
// Fonction pour récupérer les donations par ID utilisateur
function getDonationsByUserId(personId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const donations = yield index_1.prisma.donation.findMany({
                where: {
                    personId: personId
                }
            });
            return donations;
        }
        catch (error) {
            console.error('Error fetching donations by user ID:', error);
            throw error;
        }
    });
}
exports.getDonationsByUserId = getDonationsByUserId;
function updateDonation(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedDonation = yield index_1.prisma.donation.update({
                where: { id },
                data,
            });
            return updatedDonation;
        }
        catch (error) {
            console.error('Error updating donation:', error);
            throw error;
        }
    });
}
exports.updateDonation = updateDonation;
