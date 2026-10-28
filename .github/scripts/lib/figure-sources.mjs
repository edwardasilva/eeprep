import fs from 'node:fs';
import path from 'node:path';

/**
 * WaveDrom `.json5` sources under a diagrams directory.
 * The style folder holds samples, not page figures, so it is skipped.
 * @param {string} dir
 * @param {string} styleDir
 * @param {string[]} out
 */
export function listFigureSources(dir, styleDir, out = []) {
	if (!fs.existsSync(dir)) return out;
	for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, ent.name);
		if (path.resolve(full) === styleDir) continue;
		if (ent.isDirectory()) listFigureSources(full, styleDir, out);
		else if (ent.name.endsWith('.json5')) out.push(full);
	}
	return out;
}
