/* globals describe, it, beforeEach, afterEach */
const toggle = require('./core-toggle.cjs')

describe('toggle', () => {
  test('should exists', () => {
    expect(toggle).toBeInstanceOf(Function)
  })
})
