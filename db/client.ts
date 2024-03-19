import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = 'postgres://user:postgres@localhost:5432/short_links';
const queryClient = postgres(connectionString);

export const db = drizzle(queryClient, { schema });
