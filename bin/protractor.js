import path from 'path'
import dotenv from 'dotenv'
import reporters from 'jasmine-reporters'

const capabilities = [
  // chrome: {
  //   browserName: 'Chrome',
  //   browser_version: '72.0',
  //   os: 'Windows',
  //   os_version: '10',
  // },
  // chrome37: {
  //   browserName: 'Chrome',
  //   os: 'Windows',
  //   os_version: '10',
  //   browser_version: '37',
  // },
  // chrome46: {
  //   browserName: 'Chrome',
  //   os: 'Windows',
  //   os_version: '10',
  //   browser_version: '46',
  // },
  // chrome57: {
  //   browserName: 'Chrome',
  //   os: 'Windows',
  //   os_version: '10',
  //   browser_version: '57',
  // },
  // edge: {
  //   browserName: 'Edge',
  //   os: 'Windows',
  //   os_version: '10'
  // },
  // edge17: {
  //   browserName: 'Edge',
  //   browser_version: '17.0',
  //   os: 'Windows',
  //   os_version: '10'
  // },
  // edge18: {
  //   browserName: 'Edge',
  //   browser_version: '18.0',
  //   os: 'Windows',
  //   os_version: '10'
  // },
  // edge13: {
  //   browserName: 'Edge',
  //   os: 'Windows',
  //   os_version: '10',
  //   browser_version: '13.0',
  //   resolution: '1024x768'
  // },
  // firefox: {
  //   browserName: 'Firefox',
  //   os: 'Windows',
  //   os_version: '10'
  // },
  {
    browserName: 'firefox',
    // os: 'Windows',
    // os_version: '7',
    // browser_version: '44.0'
  },
  // {
  //   browserName: 'Firefox',
  //   os: 'Windows',
  //   os_version: '10',
  //   browser_version: '52.0'
  // },
  // {
  //   browserName: 'IE',
  //   os: 'Windows',
  //   browser_version: '10'
  // },
  // {
  //   browserName: 'IE',
  //   browser_version: '11',
  //   os: 'Windows',
  //   os_version: '10'
  // }
  // },
  // ie11win7: {
  //   browserName: 'IE',
  //   os: 'Windows',
  //   os_version: '7',
  //   browser_version: '11'
  // },
  // ipad: {
  //   browserName: 'iPad',
  //   platform: 'MAC',
  //   device: 'iPad Pro',
  //   real_mobile: 'true',
  //   nativeWebTap: 'true'
  // },
  // iphone8: {
  //   browserName: 'iPhone',
  //   platform: 'MAC',
  //   device: 'iPhone 8',
  //   real_mobile: 'true',
  //   nativeWebTap: 'true'
  // },
  // iphoneSE: {
  //   browserName: 'iPhone',
  //   os_version: '11.2',
  //   platform: 'MAC',
  //   device: 'iPhone SE',
  //   real_mobile: 'true',
  //   nativeWebTap: 'true'
  // },
  // iphoneX: {
  //   browserName: 'iPhone',
  //   platform: 'MAC',
  //   device: 'iPhone X',
  //   real_mobile: 'true',
  //   nativeWebTap: 'true'
  // },
  // iphoneXS: {
  //   browserName: 'iPhone',
  //   platform: 'MAC',
  //   device: 'iPhone XS',
  //   os_version: '12',
  //   real_mobile: 'true',
  //   nativeWebTap: 'true'
  // },
  // operaXp: {
  //   browserName: 'Opera',
  //   os: 'Windows',
  //   os_version: 'XP',
  //   browser_version: '12.16',
  //   resolution: '1024x768'
  // },
  // pixel3: {
  //   browserName: 'Chrome',
  //   os_version: '9.0',
  //   platform: 'ANDROID',
  //   device: 'Google Pixel 3',
  //   real_mobile: 'true'
  // },
  // safari: {
  //   browserName: 'Safari',
  //   os: 'OS X',
  //   os_version: 'High Sierra'
  // },
  // safari7: {
  //   browserName: 'Safari',
  //   os: 'OS X',
  //   os_version: 'Mavericks',
  //   browser_version: '7.1',
  //   resolution: '1024x768'
  // },
  // safari8: {
  //   browserName: 'Safari',
  //   os: 'OS X',
  //   os_version: 'Yosemite',
  //   browser_version: '8.0',
  //   resolution: '1024x768'
  // },
  // safari9: {
  //   browserName: 'Safari',
  //   os: 'OS X',
  //   os_version: 'El Capitan',
  //   browser_version: '9.1',
  //   resolution: '1024x768'
  // },
  // safari10: {
  //   browserName: 'Safari',
  //   os: 'OS X',
  //   os_version: 'Sierra',
  //   browser_version: '10.0',
  //   resolution: '1024x768'
  // },
  // samsungGalaxy9: {
  //   os_version: '8.0',
  //   platform: 'ANDROID',
  //   browserName: 'Chrome',
  //   device: 'Samsung Galaxy S9',
  //   real_mobile: 'true'
  // },
  // samsungGalaxyNote4: {
  //   os_version: '6.0',
  //   platform: 'ANDROID',
  //   browserName: 'Chrome',
  //   device: 'Samsung Galaxy Note 4',
  //   real_mobile: 'true'
  // },
  // samsungGalaxyNote8: {
  //   os_version: '7.1',
  //   platform: 'ANDROID',
  //   browserName: 'Chrome',
  //   device: 'Samsung Galaxy Note 8',
  //   real_mobile: 'true'
  // },
  // samsungGalaxyS8: {
  //   os_version: '7.0',
  //   platform: 'ANDROID',
  //   browserName: 'Chrome',
  //   device: 'Samsung Galaxy S8',
  //   real_mobile: 'true'
  // }
]

dotenv.config()
const timestamp = new Date().toLocaleString()

const config = {
  framework: 'jasmine',
  specs: [
    path.resolve(__dirname, '..', 'packages/**/core-toggle.test.js'),
    path.resolve(__dirname, '..', 'packages/**/core-tabs.test.js'),
    path.resolve(__dirname, '..', 'packages/**/core-suggest.test.js'),
    path.resolve(__dirname, '..', 'packages/**/core-scroll.test.js'),
    path.resolve(__dirname, '..', 'packages/**/core-progress.test.js'),
  ],
  // seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  SELENIUM_PROMISE_MANAGER: false,
  jasmineNodeOpts: {
    defaultTimeoutInterval: 10000,
    print: () => {}   // Disable dot reporter
  },
  logLevel: 'INFO',
  multiCapabilities: capabilities.map((capability) => {
    return {
      'browserstack.user': process.env.BROWSERSTACK_USER,
      'browserstack.key': process.env.BROWSERSTACK_KEY,
      project: 'core-components',
      build: timestamp,
      name: capability.browserName,
      ...capability
    }
  }),
  onPrepare: () => {
    jasmine.getEnv().addReporter(new reporters.TapReporter())
    browser.waitForAngularEnabled(false)
  },
  onComplete: () => {
    console.log(`Test ${timestamp} finished`)
  }
}


exports.config = config

// https://github.com/angular/protractor/blob/master/lib/config.ts

// https://jasmine.github.io/tutorials/custom_reporter

// lifecycle hooks: https://stackoverflow.com/a/54556530/8819615
// setup bs-local https://stackoverflow.com/a/25538163/8819615
