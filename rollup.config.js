const buble = require('rollup-plugin-buble')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const resolve = require('rollup-plugin-node-resolve')
const serve = require('rollup-plugin-serve')
const uglify = require('rollup-plugin-uglify')
const {pkgs} = require('./bin/index.js')                      // Find all packages

const paths = pkgs.concat('.')                                // Path to all packages and root bundle
const globals = {'react-dom': 'ReactDOM', react: 'React'}     // Do not include react in out package
const plugins = [
  json(),                                                     // Enable treeshaking json imports
  resolve({browser: true}),                                   // Respect pkg.browser
  commonjs({ignoreGlobal: true}),                             // Let dependencies use the word `global`
  buble({objectAssign: 'assign'}),                            // Polyfill Object.assign from utils.js
  uglify()
]

export default paths.map((path, index) => {                   // Make config for all packages
  const pkg = require(`${path}/package.json`)
  const src = pkg.main.replace('.cjs.js', '.js')              // Source files is always just .js
  const watch = !index && process.env.ROLLUP_WATCH            // Only watch if first index
  const config = {
    input: `${path}/${src}`,
    output: [
      {file: `${path}/${pkg.main}`, format: 'cjs', globals},  // CommonJS (for Node)
      {file: `${path}/${pkg.module}`, format: 'es', globals}  // ES module (for bundlers)
    ],
    watch: {exclude: '**.*.(min|js)'},
    external: Object.keys(globals),
    plugins
  }

  if (watch) config.plugins.push(serve('bundle'))
  if (pkg.browser) {
    config.output.push({
      name: pkg.name.split('-').pop(),
      file: `${path}/${pkg.browser}`,                         // UDM for browsers
      format: 'umd',
      sourcemap: true,
      globals
    })
  }

  return config
})
