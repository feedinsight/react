import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
	plugins: [
		react(),
		dts({
			include: ['src/widget/**/*'],
			outDir: 'dist'
		})
	],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/widget/index.tsx'),
			name: '@feedinsight/react',
			formats: ['es', 'cjs'],
			fileName: (format) => `index.${format === 'es' ? 'esm' : format}.js`
		},
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true
			}
		},
		rollupOptions: {
			external: ['react', 'react-dom'],
			output: {
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM'
				}
			}
		}
	}
});
