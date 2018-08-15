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

    coreScroll(scrollContainer)
    expect(scrollContainer.style.overflow).toEqual('scroll')
    expect(scrollContainer.style.webkitOverflowScrolling).toEqual('touch')
    expect(scrollContainer.style.maxHeight).toEqual('calc(100% + 0px)')
    expect(scrollContainer.style.marginRight).toEqual('-0px')
    expect(scrollContainer.style.marginBottom).toEqual('-0px')
  })
})
