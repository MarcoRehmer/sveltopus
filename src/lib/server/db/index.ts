import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schemas';
import { getConfig } from '$lib/server/config';

const client = postgres(getConfig().database.DATABASE_URL);

export const db = drizzle(client, { schema });
