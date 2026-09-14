import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { runDoctor, supportedNode } from '../scripts/doctor.mjs';

const help = ['catalog', 'agents', 'agent', 'route', 'tools', 'call', 'tool', 'recall', 'context']
  .map((command) => `q5m ${command}`).join('\n');
const success = (stdout) => ({ status: 0, stdout, stderr: '' });

function fake(overrides = {}) {
  const calls = [];
  const defaults = {
    'pi --version': success('0.85.1\n'),
    'q5m --version': success('0.1.4\n'),
    'q5m --help': success(help),
    'q5m auth status --json': success(JSON.stringify({ authenticated: true, context: 'personal' })),
  };
  return {
    calls,
    run(command, args) {
      const key = [command, ...args].join(' ');
      calls.push(key);
      assert.ok(key in defaults, `Unexpected command: ${key}`);
      return overrides[key] ?? defaults[key];
    },
  };
}

function diagnose(overrides, nodeVersion = '22.22.0') {
  const runner = fake(overrides);
  return { ...runner, report: runDoctor({ run: runner.run, nodeVersion }) };
}

test('Node requirement includes 22.19+ and excludes invalid/old versions', () => {
  for (const version of ['22.19.0', '22.22.0', '23.0.0', '24.1.0']) assert.ok(supportedNode(version));
  for (const version of ['20.99.0', '22.18.9', 'v22.19.0', 'bad', '22.19']) assert.ok(!supportedNode(version));
});

test('healthy installation invokes only the read-only allowlist', () => {
  const { report, calls } = diagnose();
  assert.equal(report.ok, true);
  assert.equal(report.checks.length, 5);
  assert.deepEqual(calls, ['pi --version', 'q5m --version', 'q5m --help', 'q5m auth status --json']);
});

test('missing CLI skips authenticated requests', () => {
  const { report, calls } = diagnose({ 'q5m --version': { error: { code: 'ENOENT' }, status: null } });
  assert.equal(report.ok, false);
  assert.deepEqual(calls, ['pi --version', 'q5m --version']);
});

test('missing Pi or unsupported Node makes readiness fail', () => {
  assert.equal(diagnose({ 'pi --version': { status: 1 } }).report.ok, false);
  assert.equal(diagnose({}, '22.18.0').report.ok, false);
});

test('unknown CLI surface fails readiness', () => {
  assert.equal(diagnose({ 'q5m --help': success('q5m auth login') }).report.ok, false);
});

test('errors, timeouts, malformed JSON and ambiguous success all fail closed', () => {
  for (const result of [
    { status: 3, stderr: 'private diagnostic' },
    { status: null, error: { code: 'ETIMEDOUT' } },
    { status: 0, error: { code: 'ENOBUFS' }, stdout: '{"authenticated":true,"context":"personal"}' },
    success('not json'), success('null'), success('{}'),
    success('{"authenticated":false,"context":"personal"}'),
    success('{"authenticated":true}'),
    success('{"authenticated":true,"context":""}'),
  ]) {
    const { report } = diagnose({ 'q5m auth status --json': result });
    assert.equal(report.ok, false);
    assert.equal(report.checks.at(-1).name, 'connection');
    assert.equal(report.checks.at(-1).ok, false);
  }
});

test('never includes raw status, endpoint, Home ID, key, or error output', () => {
  const marker = 'SYNTHETIC_PRIVATE_MARKER';
  const { report } = diagnose({
    'q5m auth status --json': success(JSON.stringify({
      authenticated: true, context: marker, api_url: `https://${marker}.invalid`, api_key: marker,
    })),
  });
  assert.equal(report.ok, true);
  assert.match(report.checks.at(-1).message, /shared Space/);
  assert.ok(!JSON.stringify(report).includes(marker));
  const failed = diagnose({ 'q5m auth status --json': { status: 1, stderr: marker, stdout: marker } });
  assert.ok(!JSON.stringify(failed.report).includes(marker));
});

test('arbitrary version output and thrown subprocess errors are never printed', () => {
  const marker = 'SYNTHETIC_PRIVATE_MARKER';
  const { report } = diagnose({ 'q5m --version': success(`0.1.4\n${marker}`) });
  assert.equal(report.ok, false);
  assert.ok(!JSON.stringify(report).includes(marker));
  const thrown = runDoctor({ run() { throw new Error(marker); }, nodeVersion: '22.22.0' });
  assert.equal(thrown.ok, false);
  assert.ok(!JSON.stringify(thrown).includes(marker));
});

test('entrypoint help and usage work without accessing installed CLIs', () => {
  const run = (...args) => spawnSync(process.execPath, ['scripts/doctor.mjs', ...args], {
    encoding: 'utf8', env: { PATH: '' },
  });
  const helpResult = run('--help');
  assert.equal(helpResult.status, 0);
  assert.match(helpResult.stdout, /Read-only checks/);
  for (const args of [['--unknown'], ['--json', '--unknown'], ['--json', '--json']]) {
    assert.equal(run(...args).status, 2);
  }
});

test('JSON entrypoint reports failed readiness without leaking child diagnostics', () => {
  const result = spawnSync(process.execPath, ['scripts/doctor.mjs', '--json'], {
    encoding: 'utf8', env: { PATH: '' },
  });
  assert.equal(result.status, 1);
  assert.equal(JSON.parse(result.stdout).ok, false);
  assert.equal(result.stderr, '');
});
