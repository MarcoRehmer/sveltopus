# Email Abstraction Layer

A provider-neutral email transport layer with support for Scaleway TEM, Brevo (stub), and Console (development).

## 📁 Structure

```
src/lib/server/email/
├── transport.ts          # Core interfaces (EmailMessage, EmailTransport)
├── config.ts             # Global config validation
├── errors.ts             # Unified EmailSendError
├── index.ts              # Main entry point (sendEmail function)
├── providers/
│   ├── index.ts          # Static registry of providers
│   ├── scaleway.ts       # Scaleway TEM implementation
│   ├── brevo.ts          # Brevo stub (placeholder)
│   └── console.ts        # Console provider for development
└── templates.ts          # Template utilities (readTemplate, renderTemplate)
└── templates/            # Plain HTML templates (e.g., welcome.html)
```

## 🚀 Usage

### 1. Configure Environment

Copy `.env.example` to `.env` and set:

```env
# Provider (scaleway, brevo, or console)
EMAIL_PROVIDER="scaleway"

# Sender information (required for all providers)
EMAIL_SENDER_NAME="Your App"
EMAIL_SENDER_EMAIL="noreply@yourapp.com"

# Scaleway TEM (required if EMAIL_PROVIDER="scaleway")
EMAIL_SCW_PROJECT_ID="your-project-id"
EMAIL_SCW_API_TOKEN="your-api-token"
EMAIL_SCW_REGION="fr-par"

# Brevo (required if EMAIL_PROVIDER="brevo")
EMAIL_BREVO_API_KEY="your-brevo-api-key"

# Console (no additional configuration needed)
# Set EMAIL_PROVIDER="console" for development testing
```

### 2. Send an Email

```ts
import { sendEmail } from '$lib/server/email';

// Basic email
const messageId = await sendEmail({
	to: [{ email: 'user@example.com', name: 'John Doe' }],
	subject: 'Welcome to Sveltopus',
	htmlBody: '<p>Hello John!</p>',
	textBody: 'Hello John!',
	replyTo: 'support@yourapp.com',
	tags: { campaign: 'welcome', priority: 'high' }
});

console.log('Message ID:', messageId);
```

### 3. Use Templates

Create plain HTML files in `src/lib/server/email/templates/`:

```html
<!-- templates/welcome.html -->
<!DOCTYPE html>
<html>
	<body>
		<h1>Welcome {{name}}!</h1>
		<p>Thank you for signing up.</p>
	</body>
</html>
```

Then render and send:

```ts
import { sendEmail, readTemplate, renderTemplate } from '$lib/server/email';

// Read and render template
const html = await renderTemplate('welcome.html', { name: 'Marco' });

// Send email with rendered template
const messageId = await sendEmail({
	to: [{ email: 'user@example.com' }],
	subject: 'Welcome!',
	htmlBody: html
});
```

## 🔧 Adding a New Provider

1. Create a new file in `providers/` (e.g., `sendgrid.ts`)
2. Implement the `EmailTransport` interface
3. Add a factory function (e.g., `createSendgridTransport`)
4. Register it in `providers/index.ts`:

```ts
import { createSendgridTransport } from './sendgrid';

export const providers: Record<
	string,
	(sender: { name: string; email: string }) => EmailTransport
> = {
	scaleway: createScalewayTransport,
	brevo: createBrevoTransport,
	sendgrid: createSendgridTransport // Add new provider
};
```

## 📦 Types

```ts
interface EmailRecipient {
  email: string;
  name?: string;
}

interface EmailMessage {
  to: EmailRecipient[];
  subject: string;
  htmlBody?: string;
  textBody?: string;
  replyTo?: string;
  tags?: Record<string, string>;
}

class EmailSendError extends Error {
  constructor(
    message: string,
    public readonly provider?: string,
    public readonly statusCode?: number,
    public readonly providerErrorCode?: string
  );
}
```

## 🛡️ Security

- **No credentials in errors**: Error messages never include API tokens, project IDs, or email content.
- **Provider isolation**: Scaleway/Brevo details are isolated in their respective modules.
- **Type-safe**: All configuration is validated with Zod.

## ✅ Verification

```bash
# Type check
bun run check

# Lint
bun run lint

# Tests (deferred)
bun run test -- --project server
```
