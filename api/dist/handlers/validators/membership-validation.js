"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipListValidation = exports.MembershipUpdateValidation = exports.MembershipValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation pour la création d'une adhésion
exports.MembershipValidation = joi_1.default.object({
    joinDate: joi_1.default.date().required(),
    status: joi_1.default.string().required(),
    expiryDate: joi_1.default.date().required(),
    accessLevel: joi_1.default.string().required(),
    fees: joi_1.default.number().required(),
    renewalDate: joi_1.default.date().optional(),
    type: joi_1.default.string().required(),
    paymentMethod: joi_1.default.string().required(),
    renewalFrequency: joi_1.default.number().required(),
});
// Validation pour la mise à jour d'une adhésion
exports.MembershipUpdateValidation = joi_1.default.object({
    joinDate: joi_1.default.date().optional(),
    status: joi_1.default.string().optional(),
    expiryDate: joi_1.default.date().optional(),
    accessLevel: joi_1.default.string().optional(),
    fees: joi_1.default.number().optional(),
    renewalDate: joi_1.default.date().optional(),
    type: joi_1.default.string().optional(),
    paymentMethod: joi_1.default.string().optional(),
    renewalFrequency: joi_1.default.number().optional(),
});
// Validation pour la liste des adhésions
exports.MembershipListValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
});
exports.default = {
    MembershipValidation: exports.MembershipValidation,
    MembershipUpdateValidation: exports.MembershipUpdateValidation,
    MembershipListValidation: exports.MembershipListValidation,
};
