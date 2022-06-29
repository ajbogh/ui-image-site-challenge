export function setPageTitle({ prepend, title, append, separator }) {
  const titleElem = document.querySelector('page-title');
  if(prepend) { 
    titleElem.setAttribute('prepend', prepend);
  }

  if(append) { 
    titleElem.setAttribute('append', append);
  }

  if(title) { 
    titleElem.setAttribute('title', title);
  }

  if(separator) { 
    titleElem.setAttribute('separator', separator);
  }
}