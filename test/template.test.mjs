import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, mkdtempSync, copyFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';

const read = (path) => readFileSync(path, 'utf8');

function markdownFiles(directory = '.') {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (['.git', 'node_modules', 'private'].includes(entry.name)) return [];
    const path = join(directory, entry.name);
    return entry.isDirectory() ? markdownFiles(path) : entry.name.endsWith('.md') ? [path] : [];
  });
}

test('portable startup contract and fallback skill exist', () => {
  const contract = read('AGENTS.md');
  assert.match(contract, /user should not have to say/i);
  assert.match(contract, /private\/AGENTS\.md/);
  assert.match(contract, /Never bypass/);
  const skill = read('.agents/skills/q5m-workflows/SKILL.md');
  assert.match(skill, /^---\nname: q5m-workflows\ndescription: .+\n---\n/);
  for (const command of ['catalog', 'agents', 'route', 'agent', 'tools']) {
    assert.ok(skill.includes(`q5m ${command}`));
  }
});

test('Pi prompt files have descriptions and are discoverable without custom settings', () => {
  const files = readdirSync('.pi/prompts');
  assert.deepEqual(files.sort(), ['build-workflow.md', 'day-plan.md', 'weekly-review.md']);
  for (const file of files) {
    const text = read(join('.pi/prompts', file));
    assert.match(text, /^---\ndescription: .+\n/);
    assert.match(text, /private\//);
  }
});

test('local Markdown links resolve', () => {
  for (const file of markdownFiles()) {
    for (const match of read(file).matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = match[1];
      if (/^(https?:|#|mailto:)/.test(target)) continue;
      assert.ok(existsSync(resolve(dirname(file), target.split('#')[0])), `${file}: missing ${target}`);
    }
  }
});

test('public docs contain no host-specific checkout paths', () => {
  for (const file of markdownFiles()) {
    assert.doesNotMatch(read(file), /\/(?:home|Users)\/[^\s/]+\/|\/opt\/q5m\//, file);
  }
});

test('ignore rules protect personal artifacts but retain public resources', () => {
  // Independent of the caller checkout/index; also works in a source archive.
  const directory = mkdtempSync(join(tmpdir(), 'q-pi-ignore-'));
  try {
    const init = spawnSync('git', ['init', '-q', directory], { encoding: 'utf8' });
    assert.equal(init.status, 0, init.stderr);
    copyFileSync('.gitignore', join(directory, '.gitignore'));
    const ignored = ['private/AGENTS.md', 'private/report.html', '.env', '.env.local',
      '.pi/auth.json', '.pi/settings.json', '.pi/npm/cache.json', '.pi/git/package/file',
      'exports/calendar.csv', 'sessions/session.json', 'conversation.jsonl', 'debug.log'];
    const publicPaths = ['AGENTS.md', 'README.md', '.pi/prompts/day-plan.md',
      '.agents/skills/q5m-workflows/SKILL.md', 'scripts/doctor.mjs', 'examples/private-AGENTS.md'];
    for (const [paths, expected] of [[ignored, 0], [publicPaths, 1]]) {
      for (const path of paths) {
        const result = spawnSync('git', ['check-ignore', '--no-index', '-q', path], { cwd: directory });
        assert.equal(result.status, expected, path);
      }
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
