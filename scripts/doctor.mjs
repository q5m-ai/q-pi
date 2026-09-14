#!/usr/bin/env node
/** Read-only diagnostics. Never echo child output, URLs, Home IDs, or errors. */
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function supportedNode(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) return false;
  const [, major, minor] = match.map(Number);
  return major > 22 || (major === 22 && minor >= 19);
}

export function runCommand(command, args) {
  return spawnSync(command, args, {
    encoding: 'utf8',
    shell: false,
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 15_000,
    maxBuffer: 1024 * 1024,
    windowsHide: true,
  });
}

function succeeds(result) {
  return !result.error && result.status === 0;
}

function versionOf(result) {
  if (!succeeds(result)) return undefined;
  const value = result.stdout?.trim();
  // Only print a bare numeric version; arbitrary subprocess text stays private.
  return /^\d+\.\d+\.\d+$/.test(value ?? '') ? value : undefined;
}

export function runDoctor({ run = runCommand, nodeVersion = process.versions.node } = {}) {
  const checks = [];
  const add = (name, ok, message) => checks.push({ name, ok, message });
  const invoke = (command, args) => {
    try {
      return run(command, args);
    } catch {
      return { status: null };
    }
  };

  add('node', supportedNode(nodeVersion), supportedNode(nodeVersion)
    ? 'Node.js meets the 22.19+ requirement.' : 'Install Node.js 22.19 or newer.');

  const piVersion = versionOf(invoke('pi', ['--version']));
  add('pi', Boolean(piVersion), piVersion
    ? `Pi ${piVersion} is on PATH; model authentication is not checked.`
    : 'Pi was not detected. Install it or check the agent host PATH.');

  const cliVersion = versionOf(invoke('q5m', ['--version']));
  add('q5m', Boolean(cliVersion), cliVersion
    ? `q5m ${cliVersion} is on PATH.`
    : 'q5m was not detected. Install @q5m-ai/cli or check the agent host PATH.');

  if (cliVersion) {
    const help = invoke('q5m', ['--help']);
    const commands = ['catalog', 'agents', 'agent', 'route', 'tools', 'call', 'tool', 'recall', 'context'];
    const compatible = succeeds(help) && commands.every((command) =>
      new RegExp(`\\bq5m ${command}\\b`).test(help.stdout ?? ''));
    add('cli-surface', compatible, compatible
      ? 'Expected discovery and tool commands are available.'
      : 'CLI help does not match the expected command surface. Review q5m --help.');

    // auth status validates the credential via a read-only catalog request.
    const result = invoke('q5m', ['auth', 'status', '--json']);
    let status;
    if (succeeds(result)) {
      try { status = JSON.parse(result.stdout); } catch { /* fail closed */ }
    }
    const connected = status?.authenticated === true
      && typeof status.context === 'string' && status.context.length > 0;
    add('connection', connected, connected
      ? `Authenticated; resolved Home is ${status.context === 'personal' ? 'Personal' : 'a shared Space'}.`
      : 'Connection not verified. Run q5m auth status locally; follow q5m --help for secure login if needed.');
  }

  return { ok: checks.every((check) => check.ok), checks };
}

export function main(args = process.argv.slice(2)) {
  if (args.length > 1 || (args.length === 1 && !['--json', '--help'].includes(args[0]))) {
    console.error('Usage: node scripts/doctor.mjs [--json|--help]');
    return 2;
  }
  if (args[0] === '--help') {
    console.log('Usage: node scripts/doctor.mjs [--json|--help]\nRead-only checks; no installs, login, configuration changes, or tool mutations.');
    return 0;
  }
  const report = runDoctor();
  if (args[0] === '--json') console.log(JSON.stringify(report, null, 2));
  else {
    for (const check of report.checks) {
      console.log(`${check.ok ? 'OK' : 'FAIL'} ${check.name}: ${check.message}`);
    }
    console.log('Native extension loading, model access, and peer permissions must be checked in your actual session.');
  }
  return report.ok ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = main();
}
