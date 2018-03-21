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
    buble(),                                                  // You know, like Babel
    isWatch || uglify(),                                      // Minify
    isWatch && serve('bundle')                                // Serve on watch
  ]
}

export default ['.'].concat(pkgs).reduce((acc, path) => {     // Make config for all packages (including root)
  const pkg = require(`${path}/package.json`)
  const base = `${path}/${pkg.main.replace(/[^/]+$/, '')}`    // Merge path and path from pkg.main
  const file = pkg.name.split('/').pop()                      // Name without scope
  const name = file.replace(/-./g, (m) => m[1].toUpperCase()) // Camel case

  return acc.concat(Object.assign({
    input: `${base}${file}.js`,                               // Vanilla JS
    output: {
      file: `${path}/${pkg.main}`,
      format: 'umd',
      sourcemap: true,
      name
    }
  }, config), Object.assign({
    input: `${base}${file}.jsx`,                              // JSX
    output: {
      file: `${base}jsx/index.js`,
      format: 'umd',
      sourcemap: true,
      name: name.replace(/./, (m) => m.toUpperCase()),        // Title case
      globals
    }
  }, config))
}, [])
