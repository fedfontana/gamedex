import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			'$types': 'src/types',
			'$types/*': 'src/types/*',
			'$components': 'src/components',
			'$components/*': 'src/components/*',
			'$models': 'src/models',
			'$models/*': 'src/models/*',
		}
	}
};

export default config;
