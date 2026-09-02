import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('generated site structural audit is clean', () => {
  const build = spawnSync(process.execPath, ['scripts/build.mjs'], { cwd: root, encoding: 'utf8' });
  assert.equal(build.status, 0, build.stderr);

  const audit = spawnSync(process.execPath, ['scripts/audit-generated.mjs'], { cwd: root, encoding: 'utf8' });
  assert.equal(audit.status, 0, `${audit.stdout}\n${audit.stderr}`);
  assert.match(audit.stdout, /auditoria estrutural ok/i);
});