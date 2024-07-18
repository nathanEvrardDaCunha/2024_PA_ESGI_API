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
const stripe_1 = __importDefault(require("stripe"));
const donationRepository_1 = require("../repository/donationRepository");
const index_1 = require("../index");
const pdfkit_1 = __importDefault(require("pdfkit"));
const donationRouter = express_1.default.Router();
const stripe = new stripe_1.default('sk_test_51PAYakGNSIKaQBU9pSy67gIi627DV10OYHHc5lr7TnZptVISScLpgqc0nQfKqA5nTo9PqourKhyUr8gdJ6eujseE00p0hZIgZ2');
donationRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const donations = yield (0, donationRepository_1.getAllDonation)();
        res.status(200).json(donations);
    }
    catch (error) {
        console.error('Error fetching donations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
donationRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const donation = yield (0, donationRepository_1.getDonationById)(req.params.id);
        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }
        res.status(200).json(donation);
    }
    catch (error) {
        console.error('Error fetching donation by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
donationRouter.get('/user/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const userDonations = yield (0, donationRepository_1.getDonationsByUserId)(userId);
        if (userDonations.length === 0) {
            return res.status(404).json({ error: 'No donations found for this user' });
        }
        res.status(200).json(userDonations);
    }
    catch (error) {
        console.error('Error fetching donations by user ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
donationRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newDonation = yield (0, donationRepository_1.createDonation)(req.body);
        res.status(201).json(newDonation);
    }
    catch (error) {
        console.error('Error creating donation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
donationRouter.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedDonation = yield (0, donationRepository_1.updateDonation)(id, req.body);
        if (!updatedDonation) {
            return res.status(404).json({ error: 'Donation not found' });
        }
        res.status(200).json(updatedDonation);
    }
    catch (error) {
        console.error('Error updating donation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
donationRouter.post('/create-checkout-session', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { amount, userId, type, paymentMethod, message } = req.body;
    try {
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'Donation',
                            metadata: {
                                userId,
                                type,
                                paymentMethod,
                                message,
                            },
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:3001/',
            cancel_url: 'http://localhost:3001/',
        });
        console.log('Checkout session created successfully:', session.id);
        const transactionDate = new Date();
        const donation = yield index_1.prisma.donation.create({
            data: {
                status: 'waiting',
                type,
                paymentMethod,
                message,
                amount: amount / 100,
                transactionDate,
                url: (_a = session.url) !== null && _a !== void 0 ? _a : 'default_url',
                person: {
                    connect: { id: userId },
                },
            },
        });
        res.status(200).json({ id: session.id, donation });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while creating the checkout session' });
    }
}));
donationRouter.post('/donation-success', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sessionId } = req.body;
    console.log("GROS PPPPPPPPPPPPPPEPPPPPPPPPS");
    try {
        const session = yield stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === 'paid') {
            const donation = yield index_1.prisma.donation.findFirst({
                where: {
                    url: session.url,
                },
            });
            if (donation) {
                yield index_1.prisma.donation.update({
                    where: {
                        id: donation.id,
                    },
                    data: {
                        status: 'validated',
                    },
                });
                console.log("GROS PPPPPPPPPPPPPPEPPPPPPPPPS");
                res.status(200).json({ message: 'Donation validated successfully' });
            }
            else {
                res.status(404).json({ message: 'Donation not found' });
            }
        }
        else {
            res.status(400).json({ message: 'Payment not completed' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while validating the donation' });
    }
}));
donationRouter.get('/generate-pdf/:donationId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { donationId } = req.params;
        // Fetch the donation data from the database
        const donation = yield index_1.prisma.donation.findUnique({
            where: {
                id: donationId,
            },
            include: {
                person: true, // Include the related person data
            },
        });
        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }
        // Create a new PDF document
        const pdfDoc = new pdfkit_1.default({ margins: { top: 100, bottom: 100, left: 50, right: 50 } });
        // Set the font and font size
        pdfDoc.font('Helvetica-Bold');
        pdfDoc.fontSize(18);
        pdfDoc.text('Donation Receipt');
        pdfDoc.y += 32;
        // Add a separation line
        pdfDoc.moveTo(50, pdfDoc.y)
            .lineTo(pdfDoc.page.width - 50, pdfDoc.y)
            .stroke();
        pdfDoc.y += 32;
        // Reset the font and font size
        pdfDoc.font('Helvetica');
        pdfDoc.fontSize(12);
        // Generate the PDF content based on the fetched data
        pdfDoc.text(`Reference:                 ${donation.id}`);
        pdfDoc.y += 16;
        pdfDoc.text(`Type:                          ${donation.type}`);
        pdfDoc.y += 16;
        pdfDoc.text(`Payment Method:       ${donation.paymentMethod}`);
        pdfDoc.y += 16;
        pdfDoc.text(`Message:                    ${donation.message || 'N/A'}`);
        pdfDoc.y += 16;
        pdfDoc.text(`Amount:                      ${donation.amount}`);
        pdfDoc.y += 16;
        pdfDoc.text(`Transaction Date:       ${donation.transactionDate.toLocaleString()}`);
        pdfDoc.y += 16;
        pdfDoc.text(`Person:                       ${donation.person.firstName} ${donation.person.lastName}`);
        pdfDoc.y += 16;
        pdfDoc.y = pdfDoc.page.height - 117;
        pdfDoc.moveTo(50, pdfDoc.y - 32)
            .lineTo(pdfDoc.page.width - 50, pdfDoc.y - 32)
            .stroke();
        // Add your company name at the bottom of the first page
        pdfDoc.font('Helvetica-Bold');
        const companyText = 'Oracle';
        const textWidth = pdfDoc.widthOfString(companyText);
        const textX = (pdfDoc.page.width - textWidth) / 2;
        pdfDoc.text(companyText, textX, pdfDoc.y);
        // Set the response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="donation-receipt.pdf"');
        // Pipe the PDF document to the response
        pdfDoc.pipe(res);
        pdfDoc.end();
    }
    catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = donationRouter;