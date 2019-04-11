// using require instead of import to play nicely with travis ci
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const serve = require('rollup-plugin-serve')
const json = require('rollup-plugin-json')
const { uglify } = require('rollup-plugin-uglify')
const { pkgs, getPackageName } = require('./bin/index.js') // Find all packages
const { version } = require('./package.json')
const fs = require('fs')

;['readme.md', 'packages/readme.md'].forEach((path) => {
  const readme = String(fs.readFileSync(path))
  const versioned = readme.replace(/core-components\/major\/\d+/, `core-components/major/${version.match(/\d+/)}`)
  fs.writeFileSync(path, versioned)
})

const minify = uglify({ output: { comments: /^!/ } })
const globals = { 'react-dom': 'ReactDOM', react: 'React' } // Exclude from output
const external = Object.keys(globals)
const plugins = [
  json(),
  resolve(),
  commonjs(),
  babel({ presets: [['@babel/preset-env', { modules: false }]] }),
  !process.env.ROLLUP_WATCH || serve('packages')
]

export default pkgs.reduce((all, path) => {
  const { version } = require(`${path}/package.json`)
  const file = getPackageName(path)
  const name = file.replace(/-./g, (m) => m.slice(-1).toUpperCase())
  const jsx = name.replace(/./, (m) => m.toUpperCase())

  return all.concat({
    input: `${path}/${file}.js`, // JS CJS
    output: {
      format: 'cjs',
      file: `${path}/${file}.cjs.js`
    },
    external,
    plugins
  }, {
    input: `${path}/${file}.js`, // JS UMD
    output: {
      format: 'umd',
      file: `${path}/${file}.min.js`,
      banner: `/*! @nrk/${file} v${version} - Copyright (c) 2017-${new Date().getFullYear()} NRK */`,
      footer: `window.customElements.define('${file}', ${name})`,
      sourcemap: true,
      globals,
      name
    },
    external,
    plugins: plugins.concat(minify)
  }, {
    input: `${path}/${file}.jsx`, // JSX CJS
    output: {
      format: 'cjs',
      file: `${path}/jsx.js`,
      globals
    },
    external,
    plugins
  }, {
    input: `${path}/${file}.jsx`, // JSX UMD (only used in docs)
    output: {
      format: 'umd',
      file: `${path}/${file}.jsx.js`,
      name: jsx,
      sourcemap: true,
      globals
    },
    external,
    plugins
  })
}, [])
