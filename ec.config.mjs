// ec.config.mjs (project root) — Expressive Code, used by Starlight for all code blocks
import { defineEcConfig } from '@astrojs/starlight/expressive-code';
import fs from 'node:fs';
const light = JSON.parse(
	fs.readFileSync('./src/styles/ec-eeprep-light.json', 'utf8'),
);
const dark = JSON.parse(
	fs.readFileSync('./src/styles/ec-eeprep-dark.json', 'utf8'),
);
export default defineEcConfig({
	themes: [dark, light], // Starlight maps first dark / first light theme to data-theme
	useStarlightDarkModeSwitch: true,
	styleOverrides: {
		borderRadius: '4px',
		borderColor: 'var(--eep-rule)',
		borderWidth: '1px',
		codeFontFamily: 'var(--eep-font-mono)',
		codeFontSize: '0.875rem',
		codeLineHeight: '1.75',
		codePaddingBlock: '1.125rem',
		codePaddingInline: '1.375rem',
		uiFontFamily: 'var(--eep-font-mono)',
		uiFontSize: '0.71875rem',
		frames: {
			shadowColor: 'transparent',
			editorTabBarBackground: 'var(--eep-sunken)',
			editorActiveTabBackground: 'var(--eep-sunken)',
			editorActiveTabIndicatorTopColor: 'transparent',
			editorActiveTabIndicatorBottomColor: 'var(--eep-accent)',
			editorTabBarBorderBottomColor: 'var(--eep-rule)',
			terminalTitlebarBackground: 'var(--eep-sunken)',
			terminalBackground: 'var(--eep-sunken)',
			frameBoxShadowCssValue: 'none',
		},
	},
});
