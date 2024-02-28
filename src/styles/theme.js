
export function initTheme() {
  const body = document.body;
  body.classList.add('light');
}

export function toogleTheme() {
  const body = document.body;
  body.classList.toggle('light');
  body.classList.toggle('dark');
}