
(function () {
  'use strict';

  const ICON_MAP = {
    'angle-down': '⌄',
    'arrow-left': '←',
    'arrow-right': '→',
    'bars': '☰',
    'calendar-alt': '🗓',
    'calendar-check': '🗓',
    'chair': '▣',
    'check-circle': '✓',
    'chess-board': '♟',
    'chess-knight': '♞',
    'envelope': '✉',
    'facebook-f': 'f',
    'instagram': '◎',
    'lightbulb': '💡',
    'lock': '🔒',
    'map-marked-alt': '📍',
    'map-marker-alt': '📍',
    'phone': '☎',
    'question-circle': '?',
    'quote-left': '“',
    'quote-right': '”',
    'random': '⇄',
    'redo': '↻',
    'search': '⌕',
    'shopping-cart': '🛒',
    'sign-out-alt': '⇥',
    'star': '★',
    'times': '✕',
    'trash': '🗑',
    'trophy': '🏆',
    'user': '👤'
  };

  function injectFallbackStyle() {
    if (document.getElementById('fa-fallback-style')) return;
    const style = document.createElement('style');
    style.id = 'fa-fallback-style';
    style.textContent = `
      .fa-fallback-rendered {
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        font-style: normal !important;
        font-family: 'Segoe UI Symbol', 'Apple Color Emoji', 'Noto Sans Symbols 2', sans-serif !important;
        line-height: 1 !important;
      }
      .fa-fallback-rendered::before { content: none !important; }
      .fa-fallback-rendered .fa-fallback-char { display: inline-block; line-height: 1; }
    `;
    document.head.appendChild(style);
  }

  function iconNameFromNode(node) {
    for (const cls of Array.from(node.classList || [])) {
      if (cls.startsWith('fa-') && !['fa', 'fas', 'far', 'fab', 'fal', 'fad'].includes(cls)) {
        return cls.replace(/^fa-/, '');
      }
    }
    return null;
  }

  function applyFallback(root) {
    const scope = root && root.querySelectorAll ? root : document;
    const nodes = scope.querySelectorAll('i[class*="fa-"], span[class*="fa-"]');
    nodes.forEach(node => {
      if (node.dataset.faFallbackApplied === '1') return;
      const iconName = iconNameFromNode(node);
      if (!iconName) return;
      const fallbackChar = ICON_MAP[iconName] || '•';
      node.dataset.faFallbackApplied = '1';
      node.classList.add('fa-fallback-rendered');
      node.innerHTML = '<span class="fa-fallback-char" aria-hidden="true">' + fallbackChar + '</span>';
      if (!node.getAttribute('aria-label') && !node.getAttribute('title')) {
        node.setAttribute('aria-hidden', 'true');
      }
    });
  }

  function fontAwesomeLoaded() {
    const probe = document.createElement('i');
    probe.className = 'fas fa-chess-knight';
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.pointerEvents = 'none';
    document.body.appendChild(probe);
    const fam = (getComputedStyle(probe).fontFamily || '').toLowerCase();
    document.body.removeChild(probe);
    return fam.includes('font awesome');
  }

  function setup() {
    injectFallbackStyle();
    if (fontAwesomeLoaded()) return;
    applyFallback(document);
    const observer = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          if (node.matches && (node.matches('i[class*="fa-"], span[class*="fa-"]'))) {
            applyFallback(node.parentNode || document);
          } else if (node.querySelectorAll) {
            applyFallback(node);
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
