// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// const connectionString = 'postgres://user:postgres@localhost:5432/short_links';
// const queryClient = postgres(connectionString);

// export const db = drizzle(queryClient, { schema });

import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

export const db = drizzle(sql, { schema });
