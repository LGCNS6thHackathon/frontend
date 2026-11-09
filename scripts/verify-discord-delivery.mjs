import assert from 'node:assert/strict';
import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
const dir = await mkdtemp(join(tmpdir(), 'discord-test-'));
try {
  const source = await readFile('src/lib/discord-delivery.ts', 'utf8');
  await writeFile(join(dir, 'delivery.mjs'), ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText);
  const { sendDiscord } = await import(pathToFileURL(join(dir, 'delivery.mjs')));
  for (const [post, get, expected] of [
    ['SENT', null, 'SENT'], ['FAILED', null, 'FAILED'], ['PENDING', null, 'PENDING'],
    [null, 'SENT', 'SENT'], [null, 'FAILED', 'FAILED'], [null, null, 'UNKNOWN'], ['invalid', null, 'UNKNOWN'],
  ]) {
    const calls = [];
    const result = await sendDiscord(async (...args) => {
      calls.push(args);
      const status = args[1] === 'POST' ? post : get;
      if (status === null) throw Error('network');
      return { status };
    }, 12);
    assert.equal(result, expected);
    assert.deepEqual(calls, post === null ? [['/api/posts/12/discord-delivery', 'POST'], ['/api/posts/12/discord-delivery', 'GET']] : [['/api/posts/12/discord-delivery', 'POST']]);
  }
  for (const name of ['api-client', 'backend-capabilities', 'admin-api']) {
    const source = await readFile(`src/lib/${name}.ts`, 'utf8');
    const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText
      .replaceAll('"./api-client"', '"./api-client.mjs"')
      .replaceAll('"./backend-capabilities"', '"./backend-capabilities.mjs"');
    await writeFile(join(dir, `${name}.mjs`), js);
  }
  const { createAdminApi } = await import(pathToFileURL(join(dir, 'admin-api.mjs')));
  const originalFetch = globalThis.fetch;
  try {
    for (const lookupFails of [false, true]) {
      const calls = [];
      globalThis.fetch = async path => {
        calls.push(path);
        if (path.includes('discord-deliveries')) {
          if (lookupFails) throw Error('network');
          return Response.json({ '12': 'SENT', '13': 'FAILED' });
        }
        if (path.includes('/cohorts/')) return Response.json({ items: [{ id: 12 }, { id: 13 }, { id: 14 }], total: 3 });
        return Response.json({ id: Number(path.split('/').at(-1)), category: 'COURSE', title: 'notice' });
      };
      const rows = await createAdminApi('', '', 7).list('posts');
      assert.deepEqual(rows.map(row => row.deliveryStatus), lookupFails ? ['UNKNOWN', 'UNKNOWN', 'UNKNOWN'] : ['SENT', 'FAILED', null]);
      assert.equal(calls.filter(path => path === '/api/cohorts/7/discord-deliveries').length, 1);
    }
  } finally { globalThis.fetch = originalFetch; }
  console.log('Discord list: status merge, missing status, and failed lookup passed.');
  console.log('Discord delivery: 7 response/recovery cases passed; no real requests.');
} finally { await rm(dir, { recursive: true, force: true }); }
