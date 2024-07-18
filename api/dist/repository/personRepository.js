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
exports.deletePersonById = exports.loginAdmin = exports.loginUser = exports.resetPassword = exports.registerUser = exports.updatePerson = exports.createPerson = exports.getPersonById = exports.getAllPerson = void 0;
const index_1 = require("../index");
const bcrypt_1 = require("bcrypt");
const auth_middleware_1 = require("../handlers/middleware/auth-middleware");
const nodemailer_1 = __importDefault(require("nodemailer"));
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
function resetPassword(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const person = yield index_1.prisma.person.findUnique({ where: { email } });
            if (!person) {
                throw new Error("User not found");
            }
            const temporaryPassword = generateTemporaryPassword();
            const hashedPassword = yield (0, bcrypt_1.hash)(temporaryPassword, 10);
            yield index_1.prisma.person.update({
                where: { email },
                data: { password: hashedPassword },
            });
            yield sendResetPasswordEmail(email, temporaryPassword);
        }
        catch (error) {
            console.error("Error resetting password:", error);
            throw error;
        }
    });
}
exports.resetPassword = resetPassword;
function generateTemporaryPassword() {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}
function sendResetPasswordEmail(email, temporaryPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create a transporter using Elastic Email
            const transporter = nodemailer_1.default.createTransport({
                host: "smtp.elasticemail.com",
                port: 2525,
                secure: false,
                auth: {
                    user: "zharksmail2@gmail.com",
                    pass: "9F3057339C068693F0201866AF0DBF99797F",
                },
            });
            // Compose the email message
            const mailOptions = {
                from: "zharksmail2@gmail.com",
                to: email,
                subject: "Password Reset",
                text: `Your temporary password is: ${temporaryPassword}`,
                html: `<p>Your temporary password is: <strong>${temporaryPassword}</strong></p>`,
            };
            // Send the email
            yield transporter.sendMail(mailOptions);
            console.log(`Reset password email sent to ${email}`);
        }
        catch (error) {
            console.error("Error sending reset password email:", error);
            throw error;
        }
    });
}
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
                yield prisma.session.deleteMany({ where: { personId: id } });
                yield prisma.donation.deleteMany({ where: { personId: id } });
                yield prisma.membership.deleteMany({ where: { personId: id } });
                yield prisma.document.deleteMany({ where: { authorId: id } });
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
