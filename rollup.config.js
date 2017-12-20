import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import buble from 'rollup-plugin-buble'
import serve from 'rollup-plugin-serve'
import pkg from './package.json'

const isBuild = !process.env.ROLLUP_WATCH
const plugins = [
  buble({objectAssign: 'assign'}),    // Polyfill for Object.assign from utils.js
  replace({'@VERSION': pkg.version})  // Replace all instances of @VERSION
]

export default [{
  input: 'src/core-components.js',
  output: [
    {file: pkg.main, format: 'cjs'},  // CommonJS (for Node)
    {file: pkg.module, format: 'es'}  // ES module (for bundlers)
  ],
  plugins
}, {
  input: 'src/core-components.js',
  output: {
    file: pkg.browser,                // UDM for browsers
    format: 'umd',
    name: 'coreComponents',
    sourcemap: true
  },
  plugins: plugins.concat([
    isBuild && uglify(),              // Minify on build
    isBuild || serve(['src', 'dist']) // Serve on watch
  ]),
  watch: { include: 'src/*' }
}]
