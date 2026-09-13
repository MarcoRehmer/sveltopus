import { describe, it, expect } from 'vitest';
import type { EmailMessage, EmailRecipient, EmailTransport } from './transport';

// Mock transport implementation for testing the interface
class MockTransport implements EmailTransport {
	async send(): Promise<string> {
		return 'mock-message-id';
	}
}

describe('Email Transport Contract', () => {
	describe('EmailRecipient', () => {
		it('should support email only', () => {
			const recipient: EmailRecipient = {
				email: 'test@example.com'
			};
			expect(recipient.email).toBe('test@example.com');
			expect(recipient.name).toBeUndefined();
		});

		it('should support email with name', () => {
			const recipient: EmailRecipient = {
				email: 'test@example.com',
				name: 'Test User'
			};
			expect(recipient.email).toBe('test@example.com');
			expect(recipient.name).toBe('Test User');
		});
	});

	describe('EmailMessage', () => {
		it('should support minimal message with required fields', () => {
			const message: EmailMessage = {
				to: [{ email: 'recipient@example.com' }],
				subject: 'Test Subject'
			};
			expect(message.to).toHaveLength(1);
			expect(message.subject).toBe('Test Subject');
			expect(message.htmlBody).toBeUndefined();
			expect(message.textBody).toBeUndefined();
			expect(message.replyTo).toBeUndefined();
			expect(message.tags).toBeUndefined();
		});

		it('should support full message with all fields', () => {
			const message: EmailMessage = {
				to: [
					{ email: 'recipient1@example.com', name: 'Recipient One' },
					{ email: 'recipient2@example.com', name: 'Recipient Two' }
				],
				subject: 'Test Subject',
				htmlBody: '<p>HTML content</p>',
				textBody: 'Plain text content',
				replyTo: 'reply@example.com',
				tags: { category: 'test', priority: 'high' }
			};
			expect(message.to).toHaveLength(2);
			expect(message.subject).toBe('Test Subject');
			expect(message.htmlBody).toBe('<p>HTML content</p>');
			expect(message.textBody).toBe('Plain text content');
			expect(message.replyTo).toBe('reply@example.com');
			expect(message.tags).toEqual({ category: 'test', priority: 'high' });
		});

		it('should support multiple recipients', () => {
			const message: EmailMessage = {
				to: [
					{ email: 'user1@example.com' },
					{ email: 'user2@example.com' },
					{ email: 'user3@example.com' }
				],
				subject: 'Group Email'
			};
			expect(message.to).toHaveLength(3);
		});
	});

	describe('EmailTransport interface', () => {
		it('should have send method returning Promise<string>', async () => {
			const transport: EmailTransport = new MockTransport();
			const message: EmailMessage = {
				to: [{ email: 'test@example.com' }],
				subject: 'Test'
			};

			const result = await transport.send(message);
			expect(result).toBeTypeOf('string');
			expect(result).toBe('mock-message-id');
		});

		it('should accept EmailMessage parameter', async () => {
			const transport: EmailTransport = new MockTransport();
			const message: EmailMessage = {
				to: [{ email: 'test@example.com', name: 'Test User' }],
				subject: 'Test Subject',
				htmlBody: '<p>Test</p>',
				textBody: 'Test',
				replyTo: 'reply@example.com',
				tags: { test: 'value' }
			};

			// This should compile and run without errors
			const result = await transport.send(message);
			expect(result).toBeDefined();
		});
	});
});
