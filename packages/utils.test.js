import test from 'ava'
import React from 'react'
import ReactDOM from 'react-dom'
import { JSDOM } from 'jsdom'
import { elementToReact } from './utils.js'

test.beforeEach(() => {
  global.window = new JSDOM().window
  global.document = window.document
})

test('utils: elem to react from simple element', (t) => {
  const Test = elementToReact(class Test extends window.HTMLElement {})
  const comp = ReactDOM.render(<Test />, document.createElement('div'))
  const el = ReactDOM.findDOMNode(comp)
  t.true(Test instanceof Function)
  t.true(comp instanceof React.Component)
  t.deepEqual(comp.props, {})
  t.true(el.nodeName.includes('TEST-'))
})

test('utils: elem to react from element with props', (t) => {
  const Test = elementToReact(class Test extends window.HTMLElement {}, 'event1')
  const comp = ReactDOM.render(<Test bool str='string' num={3} className='class' />, document.createElement('div'))
  const el = ReactDOM.findDOMNode(comp)
  t.true(comp.event1 instanceof Function)
  t.is(el.getAttribute('bool'), '')
  t.is(el.getAttribute('str'), 'string')
  t.is(el.getAttribute('num'), '3')
  t.is(el.getAttribute('class'), 'class')
})
