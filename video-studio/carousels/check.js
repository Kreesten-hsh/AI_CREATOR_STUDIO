// Ouvre une slide avec #check (utilisé par render_carousel.mjs et la planche contact)
// pour encadrer en rouge tout débordement, chevauchement de calques, sortie des marges
// de sécurité ou texte inférieur à 28px sur la toile 1080px.
(function () {
  function runAudit() {
    const slide = document.querySelector('.slide');
    if (!slide) return;

    const S = slide.getBoundingClientRect();
    const isCheckMode = location.hash === '#check';
    const problems = [];

    const layers = Array.from(slide.querySelectorAll('.L'));
    const textBoxes = [];

    for (const el of layers) {
      const r = el.getBoundingClientRect();
      const isChrome =
        el.classList.contains('foot-progress') ||
        el.classList.contains('swipe-btn') ||
        el.classList.contains('decorative');

      const offCanvas =
        r.left < S.left - 1 ||
        r.top < S.top - 1 ||
        r.right > S.right + 1 ||
        r.bottom > S.bottom + 1;

      const textSpill =
        el.scrollWidth > el.clientWidth + 2 ||
        (el.style.height && el.scrollHeight > el.clientHeight + 4);

      const unsafeBand =
        !isChrome &&
        (r.top < S.top + 36 ||
          r.bottom > S.bottom - 92 ||
          r.left < S.left + 44 ||
          r.right > S.right - 44);

      if (offCanvas) {
        problems.push({ el, reason: 'off-canvas', label: 'hors cadre' });
      } else if (textSpill) {
        problems.push({ el, reason: 'overflow', label: 'texte coupé' });
      } else if (unsafeBand) {
        problems.push({ el, reason: 'safe-zone', label: 'marge Studio Lin' });
      }

      if (!isChrome && !el.classList.contains('connector')) {
        textBoxes.push({ el, r });
      }
    }

    // Détection de chevauchement involontaire entre deux calques non marqués .overlap-ok
    for (let i = 0; i < textBoxes.length; i += 1) {
      for (let j = i + 1; j < textBoxes.length; j += 1) {
        const a = textBoxes[i];
        const b = textBoxes[j];
        if (
          a.el.contains(b.el) ||
          b.el.contains(a.el) ||
          a.el.classList.contains('overlap-ok') ||
          b.el.classList.contains('overlap-ok')
        ) {
          continue;
        }
        const overlapX = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
        const overlapY = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
        if (overlapX > 6 && overlapY > 6) {
          problems.push({ el: b.el, reason: 'overlap', label: 'chevauchement' });
        }
      }
    }

    // Vérification stricte Studio Lin : zéro texte < 28px
    const walker = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.nodeValue || !node.nodeValue.trim()) continue;
      const parent = node.parentElement;
      if (!parent) continue;
      const fs = Number.parseFloat(getComputedStyle(parent).fontSize);
      if (Number.isFinite(fs) && fs < 27.5) {
        problems.push({ el: parent, reason: 'font-too-small', label: `police ${fs}px < 28px` });
      }
    }

    if (isCheckMode) {
      for (const item of problems) {
        item.el.style.outline = '6px solid #FF2D2D';
        item.el.style.outlineOffset = '4px';
        const tag = document.createElement('div');
        tag.textContent = item.label;
        Object.assign(tag.style, {
          position: 'absolute',
          zIndex: '9999',
          background: '#FF2D2D',
          color: '#FFFFFF',
          font: "700 28px/1 'Plus Jakarta Sans', sans-serif",
          padding: '8px 14px',
          borderRadius: '8px',
          left: `${Math.max(16, item.el.offsetLeft)}px`,
          top: `${Math.max(28, item.el.offsetTop - 46)}px`,
        });
        slide.appendChild(tag);
      }
    }

    document.documentElement.dataset.problems = String(problems.length);
    document.documentElement.dataset.report = JSON.stringify(
      problems.map((p) => ({
        reason: p.reason,
        label: p.label,
        tag: p.el.tagName,
        className: p.el.className,
        text: (p.el.textContent || '').trim().slice(0, 60),
      }))
    );
  }

  const ready = document.fonts ? document.fonts.ready : Promise.resolve();
  ready.then(() => setTimeout(runAudit, 60));
})();
