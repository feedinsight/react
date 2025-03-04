interface ThemeConfig {
	primary_muted: string;
	background: string;
	primary: string;
	rounded: string;
	border: string;
	brand: string;
}

type ThemeOverrides = {
	dark?: Partial<ThemeConfig>;
	light?: Partial<ThemeConfig>;
};

const defaultThemes: Record<'dark' | 'light', ThemeConfig> = {
	dark: {
		primary_muted: '#a8a29e',
		background: '#0c0a09',
		primary: '#fafaf9',
		border: '#292524',
		brand: '#ea580c',
		rounded: '1rem'
	},
	light: {
		primary_muted: '#0c0a09',
		background: '#ffffff',
		primary: '#0c0a09',
		border: '#e7e5e4',
		brand: '#ea580c',
		rounded: '1rem'
	}
};

export type { ThemeConfig };

export const themeConfig = (overrides?: ThemeOverrides): Record<'dark' | 'light', ThemeConfig> => {
	return {
		dark: { ...defaultThemes.dark, ...(overrides?.dark || {}) },
		light: { ...defaultThemes.light, ...(overrides?.light || {}) }
	};
};
