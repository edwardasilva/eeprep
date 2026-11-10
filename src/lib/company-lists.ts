// Build-time loader for the company list page. Reads every
// company-lists/data/<country>/<state>/<region>.csv file in the submodule,
// drops staffing-eligibility columns, and returns the rows plus the labels
// and filter values the page needs. New state files show up with no code
// change. There is no runtime fetch.

import fs from 'node:fs';
import path from 'node:path';

// Astro bundles this file into dist/ during the build, so import.meta.url
// is no longer the source path. process.cwd() is the repo root for
// `astro build` and `astro dev`.
const ROOT = process.cwd();
const SUBMODULE = path.join(ROOT, 'company-lists');
const DATA = path.join(SUBMODULE, 'data');
const SCHEMA = path.join(SUBMODULE, 'schema', 'company.schema.json');
const INDUSTRIES = path.join(SUBMODULE, 'schema', 'industries.csv');

// Column names that must never be rendered or searched, if a future file
// adds them. Matched against the header, not the cell values.
const HIDDEN_COLUMN =
	/visa|clearance|citizenship|sponsor|sponsorship|work[_-]?auth/i;

const INDUSTRY_LABELS: Record<string, string> = {
	'aerospace-defense': 'Aerospace and defense',
	automotive: 'Automotive',
	'construction-engineering': 'Construction and engineering',
	'consumer-products': 'Consumer products',
	'education-research': 'Education and research',
	electronics: 'Electronics',
	'energy-utilities': 'Energy and utilities',
	government: 'Government',
	healthcare: 'Healthcare',
	industrial: 'Industrial',
	'mining-materials': 'Mining and materials',
	'software-it': 'Software and IT',
	telecommunications: 'Telecommunications',
};

export type CompanyRow = {
	id: string;
	name: string;
	website: string;
	careersUrl: string;
	industry: string;
	industryLabel: string;
	field: string;
	fieldLabel: string;
	city: string;
	state: string;
	region: string;
	country: string;
	sourceUrl: string;
	notes: string;
	search: string;
};

export type CompanyFilter = {
	name: 'state' | 'region' | 'industry' | 'field' | 'city';
	label: string;
	options: { value: string; label: string }[];
};

export type CompanyListData = {
	rows: CompanyRow[];
	filters: CompanyFilter[];
	coverage: string;
};

/**
 * Parse a CSV string into rows of cells. Handles quoted fields, escaped
 * quotes, and LF or CRLF line breaks inside quotes.
 */
export function parseCsv(text: string): string[][] {
	const input = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
	const rows: string[][] = [];
	let row: string[] = [];
	let cell = '';
	let i = 0;
	let quoted = false;

	const pushCell = () => {
		row.push(cell);
		cell = '';
	};
	const pushRow = () => {
		pushCell();
		if (row.length > 1 || row[0] !== '') {
			rows.push(row);
		}
		row = [];
	};

	while (i < input.length) {
		const ch = input[i];
		if (quoted) {
			if (ch === '"') {
				if (input[i + 1] === '"') {
					cell += '"';
					i += 2;
					continue;
				}
				quoted = false;
				i += 1;
				continue;
			}
			cell += ch;
			i += 1;
			continue;
		}
		if (ch === '"') {
			quoted = true;
			i += 1;
			continue;
		}
		if (ch === ',') {
			pushCell();
			i += 1;
			continue;
		}
		if (ch === '\n') {
			pushRow();
			i += 1;
			continue;
		}
		if (ch === '\r') {
			if (input[i + 1] === '\n') {
				i += 1;
			}
			pushRow();
			i += 1;
			continue;
		}
		cell += ch;
		i += 1;
	}
	if (quoted) {
		throw new Error('CSV ends inside a quoted field.');
	}
	if (cell !== '' || row.length > 0) {
		pushRow();
	}
	return rows;
}

function industryLabel(slug: string): string {
	if (!slug) {
		return '';
	}
	if (INDUSTRY_LABELS[slug]) {
		return INDUSTRY_LABELS[slug];
	}
	return slug
		.split('-')
		.map((part, index) => {
			if (part === 'it') {
				return 'IT';
			}
			if (part === 'ee') {
				return 'EE';
			}
			if (index === 0) {
				return part.charAt(0).toUpperCase() + part.slice(1);
			}
			return part;
		})
		.join(' ');
}

function loadFieldLabels(): Map<string, string> {
	const labels = new Map<string, string>();
	if (!fs.existsSync(INDUSTRIES)) {
		return labels;
	}
	const rows = parseCsv(fs.readFileSync(INDUSTRIES, 'utf8'));
	const header = rows[0] ?? [];
	const industryIdx = header.indexOf('industry');
	const fieldIdx = header.indexOf('field');
	const labelIdx = header.indexOf('label');
	if (industryIdx === -1 || fieldIdx === -1 || labelIdx === -1) {
		throw new Error(
			'schema/industries.csv is missing industry, field, or label.',
		);
	}
	for (const row of rows.slice(1)) {
		const field = row[fieldIdx] ?? '';
		const label = row[labelIdx] ?? '';
		if (field && label) {
			labels.set(field, label);
		}
	}
	return labels;
}

function loadExpectedColumns(): string[] {
	if (!fs.existsSync(SCHEMA)) {
		throw new Error(
			`Missing ${path.relative(ROOT, SCHEMA)}. Initialize the company-lists submodule.`,
		);
	}
	const schema = JSON.parse(fs.readFileSync(SCHEMA, 'utf8')) as {
		['x-columns']?: string[];
	};
	const columns = schema['x-columns'];
	if (!Array.isArray(columns) || columns.length === 0) {
		throw new Error('company.schema.json is missing x-columns.');
	}
	return columns;
}

function walkCsvFiles(dir: string, acc: string[]): void {
	if (!fs.existsSync(dir)) {
		return;
	}
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			walkCsvFiles(full, acc);
			continue;
		}
		if (entry.isFile() && entry.name.endsWith('.csv')) {
			acc.push(full);
		}
	}
}

function optionList(
	rows: CompanyRow[],
	valueOf: (row: CompanyRow) => string,
	labelOf: (value: string, row: CompanyRow) => string,
): { value: string; label: string }[] {
	const seen = new Map<string, string>();
	for (const row of rows) {
		const value = valueOf(row);
		if (!value || seen.has(value)) {
			continue;
		}
		seen.set(value, labelOf(value, row));
	}
	return [...seen.entries()]
		.sort((a, b) => a[1].localeCompare(b[1], 'en', { sensitivity: 'base' }))
		.map(([value, label]) => ({ value, label }));
}

function coverageSentence(rows: CompanyRow[]): string {
	const byState = new Map<string, Set<string>>();
	for (const row of rows) {
		const regions = byState.get(row.state) ?? new Set();
		regions.add(row.region);
		byState.set(row.state, regions);
	}
	const parts = [...byState.entries()]
		.sort((a, b) => a[0].localeCompare(b[0], 'en'))
		.map(([state, regions]) => {
			const list = [...regions].sort((a, b) => a.localeCompare(b, 'en'));
			if (list.length === 1) {
				return `${list[0]}, ${state}`;
			}
			if (list.length === 2) {
				return `${list[0]} and ${list[1]}, ${state}`;
			}
			return `${list.slice(0, -1).join(', ')}, and ${list.at(-1)}, ${state}`;
		});
	if (parts.length === 0) {
		return '';
	}
	if (parts.length === 1) {
		return parts[0];
	}
	if (parts.length === 2) {
		return `${parts[0]} and ${parts[1]}`;
	}
	return `${parts.slice(0, -1).join(', ')}, and ${parts.at(-1)}`;
}

export function loadCompanyList(): CompanyListData {
	if (!fs.existsSync(DATA)) {
		throw new Error(
			'company-lists/data is missing. Run git submodule update --init company-lists.',
		);
	}

	const expected = loadExpectedColumns();
	const fieldLabels = loadFieldLabels();
	const files: string[] = [];
	walkCsvFiles(DATA, files);
	files.sort();
	if (files.length === 0) {
		throw new Error('company-lists/data has no CSV files.');
	}

	const rows: CompanyRow[] = [];
	for (const file of files) {
		const rel = path.relative(ROOT, file);
		const parts = path.relative(DATA, file).split(path.sep);
		if (parts.length !== 3 || !parts[2].endsWith('.csv')) {
			continue;
		}
		const table = parseCsv(fs.readFileSync(file, 'utf8'));
		if (table.length === 0) {
			throw new Error(`${rel} is empty.`);
		}
		const header = table[0];
		if (header.join(',') !== expected.join(',')) {
			throw new Error(
				`${rel} header does not match schema/company.schema.json.`,
			);
		}
		const hidden = new Set(header.filter((name) => HIDDEN_COLUMN.test(name)));
		for (let i = 1; i < table.length; i += 1) {
			const cells = table[i];
			if (cells.length !== header.length) {
				throw new Error(
					`${rel}:${i + 1} has ${cells.length} cells, expected ${header.length}.`,
				);
			}
			const raw: Record<string, string> = {};
			header.forEach((name, index) => {
				if (!hidden.has(name)) {
					raw[name] = cells[index] ?? '';
				}
			});
			const field = raw.field ?? '';
			const industry = raw.industry ?? '';
			const industryLabelText = industryLabel(industry);
			const fieldLabel = field
				? (fieldLabels.get(field) ?? industryLabel(field))
				: '';
			const search = [
				raw.name,
				raw.city,
				raw.state,
				raw.region,
				raw.country,
				industry,
				industryLabelText,
				field,
				fieldLabel,
				raw.notes,
			]
				.filter(Boolean)
				.join(' ')
				.toLowerCase();
			rows.push({
				id: raw.id ?? '',
				name: raw.name ?? '',
				website: raw.website ?? '',
				careersUrl: raw.careers_url ?? '',
				industry,
				industryLabel: industryLabelText,
				field,
				fieldLabel,
				city: raw.city ?? '',
				state: raw.state ?? '',
				region: raw.region ?? '',
				country: raw.country ?? '',
				sourceUrl: raw.source_url ?? '',
				notes: raw.notes ?? '',
				search,
			});
		}
	}

	if (rows.length === 0) {
		throw new Error('company-lists/data has no company rows.');
	}

	rows.sort((a, b) => {
		const byName = a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
		if (byName !== 0) {
			return byName;
		}
		return a.city.localeCompare(b.city, 'en', { sensitivity: 'base' });
	});

	const filters: CompanyFilter[] = [
		{
			name: 'state',
			label: 'State',
			options: optionList(
				rows,
				(row) => row.state,
				(value) => value,
			),
		},
		{
			name: 'region',
			label: 'Region',
			options: optionList(
				rows,
				(row) => row.region,
				(value) => value,
			),
		},
		{
			name: 'industry',
			label: 'Industry',
			options: optionList(
				rows,
				(row) => row.industry,
				(_value, row) => row.industryLabel,
			),
		},
		{
			name: 'field',
			label: 'Field',
			options: optionList(
				rows,
				(row) => row.field,
				(_value, row) => row.fieldLabel,
			),
		},
		{
			name: 'city',
			label: 'City',
			options: optionList(
				rows,
				(row) => row.city,
				(value) => value,
			),
		},
	];

	return { rows, filters, coverage: coverageSentence(rows) };
}
