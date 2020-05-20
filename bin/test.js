import 'regenerator-runtime/runtime'
import path from 'path'
import http from 'http'
import https from 'https'
import dotenv from 'dotenv'
import { SpecReporter } from 'jasmine-spec-reporter'
import { getUUID } from '../packages/utils'

dotenv.config()
const isLocal = process.env.NODE_ENV === 'test'
const username = process.env.SMARTBEAR_USER
const authKey = process.env.SMARTBEAR_AUTHKEY
const localIdentifier = getUUID()
const identifier = new Date().toLocaleString()
const specs = path.resolve(process.cwd(), `packages/*/*.test.${isLocal ? '' : 'cjs.'}js`)

const commonCapabilities = {
  username,
  password: authKey,

  record_video: true,
  record_network: false, // there is an issue with CBT, forcing us not to record network p.t.

  build: 'core-components tests'
}

function config () {
  console.log('isLocal?', isLocal)
  console.log('capabilities:', capabilities)
  return {
    framework: 'jasmine',
    specs: [specs],
    seleniumAddress: `http://${username}:${authKey}@hub.crossbrowsertesting.com:80/wd/hub`,
    directConnect: isLocal,
    SELENIUM_PROMISE_MANAGER: false,
    jasmineNodeOpts: {
      defaultTimeoutInterval: 2 * 60 * 1000,
      print: Function.prototype // Disable dot reporter
    },
    allScriptsTimeout: 30000,
    getPageTimeout: 30000,
    logLevel: 'INFO',
    multiCapabilities: capabilities.map((cap) => {
      return {
        'cbt.user': username,
        'cbt.key': authKey,
        'cbt.debug': false, // Capture screenshots for visual logs
        'cbt.record_video': false, // Capture video of tests
        'cbt.console': 'errors', // Capture console logs
        'cbt.localIdentifier': localIdentifier,
        'cbt.sendKeys': true,
        project: 'core-components',
        build: identifier,
        name: ['core-components, ',
          (cap.browserName || cap.device).replace(/./, (m) => m.toUpperCase()),
          cap.browser_version ? parseInt(cap.browser_version) : ''
        ].join(' '),
        ...cap
      }
    }),
    beforeLaunch: async () => {
      await new Promise((resolve, reject) => {
        // bsLocal.start({ key, localIdentifier, forceLocal: true }, (error) => {
        //   if (error) return reject(Error('BrowserStack Local error: ' + error))
        //   resolve(console.log('BrowserStack Local started'))
        // })
        resolve()
      })
    },
    afterLaunch: async () => {
      await new Promise((resolve, reject) => {
        // bsLocal.stop((error) => {
        //   if (error) return reject(Error('BrowserStack Local error: ' + error))
        //   resolve(console.log('BrowserStack Local stopped'))
        // })
        resolve()
      })
    },
    onPrepare: () => {
      const env = jasmine.getEnv()
      env.addReporter(new SpecReporter({
        spec: {
          displaySuccessful: true,
          displayFailed: true,
          displayStacktrace: true,
          displayErrorMessages: true
        },
        summary: false
      }))
      browser.waitForAngularEnabled(false)
    },
    onComplete: async (passed) => {
      console.log('passed?', passed)
      resolve(passed)
      process.exit(passed)
      // if (isLocal) return
      // const session = await browser.getSession()
      // return axios.put(`https://${username}:${authKey}@api.browserstack.com/automate/sessions/${session.id_}.json`, {
      //   status: passed ? 'passed' : 'failed'
      // })
    }
  }
}

// const capabilities = isLocal
//   ? [{
//       browserName: 'chrome',
//       chromeOptions: {
//         args: ['--headless', '--window-size=800x600']
//       }
//     }]
//   : [{
//       browserName: 'Chrome',
//       browser_version: '46',
//       os: 'Windows',
//       os_version: '10'
//     },
//     {
//       browserName: 'Chrome',
//       browser_version: '57',
//       os: 'Windows',
//       os_version: '10'
//     },
//     {
//       browserName: 'Edge',
//       browser_version: '15.0',
//       os: 'Windows',
//       os_version: '10'
//     },
//     {
//       browserName: 'Edge',
//       browser_version: '17.0',
//       os: 'Windows',
//       os_version: '10'
//     },
//     {
//       browserName: 'Edge',
//       browser_version: '18.0',
//       os: 'Windows',
//       os_version: '10'
//     },
//     {
//       browserName: 'IE',
//       browser_version: '11',
//       os: 'Windows',
//       os_version: '10'
//     },
//     {
//       browserName: 'IE',
//       browser_version: '11',
//       os: 'Windows',
//       os_version: '7'
//     },
//     {
//       browserName: 'Firefox',
//       browser_version: '69',
//       os: 'Windows',
//       os_version: '10'
//     },
//     {
//       browserName: 'Firefox',
//       browser_version: '64',
//       os: 'Windows',
//       os_version: '10'
//     },
// {
//   browserName: 'Safari',
//   browser_version: '10.1',
//   os: 'OS X',
//   os_version: 'Sierra'
// },
// {
//   browserName: 'Safari',
//   browser_version: '9.1',
//   os: 'OS X',
//   os_version: 'El Capitan'
// }
// {
//   browserName: 'Safari',
//   browser_version: '10.0',
//   os: 'OS X',
//   os_version: 'Sierra',
//   resolution: '1024x768'
// },
// {
//   device: 'iPad Pro 9.7 2016',
//   real_mobile: 'true',
//   nativeWebTap: 'true',
// },
// {
//   device: 'iPhone 8',
//   os: 'iOS',
//   os_version: '11',
//   real_mobile: 'true',
//   nativeWebTap: 'true',
// },
// {
//   device: 'iPhone 8',
//   os: 'iOS',
//   os_version: '12',
//   real_mobile: 'true',
//   nativeWebTap: 'true',
// },
// {
//   os_version: '11',
//   device: 'iPhone SE',
//   real_mobile: 'true',
//   nativeWebTap: 'true',
// },
// {
//   device: 'iPhone X',
//   os_version: '11',
//   real_mobile: 'true',
//   nativeWebTap: 'true',
// },
// {
//   device: 'iPhone XS',
//   os_version: '12',
//   real_mobile: 'true',
//   nativeWebTap: 'true',
// },
// {
//   os_version: '9.0',
//   device: 'Google Pixel 3',
//   real_mobile: 'true',
// },
// {
//   os_version: '8.0',
//   device: 'Samsung Galaxy S9',
//   real_mobile: 'true',
// },
// {
//   os_version: '7.1',
//   device: 'Samsung Galaxy Note 8',
//   real_mobile: 'true',
// },
// {
//   os_version: '7.0',
//   device: 'Samsung Galaxy S8',
//   real_mobile: 'true',
// },
// {
//   os_version: '6.0',
//   device: 'Samsung Galaxy Note 4',
//   real_mobile: 'true',
// }
// ]

const capabilities = isLocal
  ? [
      {
        browserName: 'chrome',
        chromeOptions: {
          // args: ['--headless', '--window-size=800x600']
          args: ['--window-size=800x600']
        }
      }
    ]
  : completeCaps([
  // Windows:

    // Chrome 78, Windows 10, hits=1102659, vdist=0.000
    // {
    //   tags: {
    //     id: 'chrome',
    //     browser: 'chrome',
    //     platform: 'windows',
    //     device: 'desktop',
    //     hits: 1102659,
    //     popularity: 'high',
    //     default: true,
    //   },
    //   platform: 'Windows 10',
    //   browserName: 'Chrome',
    //   version: '78',
    // },

    // Chrome 77, Windows 10, hits=57084, vdist=0.000
    // {
    //   tags: {
    //     id: 'chrome77',
    //     browser: 'chrome',
    //     platform: 'windows',
    //     device: 'desktop',
    //     hits: 57084,
    //     popularity: 'medium',
    //     default: false,
    //   },
    //   platform: 'Windows 10',
    //   browserName: 'Chrome',
    //   version: '77',
    // },

    // Chrome 78, Windows 8.1, hits=48772, vdist=0.000
    // {
    //   tags: {
    //     id: 'chromeWin81',
    //     browser: 'chrome',
    //     platform: 'windows',
    //     device: 'desktop',
    //     hits: 48772,
    //     popularity: 'low',
    //     default: false,
    //   },
    //   platform: 'Windows 8.1',
    //   browserName: 'Chrome',
    //   version: '78x64',
    // },

    // Chrome 78, Windows 7, hits=139900, vdist=0.000
    // {
    //   tags: {
    //     id: 'chromeWin7',
    //     browser: 'chrome',
    //     platform: 'windows',
    //     device: 'desktop',
    //     hits: 139900,
    //     popularity: 'high',
    //     default: true,
    //   },
    //   platform: 'Windows 7 64-Bit',
    //   browserName: 'Chrome',
    //   version: '78',
    // },

    // Edge 18.18362, Windows 10, hits=218803, vdist=0.184
    // Edge 18.17763, Windows 10, hits=70727, vdist=0.178
    // Edge 18.18363, Windows 10, hits=15274, vdist=0.184
    // core-components
    {
      tags: {
        id: 'edge',
        browser: 'edge',
        platform: 'windows',
        device: 'desktop',
        hits: 304804,
        popularity: 'high',
        default: true
      },
      platform: 'Windows 10',
      browserName: 'MicrosoftEdge',
      version: '18'
    },

    /*
  // Edge 17.17134, Windows 10, hits=38578, vdist=0.171
  // core-components
  {
    tags: {
      id: 'edge17',
      browser: 'edge',
      platform: 'windows',
      device: 'desktop',
      hits: 38578,
      popularity: 'low',
      default: false,
    },
    platform: 'Windows 10',
    browserName: 'MicrosoftEdge',
    version: '17',
  },

  // Edge 16.16299, Windows 10, hits=16947, vdist=0.163
  // {
  //   tags: {
  //     id: 'edge16',
  //     browser: 'edge',
  //     platform: 'windows',
  //     device: 'desktop',
  //     hits: 16947,
  //     popularity: 'low',
  //     default: false,
  //   },
  //   platform: 'Windows 10',
  //   browserName: 'MicrosoftEdge',
  //   version: '16',
  // },

  // Edge 15
  // core-components
  {
    tags: {
      id: 'edge15',
      browser: 'edge',
      platform: 'windows',
      device: 'desktop',
      hits: 16947,
      popularity: 'low',
      default: false,
    },
    platform: 'Windows 10',
    browserName: 'MicrosoftEdge',
    version: '15',
  },
  */
    // Firefox 70, Windows 10, hits=145659, vdist=0.000
    // core-components
    {
      tags: {
        id: 'firefox70',
        browser: 'firefox',
        platform: 'windows',
        device: 'desktop',
        hits: 145659,
        popularity: 'high',
        default: true
      },
      platform: 'Windows 10',
      browserName: 'Firefox',
      version: '70x64'
    } /*,

  // Firefox 64
  {
    tags: {
      id: 'firefox64',
      browser: 'firefox',
      platform: 'windows',
      device: 'desktop',
      hits: 0,
      popularity: 'low',
      default: false,
    },
    browserName: 'Firefox',
    version: '64x64',
    platform: 'Windows 10'
  },

  // Internet Explorer 11, Windows 10, hits=99574, vdist=0.000
  // core-components
  {
    tags: {
      id: 'ie11',
      browser: 'internet explorer',
      platform: 'windows',
      device: 'desktop',
      hits: 99574,
      popularity: 'medium',
      default: true,
    },
    platform: 'Windows 10',
    browserName: 'Internet Explorer',
    version: '11',
  },

  // Internet Explorer 11, Windows 8.1, hits=15300, vdist=0.000
  // {
  //   tags: {
  //     id: 'ie11win81',
  //     browser: 'internet explorer',
  //     platform: 'windows',
  //     device: 'desktop',
  //     hits: 15300,
  //     popularity: 'low',
  //     default: false,
  //   },
  //   platform: 'Windows 8.1',
  //   browserName: 'Internet Explorer',
  //   version: '11',
  // },

  // Internet Explorer 11, Windows 7, hits=22329, vdist=0.000
  // core-components
  {
    tags: {
      id: 'ie11win7',
      browser: 'internet explorer',
      platform: 'windows',
      device: 'desktop',
      hits: 22329,
      popularity: 'low',
      default: false,
    },
    platform: 'Windows 7 64-Bit',
    browserName: 'Internet Explorer',
    version: '11',
  },

  // Mac:
  // core-components
  // Safari 9, not supported?
  {
    tags: {
      id: 'safari',
      browser: 'safari',
      platform: 'mac',
      device: 'desktop',
      hits: 0,
      popularity: 'low',
      default: false, // true
    },
    platform: 'Mac OSX 10.09',
    browserName: 'Safari',
    version: '9',
  },
  // Safari 13, Mac 10.15, hits=530034, vdist=0.000
  // Safari 13, Mac 10.14, hits=95579, vdist=0.010
  // Safari 13, Mac 10.13, hits=52303, vdist=0.020
  // {
  //   tags: {
  //     id: 'safari',
  //     browser: 'safari',
  //     platform: 'mac',
  //     device: 'desktop',
  //     hits: 677916,
  //     popularity: 'high',
  //     default: false, // true
  //   },
  //   platform: 'Mac OSX 10.15',
  //   browserName: 'Safari',
  //   version: '13',
  // },

  // Safari 12.1, Mac 10.14, hits=49980, vdist=0.100
  // Safari 12.1, Mac 10.12, hits=33694, vdist=0.102
  // Safari 12, Mac 10.14, hits=19374, vdist=0.000
  // Safari 12.1, Mac 10.13, hits=10616, vdist=0.100
  // Safari 12, Mac 10.13, hits=2889, vdist=0.010
  // Safari 12, Mac 10.12, hits=1339, vdist=0.020
  // {
  //   tags: {
  //     id: 'safari12',
  //     browser: 'safari',
  //     platform: 'mac',
  //     device: 'desktop',
  //     hits: 117892,
  //     popularity: 'high',
  //     default: false, // true
  //   },
  //   platform: 'Mac OSX 10.14',
  //   browserName: 'Safari',
  //   version: '12',
  // },

  // Safari 11.1, Mac 10.11, hits=24936, vdist=0.102
  // Safari 11.1, Mac 10.13, hits=9020, vdist=0.100
  // Safari 11, Mac 10.13, hits=3546, vdist=0.000
  // {
  //   tags: {
  //     id: 'safari11',
  //     browser: 'safari',
  //     platform: 'mac',
  //     device: 'desktop',
  //     hits: 37502,
  //     popularity: 'low',
  //     default: false,
  //   },
  //   platform: 'Mac OSX 10.13',
  //   browserName: 'Safari',
  //   version: '11',
  // },

  // Safari 10.1, Mac 10.10, hits=26357, vdist=0.102
  // Safari 10.1, Mac 10.12, hits=3464, vdist=0.100
  // Safari 10, Mac 10.12, hits=1259, vdist=0.000
  // {
  //   tags: {
  //     id: 'safari10',
  //     browser: 'safari',
  //     platform: 'mac',
  //     device: 'desktop',
  //     hits: 31080,
  //     popularity: 'low',
  //     default: false,
  //   },
  //   platform: 'Mac OSX 10.12',
  //   browserName: 'Safari',
  //   version: '10',
  // },

  // Chrome 78, Mac 10.15, hits=53741, vdist=0.000
  // {
  //   tags: {
  //     id: 'chromeMac1015',
  //     browser: 'chrome',
  //     platform: 'mac',
  //     device: 'desktop',
  //     hits: 53741,
  //     popularity: 'medium',
  //     default: false,
  //   },
  //   platform: 'Mac OSX 10.15',
  //   browserName: 'Chrome',
  //   version: '78x64',
  // },

  // Chrome 78, Mac 10.14, hits=104753, vdist=0.000
  // {
  //   tags: {
  //     id: 'chromeMac1014',
  //     browser: 'chrome',
  //     platform: 'mac',
  //     device: 'desktop',
  //     hits: 104753,
  //     popularity: 'high',
  //     default: false,
  //   },
  //   platform: 'Mac OSX 10.14',
  //   browserName: 'Chrome',
  //   version: '78x64',
  // },

  // Chrome 78, Mac 10.13, hits=41914, vdist=0.000
  // {
  //   tags: {
  //     id: 'chromeMac1013',
  //     browser: 'chrome',
  //     platform: 'mac',
  //     device: 'desktop',
  //     hits: 41914,
  //     popularity: 'low',
  //     default: false,
  //   },
  //   platform: 'Mac OSX 10.13',
  //   browserName: 'Chrome',
  //   version: '78x64',
  // },

  // Chrome 78, Mac 10.12, hits=21783, vdist=0.000
  // {
  //   tags: {
  //     id: 'chromeMac1012',
  //     browser: 'chrome',
  //     platform: 'mac',
  //     device: 'desktop',
  //     hits: 21783,
  //     popularity: 'low',
  //     default: false,
  //   },
  //   platform: 'Mac OSX 10.12',
  //   browserName: 'Chrome',
  //   version: '78x64',
  // },

  // Chrome 78, Mac 10.11, hits=20068, vdist=0.000
  // Chrome 78, Mac 10.10, hits=19915, vdist=0.010
  // {
  //   tags: {
  //     id: 'chromeMac1011',
  //     browser: 'chrome',
  //     platform: 'mac',
  //     device: 'desktop',
  //     hits: 39983,
  //     popularity: 'low',
  //     default: false,
  //   },
  //   platform: 'Mac OSX 10.11',
  //   browserName: 'Chrome',
  //   version: '78x64',
  // },
  //
  // // Chrome 77, Mac 10.14, hits=15024, vdist=0.000
  // // Chrome 77, Mac 10.15, hits=2103, vdist=0.010
  // {
  //   tags: {
  //     id: 'chrome77Mac1014',
  //     browser: 'chrome',
  //     platform: 'mac',
  //     device: 'desktop',
  //     hits: 17127,
  //     popularity: 'low',
  //     default: false,
  //   },
  //   platform: 'Mac OSX 10.14',
  //   browserName: 'Chrome',
  //   version: '77x64',
  // },
  //
  // // Firefox 70, Mac 10.15, hits=8002, vdist=0.000
  // // Firefox 70, Mac 10.9, hits=3487, vdist=0.750
  // {
  //   tags: {
  //     id: 'firefoxMac1015',
  //     browser: 'firefox',
  //     platform: 'mac',
  //     device: 'desktop',
  //     hits: 11489,
  //     popularity: 'low',
  //     default: false,
  //   },
  //   platform: 'Mac OSX 10.15',
  //   browserName: 'Firefox',
  //   version: '70',
  // },

  // Firefox 70, Mac 10.14, hits=12145, vdist=0.000
  // {
  //   tags: {
  //     id: 'firefoxMac1014',
  //     browser: 'firefox',
  //     platform: 'mac',
  //     device: 'desktop',
  //     hits: 12145,
  //     popularity: 'low',
  //     default: false,
  //   },
  //   platform: 'Mac OSX 10.14',
  //   browserName: 'Firefox',
  //   version: '70',
  // },

  // Android:

  // Chrome 78, Android 8.0, hits=110227, vdist=1.414
  // Chrome 78, Android 7.0, hits=53495, vdist=2.236
  // Chrome 78, Android 8.1, hits=32265, vdist=1.345
  // Chrome 78, Android 6.0, hits=27535, vdist=3.162
  // Chrome 78, Android 7.1, hits=12165, vdist=2.147
  // Chrome 78, Android 5.1, hits=6148, vdist=4.026
  // Chrome 78, Android 5.0, hits=5707, vdist=4.123
  // Chrome 77, Android 8.0, hits=4761, vdist=1.000
  // Chrome 77, Android 7.0, hits=2345, vdist=2.000
  // Chrome 77, Android 8.1, hits=1017, vdist=0.900
  // {
  //   tags: {
  //     id: 'android9',
  //     browser: 'chrome',
  //     platform: 'android',
  //     device: 'mobile',
  //     hits: 255665,
  //     popularity: 'high',
  //     default: true,
  //   },
  //   deviceName: 'Pixel 3',
  //   platformName: 'Android',
  //   platformVersion: '9.0',
  //   browserName: 'Chrome',
  // },

  // Chrome 78, Android 4.4, hits=3319, vdist=4.686
  // Chrome 77, Android 6.0, hits=2449, vdist=2.828
  // Chrome 76, Android 8.0, hits=2122, vdist=1.000
  // Chrome 76, Android 7.0, hits=1429, vdist=1.414
  // Chrome 75, Android 8.0, hits=1309, vdist=0.000
  // Chrome 76, Android 6.0, hits=1190, vdist=2.236
  // Chrome 77, Android 5.1, hits=1012, vdist=3.523
  // {
  //   tags: {
  //     id: 'android8',
  //     browser: 'chrome',
  //     platform: 'android',
  //     device: 'mobile',
  //     hits: 12830,
  //     popularity: 'low',
  //     default: false,
  //   },
  //   deviceName: 'Galaxy S8',
  //   platformName: 'Android',
  //   platformVersion: '8.0',
  //   browserName: 'Chrome',
  // },

  // Chrome 78, Android 7.1, hits=8583, vdist=4.148
  // Chrome 78, Android 6.0, hits=8027, vdist=4.000
  // Chrome 78, Android 8.1, hits=7205, vdist=4.518
  // Chrome 78, Android 7.0, hits=3596, vdist=4.123
  // Chrome 78, Android 8.0, hits=3352, vdist=4.472
  // Chrome 78, Android 5.0, hits=2347, vdist=4.123
  // Chrome 78, Android 5.1, hits=2238, vdist=4.100
  // {
  //   tags: {
  //     id: 'android6',
  //     browser: 'chrome',
  //     platform: 'android',
  //     device: 'tablet',
  //     hits: 35348,
  //     popularity: 'low',
  //     default: false,
  //   },
  //   deviceName: 'Nexus 9',
  //   platformName: 'Android',
  //   platformVersion: '6.0',
  //   browserName: 'Chrome',
  // },

  // iOS:

  // Safari 13, iOS 13.1, hits=557452, vdist=1.487
  // Safari 12.1, iOS 12.4, hits=243035, vdist=0.412
  // Safari 13.1, iOS 13.1, hits=242217, vdist=1.556
  // Safari 13, iOS 13.2, hits=171731, vdist=1.562
  // Safari 12.4, iOS 12.4, hits=92673, vdist=0.566
  // Safari 13.2, iOS 13.2, hits=77143, vdist=1.697
  // Safari 12.1, iOS 12.3, hits=48386, vdist=0.316
  // Safari 12, iOS 12.1, hits=22843, vdist=0.100
  // Safari 12.1, iOS 12.2, hits=15345, vdist=0.224
  // Safari 12.3, iOS 12.3, hits=14392, vdist=0.424
  // Safari 13, iOS 13.0, hits=12859, vdist=1.414
  // Safari 12.1, iOS 12.1, hits=6318, vdist=0.141
  // Safari 12, iOS 12.0, hits=5735, vdist=0.000
  // Safari 12.2, iOS 12.2, hits=4733, vdist=0.283
  // Safari 13, iOS 13.3, hits=1867, vdist=1.640
  // {
  //   tags: {
  //     id: 'iphone',
  //     browser: 'safari',
  //     platform: 'ios',
  //     device: 'mobile',
  //     hits: 1516729,
  //     popularity: 'high',
  //     default: true,
  //   },
  //   deviceName: 'iPhone XR Simulator',
  //   platformName: 'iOS',
  //   platformVersion: '12.0',
  //   browserName: 'Safari',
  //
  //   // allScriptsTimeout gives error. CBT: 'We are working on upgrading our
  //   // infrastructure but for now you can try to pass timeouts through your
  //   // capabilites like so "timeouts": {"script": 1000}?' It works, but only
  //   // for iOS...
  //   timeouts: {
  //     script: 30000,
  //   },
  //   configOverrides: {
  //     allScriptsTimeout: 0,
  //   },
  // },

  // Safari 11, iOS 11.4, hits=16222, vdist=0.400
  // Safari 11, iOS 11.2, hits=6698, vdist=0.200
  // Safari 11.4, iOS 11.4, hits=5071, vdist=0.566
  // Safari 11, iOS 11.3, hits=4877, vdist=0.300
  // Safari 11, iOS 11.0, hits=2176, vdist=0.000
  // Safari 11.2, iOS 11.2, hits=1880, vdist=0.283
  // Safari 11, iOS 11.1, hits=1532, vdist=0.100
  // Safari 11.3, iOS 11.3, hits=1401, vdist=0.424
  // {
  //   tags: {
  //     id: 'iphone11',
  //     browser: 'safari',
  //     platform: 'ios',
  //     device: 'mobile',
  //     hits: 39857,
  //     popularity: 'low',
  //     default: true,
  //   },
  //   deviceName: 'iPhone X Simulator',
  //   platformName: 'iOS',
  //   platformVersion: '11.0',
  //   browserName: 'Safari',
  // },
  //
  // // Safari 10, iOS 10.3, hits=8399, vdist=0.100
  // // Safari 10.3, iOS 10.3, hits=1903, vdist=0.316
  // {
  //   tags: {
  //     id: 'iphone7',
  //     browser: 'safari',
  //     platform: 'ios',
  //     device: 'mobile',
  //     hits: 10302,
  //     popularity: 'low',
  //     default: true,
  //   },
  //   deviceName: 'iPhone 7 Simulator',
  //   platformName: 'iOS',
  //   platformVersion: '10.2',
  //   browserName: 'Safari',
  // },

  // Safari 12.1, iOS 12.4, hits=297854, vdist=0.412
  // Safari 12.1, iOS 12.3, hits=69303, vdist=0.316
  // Safari 12, iOS 12.1, hits=45315, vdist=0.100
  // Safari 12.4, iOS 12.4, hits=32610, vdist=0.566
  // Safari 13.1, iOS 13.1, hits=32028, vdist=1.556
  // Safari 12.1, iOS 12.2, hits=31706, vdist=0.224
  // Safari 13.2, iOS 13.2, hits=14174, vdist=1.697
  // Safari 12, iOS 12.0, hits=7503, vdist=0.000
  // Safari 13, iOS 13.1, hits=6217, vdist=1.487
  // Safari 12.3, iOS 12.3, hits=6066, vdist=0.424
  // Safari 12.1, iOS 12.1, hits=3607, vdist=0.141
  // Safari 13, iOS 13.2, hits=2778, vdist=1.562
  // Safari 12.2, iOS 12.2, hits=1940, vdist=0.283
  // {
  //   tags: {
  //     id: 'ipad',
  //     browser: 'safari',
  //     platform: 'ios',
  //     device: 'tablet',
  //     hits: 551101,
  //     popularity: 'high',
  //     default: true,
  //   },
  //   deviceName: 'iPad 6th Generation Simulator',
  //   platformName: 'iOS',
  //   platformVersion: '12.0',
  //   browserName: 'Safari',
  // },

  // Safari 11, iOS 11.4, hits=18581, vdist=0.400
  // Safari 11, iOS 11.2, hits=8982, vdist=0.200
  // Safari 11, iOS 11.3, hits=8402, vdist=0.300
  // Safari 11, iOS 11.0, hits=4069, vdist=0.000
  // Safari 11, iOS 11.1, hits=3526, vdist=0.100
  // Safari 11.4, iOS 11.4, hits=1574, vdist=0.566
  // {
  //   tags: {
  //     id: 'ipad11',
  //     browser: 'safari',
  //     platform: 'ios',
  //     device: 'tablet',
  //     hits: 45134,
  //     popularity: 'low',
  //     default: false,
  //   },
  //   deviceName: 'iPad Pro Simulator',
  //   platformName: 'iOS',
  //   platformVersion: '11.0',
  //   browserName: 'Safari',
  // },

  // Safari 10, iOS 10.3, hits=50181, vdist=0.100
  // Safari 10.3, iOS 10.3, hits=8065, vdist=0.316
  // Safari 10, iOS 10.2, hits=1728, vdist=0.000
  // {
  //   tags: {
  //     id: 'ipad10',
  //     browser: 'safari',
  //     platform: 'ios',
  //     device: 'tablet',
  //     hits: 59974,
  //     popularity: 'medium',
  //     default: false, // true
  //   },
  //   deviceName: 'iPad Pro Simulator',
  //   platformName: 'iOS',
  //   platformVersion: '10.2',
  //   browserName: 'Safari',
  // },

  // Safari 9, iOS 9.3, hits=12568, vdist=0.000
  // Safari 9.3, iOS 9.3, hits=4288, vdist=0.300
  {
    tags: {
      id: 'ipad9',
      browser: 'safari',
      platform: 'ios',
      device: 'tablet',
      hits: 16856,
      popularity: 'low',
      default: false,
    },
    deviceName: 'iPad Pro Simulator',
    platformName: 'iOS',
    platformVersion: '9.3',
    browserName: 'Safari',
  } */

  ])

// https://www.browserstack.com/automate/node#add-on
// https://github.com/browserstack/fast-selenium-scripts/blob/master/node/fast-selenium.js
function faster () {
  const keepAliveTimeout = 30 * 1000
  // eslint-disable-next-line
  if (http.globalAgent && http.globalAgent.hasOwnProperty('keepAlive')) {
    http.globalAgent.keepAlive = true
    https.globalAgent.keepAlive = true
    http.globalAgent.keepAliveMsecs = keepAliveTimeout
    https.globalAgent.keepAliveMsecs = keepAliveTimeout
  } else {
    const agent = new http.Agent({
      keepAlive: true,
      keepAliveMsecs: keepAliveTimeout
    })

    const secureAgent = new https.Agent({
      keepAlive: true,
      keepAliveMsecs: keepAliveTimeout
    })

    const httpRequest = http.request
    const httpsRequest = https.request

    http.request = (options, callback) => {
      if (options.protocol === 'https:') {
        options.agent = secureAgent
        return httpsRequest(options, callback)
      } else {
        options.agent = agent
        return httpRequest(options, callback)
      }
    }
  }
}

function completeCaps (caps) {
  return caps.map((cap) => ({
    browserName: '', // TypeError: Target browser must be a string...
    ...commonCapabilities,
    ...cap
  }))
}

faster()
exports.config = config()
