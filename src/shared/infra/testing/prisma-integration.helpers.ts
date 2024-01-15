import { URL } from 'node:url';
import crypto from 'node:crypto';

export const generateDatabaseURL = () => {
  const schemaId = `test-${crypto.randomUUID()}`;

  if (!process.env.DATABASE_URL) {
    throw new Error('please provide a database url');
  }

  const url = new URL(process.env.DATABASE_URL);
  
  url.searchParams.append('schema', schemaId);

  return { url: url.toString(), schemaId };
};