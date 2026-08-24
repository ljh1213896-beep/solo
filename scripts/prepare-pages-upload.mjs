import { cp, mkdir, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDirectory = path.join(projectRoot, 'dist');
const clientDirectory = path.join(distDirectory, 'client');
const serverDirectory = path.join(distDirectory, 'server');
const pagesDirectory = path.join(distDirectory, 'pages');
const workerDirectory = path.join(pagesDirectory, '_worker.js');

await rm(pagesDirectory, { recursive: true, force: true });
await mkdir(pagesDirectory, { recursive: true });
await cp(clientDirectory, pagesDirectory, { recursive: true });
await cp(serverDirectory, workerDirectory, { recursive: true });
await rename(path.join(workerDirectory, 'index.js'), path.join(workerDirectory, 'app.js'));
await cp(
  path.join(projectRoot, 'scripts', 'pages-worker-entry.js'),
  path.join(workerDirectory, 'index.js'),
);

console.log(`Cloudflare Pages upload prepared at ${pagesDirectory}`);
