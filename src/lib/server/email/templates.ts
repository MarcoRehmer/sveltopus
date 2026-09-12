import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Read a plain HTML email template from the templates directory.
 * @param fileName - Name of the template file (e.g., 'welcome.html')
 * @returns Promise resolving to the template content as a string
 * @throws {Error} if the file cannot be read
 */
export async function readTemplate(fileName: string): Promise<string> {
	const templatePath = join(__dirname, 'templates', fileName);
	return readFile(templatePath, 'utf-8');
}

/**
 * Read a plain HTML email template and replace placeholders with values.
 * Placeholders are in the format {{placeholderName}}.
 * @param fileName - Name of the template file (e.g., 'welcome.html')
 * @param replacements - Object mapping placeholder names to replacement values
 * @returns Promise resolving to the rendered template
 * @throws {Error} if the file cannot be read or replacements fail
 */
export async function renderTemplate(
	fileName: string,
	replacements: Record<string, string> = {}
): Promise<string> {
	const template = await readTemplate(fileName);
	let rendered = template;

	for (const [key, value] of Object.entries(replacements)) {
		rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), value);
	}

	return rendered;
}
