// const details = require('../details')
// const expect = require('expect.js')
// const {JSDOM} = require('jsdom')

// const setupDom = () => {
//   const dom = new JSDOM(`<!doctype html><head></head><body>mock document</body></html>`)
//   global.window = dom.window
//   global.document = dom.window.document
// }

// const teardownDom = () => {
//   delete global.window
//   delete global.document
// }

// describe('details', () => {
//   beforeEach(setupDom)

//   it('should exists', () => {
//     expect(details).to.be.an('object')
//   })

//   afterEach(teardownDom)
// })
