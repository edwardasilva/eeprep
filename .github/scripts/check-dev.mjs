// Starts `astro dev` on a free port and fails if a page returns an error.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';

const readyTimeoutMs = 180_000;
// The CSI marker is a control character. That is the ANSI sequence Astro prints.
// eslint-disable-next-line no-control-regex
const ansiPattern = /\u001b\[[0-9;]*m/g;
const requestTimeoutMs = 120_000;
const shutdownTimeoutMs = 5_000;
const pages = [
	'/',
	'/advice/resume/',
	'/advice/getting-hired/',
	'/help/',
	'/roadmap/',
];
const errorMarkers = ['ReferenceError', 'An error occurred'];

const astroBin = path.resolve('node_modules/astro/bin/astro.mjs');
if (!fs.existsSync(astroBin)) {
	console.error('astro is not installed. Run npm ci first.');
	process.exit(1);
}

const port = await freePort();
// --ignore-lock keeps the server in the foreground and out of .astro/dev.json.
// Without it, Astro moves `astro dev` to the background when an AI coding
// agent runs it, the child exits at once, and this check fails. It also lets
// the check run while another dev server holds the lock.
const child = spawn(
	process.execPath,
	[
		astroBin,
		'dev',
		'--port',
		String(port),
		'--host',
		'127.0.0.1',
		'--ignore-lock',
	],
	{
		detached: true,
		stdio: ['ignore', 'pipe', 'pipe'],
		env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', BROWSER: 'none' },
	},
);

let log = '';
/** @param {Buffer} chunk */
const onChunk = (chunk) => {
	const text = chunk.toString();
	log += text;
	process.stdout.write(text);
};
child.stdout?.on('data', onChunk);
child.stderr?.on('data', onChunk);

let stopped = false;
process.on('SIGINT', () => {
	stop().finally(() => process.exit(1));
});
process.on('SIGTERM', () => {
	stop().finally(() => process.exit(1));
});

let failed = false;
try {
	await waitForReady(readyTimeoutMs);
	for (const page of pages) {
		if (!(await checkPage(port, page))) failed = true;
	}
} catch (error) {
	console.error(error instanceof Error ? error.message : String(error));
	failed = true;
} finally {
	await stop();
}

if (failed) process.exitCode = 1;
else console.log('Dev server returned 200 for every checked page.');

/** @returns {Promise<number>} */
function freePort() {
	return new Promise((resolve, reject) => {
		const server = net.createServer();
		server.once('error', reject);
		server.listen(0, '127.0.0.1', () => {
			const address = server.address();
			if (address === null || typeof address === 'string') {
				server.close();
				reject(new Error('Could not bind a free port.'));
				return;
			}
			const { port: free } = address;
			server.close((error) => {
				if (error) reject(error);
				else resolve(free);
			});
		});
	});
}

/** @param {number} timeoutMs */
function waitForReady(timeoutMs) {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			cleanup();
			reject(
				new Error(`astro dev did not become ready within ${timeoutMs}ms.`),
			);
		}, timeoutMs);
		/** @param {number | null} code @param {NodeJS.Signals | null} signal */
		const onExit = (code, signal) => {
			cleanup();
			reject(new Error(`astro dev exited before ready (${signal ?? code}).`));
		};
		const onData = () => {
			// Astro dims "ready in" and leaves the millisecond count outside that style.
			// With color on, an ANSI reset sits between them. GitHub Actions turns color on.
			const plain = log.replace(ansiPattern, '');
			if (/ready in \d+/i.test(plain)) {
				cleanup();
				resolve();
			}
		};
		function cleanup() {
			clearTimeout(timer);
			child.off('exit', onExit);
			child.stdout?.off('data', onData);
			child.stderr?.off('data', onData);
		}
		child.on('exit', onExit);
		child.stdout?.on('data', onData);
		child.stderr?.on('data', onData);
		onData();
	});
}

/**
 * @param {number} serverPort
 * @param {string} page
 * @returns {Promise<boolean>}
 */
async function checkPage(serverPort, page) {
	const url = `http://127.0.0.1:${serverPort}${page}`;
	/** @type {Response} */
	let response;
	try {
		response = await fetch(url, {
			signal: AbortSignal.timeout(requestTimeoutMs),
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.error(`${url} request failed: ${message}`);
		return false;
	}
	const body = await response.text();
	const hits = errorMarkers.filter((marker) => body.includes(marker));
	if (response.status !== 200)
		console.error(`${url} returned ${response.status}.`);
	if (hits.length > 0)
		console.error(`${url} body contains ${hits.join(', ')}.`);
	const ok = response.status === 200 && hits.length === 0;
	if (ok) console.log(`${url} returned 200.`);
	return ok;
}

async function stop() {
	if (stopped) return;
	stopped = true;
	if (!child.pid) return;
	try {
		process.kill(-child.pid, 'SIGTERM');
	} catch {
		try {
			child.kill('SIGTERM');
		} catch {
			return;
		}
	}
	await waitForExit(shutdownTimeoutMs);
	if (child.exitCode === null && child.signalCode === null) {
		try {
			process.kill(-child.pid, 'SIGKILL');
		} catch {
			// The process group is already gone.
		}
		await waitForExit(shutdownTimeoutMs);
	}
}

/** @param {number} timeoutMs */
function waitForExit(timeoutMs) {
	if (child.exitCode !== null || child.signalCode !== null)
		return Promise.resolve();
	return new Promise((resolve) => {
		const timer = setTimeout(() => {
			child.off('exit', onExit);
			resolve();
		}, timeoutMs);
		const onExit = () => {
			clearTimeout(timer);
			resolve();
		};
		child.once('exit', onExit);
	});
}
