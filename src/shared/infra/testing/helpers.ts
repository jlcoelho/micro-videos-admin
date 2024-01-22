import { PrismaClient } from "@prisma/client";
import { exec } from 'node:child_process';
import util from 'node:util';
import { URL } from 'node:url';
import crypto from 'node:crypto';
import { Config } from '../config';
const execSync = util.promisify(exec);


const prismaBinary = './node_modules/.bin/prisma';

export function setupPrisma() {
    let _prisma: PrismaClient;
    const { schemaId, url } = generateTestURL();

    beforeAll(async () => {
        _prisma = new PrismaClient({
          datasources: { db: { url } }
        });
    });

    beforeEach(async () => {
        await execSync(`${prismaBinary} db push`, {
            env: {
                ...process.env,
                DATABASE_URL: url,
            },
        });
    });

    afterEach(async () => {
        await _prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE;`);
    })

    afterAll(async () => {   
        await _prisma.$disconnect();
    });

    return { 
        get prisma() {
            return _prisma;
        }
    };
}


export const generateTestURL = () => {
  const schemaId = `test-${crypto.randomUUID()}`;

  const url = new URL(Config.db().url);
  
  url.searchParams.append('schema', schemaId);

  return { url: url.toString(), schemaId };
};