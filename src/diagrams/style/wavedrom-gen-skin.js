// Generates theme/wavedrom-skin-eeprep.js from WaveDrom's default skin (geometry unchanged; style + colours replaced).
const fs = require('fs');
const base = JSON.parse(
	JSON.stringify(require('wavedrom/skins/default.js').default),
);
const INK = '#17181c',
	ACCENT = '#a3201d',
	MUTE = '#8a8d94',
	FILL = '#ffffff',
	GRID = '#e7e5e0';
const MONO =
	"'JetBrains Mono Variable','JetBrains Mono',ui-monospace,monospace";
const SERIF = "'Newsreader Variable','Newsreader',Georgia,serif";
const ink = `var(--wd-ink,${INK})`;
const S = '.WaveDrom '; // scope every rule: the SVG is inlined into pages next to other SVGs
const css = [
	`${S}text{font-family:${MONO};font-size:11.5px;font-style:normal;font-weight:400;fill:var(--wd-text,${INK});fill-opacity:1}`,
	// signal names (direct <text> of each lane group, not the draw group)
	`${S}[id^="wavelane_"]:not([id^="wavelane_draw"])>text{font-family:${SERIF};font-style:italic;font-size:17px;fill:${ink}}`,
	`${S}.h1,${S}.h2,${S}.h3,${S}.h4,${S}.h5,${S}.h6{font-family:${SERIF};font-style:normal;font-weight:500;fill:${INK}}`,
	`${S}.h1{font-size:28px}${S}.h2{font-size:24px}${S}.h3{font-size:20px}${S}.h4{font-size:17px}${S}.h5{font-size:14px}${S}.h6{font-size:12px}`,
	`${S}.info{fill:${ink}}${S}.muted{fill:${MUTE}}${S}.success,${S}.warning{fill:${INK}}${S}.error{fill:${ACCENT}}`,
	// strokes: 1.75px everywhere that draws a level/edge
	`.eepwd-s1,.eepwd-s4{fill:none;stroke:${ink};stroke-width:1.75px;stroke-linecap:round;stroke-linejoin:round}`,
	`.eepwd-s2{fill:none;stroke:${ink};stroke-width:.75px;stroke-opacity:.4;stroke-linecap:round}`, // x hatch
	`.eepwd-s3{fill:none;stroke:${ink};stroke-width:1.75px;stroke-dasharray:1,4;stroke-linecap:round}`, // pull-up/down
	`.eepwd-s5{fill:${FILL};stroke:none}`, // gap mask
	`.eepwd-s6{fill:${ink};stroke:none}`, // clock edge arrows
	// data fills: '=' '2' plain, '3' blue tint, '4' green tint, '5' amber tint, '6'-'9' sunken
	`.eepwd-s7{fill:var(--wd-fill,${FILL})}.eepwd-s8{fill:var(--wd-fill,#eef4f8)}.eepwd-s9{fill:var(--wd-fill,#eff4ea)}`,
	`.eepwd-s10{fill:var(--wd-fill,#fbf3e4)}.eepwd-s11,.eepwd-s12,.eepwd-s13,.eepwd-s14{fill:var(--wd-fill,#f6f5f1)}`,
	`.eepwd-s15{fill:${MUTE};stroke:none}.eepwd-s16{fill:none;stroke:${MUTE};stroke-width:1px}`,
	// renderer hard-codes these inline; override
	`${S}[id^="waves_"]>rect{fill:none!important}`,
	`${S}[id^="gmarks_"] g{stroke:${GRID}!important;stroke-width:.75px!important;stroke-dasharray:2,3!important}`,
	`${S}[id^="wavelane_"] path[style*="marker"],${S}[id^="wavearcs_"] path{stroke:${MUTE}!important}`,
	// ONE highlighted signal: name: ['tspan', {class:'hl'}, 'MOSI']
	`${S}[id^="wavelane_"]:has(>text .hl){--wd-ink:${ACCENT};--wd-fill:#f8ecea}`,
].join('');
base[2][2] = css;
let out = JSON.stringify(base)
	.replace(/#0041c4/g, MUTE)
	// brick paths are cloned into <use> shadow trees, where '.WaveDrom .s1' cannot match: use unique unscoped classes
	.replace(/"class":"s(\d+)"/g, '"class":"eepwd-s$1"');
fs.writeFileSync(
	require('path').join(__dirname, 'wavedrom-skin-eeprep.js'),
	`/* eeprep.com WaveDrom skin — "Clean modern textbook" (light; dark via Diagram.astro palette swap).
 * Geometry = WaveDrom ${require('wavedrom/package.json').version} default skin; styles/colours replaced.
 * Browser: <script src="wavedrom-skin-eeprep.js"> then source { config: { skin: 'eeprep' } }.
 * Node:    const skins = Object.assign({}, require('wavedrom/skins/default.js'), require('./wavedrom-skin-eeprep.js'));
 * Highlight ONE signal: { name: ['tspan', {class: 'hl'}, 'MOSI'], wave: ... }  (needs CSS :has — all evergreen browsers)
 * Regenerate: node wavedrom-gen-skin.js (see theme-spec §9.6). */
var WaveSkin = WaveSkin || {};
WaveSkin.eeprep = ${out};
try { module.exports = WaveSkin; } catch (err) {}
`,
);
console.log('ok', css.length);
