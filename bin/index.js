const {execSync} = require('child_process')
const path = require('path')
const fs = require('fs')
const args = getProcessArgs()
const pkgs = getPackagePaths()

module.exports = {args, pkgs}

// Utilities -------------------------------------------------------------------
function getProcessArgs () {
  return process.argv.slice(2).reduce((args, arg) => {
    const [key, value = true] = arg.split('=')
    args[key.replace(/^-*/g, '')] = value
    return args
  }, {})
}

function getPackagePaths () {
  const dir = path.join(process.cwd(), 'packages')
  return fs.readdirSync(dir).reduce((packages, file) => {
    const isPackage = fs.existsSync(path.join(dir, file, 'package.json'))
    return packages.concat(isPackage ? path.join(dir, file) : [])
  }, [])
}

// Exectution ------------------------------------------------------------------
if (args.install) {
  pkgs.forEach((path) => {
    const name = path.split('/').pop()
    console.log(`Installing ${name}`)
    execSync('npm install', {cwd: path, stdio: 'inherit'})
    console.log('') // Insert new line
  })
}
