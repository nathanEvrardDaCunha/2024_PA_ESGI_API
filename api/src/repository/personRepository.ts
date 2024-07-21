import {prisma} from "../index";
import {Prisma} from "@prisma/client";
import {LoginPersonRequest, PersonRequest, PersonUpdateRequest} from "../handlers/validators/person-validation";
import {compare, hash} from "bcrypt";
import {generateToken} from "../handlers/middleware/auth-middleware";
import nodemailer from "nodemailer";

export async function getAllPerson() {
	try {
		return await prisma.person.findMany();
	} catch (error) {
		console.error('Error fetching persons:', error);
		throw error;
	}
}

export async function getPersonById(id: string) {
	try {
		return await prisma.person.findUnique({ where: { id } });
	} catch (error) {
		console.error('Error fetching person by ID:', error);
		throw error;
	}
}

export async function createPerson(data: Prisma.PersonCreateInput) {
	try {
		return await prisma.person.create({data});
	} catch (error) {
		console.error('Error creating person:', error);
		throw error;
	}
}

export async function updatePerson(id: string, data: PersonUpdateRequest) {
	try {
		if(data.password){
			const hashedPassword = await hash(data.password, 10);
			data.password=hashedPassword;
		}
		return await prisma.person.update({
			where: {id},
			data,
		});
	} catch (error) {
		console.error('Error updating person:', error);
		throw error;
	}
}
export async function registerUser(data: PersonRequest) {
	try {
		const hashedPassword = await hash(data.password, 10);
		const personData = { ...data, password: hashedPassword };
		const personRepository = await prisma.person.create({ data: personData });
		return { id: personRepository.id, email: personRepository.email, role: personRepository.role };
	} catch (error) {
		console.error("Error registering user:", error);
		throw error;
	}
}

export async function resetPassword(email: string) {
	try {
		const person = await prisma.person.findUnique({ where: { email } });
		if (!person) {
			throw new Error("User not found");
		}
		
		const temporaryPassword = generateTemporaryPassword();
		const hashedPassword = await hash(temporaryPassword, 10);
		
		await prisma.person.update({
			where: { email },
			data: { password: hashedPassword },
		});
		
		await sendResetPasswordEmail(email, temporaryPassword);
	} catch (error) {
		console.error("Error resetting password:", error);
		throw error;
	}
}

function generateTemporaryPassword() {
	const length = 8;
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let password = "";
	for (let i = 0; i < length; i++) {
		password += charset.charAt(Math.floor(Math.random() * charset.length));
	}
	return password;
}

async function sendResetPasswordEmail(email: string, temporaryPassword: string) {
	try {

		const transporter = nodemailer.createTransport({
			host: "smtp.elasticemail.com",
			port: 2525,
			secure: false,
			auth: {
				user: "zharksmail2@gmail.com",
				pass: "9F3057339C068693F0201866AF0DBF99797F",
			},
		});
		

		const mailOptions = {
			from: "zharksmail2@gmail.com",
			to: email,
			subject: "Password Reset",
			text: `Your temporary password is: ${temporaryPassword}`,
			html: `<p>Your temporary password is: <strong>${temporaryPassword}</strong></p>`,
		};
		

		await transporter.sendMail(mailOptions);
		console.log(`Reset password email sent to ${email}`);
	} catch (error) {
		console.error("Error sending reset password email:", error);
		throw error;
	}
}

export async function loginUser(data: LoginPersonRequest) {
	try {
		const personRepository = await prisma.person.findFirst({
			where: { email: data.email, role: "user" },
		});
		if (!personRepository) {
			throw new Error("Invalid user credentials");
		}
		const isValid = await compare(data.password, personRepository.password);
		if (!isValid) {
			throw new Error("Invalid user credentials");
		}
		const token = await generateToken(personRepository.id);
		return { id: personRepository.id, token };
	} catch (error) {
		console.error("Error logging in user:", error);
		throw error;
	}
}

export async function loginAdmin(data: LoginPersonRequest) {
	try {
		const adminRepository = await prisma.person.findFirst({
			where: { email: data.email, role: "admin" },
		});
		if (!adminRepository) {
			throw new Error("Invalid admin credentials");
		}
		const isValid = await compare(data.password, adminRepository.password);
		if (!isValid) {
			throw new Error("Invalid admin credentials");
		}
		const token = await generateToken(adminRepository.id);
		return { id: adminRepository.id, token };
	} catch (error) {
		console.error("Error logging in admin:", error);
		throw error;
	}
}

export async function deletePersonById(id: string) {
	try {
		const deletedPerson = await prisma.$transaction(async (prisma) => {
			await prisma.session.deleteMany({ where: { personId: id } });
			await prisma.donation.deleteMany({ where: { personId: id } });
			await prisma.membership.deleteMany({ where: { personId: id } });
			await prisma.document.deleteMany({ where: { authorId: id } });
			await prisma.person.update({
				where: { id },
				data: {
					generalAssembly: { disconnect: [] },
					equipment: { disconnect: [] },
					task: { disconnect: [] },
					location: { disconnect: true },
					choices: { disconnect: [] },
				},
			});
			const deletedPerson = await prisma.person.delete({ where: { id } });
			return deletedPerson;
		});
		
		return deletedPerson;
	} catch (error) {
		console.error('Error deleting person by ID:', error);
		throw error;
	}
}