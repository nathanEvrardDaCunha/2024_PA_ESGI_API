"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillListValidation = exports.BillUpdateValidation = exports.BillValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation pour la création d'une facture
exports.BillValidation = joi_1.default.object({
    transactionDate: joi_1.default.date().required(),
    amount: joi_1.default.number().required(),
    description: joi_1.default.string().required(),
    paymentMethod: joi_1.default.string().required(),
});
// Validation pour la mise à jour d'une facture
exports.BillUpdateValidation = joi_1.default.object({
    transactionDate: joi_1.default.date().optional(),
    amount: joi_1.default.number().optional(),
    description: joi_1.default.string().optional(),
    paymentMethod: joi_1.default.string().optional(),
});
// Validation pour la liste des factures
exports.BillListValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
});
exports.default = {
    BillValidation: exports.BillValidation,
    BillUpdateValidation: exports.BillUpdateValidation,
    BillListValidation: exports.BillListValidation,
};
