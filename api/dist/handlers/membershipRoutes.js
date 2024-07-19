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
const membershipRepository_1 = require("../repository/membershipRepository");
const stripe_1 = __importDefault(require("stripe"));
const date_fns_1 = require("date-fns");
const index_1 = require("../index");
const pdfkit_1 = __importDefault(require("pdfkit"));
const membershipRouter = express_1.default.Router();
const stripe = new stripe_1.default('sk_test_51PAYakGNSIKaQBU9pSy67gIi627DV10OYHHc5lr7TnZptVISScLpgqc0nQfKqA5nTo9PqourKhyUr8gdJ6eujseE00p0hZIgZ2');
membershipRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const memberships = yield (0, membershipRepository_1.getAllMembership)();
        res.status(200).json(memberships);
    }
    catch (error) {
        console.error('Error fetching memberships:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
membershipRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const membership = yield (0, membershipRepository_1.getMembershipById)(req.params.id);
        if (!membership) {
            return res.status(404).json({ error: 'Person not found' });
        }
        res.status(200).json(membership);
    }
    catch (error) {
        console.error('Error fetching membership by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
membershipRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const newLocation = yield (0, membershipRepository_1.createMembership)(req.body);
        res.status(201).json(newLocation);
    }
    catch (error) {
        console.error('Error creating memberships:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
membershipRouter.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: Check all argument validation
    // TODO: Write the service rules
    try {
        const { id } = req.params;
        const updatedMembership = yield (0, membershipRepository_1.updateMembership)(id, req.body);
        if (!updatedMembership) {
            return res.status(404).json({ error: 'Membership not found' });
        }
        res.status(200).json(updatedMembership);
    }
    catch (error) {
        console.error('Error updating membership:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
membershipRouter.post('/create-checkout-session', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, userId, type, paymentMethod, renewalFrequency } = req.body;
    try {
        const existingMembership = yield index_1.prisma.membership.findFirst({
            where: {
                personId: userId,
                status: 'active'
            },
        });
        if (existingMembership) {
            return res.status(400).json({ error: 'User already has an active membership.' });
        }
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'Membership',
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://185.216.27.210:3001/membership-success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://185.216.27.210:3001/membership',
            metadata: {
                userId,
                type,
                paymentMethod,
                renewalFrequency: renewalFrequency.toString(),
            },
        });
        res.status(200).json({ id: session.id, url: session.url });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while creating the checkout session' });
    }
}));
membershipRouter.post('/membership-success', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { session_id } = req.body;
    if (!session_id || typeof session_id !== 'string') {
        return res.status(400).json({ error: 'Invalid session ID' });
    }
    try {
        const session = yield stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status !== 'paid') {
            return res.status(400).json({ error: 'Payment not completed' });
        }
        const metadata = session.metadata;
        if (!metadata.userId || !metadata.type || !metadata.paymentMethod || !metadata.renewalFrequency) {
            return res.status(400).json({ error: 'Invalid metadata' });
        }
        const existingMembership = yield index_1.prisma.membership.findUnique({
            where: { personId: metadata.userId },
        });
        if (existingMembership) {
            return res.status(200).json({ message: 'Membership already exists', membership: existingMembership });
        }
        const joinDate = new Date();
        const expiryDate = (0, date_fns_1.addMonths)(joinDate, parseInt(metadata.renewalFrequency));
        const membership = yield index_1.prisma.membership.create({
            data: {
                joinDate,
                status: 'active',
                expiryDate,
                accessLevel: 'normal user',
                fees: session.amount_total ? session.amount_total / 100 : 0,
                renewalFrequency: parseInt(metadata.renewalFrequency),
                type: metadata.type,
                paymentMethod: metadata.paymentMethod,
                url: (_a = session.url) !== null && _a !== void 0 ? _a : 'default_url',
                person: {
                    connect: { id: metadata.userId },
                },
            },
        });
        res.status(200).json({ message: 'Membership created successfully', membership });
    }
    catch (err) {
        console.error('Error processing membership:', err);
        res.status(500).json({ error: 'An error occurred while processing the membership', details: err });
    }
}));
membershipRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const membership = yield index_1.prisma.membership.findUnique({ where: { id } });
        if (!membership) {
            return res.status(404).json({ error: 'Membership not found' });
        }
        yield index_1.prisma.membership.delete({ where: { id } });
        res.status(200).json({ message: 'Membership deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting membership:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
membershipRouter.get('/user/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const memberships = yield (0, membershipRepository_1.getMembershipsByUserId)(userId);
        if (memberships.length === 0) {
            return res.status(404).json({ error: 'No memberships found for the user' });
        }
        res.status(200).json(memberships);
    }
    catch (error) {
        console.error('Error fetching memberships:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
membershipRouter.delete('/user/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const memberships = yield (0, membershipRepository_1.getMembershipsByUserId)(userId);
        if (memberships.length === 0) {
            return res.status(404).json({ error: 'No memberships found for the user' });
        }
        for (const membership of memberships) {
            yield (0, membershipRepository_1.deleteMembershipById)(membership.id);
        }
        res.status(200).json({ message: 'Memberships deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting memberships:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
membershipRouter.get('/generate-pdf/:membershipId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { membershipId } = req.params;
        const membership = yield index_1.prisma.membership.findUnique({
            where: {
                id: membershipId,
            },
            include: {
                person: true,
            },
        });
        if (!membership) {
            return res.status(404).json({ error: 'Membership not found' });
        }
        const pdfDoc = new pdfkit_1.default({ margins: { top: 100, bottom: 100, left: 50, right: 50 } });
        pdfDoc.font('Helvetica-Bold');
        pdfDoc.fontSize(18);
        pdfDoc.text('Membership Details');
        pdfDoc.y += 32;
        pdfDoc.moveTo(50, pdfDoc.y)
            .lineTo(pdfDoc.page.width - 50, pdfDoc.y)
            .stroke();
        pdfDoc.y += 32;
        pdfDoc.font('Helvetica');
        pdfDoc.fontSize(12);
        pdfDoc.text(`Membership ID:                  ${membership.id}`);
        pdfDoc.y += 16;
        pdfDoc.text(`Join Date:                           ${membership.joinDate.toLocaleString()}`);
        pdfDoc.y += 16;
        pdfDoc.text(`Status:                                ${membership.status}`);
        pdfDoc.y += 16;
        pdfDoc.text(`Expiry Date:                       ${membership.expiryDate.toLocaleString()}`);
        pdfDoc.y += 16;
        pdfDoc.text(`Access Level:                     ${membership.accessLevel}`);
        pdfDoc.y += 16;
        pdfDoc.text(`Fees:                                  ${membership.fees}`);
        pdfDoc.y += 16;
        pdfDoc.text(`Renewal Date:                   ${membership.renewalDate ? membership.renewalDate.toLocaleString() : 'N/A'}`);
        pdfDoc.y += 16;
        pdfDoc.text(`Type:                                  ${membership.type}`);
        pdfDoc.y += 16;
        pdfDoc.text(`Payment Method:               ${membership.paymentMethod}`);
        pdfDoc.y += 16;
        pdfDoc.text(`Renewal Frequency:          ${membership.renewalFrequency} months`);
        pdfDoc.y += 16;
        pdfDoc.text(`Member:                             ${membership.person.firstName} ${membership.person.lastName}`);
        pdfDoc.y += 16;
        pdfDoc.y = pdfDoc.page.height - 117;
        pdfDoc.moveTo(50, pdfDoc.y - 32)
            .lineTo(pdfDoc.page.width - 50, pdfDoc.y - 32)
            .stroke();
        pdfDoc.font('Helvetica-Bold');
        const companyText = 'Oracle';
        const textWidth = pdfDoc.widthOfString(companyText);
        const textX = (pdfDoc.page.width - textWidth) / 2;
        pdfDoc.text(companyText, textX, pdfDoc.y);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="membership-details.pdf"');
        pdfDoc.pipe(res);
        pdfDoc.end();
    }
    catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = membershipRouter;
