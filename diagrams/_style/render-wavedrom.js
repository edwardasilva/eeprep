#!/usr/bin/env node
// eeprep WaveDrom renderer: wavedrom-cli 3.2.0 hard-codes its skins (default/narrow/lowkey) and cannot load a
// custom skin, so this does the same thing as the CLI with ours added.  Usage: node render-wavedrom.js in.json5 out.svg
const fs = require('fs'), path = require('path');
const json5 = require('json5'), onml = require('onml'), wavedrom = require('wavedrom');
const skins = Object.assign({}, require('wavedrom/skins/default.js'),
  require(path.join(__dirname, 'wavedrom-skin-eeprep.js')));
const [, , input, output] = process.argv;
const source = json5.parse(fs.readFileSync(input, 'utf8'));
source.config = Object.assign({ skin: 'eeprep' }, source.config);
let svg = onml.s(wavedrom.renderAny(0, source, skins));
// Normalise renderer-inlined colours to palette sentinels so Diagram.astro's swap catches everything
svg = svg.replace(/stroke:#0041c4|stroke:#00F\b|stroke:#F00\b/g, 'stroke:#8a8d94')
         .replace(/style="stroke:none;fill:white"/g, 'style="stroke:none;fill:none"')
         .replace(/stroke:#888;stroke-width:0\.5;stroke-dasharray:1,3/g, 'stroke:#e7e5e0;stroke-width:0.75;stroke-dasharray:2,3');
fs.writeFileSync(output, svg);
console.log('wrote', output);
