import terser from '@rollup/plugin-terser';

export default [
  // CommonJS build
  {
    input: 'src/sdk/index.js',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      })
    ]
  },
  // ES Module build
  {
    input: 'src/sdk/index.js',
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      })
    ]
  },
  // UMD build for browser
  {
    input: 'src/sdk/index.js',
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'PeyDeySDK',
      sourcemap: true,
      exports: 'named',
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
      }
    },
    external: ['react', 'react-dom'],
    plugins: [
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      })
    ]
  }
];
