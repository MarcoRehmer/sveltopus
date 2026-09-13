# Dashboard Welcome Email Button

## Overview

A button has been added to the dashboard page (`/dashboard`) that triggers the sending of a welcome email using the Scaleway TEM integration.

## Location

- **UI Component**: `src/routes/(app)/dashboard/+page.svelte`
- **Server Action**: `src/routes/(app)/dashboard/+page.server.ts`
- **Button**: Added below the dashboard title and description

## How It Works

### Architecture

The implementation follows SvelteKit's best practices by separating concerns:

- **Client-side** (`+page.svelte`): UI component with button and status messages
- **Server-side** (`+page.server.ts`): Action handler that sends the email

This separation ensures sensitive server-side code (email sending) never runs in the browser.

### Button Features

1. **Visual State**: Shows a loading spinner when sending
2. **Disabled State**: Prevents multiple clicks during sending
3. **Status Messages**: Shows success/error messages below the button
4. **Uses Existing Infrastructure**: Leverages the email service already configured

### Email Content

- **Template**: Uses `welcome.html` from `/src/lib/server/email/templates/`
- **Recipient**: Hardcoded to `test@example.com` (for testing purposes)
- **Subject**: "Welcome to Sveltopus!"
- **Tags**: `{ purpose: "welcome" }` for tracking

## How to Use

### 1. Configure Environment Variables

Ensure your `.env` file has the correct Scaleway TEM configuration:

```env
# Email Configuration (required for all providers)
EMAIL_PROVIDER=scaleway
EMAIL_SENDER_NAME="Your App Name"
EMAIL_SENDER_EMAIL=noreply@yourdomain.com

# Scaleway TEM Configuration (required for Scaleway provider)
EMAIL_SCW_PROJECT_ID=your-project-id
EMAIL_SCW_API_TOKEN=your-api-token
EMAIL_SCW_REGION=fr-par  # optional, defaults to 'fr-par'
```

### 2. For Local Testing

Switch to the console provider to see the email content without sending:

```env
EMAIL_PROVIDER=console
```

This will print the email to the console instead of sending it.

### 3. Customize the Recipient

To send to a real email address, modify the `sendWelcomeEmail` function:

```svelte
async function sendWelcomeEmail() {
	isSending = true;
	try {
		const htmlBody = await renderTemplate("welcome.html", {
			name: "Test User",
			appName: "Sveltopus"
		});

		// Replace test@example.com with the actual recipient
		const messageId = await sendEmail({
			to: [{ email: "user@example.com", name: "User Name" }],
			subject: "Welcome to Sveltopus!",
			htmlBody,
			textBody: "Welcome to Sveltopus! Thank you for joining.",
			tags: { purpose: "welcome" }
		});

		toast.success("Welcome email sent successfully!");
	} catch (error) {
		console.error("Failed to send welcome email:", error);
		toast.error("Failed to send welcome email");
	} finally {
		isSending = false;
	}
}
```

### 4. Production Use

In a real application, you would typically trigger this email after:

- User sign-up
- Email verification
- Account activation

Example integration in a signup flow:

```ts
// In a server action or API endpoint
import { sendEmail, renderTemplate } from '$lib/server/email';

async function handleSignup(email: string, name: string) {
	// Create user
	const user = await createUser(email, name);

	// Send verification email
	await sendVerificationEmail(email, name);

	// After verification, send welcome email
	const htmlBody = await renderTemplate('welcome.html', {
		name,
		appName: 'Sveltopus'
	});

	await sendEmail({
		to: [{ email, name }],
		subject: 'Welcome to Sveltopus!',
		htmlBody,
		textBody: `Welcome ${name}! Thank you for joining Sveltopus.`,
		tags: { purpose: 'welcome' }
	});
}
```

## Testing

### Manual Test

1. Run the development server:

   ```bash
   bun run dev
   ```

2. Navigate to `/dashboard`

3. Click the "Send Welcome Email" button

4. Check:
   - Console for errors
   - Toast notifications for success/error messages
   - Scaleway TEM dashboard for sent emails (if using real provider)

### Automated Test

The button uses the existing email infrastructure which is already tested in the repository. The button itself is a simple UI component that triggers the email service.

### Testing with Console Provider

To test without sending real emails:

1. Set the console provider in `.env`:

   ```env
   EMAIL_PROVIDER=console
   ```

2. Run the development server:

   ```bash
   bun run dev
   ```

3. Navigate to `/dashboard`

4. Click the button - you'll see the email content logged to the console instead of being sent.

### Testing with Scaleway TEM

To test with real email sending:

1. Configure Scaleway TEM in `.env`:

   ```env
   EMAIL_PROVIDER=scaleway
   EMAIL_SCW_PROJECT_ID=your-project-id
   EMAIL_SCW_API_TOKEN=your-api-token
   ```

2. Run the development server:

   ```bash
   bun run dev
   ```

3. Navigate to `/dashboard`

4. Click the button - the email will be sent via Scaleway TEM

5. Check your email inbox and the [Scaleway TEM dashboard](https://console.scaleway.com/tem) for the sent email

## Notes

- The button is designed for testing purposes and demonstrates the email sending functionality
- In a production application, you would integrate this into your actual user flows (signup, verification, etc.)
- The email template (`welcome.html`) can be customized as needed
- Error handling is in place to catch and display any issues
