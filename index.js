// Test de frappe : tape le plus vite et le plus juste possible, en temps limité ou en nombre de mots ; records, courbe et touches les plus ratées.
// Appli NeoDex habillée en pixel art (police bitmap, cadres et boutons en pixels). Elle tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Test de frappe</span><span class="hint" id="tyBest" data-pxskip></span></div>
  <div class="row tyTop"><label class="row">Durée <select class="f gSel" id="tyDur"><option value="15">15 s</option><option value="30" selected>30 s</option><option value="60">60 s</option><option value="120">2 min</option><option value="w25">25 mots</option><option value="w50">50 mots</option></select></label><label class="check"><input type="checkbox" id="tyPunct"> Ponctuation et majuscules</label><button class="btn main" id="tyRestart">RECOMMENCER</button></div>
  <div class="sysCard tyCard"><div id="tyText" data-pxskip></div><input class="f" id="tyIn" spellcheck="false" autocomplete="off" placeholder="Commence à taper : le chrono démarre à la première lettre"><div class="tyProg" id="tyProg" data-pxskip></div><div class="tyBar"><span id="tyLive" class="label" data-pxskip></span><span class="hint">Tab ou Échap : recommencer</span></div><div class="tyKb" id="tyKb" data-pxskip></div><div class="tyMiss" id="tyMiss" data-pxskip></div></div>
  <div class="sysCard tyRes" id="tyRes" style="display:none" data-pxskip></div>
  <div class="sysCard"><span class="label">Tes 20 dernières parties · mots par minute</span><div id="tyChart" class="colChart" data-pxskip></div></div>
</div>`;
/*CSS-MOVED*/ const CSS = `#tyText{--fs:clamp(26px,min(3.1vw,5.2vh),48px);display:flex;flex-wrap:wrap;gap:0 .55em;font:var(--fs)/1.5 var(--text);color:var(--muted);height:calc(var(--fs) * 4.5 + 20px);overflow:hidden;padding:10px 14px;background:#0a0618 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' shape-rendering='crispEdges'%3E%3Crect width='1' height='1' fill='%23170f2e'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23130b26'/%3E%3C/svg%3E");background-size:8px 8px;image-rendering:pixelated;box-shadow:inset 0 0 0 3px #2a1d52,inset 6px 6px 0 #05010b,4px 4px 0 #05010b}
#tyText i.c{box-shadow:none;background:var(--pink);color:#0a0618;animation:tyBlink 1s steps(1) infinite}
@keyframes tyBlink{50%{background:transparent;color:var(--muted);box-shadow:inset 0 -4px 0 var(--pink)}}
.tyProg{display:flex;gap:2px;height:10px;margin:2px 0}.tyProg i{flex:1;background:#1c1238;box-shadow:inset -2px -2px 0 rgba(0,0,0,.35)}.tyProg i.on{background:var(--pink)}
.tyKb{display:flex;flex-direction:column;align-items:center;gap:4px;margin-top:6px;user-select:none}.tyKb div{display:flex;gap:4px}
.tyKb{--kw:clamp(26px,min(4.2vw,5.6vh),56px)}
.tyKb b{display:grid;place-items:center;width:var(--kw);height:var(--kw);font:calc(var(--kw) * .42) var(--text);color:#d9c6ff;background:#1c1238;box-shadow:inset -3px -3px 0 #0e0820,inset 3px 3px 0 #2e2256,0 3px 0 #05010b;transition:transform .05s}
.tyKb b.sp{width:calc(var(--kw) * 8)}
.tyKb b.h1{background:#5a5020;box-shadow:inset -3px -3px 0 #3a3410,inset 3px 3px 0 #8a7a30,0 3px 0 #05010b}
.tyKb b.h2{background:#7a4a1a;box-shadow:inset -3px -3px 0 #4a2a0a,inset 3px 3px 0 #b07030,0 3px 0 #05010b}
.tyKb b.h3{background:#7a1a2a;box-shadow:inset -3px -3px 0 #4a0a14,inset 3px 3px 0 #c04050,0 3px 0 #05010b}
.tyMiss{display:flex;flex-wrap:wrap;gap:6px 14px;justify-content:center;align-items:center;font:15px var(--text);color:var(--muted);min-height:22px}
.tyMiss i{font-style:normal;display:inline-block;width:12px;height:12px;margin-right:4px;vertical-align:-1px}
.tyMiss b{color:#fff;font-weight:normal}.tyKb b.g{background:#2f7a46;color:#fff;transform:translateY(2px);box-shadow:inset -3px -3px 0 #1e5030,inset 3px 3px 0 #5fbf6a}
.tyKb b.r{background:#8a2c3c;color:#fff;transform:translateY(2px);box-shadow:inset -3px -3px 0 #5a1a26,inset 3px 3px 0 #d8584a}
.tyKb b.next{box-shadow:inset 0 0 0 2px var(--pink),0 3px 0 #05010b}
#tyText .ok{color:var(--lilac)}
#tyText .bad{color:var(--red);text-decoration:line-through}
#tyText .cur{color:var(--muted)}
#tyText i{font-style:normal}
#tyText i.g{color:#fff}
#tyText i.r{color:var(--red);background:rgba(255,79,109,.18)}
#tyText i.x{opacity:.7}
.tyRes{flex-direction:row;flex-wrap:wrap;align-items:center;gap:18px 34px}
.tyRes>div{display:flex;flex-direction:column;gap:6px}
.tyRes b{font:18px var(--title);color:#fff}
.tyRec{font:10px var(--title);color:var(--pink)}
.tyCurve{width:300px;height:60px;image-rendering:pixelated;background:#0a0618;box-shadow:inset 0 0 0 2px #2a1d52}
#tyIn{font-size:clamp(18px,2vw,28px)}
.tyTop{flex-wrap:wrap;gap:10px 18px;align-items:center}
.tyCard{display:flex;flex-direction:column;gap:8px}
#tyIn.wrong{box-shadow:inset 0 0 0 3px var(--red)}
.tyBar{display:flex;justify-content:space-between;align-items:center}
#tyRes{color:var(--pink);font-size:17px}
`;  // le style de ce plugin (il utilise les variables du thème de NeoDex)
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}

export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const { el, toast, sfx, ask, newTab, pixIcon, PIX, WX } = ctx.host;
  const folder = ctx.folder, legacy = ctx.legacy || {};
  ctx.host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "TEST DE FRAPPE", T: {"k": "#050c06", "k2": "#0c1a0e", "fill": "#142a18", "fillOn": "#1c3a22", "hl": "#24482a", "line": "#3a6a40", "acc": "#3fe0ff", "accL": "#c8f8ff", "accS": "#1a9ac0", "accD": "#06304a", "rivet": "#c8f8ff", "btn": "#24482a", "btnHi": "#5a9a5a", "btnLo": "#0c1a0e", "btnHov": "#2a5430", "btnHovHi": "#7aba7a", "text": "#f0fff0", "muted": "#b0d0a8", "acc2": "#ff4fa8", "gold": "#ffd84a", "orange": "#ffa030", "red": "#ff4a5a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#060e08", "bgDot": "#142a18", "bgDot2": "#0c1a0e", "spark": "#3a6a40", "spark2": "#ff4fa8", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["............", "kkkkkkkkkkkk", "kwkwkwkwkwkk", "kkkkkkkkkkkk", "kkwkwkwkwkwk", "kkkkkkkkkkkk", "kwkwkwkwkwkk", "kkkkkkkkkkkk", "kkkwwwwwwkkk", "kkkkkkkkkkkk", "............", "............"],
  icons: [[/^RECOMMENCER/, "play"]] });
  const $ = id => id === "typingApp" ? view : view.querySelector('#' + id);  // les identifiants de ta vue, sans toucher à ceux du reste de NeoDex
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const LEGACY_API = ["games"];
  const api = async (n, data) => {
    if (data !== undefined) { await folder.write(n, data); return true; }
    let v = await doc(n);
    if (v == null && legacy.api && LEGACY_API.includes(n)) { v = await legacy.api(n).catch(() => null); if (v != null) await folder.write(n, v); }  // première ouverture : tu retrouves tes données d'avant
    return v;
  };
  let games = await doc('games');
  if (games == null) { const old = legacy.api ? await legacy.api('games').catch(() => null) : null; games = { typing: old?.typing || [], best: Object.fromEntries(Object.entries(old?.best || {}).filter(([k]) => k.startsWith('typing'))) }; if (old) await folder.write('games', games); }
  games = { typing: [], best: {}, ...games };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v, higher = true) => { const b = games.best[k]; if (b == null || (higher ? v > b : v < b)) { games.best[k] = v; saveGames(); return true; } return false; };
  // ---- ton code d'origine ----
  /* ---------- Test de frappe: modes by time or by number of words, optional punctuation, letter by letter feedback ---------- */
  const TY_WORDS = ('le de un être et à il avoir ne je son que se qui ce dans en du elle au pour pas vous par sur faire plus dire me on mon lui nous comme mais pouvoir avec tout aller voir bien où sans tu ou leur homme si deux moi vouloir te femme venir quand grand celui notre devoir là jour prendre même votre rien petit encore aussi quelque dont mer trouver donner temps peu falloir sous parler alors main chose ton mettre vie savoir yeux passer autre après regarder toujours puis jamais cela aimer non heure croire cent monde donc enfant fois seul entre vers chez demander jeune jusque très moment rester répondre tête père fille mille premier car entendre bon trois cœur an quatre terre contre voix penser quel arriver maison devant coup beau connaître devenir air mot nuit sentir vieux sembler moins tenir ami porte ouvrir partir pendant mieux depuis ville chat livre école musique jouer écran clavier étoile pixel couleur fenêtre soleil route lumière histoire matin soir rapide lent simple question réponse idée travail ensemble bientôt souvent parfois vrai faux image page lettre nombre jeu partie niveau').split(' ');
  let ty = null;
  const tyMode = () => $('tyDur').value;  // "30" = seconds, "w25" = number of words
  function tyNew() {
    clearInterval(ty?.timer);
    let list = Array.from({length: 150}, () => TY_WORDS[Math.floor(Math.random() * TY_WORDS.length)]);
    if ($('tyPunct').checked) {  // a capital after each full stop or question mark, some commas
      let cap = true;
      list = list.map(w => { if (cap) { w = w[0].toUpperCase() + w.slice(1); cap = false; } const r = Math.random(); if (r < .07) { cap = true; return w + '.'; } if (r < .1) { cap = true; return w + ' ?'; } return r < .17 ? w + ',' : w; }).join(' ').split(' ');
    }
    const m = tyMode(), byWords = m.startsWith('w');
    if (byWords) list = list.slice(0, +m.slice(1));
    ty = {words: list, i: 0, typed: [], byWords, secs: byWords ? 0 : +m, left: byWords ? 0 : +m, started: 0, timer: null, ok: 0, bad: 0, keys: 0, errors: 0, curve: [], done: false};
    $('tyIn').value = ''; $('tyIn').disabled = false; $('tyRes').replaceChildren(); $('tyRes').style.display = 'none'; tyRender(); tyHist();
  }
  const tyElapsed = () => ty.started ? (Date.now() - ty.started) / 1000 : 0;
  const tyWpm = () => { const s = tyElapsed(); return s > 1 ? Math.round(ty.ok / 5 / (s / 60)) : 0; };
  function tyRender() {
    const box = $('tyText'), cur = $('tyIn').value;
    box.replaceChildren(...ty.words.map((w, k) => {
      if (k < ty.i) return el('span', ty.typed[k] === w ? 'ok' : 'bad', w);
      if (k > ty.i) return el('span', '', w);
      const s = el('span', 'cur');  // the current word, letter by letter
      [...w].forEach((ch, j) => s.append(el('i', j < cur.length ? (cur[j] === ch ? 'g' : 'r') : j === cur.length ? 'c' : '', ch)));
      if (cur.length > w.length) s.append(el('i', 'r x', cur.slice(w.length)));
      return s;
    }));
    const c = box.querySelector('.cur'), lh = c ? c.offsetHeight : 36; if (c) box.scrollTop = Math.max(0, c.offsetTop - box.offsetTop - lh);  // la ligne en cours reste la deuxième
    const acc = ty.keys ? Math.round((ty.keys - ty.errors) / ty.keys * 100) : 100;
    const done = ty.byWords ? ty.i / ty.words.length : ty.secs ? 1 - ty.left / ty.secs : 0, n = Math.round(done * 30);
    $('tyProg').replaceChildren(...Array.from({length: 30}, (_, k) => el('i', k < n ? 'on' : '')));
    const nx = (ty.words[ty.i] || '')[cur.length] ?? ' '; $('tyKb').querySelectorAll('b').forEach(b => b.classList.toggle('next', b.dataset.k === nx.toLowerCase()));
    $('tyLive').textContent = (ty.byWords ? ty.i + ' / ' + ty.words.length + ' mots' : ty.left + ' s') + ' · ' + tyWpm() + ' mots/min · ' + acc + ' %';
  }
  function tyEnd() {
    clearInterval(ty.timer); ty.done = true; $('tyIn').disabled = true;
    const secs = tyElapsed(), wpm = Math.round(ty.ok / 5 / (secs / 60)), raw = Math.round((ty.ok + ty.bad) / 5 / (secs / 60)), acc = ty.keys ? Math.round((ty.keys - ty.errors) / ty.keys * 100) : 0;
    const good = ty.typed.filter((w, k) => w === ty.words[k]).length, mode = tyMode() + ($('tyPunct').checked ? 'p' : '');
    games.typing.push({wpm, raw, acc, mode, secs: Math.round(secs), t: Date.now()}); games.typing = games.typing.slice(-200);
    const rec = best('typing' + mode, wpm); saveGames();
    const card = $('tyRes'), stat = (label, value) => { const d = el('div'); d.append(el('span', 'label', label), el('b', '', value)); return d; };
    card.replaceChildren(stat('Vitesse', wpm + ' mots/min'), stat('Brute', raw + ' mots/min'), stat('Précision', acc + ' %'), stat('Mots justes', good + ' / ' + ty.typed.length), stat('Temps', Math.round(secs) + ' s'),
      el('div', 'tyRec', rec ? 'NOUVEAU RECORD !' : 'Record : ' + games.best['typing' + mode] + ' mots/min'), el('div', 'hint', 'Tab ou Échap : recommencer'));
    const cv = el('canvas', 'tyCurve'); cv.width = 300; cv.height = 60; card.append(cv);
    const g = cv.getContext('2d'), mx = Math.max(20, ...ty.curve); g.fillStyle = '#8a5cf0';
    ty.curve.forEach((v, i) => { const h = Math.max(1, v / mx * 56); g.fillRect(Math.floor(i * 300 / ty.curve.length), 60 - h, Math.max(1, Math.floor(300 / ty.curve.length) - 1), h); });
    card.style.display = ''; sfx(rec ? 'launch' : 'notify'); tyHist(); tyHeatDraw();
  }
  function tyHist() {
    const h = (games?.typing || []).filter(x => (x.mode || String(x.secs)) === tyMode() + ($('tyPunct').checked ? 'p' : '')), last = h.slice(-20), max = Math.max(40, ...last.map(x => x.wpm));
    $('tyBest').textContent = 'Record dans ce mode : ' + (games?.best['typing' + tyMode() + ($('tyPunct').checked ? 'p' : '')] ?? '—') + ' mots/min';
    $('tyChart').replaceChildren(...(last.length ? last.map(x => { const c = el('div', 'col'), b = el('div', 'bar'); b.style.height = x.wpm / max * 120 + 'px'; c.title = new Date(x.t).toLocaleString('fr-FR', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'}) + ' : ' + x.wpm + ' mots/min, ' + x.acc + ' %'; c.append(b, el('span', '', String(x.wpm))); return c; }) : [el('div', 'hint', 'Tes parties dans ce mode apparaîtront ici.')]));
  }
  $('tyIn').oninput = e => {
    if (ty.done) return;
    if (!ty.started) {
      ty.started = Date.now();
      ty.timer = setInterval(() => { ty.curve.push(tyWpm()); if (!ty.byWords) { ty.left = Math.max(0, ty.secs - Math.floor(tyElapsed())); if (ty.left <= 0) return tyEnd(); } tyRender(); }, 1000);
    }
    const v = e.target.value, target = ty.words[ty.i];
    if (e.inputType?.startsWith('insert')) { ty.keys++; const j = v.trimEnd().length - 1; if (j >= 0 && !/\s$/.test(v) && v[j] !== target[j]) ty.errors++; }
    if (/\s$/.test(v)) {  // a space validates the word
      const w = v.trim();
      if (w) { ty.typed[ty.i] = w; if (w === target) ty.ok += w.length + 1; else ty.bad += Math.max(w.length, target.length); ty.i++; }
      e.target.value = '';
      if (ty.byWords && ty.i >= ty.words.length) return tyEnd();
    }
    $('tyIn').classList.toggle('wrong', !ty.words[ty.i]?.startsWith(e.target.value));
    tyRender();
  };
  // un clavier AZERTY en pixels : la touche suivante est entourée, celle que tu frappes s'allume (verte si juste, rouge sinon)
  $('tyKb').replaceChildren(...['azertyuiop', 'qsdfghjklm', 'wxcvbn,.', ' '].map(r => { const d = el('div'); for (const k of r) { const b = el('b', k === ' ' ? 'sp' : '', k === ' ' ? 'ESPACE' : k.toUpperCase()); b.dataset.k = k; d.append(b); } return d; }));
  // les fautes par touche : chaque lettre attendue compte une frappe, et une faute si une autre touche est tapée ; les plus ratées se colorent
  const tyStat = () => (games.typeKeys ??= {}), tyBad = () => (games.typeMiss ??= {});
  const tyHeat = k => { const n = tyStat()[k] || 0, r = n >= 5 ? (tyBad()[k] || 0) / n : 0; return r >= .15 ? 3 : r >= .08 ? 2 : r >= .03 ? 1 : 0; };
  function tyHeatDraw() {
    $('tyKb').querySelectorAll('b').forEach(b => { const h = tyHeat(b.dataset.k); b.classList.toggle('h1', h === 1); b.classList.toggle('h2', h === 2); b.classList.toggle('h3', h === 3); });
    const top = Object.keys(tyStat()).filter(k => tyHeat(k)).sort((a, b) => tyBad()[b] / tyStat()[b] - tyBad()[a] / tyStat()[a]).slice(0, 5);
    const sw = [, '#8a7a30', '#b07030', '#c04050'];
    $('tyMiss').replaceChildren(...(top.length ? [el('span', '', 'Touches les plus ratées :'), ...top.map(k => { const s = el('span'), i = el('i'); i.style.background = sw[tyHeat(k)]; s.append(i, el('b', '', k === ' ' ? 'espace' : k.toUpperCase()), ' ' + Math.round(tyBad()[k] / tyStat()[k] * 100) + ' %'); return s; })]
      : [el('span', '', 'Les touches que tu rates le plus se coloreront ici, du jaune au rouge.')]));
  }
  const tyCount = (want, ok) => { if (!/^[a-zà-ÿ ,.?]$/.test(want)) return; tyStat()[want] = (tyStat()[want] || 0) + 1; if (!ok) tyBad()[want] = (tyBad()[want] || 0) + 1; saveGames(); };
  const tyFlash = (k, ok) => { const b = [...$('tyKb').querySelectorAll('b')].find(x => x.dataset.k === k); if (!b) return; b.classList.remove('g', 'r'); b.classList.add(ok ? 'g' : 'r'); setTimeout(() => b.classList.remove('g', 'r'), 140); };
  $('tyIn').onkeydown = e => {
    if (e.key === 'Tab' || e.key === 'Escape') { e.preventDefault(); tyNew(); $('tyIn').focus(); return; }
    if (e.key.length === 1 && ty && !ty.done) { const want = (ty.words[ty.i] || '')[$('tyIn').value.length] ?? ' '; tyFlash(e.key.toLowerCase(), e.key === want); tyCount(want.toLowerCase(), e.key === want); }
  };
  $('tyRestart').onclick = () => { tyNew(); $('tyIn').focus(); };
  $('tyDur').onchange = $('tyPunct').onchange = () => { tyNew(); $('tyIn').focus(); };
  tyHeatDraw();
  $('tyText').__ty = {st: () => ty, heat: k => tyHeat(k), draw: () => tyHeatDraw()};  // pour le test « local »
  {  // vérification : une touche ratée une fois sur cinq est rouge, une touche jamais ratée reste neutre, moins de 5 frappes ne compte pas
    const kS = JSON.stringify(games.typeKeys ?? null), kM = JSON.stringify(games.typeMiss ?? null);
    games.typeKeys = {e: 10, a: 20, z: 3}; games.typeMiss = {e: 2, z: 3};
    console.assert(tyHeat('e') === 3 && tyHeat('a') === 0 && tyHeat('z') === 0, 'frappe chaleur');
    games.typeKeys = JSON.parse(kS) ?? undefined; games.typeMiss = JSON.parse(kM) ?? undefined; if (!games.typeKeys) delete games.typeKeys; if (!games.typeMiss) delete games.typeMiss;
  }
  // ---- fin ----
  ctx.onOpen(() => { if (!ty) tyNew(); tyHist(); setTimeout(() => $('tyIn').focus()); });
  ctx.onClose(() => { clearInterval(ty?.timer); });
}
