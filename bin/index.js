const {execSync} = require('child_process')
const path = require('path')
const fs = require('fs')
const args = getProcessArgs()
const pkgs = getPackages()

// Utilities -------------------------------------------------------------------
function getProcessArgs () {
  return process.argv.slice(2).reduce((args, arg) => {
    const [key, value = true] = arg.split('=')
    args[key.replace(/^-*/g, '')] = value
    return args
  }, {})
}

function getPackages () {
  const dir = path.join(process.cwd(), 'packages')
  return fs.readdirSync(dir).reduce((packages, file) => {
    const isPackage = fs.existsSync(path.join(dir, file, 'package.json'))
    return packages.concat(isPackage ? path.join(dir, file) : [])
  }, [])
}

// Exectution ------------------------------------------------------------------
if (args.install) {
  pkgs.forEach((cwd) => {
    const name = cwd.split('/').pop()
    console.log(`Installing ${name}`)
    execSync('npm install', {cwd, stdio: 'inherit'})
    console.log('') // Insert new line
  })
}
