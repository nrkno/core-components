function onKeyDownFixRoleButton (event) {
  const enterOrSpace = event.keyCode === 13 || event.keyCode === 32
  if (enterOrSpace && event.target.getAttribute('role') === 'button') {
    event.preventDefault()
    event.target.click()
  }
}

function onClickAriaExpanded (event) {
  for (let el = event.target; el; el = el.parentElement) {
    const expanded = el.getAttribute('aria-expanded')
    if (expanded) {
      el.setAttribute('aria-expanded', expanded === 'false')
      break
    }
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('keydown', onKeyDownFixRoleButton)
  document.addEventListener('click', onClickAriaExpanded)
}
