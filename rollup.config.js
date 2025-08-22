import { defineConfig } from 'rollup';
import terser from '@rollup/plugin-terser';

export default defineConfig({
  input: 'src/sdk/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'WorkforceSDK',
      sourcemap: true,
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
      }
    },
    {
      file: 'dist/index.umd.min.js',
      format: 'umd',
      name: 'WorkforceSDK',
      sourcemap: true,
      plugins: [terser()],
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
      }
    }
  ],
  external: ['react', 'react-dom'],
  plugins: []
});
