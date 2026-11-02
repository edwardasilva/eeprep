import fs from 'node:fs';

// starlight-site-graph 0.5.0 deep-merges config with Object.entries().
// A Map is an object, so that merge turns Zod's styleRules Map into {}.
// Astro 7's Zod then rejects the object where it expects a Map.
const file = new URL(
	'../../node_modules/starlight-site-graph/config/index.ts',
	import.meta.url,
);
const source = fs.readFileSync(file, 'utf8');
const needle =
	"return (item && typeof item === 'object' && !Array.isArray(item));";
const patched =
	"return (item && typeof item === 'object' && !Array.isArray(item) && !(item instanceof Map));";

if (source.includes(patched)) {
	console.log('starlight-site-graph Map patch already applied.');
	process.exit(0);
}
if (!source.includes(needle)) {
	console.error(
		'Could not patch starlight-site-graph. The pinned 0.5.0 source changed.',
	);
	process.exit(1);
}

fs.writeFileSync(file, source.replace(needle, patched));
console.log(
	'Patched starlight-site-graph so styleRules stays a Map on Astro 7.',
);
