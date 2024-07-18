"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationListValidation = exports.DonationUpdateValidation = exports.DonationValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation pour la création d'un don
exports.DonationValidation = joi_1.default.object({
    status: joi_1.default.string().required(),
    type: joi_1.default.string().required(),
    paymentMethod: joi_1.default.string().required(),
    message: joi_1.default.string().optional(),
    renewalDate: joi_1.default.date().optional(),
    amount: joi_1.default.number().required(),
    transactionDate: joi_1.default.date().required(),
    renewalFrequency: joi_1.default.number().required(),
});
// Validation pour la mise à jour d'un don
exports.DonationUpdateValidation = joi_1.default.object({
    status: joi_1.default.string().optional(),
    type: joi_1.default.string().optional(),
    paymentMethod: joi_1.default.string().optional(),
    message: joi_1.default.string().optional(),
    renewalDate: joi_1.default.date().optional(),
    amount: joi_1.default.number().optional(),
    transactionDate: joi_1.default.date().optional(),
    renewalFrequency: joi_1.default.number().optional(),
});
// Validation pour la liste des dons
exports.DonationListValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
});
exports.default = {
    DonationValidation: exports.DonationValidation,
    DonationUpdateValidation: exports.DonationUpdateValidation,
    DonationListValidation: exports.DonationListValidation,
};
