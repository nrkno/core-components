const buble = require('rollup-plugin-buble')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const resolve = require('rollup-plugin-node-resolve')
const serve = require('rollup-plugin-serve')
const uglify = require('rollup-plugin-uglify')
const {pkgs} = require('./bin/index.js')                      // Find all packages

const isWatch = Boolean(process.env.ROLLUP_WATCH)
const globals = {'react-dom': 'ReactDOM', react: 'React'}     // Do not include react in out package
const config = {
  watch: {include: '**/*.(css|js|jsx)'},
  external: Object.keys(globals),
  plugins: [
    json(),                                                   // Enable treeshaking json imports
    resolve({browser: true}),                                 // Respect pkg.browser
    commonjs({ignoreGlobal: true}),                           // Let dependencies use the word `global`
    buble({objectAssign: 'assign'}),                          // Polyfill Object.assign from utils.js
    isWatch || uglify(),                                      // Minify on build
    isWatch && serve('packages')                              // Serve on watch
  ]
}

function assignEach (targets, ...sources) {
  return targets.map((target) => Object.assign({}, ...sources, target))
}

function camelCase (str) {
  return str.replace(/-+\w/g, (m) => m.slice(-1).toUpperCase())
}

export default pkgs.reduce((acc, path, index) => {            // Make config for all packages
  const pkg = require(`${path}/package.json`)
  const file = pkg.name.split('/').pop()                      // Name without scope
  const name = camelCase(file)
  const output = {sourcemap: true, name, globals}

  return acc.concat(assignEach([{
    input: `${path}/${file}.js`,                              // Vanilla JS
    output: assignEach([
      {file: `${path}/${pkg.main}`, format: 'cjs'},           // CommonJS (for Node)
      {file: `${path}/${pkg.module}`, format: 'es'},          // ES module (for bundlers)
      {file: `${path}/${pkg.browser}`, format: 'umd'}         // UDM for browsers
    ], output)
  }, {
    input: `${path}/${file}.jsx`,                             // JSX
    output: assignEach([{
      file: `${path}/jsx/index.js`,
      name: `${name.replace('core', '')}`,
      format: 'umd'
    }], output)
  }], config))
}, [])
