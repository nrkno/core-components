const buble = require('rollup-plugin-buble')
const commonjs = require('rollup-plugin-commonjs')
const fs = require('fs')
const json = require('rollup-plugin-json')
const postcss = require('rollup-plugin-postcss')
const postcssImport = require('postcss-import')
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

export default paths.reduce((acc, path, index) => {           // Make config for all packages
  const pkg = require(`${path}/package.json`)
  const src = pkg.main.replace('.cjs.js', '.js')              // Source files is always just .js
  const jsx = `${path}/${src.replace('.js', '.jsx')}`         // Potential path to JSX-file
  const name = pkg.name.split('-').pop()
  const watch = !index && process.env.ROLLUP_WATCH            // Only watch if first index
  const config = {
    input: `${path}/${src}`,
    output: [
      {file: `${path}/${pkg.main}`, format: 'cjs', globals},  // CommonJS (for Node)
      {file: `${path}/${pkg.module}`, format: 'es', globals}  // ES module (for bundlers)
    ],
    watch: {include: '**/*.(css|js)'},
    external: Object.keys(globals),
    plugins
  }

  if (watch) config.plugins.push(serve('bundle'))
  if (pkg.browser) {
    config.plugins.unshift(postcss({
      plugins: [postcssImport],
      extract: pkg.browser.replace('.js', '.css'),
      minimize: true
    }))
    config.output.push({
      file: `${path}/${pkg.browser}`,                         // UDM for browsers
      format: 'umd',
      sourcemap: true,
      globals,
      name
    })
  }

  // Build jsx
  if (fs.existsSync(jsx)) {
    acc.push({
      input: jsx,
      output: {
        file: `${path}/jsx/index.js`,
        format: 'umd',
        sourcemap: true,
        globals,
        name
      },
      external: Object.keys(globals),
      plugins
    })
  }

  return acc.concat(config)
}, [])
