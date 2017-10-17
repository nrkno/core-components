document.addEventListener('click', ({target}) => {
  if(target.nodeName === 'SUMMARY'){
    target.setAttribute('aria-expanded', 'true')
  }
})
/*
details { display: block }
summary { display: inline-block; cursor: pointer; touch-action: manipulation }
summary[aria-expanded="false"] ~ * { display: none }
*/
