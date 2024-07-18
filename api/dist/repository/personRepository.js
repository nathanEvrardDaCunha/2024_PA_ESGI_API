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
exports.deletePersonById = exports.loginAdmin = exports.loginUser = exports.registerUser = exports.updatePerson = exports.createPerson = exports.getPersonById = exports.getAllPerson = void 0;
const index_1 = require("../index");
const bcrypt_1 = require("bcrypt");
const auth_middleware_1 = require("../handlers/middleware/auth-middleware");
function getAllPerson() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.person.findMany();
        }
        catch (error) {
            console.error('Error fetching persons:', error);
            throw error;
        }
    });
}
exports.getAllPerson = getAllPerson;
function getPersonById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.person.findUnique({ where: { id } });
        }
        catch (error) {
            console.error('Error fetching person by ID:', error);
            throw error;
        }
    });
}
exports.getPersonById = getPersonById;
function createPerson(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.person.create({ data });
        }
        catch (error) {
            console.error('Error creating person:', error);
            throw error;
        }
    });
}
exports.createPerson = createPerson;
function updatePerson(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (data.password) {
                const hashedPassword = yield (0, bcrypt_1.hash)(data.password, 10);
                data.password = hashedPassword;
            }
            return yield index_1.prisma.person.update({
                where: { id },
                data,
            });
        }
        catch (error) {
            console.error('Error updating person:', error);
            throw error;
        }
    });
}
exports.updatePerson = updatePerson;
function registerUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hashedPassword = yield (0, bcrypt_1.hash)(data.password, 10);
            const personData = Object.assign(Object.assign({}, data), { password: hashedPassword });
            const personRepository = yield index_1.prisma.person.create({ data: personData });
            return { id: personRepository.id, email: personRepository.email, role: personRepository.role };
        }
        catch (error) {
            console.error("Error registering user:", error);
            throw error;
        }
    });
}
exports.registerUser = registerUser;
function loginUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const personRepository = yield index_1.prisma.person.findFirst({
                where: { email: data.email, role: "user" },
            });
            if (!personRepository) {
                throw new Error("Invalid user credentials");
            }
            const isValid = yield (0, bcrypt_1.compare)(data.password, personRepository.password);
            if (!isValid) {
                throw new Error("Invalid user credentials");
            }
            const token = yield (0, auth_middleware_1.generateToken)(personRepository.id);
            return { id: personRepository.id, token };
        }
        catch (error) {
            console.error("Error logging in user:", error);
            throw error;
        }
    });
}
exports.loginUser = loginUser;
function loginAdmin(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const adminRepository = yield index_1.prisma.person.findFirst({
                where: { email: data.email, role: "admin" },
            });
            if (!adminRepository) {
                throw new Error("Invalid admin credentials");
            }
            const isValid = yield (0, bcrypt_1.compare)(data.password, adminRepository.password);
            if (!isValid) {
                throw new Error("Invalid admin credentials");
            }
            const token = yield (0, auth_middleware_1.generateToken)(adminRepository.id);
            return { id: adminRepository.id, token };
        }
        catch (error) {
            console.error("Error logging in admin:", error);
            throw error;
        }
    });
}
exports.loginAdmin = loginAdmin;
function deletePersonById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deletedPerson = yield index_1.prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                // Delete session records
                yield prisma.session.deleteMany({ where: { personId: id } });
                // Delete or update related Donation records
                yield prisma.donation.deleteMany({ where: { personId: id } });
                yield prisma.membership.deleteMany({ where: { personId: id } });
                // Disconnect the Person record from other related records
                yield prisma.person.update({
                    where: { id },
                    data: {
                        generalAssembly: { disconnect: [] },
                        equipment: { disconnect: [] },
                        task: { disconnect: [] },
                        location: { disconnect: true },
                        choices: { disconnect: [] },
                    },
                });
                // Finally, delete the Person record
                const deletedPerson = yield prisma.person.delete({ where: { id } });
                return deletedPerson;
            }));
            return deletedPerson;
        }
        catch (error) {
            console.error('Error deleting person by ID:', error);
            throw error;
        }
    });
}
exports.deletePersonById = deletePersonById;
