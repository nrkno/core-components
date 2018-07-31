const coreScroll = require('./core-scroll.min')
const standardHTML = `
<button data-core-scroll="my-scroll-js" value="up" aria-label="Rull opp">Up</button>
<div>
  <div id="my-scroll-js">
    <div>Dette er en lang tekst</div>
    <div>Dette er en lang tekst</div>
    <div>Dette er en lang tekst</div>
  </div>
</div>
`

describe('core-scroll', () => {
  it('should exist', () => {
    expect(coreScroll).toBeInstanceOf(Function)
  })

  it('should initialize scroll container with appropriate styling', () => {
    document.body.innerHTML = standardHTML

    const scrollContainer = document.querySelector('#my-scroll-js')
    const expectedStyling = 'overflow: scroll; -webkit-overflow-scrolling: touch; max-height: calc(100% + 1px); margin-right: -1px; margin-bottom: -1px;'

    coreScroll(scrollContainer)
    expect(scrollContainer.getAttribute('style')).toEqual(expectedStyling)
  })
})
