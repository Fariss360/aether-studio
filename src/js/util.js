// Lightweight char splitter (avoids SplitText plugin dependency).
// Wraps each character of an element in <span class="char"> for stagger reveals.
export function splitChars(el) {
  const text = el.textContent;
  el.textContent = '';
  const chars = [];
  for (const ch of text) {
    const span = document.createElement('span');
    span.className = 'char';
    span.style.display = 'inline-block';
    span.textContent = ch === ' ' ? ' ' : ch;
    el.appendChild(span);
    chars.push(span);
  }
  return chars;
}

export function scramble(str) {
  const glyphs = '!<>-_\\/[]{}=+*^?#________';
  return str.split('').map(() => glyphs[Math.floor(Math.random() * glyphs.length)]).join('');
}
