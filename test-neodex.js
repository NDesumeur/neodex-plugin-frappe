// lancé par le test « local » de NeoDex : six fautes sur la même lettre la colorent en rouge sur le clavier,
// le texte à taper est gros et tout tient dans la fenêtre
module.exports = async ({ pj, sleep }) => {
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  await sleep(800);
  const k = await pj(`(() => { const T = document.getElementById('tyText').__ty, t = T.st(), want = t.words[t.i][0], inp = document.getElementById('tyIn');
    const bad = want === 'q' ? 'w' : 'q';
    for (let i = 0; i < 6; i++) inp.dispatchEvent(new KeyboardEvent('keydown', {key: bad, bubbles: true}));
    T.draw(); const b = document.querySelector('#tyKb b[data-k="' + want.toLowerCase() + '"]');
    return [want.toLowerCase(), T.heat(want.toLowerCase()), !!b && b.classList.contains('h3'), document.getElementById('tyMiss').textContent.includes(want.toUpperCase())].join(','); })()`);
  const [want, heat, red, listed] = k.split(',');
  if (heat !== '3' || red !== 'true' || listed !== 'true') throw new Error('touche ratée pas colorée : ' + k);
  await sleep(300);
  const L = await pj(`(() => { const t = document.getElementById('tyText'), kb = document.getElementById('tyKb').getBoundingClientRect(); return { fs: parseFloat(getComputedStyle(t).fontSize), kbr: Math.round(kb.right), kbh: Math.round(kb.height), ww: innerWidth, wh: innerHeight, sw: document.documentElement.scrollWidth }; })()`);
  if (L.fs < 26 || L.kbr > L.ww + 1 || L.sw > L.ww + 1) throw new Error('texte petit ou clavier qui dépasse : ' + JSON.stringify(L));
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  return 'la lettre ' + want + ' ratée six fois passe au rouge · texte de ' + L.fs + ' px dans ' + L.ww + '×' + L.wh;
};
