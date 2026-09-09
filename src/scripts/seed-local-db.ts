import { hashPassword, normalizeEmail } from '../lib/server/auth/session.js';
import { db } from '../prisma/db.js';

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

const emailRaw = process.env.SEED_EMAIL ?? '';
const password = process.env.SEED_PASSWORD ?? '';
const email = normalizeEmail(emailRaw);

try {
	if (!emailRaw || email.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(email)) {
		throw new Error('SEED_EMAIL must be a valid email address.');
	}

	if (password.length < MIN_PASSWORD_LENGTH) {
		throw new Error(`SEED_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters.`);
	}

	const existing = await db.orm.public.User.where({ emailNormalized: email }).first();

	if (existing) {
		throw new Error(`A user with ${email} already exists; refusing to overwrite it.`);
	}

	const now = new Date().toISOString();
	const user = await db.orm.public.User.create({
		id: crypto.randomUUID(),
		email: emailRaw.trim(),
		emailNormalized: email,
		passwordHash: await hashPassword(password),
		status: 'active',
		createdAt: now,
		updatedAt: now
	});

	console.log(`Created local user ${user.email}.`);
} finally {
	await db.close();
}
