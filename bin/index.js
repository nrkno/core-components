const {execSync} = require('child_process')
const path = require('path')
const fs = require('fs')
const args = getProcessArgs()
const pkgs = getPackagePaths()

module.exports = {args, pkgs, getPackageName}

// Utilities -------------------------------------------------------------------
function getProcessArgs () {
  return process.argv.slice(2).reduce((args, arg) => {
    const [key, value = true] = arg.split('=')
    args[key.replace(/^-*/g, '')] = value
    return args
  }, {})
}

function getPackageName (path) {
  return path.split('/').pop()
}

function getPackagePaths () {
  const dir = path.join(process.cwd(), 'packages')
  return fs.readdirSync(dir).reduce((packages, file) => {
    const isPackage = fs.existsSync(path.join(dir, file, 'package.json'))
    return packages.concat(isPackage ? path.join(dir, file) : [])
  }, [])
}

// Exectution: install ---------------------------------------------------------
if (args.install) {
  pkgs.forEach((path) => {
    console.log(`Installing ${getPackageName(path)}`)
    execSync('npm install', {cwd: path, stdio: 'inherit'})
    console.log('') // Insert new line
  })
}

// Exectution: publish ---------------------------------------------------------
if (args.publish) {
  const update = pkgs.filter((path) => args[getPackageName(path)])
  const action = args.publish.replace(/./, (m) => m.toUpperCase()) // Title case action
  const names = update.map(getPackageName).join(', ')

  // Update packages
  update.forEach((path) => {
    console.log(`Publishing ${getPackageName(path)}`)
    execSync(`npm version ${args.publish} -m 'Release ${args.publish} %s'`, {cwd: path, stdio: 'inherit'})
    execSync(`git push && git push --tags && npm publish`, {cwd: path, stdio: 'inherit'})
    console.log('') // Insert new line
  })

  // Update main package
  console.log(`Updating version for core-components`)
  execSync(`git commit -am "${action} ${names}" && git push`, {cwd: process.cwd(), stdio: 'inherit'})
  execSync(`npm version ${args.publish}`, {cwd: process.cwd(), stdio: 'inherit'})
  execSync(`git push && git push --tags`, {cwd: process.cwd(), stdio: 'inherit'})
  console.log('') // Insert new line
}
