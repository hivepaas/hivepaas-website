// Takes the backend's OpenAPI spec into openapi/hivepaas.json, the file the API
// docs are generated from.
//
// The spec is generated and committed in the backend repo, so by default this
// downloads it from a branch there: main, or another with
// HIVEPAAS_API_REF=<branch or tag>. HIVEPAAS_API_SPEC=<path> reads a local copy
// instead, such as a backend checkout's docs/openapi/swagger.json not pushed yet.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REF = process.env.HIVEPAAS_API_REF || 'main';
const LOCAL = process.env.HIVEPAAS_API_SPEC;
const URL = `https://raw.githubusercontent.com/hivepaas/hivepaas/${REF}/docs/openapi/swagger.json`;
const OUT = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'openapi',
  'hivepaas.json'
);

async function load() {
  if (LOCAL) {
    return { source: resolve(LOCAL), text: await readFile(LOCAL, 'utf8') };
  }
  const resp = await fetch(URL);
  if (!resp.ok) {
    throw new Error(`Could not download ${URL}: HTTP ${resp.status}`);
  }
  return { source: URL, text: await resp.text() };
}

try {
  const { source, text } = await load();
  const spec = JSON.parse(text);
  if (!spec.openapi || !spec.paths) {
    throw new Error(`${source} is not an OpenAPI 3 spec`);
  }

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(spec, null, 2) + '\n');
  console.log(`Saved ${Object.keys(spec.paths).length} paths from ${source}`);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
