export function enableSPAHyperlink (aElem) {
  const href = aElem.getAttribute('href');
  const text = aElem.innerText;

  aElem.addEventListener('click', (e) => {
    e.preventDefault();
    window.history.pushState({}, text, href);
  });
}