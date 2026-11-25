document.querySelectorAll<HTMLElement>('[data-embed]').forEach((box) => {
  if (box.dataset.ready === '1') return;
  box.dataset.ready = '1';
  const button = box.querySelector('button');
  button?.addEventListener('click', () => {
    const src = box.dataset.embed;
    const title = box.dataset.title || 'Contenido incrustado';
    if (!src) return;
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = title;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    box.replaceChildren(iframe);
  });
});
