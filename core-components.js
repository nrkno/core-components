module.exports = {
  version: __VERSION__, // eslint-disable-line
  // details: require('./details'),
  dialog: require('./dialog')
  // input: require('./input')
}

/* function details (element, state) {
  if(state) {
    const opts = storeState(element, state)
    element.ontoggle = opts.ontoggle
    element[opts.open? 'setAttribute' : 'removeAttribute']('open', '')
  }
  return state
}

function details (element, opts = {}) {
  const open = element.hasAttribute('open')

  const actions = {
    close: () => {
      if (open) {
        open = false
        element.removeAttribute('open')
      }
    },
    open: () => {
      if (!open) {
        open = true
        element.setAttribute('open', '')
      }
    }
  }

  const handlers = {
    click: (event) => {
      if (event.target.closest('summary')) {
        if (opts.onOpen) opts.onOpen()
      }
    }
  }

  element.addEventListener('click', handlers.click)

  return {
    actions,
    destroy: () => {
      element.removeEventListener('click', handlers.click)
    }
  }
}

//

const {actions, destroy} = details(detailsElement, {
  onOpen: (value) => {
    console.log('details opened')
  }
}) */
