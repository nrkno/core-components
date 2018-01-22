import buble from 'rollup-plugin-buble'
import cjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import pkg from './package.json'
import resolve from 'rollup-plugin-node-resolve'
import serve from 'rollup-plugin-serve'
import uglify from 'rollup-plugin-uglify'

const isBuild = !process.env.ROLLUP_WATCH
const globals = {'react-dom': 'ReactDOM', react: 'React'}
const external = Object.keys(globals)
const plugins = [
  json(),
  resolve({browser: true}),           // Respect pkg.browser
  cjs({ignoreGlobal: true}),          // Do not tamper with `global`
  buble({objectAssign: 'assign'})     // Buble needed for JSX, Polyfill for Object.assign from utils.js
]

export default [{
  input: 'src/core-components.js',
  output: [
    {file: pkg.main, format: 'cjs'},  // CommonJS (for Node)
    {file: pkg.module, format: 'es'}  // ES module (for bundlers)
  ],
  external,                           // Do not include react in out package
  globals,
  plugins
}, {
  input: 'src/core-components.js',
  output: {
    file: pkg.browser,                // UDM for browsers
    format: 'umd',
    name: 'coreComponents',
    sourcemap: true
  },
  external,                           // Do not include react in out package
  globals,
  plugins: plugins.concat([
    isBuild && uglify(),              // Minify on build
    isBuild || serve(['src', 'dist']) // Serve on watch
  ]),
  watch: {
    exclude: 'dist/**',
    chokidar: true
  }
}]
