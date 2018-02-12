const buble = require('rollup-plugin-buble')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const resolve = require('rollup-plugin-node-resolve')
const serve = require('rollup-plugin-serve')
const uglify = require('rollup-plugin-uglify')
const {pkgs} = require('./bin/index.js')                   // Find all packages

const isBuild = !process.env.ROLLUP_WATCH
const globals = {'react-dom': 'ReactDOM', react: 'React'} // Do not include react in out package
const external = Object.keys(globals)                     // Do not include react in out package
const plugins = [
  json(),                                                 // Enable treeshaking json imports
  resolve({browser: true}),                               // Respect pkg.browser
  commonjs({ignoreGlobal: true}),                         // Let dependencies use the word `global`
  buble({objectAssign: 'assign'})                         // Polyfill Object.assign from utils.js
]

export default pkgs.concat('.').reduce((acc, path) => {   // Loop all packages and add root bundle
  const pkg = require(`${path}/package.json`)
  const src = pkg.main.replace('.cjs.js', '.js')          // Source files is always just .js
  const config = [{
    input: `${path}/${src}`,
    output: [
      {file: `${path}/${pkg.main}`, format: 'cjs'},       // CommonJS (for Node)
      {file: `${path}/${pkg.module}`, format: 'es'}       // ES module (for bundlers)
    ],
    external,
    globals,
    plugins
  }]

  if (pkg.browser) {
    config.push({
      input: `${path}/${src}`,
      output: {
        file: pkg.browser,                                  // UDM for browsers
        format: 'umd',
        name: 'coreComponents',
        sourcemap: true
      },
      watch: { exclude: '**.*.(min|js)' },
      plugins: plugins.concat(isBuild ? uglify() : serve('bundle')),
      external,
      globals
    })
  }

  return acc.concat(config)
}, [])
