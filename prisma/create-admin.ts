import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client';

const USERNAME = 'adrian';
const MIN_LENGTH = 12;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL belum diatur di file .env');
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

function askHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    const stdin = process.stdin;

    if (!stdin.isTTY) {
      throw new Error('Jalankan skrip ini langsung di terminal, bukan lewat pipe.');
    }

    process.stdout.write(question);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    let input = '';

    const onData = (chunk: string) => {
      for (const char of chunk) {
        if (char === '\r' || char === '\n') {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener('data', onData);
          process.stdout.write('\n');
          resolve(input);
          return;
        }

        if (char === '\u0003') {
          process.stdout.write('\nDibatalkan.\n');
          process.exit(1);
        }

        if (char === '\u007f' || char === '\b') {
          input = input.slice(0, -1);
        } else {
          input += char;
        }
      }
    };

    stdin.on('data', onData);
  });
}

async function main() {
  const password = await askHidden(`Password baru untuk "${USERNAME}" (min ${MIN_LENGTH} karakter): `);

  if (password.length < MIN_LENGTH) {
    throw new Error(`Password terlalu pendek. Minimal ${MIN_LENGTH} karakter.`);
  }

  const confirm = await askHidden('Ulangi password: ');

  if (password !== confirm) {
    throw new Error('Kedua password tidak sama.');
  }

  const passwordHash = await hash(password, 12);

  const admin = await prisma.admin.upsert({
    where: { username: USERNAME },
    update: { passwordHash },
    create: { username: USERNAME, passwordHash },
  });

  await prisma.session.deleteMany({ where: { adminId: admin.id } });

  console.log(`Akun "${USERNAME}" siap dipakai. Semua sesi lama dicabut.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());