// Interactive lesson widgets. Each is a function(container) that builds its UI.
window.WIDGETS = {};

// ---------- helpers ----------
function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
function setupCanvas(canvas, w, h) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.aspectRatio = `${w} / ${h}`;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return ctx;
}
function slider(labelText, min, max, step, value, oninput) {
  const row = document.createElement('div');
  row.className = 'w-row';
  const label = document.createElement('label');
  label.textContent = labelText;
  const input = document.createElement('input');
  input.type = 'range';
  input.min = min; input.max = max; input.step = step; input.value = value;
  const val = document.createElement('span');
  val.className = 'val';
  val.textContent = (+value).toFixed(step < 1 ? 1 : 0);
  input.addEventListener('input', () => {
    val.textContent = (+input.value).toFixed(step < 1 ? 1 : 0);
    oninput(+input.value);
  });
  row.append(label, input, val);
  return { row, input };
}

// ---------- 1. Perceptron ----------
WIDGETS.perceptron = (el) => {
  const state = { x1: 8, x2: 3, w1: 0.5, w2: -0.5, b: 0 };
  const out = document.createElement('div');
  out.className = 'w-out';
  const bar = document.createElement('div');
  bar.className = 'pbar';
  bar.style.marginTop = '10px';
  bar.innerHTML = '<div style="width:50%"></div>';

  function render() {
    const z = state.w1 * state.x1 + state.w2 * state.x2 + state.b;
    const y = 1 / (1 + Math.exp(-z));
    out.innerHTML =
      `sum = (${state.w1.toFixed(1)} × ${state.x1}) + (${state.w2.toFixed(1)} × ${state.x2}) + ${state.b.toFixed(1)} = <b>${z.toFixed(2)}</b><br>` +
      `output = sigmoid(sum) = <b>${y.toFixed(2)}</b> → ${y > 0.5 ? '🌳 go outside!' : '🏠 stay in'}`;
    bar.firstElementChild.style.width = (y * 100) + '%';
    bar.firstElementChild.style.background = y > 0.5 ? cssVar('--good') : cssVar('--series-6');
  }
  el.append(
    slider('☀️ sunniness (0–10)', 0, 10, 1, state.x1, v => { state.x1 = v; render(); }).row,
    slider('📅 busyness (0–10)', 0, 10, 1, state.x2, v => { state.x2 = v; render(); }).row,
    slider('weight w₁ (sun)', -1, 1, 0.1, state.w1, v => { state.w1 = v; render(); }).row,
    slider('weight w₂ (busy)', -1, 1, 0.1, state.w2, v => { state.w2 = v; render(); }).row,
    slider('bias b', -5, 5, 0.5, state.b, v => { state.b = v; render(); }).row,
    out, bar,
  );
  const note = document.createElement('div');
  note.className = 'w-note';
  note.textContent = 'Output above 0.5 means "go outside". The sigmoid squashes any sum into a 0–1 score.';
  el.append(note);
  render();
};

// ---------- 2. Activation functions ----------
WIDGETS.activation = (el) => {
  const fns = {
    ReLU: x => Math.max(0, x),
    Sigmoid: x => 1 / (1 + Math.exp(-x)),
    Tanh: x => Math.tanh(x),
  };
  let current = 'ReLU', xin = 1.5;

  const btnRow = document.createElement('div');
  btnRow.className = 'w-row';
  const btns = {};
  for (const name of Object.keys(fns)) {
    const b = document.createElement('button');
    b.className = 'btn small ghost';
    b.textContent = name;
    b.onclick = () => { current = name; render(); };
    btns[name] = b;
    btnRow.append(b);
  }
  const canvas = document.createElement('canvas');
  const W = 640, H = 300;
  const ctx = setupCanvas(canvas, W, H);
  const out = document.createElement('div');
  out.className = 'w-out';

  // plot range: x in [-5,5], y in [-1.5, 2.5]
  const X0 = -5, X1 = 5, Y0 = -1.5, Y1 = 2.5;
  const px = x => (x - X0) / (X1 - X0) * W;
  const py = y => H - (y - Y0) / (Y1 - Y0) * H;

  function render() {
    for (const [n, b] of Object.entries(btns)) {
      b.style.background = n === current ? cssVar('--series-1') : 'transparent';
      b.style.color = n === current ? '#fff' : '';
      b.style.borderColor = n === current ? cssVar('--series-1') : '';
    }
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = cssVar('--surface-1');
    ctx.fillRect(0, 0, W, H);
    // axes
    ctx.strokeStyle = cssVar('--baseline');
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, py(0)); ctx.lineTo(W, py(0));
    ctx.moveTo(px(0), 0); ctx.lineTo(px(0), H);
    ctx.stroke();
    // curve
    const f = fns[current];
    ctx.strokeStyle = cssVar('--series-1');
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const x = X0 + (X1 - X0) * i / 300;
      i === 0 ? ctx.moveTo(px(x), py(f(x))) : ctx.lineTo(px(x), py(f(x)));
    }
    ctx.stroke();
    // point
    const y = f(xin);
    ctx.fillStyle = cssVar('--series-8');
    ctx.beginPath();
    ctx.arc(px(xin), py(y), 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = cssVar('--surface-1');
    ctx.lineWidth = 2;
    ctx.stroke();
    out.innerHTML = `${current}(<b>${xin.toFixed(1)}</b>) = <b>${y.toFixed(3)}</b>`;
  }
  el.append(btnRow, canvas,
    slider('input x', -5, 5, 0.1, xin, v => { xin = v; render(); }).row,
    out);
  render();
};

// ---------- 3. Fit a line (loss) ----------
WIDGETS.fitline = (el) => {
  // toy data: houses, roughly y = 0.3x + 5 with noise (x: 100s sq ft, y: $10k)
  const data = [[10, 8.5], [13, 9.3], [16, 10.2], [19, 10.4], [22, 12.1], [25, 12.4], [28, 13.8], [31, 14.9], [34, 15.1], [37, 16.7]];
  let w = 1.0, b = 0;
  const canvas = document.createElement('canvas');
  const W = 640, H = 340;
  const ctx = setupCanvas(canvas, W, H);
  const out = document.createElement('div');
  out.className = 'w-out';
  let best = Infinity;

  const X0 = 5, X1 = 42, Y0 = 0, Y1 = 25;
  const px = x => (x - X0) / (X1 - X0) * W;
  const py = y => H - (y - Y0) / (Y1 - Y0) * H;

  function loss() {
    let s = 0;
    for (const [x, y] of data) { const e = (w * x + b) - y; s += e * e; }
    return s / data.length;
  }
  function render() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = cssVar('--surface-1');
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = cssVar('--grid');
    ctx.lineWidth = 1;
    for (let gy = 5; gy < 25; gy += 5) {
      ctx.beginPath(); ctx.moveTo(0, py(gy)); ctx.lineTo(W, py(gy)); ctx.stroke();
    }
    // error segments
    ctx.strokeStyle = cssVar('--series-6');
    ctx.lineWidth = 1.5;
    for (const [x, y] of data) {
      ctx.beginPath(); ctx.moveTo(px(x), py(y)); ctx.lineTo(px(x), py(w * x + b)); ctx.stroke();
    }
    // line
    ctx.strokeStyle = cssVar('--series-1');
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(px(X0), py(w * X0 + b));
    ctx.lineTo(px(X1), py(w * X1 + b));
    ctx.stroke();
    // points
    for (const [x, y] of data) {
      ctx.fillStyle = cssVar('--series-5');
      ctx.beginPath(); ctx.arc(px(x), py(y), 5.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = cssVar('--surface-1'); ctx.lineWidth = 2; ctx.stroke();
    }
    const L = loss();
    best = Math.min(best, L);
    const grade = L < 0.35 ? ' 🏆 basically optimal!' : L < 1 ? ' 🎯 great fit!' : L < 5 ? ' getting warmer…' : '';
    out.innerHTML = `prediction = <b>${w.toFixed(2)}</b> × size + <b>${b.toFixed(1)}</b> &nbsp;|&nbsp; loss (MSE) = <b>${L.toFixed(2)}</b>${grade}<br><span style="color:${cssVar('--muted')}">best so far: ${best.toFixed(2)} · red segments are each point's error</span>`;
  }
  el.append(canvas,
    slider('slope w', -0.5, 1.5, 0.01, w, v => { w = v; render(); }).row,
    slider('intercept b', -10, 15, 0.1, b, v => { b = v; render(); }).row,
    out);
  render();
};

// ---------- 4. Gradient descent ----------
WIDGETS.gradient = (el) => {
  // f(x) = 0.1x^4 - 0.5x^2 + 0.3x + 2  -> two valleys
  const f = x => 0.1 * x ** 4 - 0.5 * x ** 2 + 0.3 * x + 2;
  const df = x => 0.4 * x ** 3 - x + 0.3;
  let x = 2.6, lr = 0.1, trail = [];

  const canvas = document.createElement('canvas');
  const W = 640, H = 320;
  const ctx = setupCanvas(canvas, W, H);
  const out = document.createElement('div');
  out.className = 'w-out';

  const X0 = -3.4, X1 = 3.4, Y0 = 0, Y1 = 6;
  const px = v => (v - X0) / (X1 - X0) * W;
  const py = v => H - (v - Y0) / (Y1 - Y0) * H;

  function render() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = cssVar('--surface-1');
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = cssVar('--series-1');
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 400; i++) {
      const xx = X0 + (X1 - X0) * i / 400;
      i === 0 ? ctx.moveTo(px(xx), py(f(xx))) : ctx.lineTo(px(xx), py(f(xx)));
    }
    ctx.stroke();
    // trail
    ctx.fillStyle = cssVar('--series-3');
    for (const t of trail) {
      ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.arc(px(t), py(f(t)), 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // ball
    ctx.fillStyle = cssVar('--series-8');
    ctx.beginPath(); ctx.arc(px(x), py(f(x)), 9, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = cssVar('--surface-1'); ctx.lineWidth = 2; ctx.stroke();
    const g = df(x);
    out.innerHTML = `position x = <b>${x.toFixed(3)}</b> &nbsp;|&nbsp; loss = <b>${f(x).toFixed(3)}</b> &nbsp;|&nbsp; gradient = <b>${g.toFixed(3)}</b> ${Math.abs(g) < 0.02 ? '<b>converged</b>' : g > 0 ? '(downhill is ←)' : '(downhill is →)'}`;
  }
  const row = document.createElement('div');
  row.className = 'w-row';
  const stepBtn = document.createElement('button');
  stepBtn.className = 'btn small';
  stepBtn.textContent = 'Step';
  stepBtn.onclick = () => {
    trail.push(x);
    if (trail.length > 40) trail.shift();
    x = x - lr * df(x);
    x = Math.max(X0, Math.min(X1, x));
    render();
  };
  const resetBtn = document.createElement('button');
  resetBtn.className = 'btn small ghost';
  resetBtn.textContent = 'Reset';
  resetBtn.onclick = () => { x = 2.6; trail = []; render(); };
  row.append(stepBtn, resetBtn);
  el.append(canvas, slider('learning rate', 0.01, 1.2, 0.01, lr, v => { lr = v; }).row, row, out);
  const note = document.createElement('div');
  note.className = 'w-note';
  note.textContent = 'Try: reach the bottom with lr ≈ 0.1. Then reset and try lr = 1.0. Also notice: there are TWO valleys — can you get stuck in the shallow one?';
  el.append(note);
  render();
};

// ---------- 5. XOR network (real training) ----------
WIDGETS.xornet = (el) => {
  const X = [[0, 0], [0, 1], [1, 0], [1, 1]];
  const T = [0, 1, 1, 0];
  let net, lossHist, timer = null, epoch = 0;

  function init() {
    const r = () => (Math.random() * 2 - 1);
    net = {
      w1: [[r(), r(), r(), r()], [r(), r(), r(), r()]], // 2x4
      b1: [0, 0, 0, 0],
      w2: [r(), r(), r(), r()], // 4x1
      b2: 0,
    };
    lossHist = [];
    epoch = 0;
  }
  const sig = z => 1 / (1 + Math.exp(-z));

  function forward(x) {
    const h = net.b1.map((b, j) => sig(x[0] * net.w1[0][j] + x[1] * net.w1[1][j] + b));
    const o = sig(h.reduce((s, hj, j) => s + hj * net.w2[j], net.b2));
    return { h, o };
  }
  function trainEpoch() {
    const lr = 2.0;
    let L = 0;
    const gw1 = [[0, 0, 0, 0], [0, 0, 0, 0]], gb1 = [0, 0, 0, 0], gw2 = [0, 0, 0, 0];
    let gb2 = 0;
    for (let i = 0; i < 4; i++) {
      const { h, o } = forward(X[i]);
      const e = o - T[i];
      L += e * e;
      const dout = 2 * e * o * (1 - o);
      for (let j = 0; j < 4; j++) {
        gw2[j] += dout * h[j];
        const dh = dout * net.w2[j] * h[j] * (1 - h[j]);
        gw1[0][j] += dh * X[i][0];
        gw1[1][j] += dh * X[i][1];
        gb1[j] += dh;
      }
      gb2 += dout;
    }
    for (let j = 0; j < 4; j++) {
      net.w2[j] -= lr * gw2[j];
      net.w1[0][j] -= lr * gw1[0][j];
      net.w1[1][j] -= lr * gw1[1][j];
      net.b1[j] -= lr * gb1[j];
    }
    net.b2 -= lr * gb2;
    return L / 4;
  }

  const canvas = document.createElement('canvas');
  const W = 640, H = 220;
  const ctx = setupCanvas(canvas, W, H);
  const out = document.createElement('div');
  out.className = 'w-out';

  function render() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = cssVar('--surface-1');
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = cssVar('--grid');
    ctx.beginPath(); ctx.moveTo(0, H - 20); ctx.lineTo(W, H - 20); ctx.stroke();
    if (lossHist.length > 1) {
      const maxL = Math.max(0.3, ...lossHist);
      ctx.strokeStyle = cssVar('--series-6');
      ctx.lineWidth = 2;
      ctx.beginPath();
      lossHist.forEach((L, i) => {
        const xx = i / (lossHist.length - 1) * W;
        const yy = (H - 25) - (L / maxL) * (H - 40);
        i === 0 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy);
      });
      ctx.stroke();
    }
    ctx.fillStyle = cssVar('--muted');
    ctx.font = '12px system-ui';
    ctx.fillText('loss over training →', 8, 16);

    const preds = X.map((x, i) => {
      const o = forward(x).o;
      const ok = Math.round(o) === T[i];
      return `${x[0]} XOR ${x[1]} → <b style="color:${ok ? cssVar('--good-text') : cssVar('--bad')}">${o.toFixed(2)}</b> (want ${T[i]})`;
    });
    const solved = X.every((x, i) => Math.round(forward(x).o) === T[i]);
    out.innerHTML = `epoch <b>${epoch}</b> &nbsp;|&nbsp; loss = <b>${(lossHist[lossHist.length - 1] ?? 0.25).toFixed(4)}</b>${solved && epoch > 0 ? ' &nbsp;<b>solved</b>' : ''}<br>` + preds.join('<br>');
  }

  const row = document.createElement('div');
  row.className = 'w-row';
  const trainBtn = document.createElement('button');
  trainBtn.className = 'btn small';
  trainBtn.textContent = '▶ Train';
  trainBtn.onclick = () => {
    if (timer) { clearInterval(timer); timer = null; trainBtn.textContent = '▶ Train'; return; }
    trainBtn.textContent = '⏸ Pause';
    timer = setInterval(() => {
      if (!canvas.isConnected) { clearInterval(timer); timer = null; return; }
      for (let k = 0; k < 20; k++) { const L = trainEpoch(); epoch++; if (epoch % 5 === 0) lossHist.push(L); }
      if (lossHist.length > 400) lossHist = lossHist.filter((_, i) => i % 2 === 0);
      render();
      if (epoch > 6000) { clearInterval(timer); timer = null; trainBtn.textContent = '▶ Train'; }
    }, 50);
  };
  const resetBtn = document.createElement('button');
  resetBtn.className = 'btn small ghost';
  resetBtn.textContent = 'Reset (new random weights)';
  resetBtn.onclick = () => { if (timer) { clearInterval(timer); timer = null; trainBtn.textContent = '▶ Train'; } init(); render(); };
  row.append(trainBtn, resetBtn);
  el.append(canvas, row, out);
  init();
  render();
};

// ---------- 6. Tokenizer ----------
WIDGETS.tokenizer = (el) => {
  // toy vocab: common words + common fragments
  const vocab = ['the', 'and', 'ing', 'tion', 'er', 'is', 'was', 'to', 'of', 'in', 'on', 'at', 'it', 'you', 'for', 'be', 'that', 'this', 'with', 'are', 'as', 'have', 'not', 'un', 'able', 'believ', 'cat', 'dog', 'sat', 'mat', 'hello', 'world', 'learn', 'token', 'model', 'time', 'day', 'good', 'new', 'ai', 're', 'ly', 'ed', 'es', 'll', 've', 'an', 'or', 'al', 'en', 'ar', 'st', 'th', 'ou', 'de', 'com', 'pro', 'con', 'ex'];
  vocab.sort((a, b) => b.length - a.length);
  const colors = ['--series-1', '--series-2', '--series-3', '--series-5', '--series-6', '--series-8'];

  function tokenize(text) {
    const tokens = [];
    const words = text.split(/(\s+)/);
    for (const wpart of words) {
      if (!wpart) continue;
      if (/^\s+$/.test(wpart)) { if (tokens.length) tokens[tokens.length - 1].trail = true; continue; }
      let w = wpart.toLowerCase(), guard = 0;
      while (w.length && guard++ < 50) {
        let matched = null;
        for (const v of vocab) if (w.startsWith(v)) { matched = v; break; }
        if (!matched) { matched = w.slice(0, Math.min(2, w.length)); }
        tokens.push({ text: matched });
        w = w.slice(matched.length);
      }
    }
    return tokens;
  }

  const input = document.createElement('input');
  input.className = 'w-input';
  input.value = 'The unbelievable cat sat on the mat';
  const box = document.createElement('div');
  box.style.marginTop = '12px';
  const out = document.createElement('div');
  out.className = 'w-out';

  function render() {
    const toks = tokenize(input.value);
    box.innerHTML = '';
    toks.forEach((t, i) => {
      const chip = document.createElement('span');
      chip.className = 'token-chip';
      chip.textContent = t.text;
      const c = cssVar(colors[i % colors.length]);
      chip.style.background = `color-mix(in srgb, ${c} 18%, var(--surface-1))`;
      chip.style.borderColor = `color-mix(in srgb, ${c} 45%, transparent)`;
      box.append(chip);
      if (t.trail) box.append(document.createTextNode(' '));
    });
    const words = input.value.trim().split(/\s+/).filter(Boolean).length;
    out.innerHTML = `<b>${toks.length}</b> tokens from <b>${words}</b> words — the model sees ${toks.length} ID numbers, e.g. [${toks.slice(0, 6).map(t => (Math.abs([...t.text].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7)) % 50000)).join(', ')}${toks.length > 6 ? ', …' : ''}]`;
  }
  input.addEventListener('input', render);
  el.append(input, box, out);
  render();
};

// ---------- 7. Embeddings map ----------
WIDGETS.embeddings = (el) => {
  const words = [
    ['cat', 15, 22], ['dog', 22, 18], ['kitten', 11, 28], ['puppy', 25, 24], ['hamster', 18, 31],
    ['apple', 70, 20], ['banana', 78, 26], ['pizza', 65, 30], ['bread', 74, 34], ['cheese', 68, 39],
    ['happy', 20, 72], ['joyful', 14, 78], ['sad', 33, 80], ['angry', 38, 72], ['excited', 24, 84],
    ['car', 72, 70], ['truck', 79, 75], ['bicycle', 65, 78], ['train', 82, 66], ['bus', 74, 82],
  ];
  let selected = null;
  const canvas = document.createElement('canvas');
  const W = 640, H = 400;
  const ctx = setupCanvas(canvas, W, H);
  const out = document.createElement('div');
  out.className = 'w-out';
  out.textContent = 'Click a word to find its nearest neighbors in meaning-space.';

  const px = v => v / 100 * W;
  const py = v => v / 100 * H;
  const dist = (a, b) => Math.hypot(a[1] - b[1], a[2] - b[2]);

  function render() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = cssVar('--surface-1');
    ctx.fillRect(0, 0, W, H);
    let nearest = [];
    if (selected) {
      nearest = words.filter(w => w !== selected).sort((a, b) => dist(a, selected) - dist(b, selected)).slice(0, 3);
      ctx.strokeStyle = cssVar('--series-1');
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      for (const n of nearest) {
        ctx.beginPath();
        ctx.moveTo(px(selected[1]), py(selected[2]));
        ctx.lineTo(px(n[1]), py(n[2]));
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }
    ctx.font = '600 14px system-ui';
    ctx.textAlign = 'center';
    for (const w of words) {
      const isSel = w === selected;
      const isNear = nearest.includes(w);
      ctx.fillStyle = isSel ? cssVar('--series-8') : isNear ? cssVar('--series-1') : cssVar('--series-5');
      ctx.beginPath();
      ctx.arc(px(w[1]), py(w[2]), isSel ? 8 : 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = (isSel || isNear || !selected) ? cssVar('--ink') : cssVar('--muted');
      ctx.fillText(w[0], px(w[1]), py(w[2]) - 12);
    }
    if (selected) {
      out.innerHTML = `nearest to <b>${selected[0]}</b>: ${nearest.map(n => `<b>${n[0]}</b> (dist ${dist(n, selected).toFixed(1)})`).join(', ')}`;
    }
  }
  canvas.style.cursor = 'pointer';
  canvas.addEventListener('click', (e) => {
    const r = canvas.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width * 100;
    const my = (e.clientY - r.top) / r.height * 100;
    let bestW = null, bestD = 8;
    for (const w of words) {
      const d = Math.hypot(w[1] - mx, w[2] - my);
      if (d < bestD) { bestD = d; bestW = w; }
    }
    if (bestW) { selected = bestW; render(); }
  });
  el.append(canvas, out);
  render();
};

// ---------- 8. Attention ----------
WIDGETS.attention = (el) => {
  const sentence = ['The', 'cat', 'sat', 'on', 'the', 'mat', 'because', 'it', 'was', 'tired'];
  // plausible toy attention weights per token (row attends to columns)
  const A = {
    0: [5, 70, 10, 2, 3, 8, 1, 1, 0, 0],
    1: [15, 40, 20, 3, 2, 10, 2, 3, 2, 3],
    2: [5, 45, 20, 8, 2, 15, 2, 1, 1, 1],
    3: [2, 10, 30, 20, 5, 30, 1, 1, 1, 0],
    4: [3, 5, 5, 8, 10, 65, 2, 1, 1, 0],
    5: [3, 8, 20, 15, 25, 25, 2, 1, 1, 0],
    6: [1, 10, 15, 2, 1, 8, 20, 5, 8, 30],
    7: [2, 55, 8, 1, 1, 12, 5, 6, 2, 8],   // "it" → cat!
    8: [1, 15, 5, 1, 1, 4, 3, 25, 20, 25],
    9: [2, 35, 10, 1, 1, 5, 8, 25, 8, 5],
  };
  let sel = 7;
  const tokRow = document.createElement('div');
  tokRow.style.textAlign = 'center';
  const barRow = document.createElement('div');
  barRow.style.cssText = 'display:flex;gap:6px;align-items:flex-end;height:90px;margin-top:14px;';
  const out = document.createElement('div');
  out.className = 'w-out';

  function render() {
    tokRow.innerHTML = '';
    barRow.innerHTML = '';
    const weights = A[sel];
    const maxW = Math.max(...weights);
    sentence.forEach((tok, i) => {
      const t = document.createElement('span');
      t.className = 'attn-token' + (i === sel ? ' sel' : '');
      t.textContent = tok;
      const strength = weights[i] / maxW;
      if (i !== sel) t.style.background = `color-mix(in srgb, ${cssVar('--series-2')} ${Math.round(strength * 55)}%, var(--surface-1))`;
      t.onclick = () => { sel = i; render(); };
      tokRow.append(t);
    });
    sentence.forEach((tok, i) => {
      const col = document.createElement('div');
      col.style.cssText = 'flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:4px;height:100%;';
      const bar = document.createElement('div');
      bar.style.cssText = `width:70%;border-radius:4px 4px 0 0;background:${i === sel ? cssVar('--series-1') : cssVar('--series-2')};height:${Math.max(2, weights[i] / maxW * 60)}px;transition:height .25s ease;`;
      const lbl = document.createElement('div');
      lbl.style.cssText = `font-size:.65rem;color:${cssVar('--muted')};overflow:hidden;max-width:100%;`;
      lbl.textContent = tok;
      col.append(bar, lbl);
      barRow.append(col);
    });
    const top = weights.map((w, i) => [w, i]).filter(([, i]) => i !== sel).sort((a, b) => b[0] - a[0]).slice(0, 2);
    out.innerHTML = `<b>"${sentence[sel]}"</b> attends most to: ${top.map(([w, i]) => `<b>"${sentence[i]}"</b> (${w}%)`).join(', ')}`;
  }
  el.append(tokRow, barRow, out);
  render();
};

// ---------- 9. Temperature sampling ----------
WIDGETS.temperature = (el) => {
  const cands = [['mat', 3.2], ['floor', 1.8], ['couch', 1.5], ['bed', 1.2], ['roof', 0.4], ['moon', -0.5], ['spaghetti', -1.5]];
  let temp = 1.0;
  const canvas = document.createElement('canvas');
  const W = 640, H = 240;
  const ctx = setupCanvas(canvas, W, H);
  const story = document.createElement('div');
  story.className = 'w-out';
  story.innerHTML = 'The cat sat on the <b>___</b>';
  let picks = [];

  function probs() {
    const t = Math.max(0.05, temp);
    const exps = cands.map(([, logit]) => Math.exp(logit / t));
    const Z = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / Z);
  }
  function render() {
    const P = probs();
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = cssVar('--surface-1');
    ctx.fillRect(0, 0, W, H);
    const bw = W / cands.length;
    ctx.textAlign = 'center';
    cands.forEach(([word], i) => {
      const h = P[i] * (H - 58);
      const x = i * bw + bw * 0.14;
      ctx.fillStyle = cssVar('--series-1');
      ctx.beginPath();
      ctx.roundRect(x, H - 34 - h, bw * 0.72, h, [4, 4, 0, 0]);
      ctx.fill();
      ctx.fillStyle = cssVar('--ink');
      ctx.font = '600 13px system-ui';
      ctx.fillText(word, i * bw + bw / 2, H - 16);
      ctx.fillStyle = cssVar('--muted');
      ctx.font = '11px system-ui';
      ctx.fillText((P[i] * 100).toFixed(P[i] < 0.095 ? 1 : 0) + '%', i * bw + bw / 2, H - 40 - h);
    });
  }
  function sample() {
    const P = probs();
    let r = Math.random(), idx = 0;
    for (let i = 0; i < P.length; i++) { r -= P[i]; if (r <= 0) { idx = i; break; } }
    picks.push(cands[idx][0]);
    if (picks.length > 8) picks.shift();
    story.innerHTML = `The cat sat on the <b>${cands[idx][0]}</b><br><span style="color:${cssVar('--muted')}">recent picks: ${picks.join(', ')}</span>`;
  }
  const row = document.createElement('div');
  row.className = 'w-row';
  const btn = document.createElement('button');
  btn.className = 'btn small';
  btn.textContent = 'Sample';
  btn.onclick = sample;
  const btn10 = document.createElement('button');
  btn10.className = 'btn small ghost';
  btn10.textContent = 'Sample ×10';
  btn10.onclick = () => { for (let i = 0; i < 10; i++) sample(); };
  row.append(btn, btn10);
  el.append(canvas, slider('temperature', 0.05, 3, 0.05, temp, v => { temp = v; render(); }).row, row, story);
  render();
};

// ---------- 10. Convolution (CNN filter) ----------
WIDGETS.convolution = (el) => {
  const N = 14, cell = 14, gs = N * cell;
  // input "image": dark background, bright square with a notch → obvious edges
  const img = [];
  for (let r = 0; r < N; r++) { img[r] = []; for (let c = 0; c < N; c++) {
    let v = 0.12;
    if (r >= 3 && r <= 10 && c >= 3 && c <= 10) v = 0.92;   // bright square
    if (r >= 6 && r <= 8 && c >= 8 && c <= 10) v = 0.12;    // notch on the right
    img[r][c] = v;
  } }
  const kernels = {
    'Vertical edge': [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]],
    'Horizontal edge': [[-1, -1, -1], [0, 0, 0], [1, 1, 1]],
    'Blur': [[1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9]],
    'Sharpen': [[0, -1, 0], [-1, 5, -1], [0, -1, 0]],
    'Outline': [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]],
  };
  let kname = 'Vertical edge', out = null, revealed = N * N, scanPos = -1, timer = null;

  function conv(r, c) {
    const k = kernels[kname]; let s = 0;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      const rr = Math.min(N - 1, Math.max(0, r + dr)), cc = Math.min(N - 1, Math.max(0, c + dc));
      s += img[rr][cc] * k[dr + 1][dc + 1];
    }
    return s;
  }
  function computeAll() { out = []; for (let r = 0; r < N; r++) { out[r] = []; for (let c = 0; c < N; c++) out[r][c] = conv(r, c); } }

  const canvas = document.createElement('canvas');
  const W = 540, H = 250, ctx = setupCanvas(canvas, W, H);
  const outText = document.createElement('div'); outText.className = 'w-out';
  const leftX = 12, rightX = W - 12 - gs, topY = 34;

  function gray(v) { const g = Math.round(Math.max(0, Math.min(1, v)) * 255); return `rgb(${g},${g},${g})`; }
  function render() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = cssVar('--surface-1'); ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = cssVar('--ink-2'); ctx.font = '600 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('input image', leftX, topY - 12);
    ctx.fillText('feature map (' + kname + ')', rightX, topY - 12);
    let maxAbs = 0; if (out) for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) maxAbs = Math.max(maxAbs, Math.abs(out[r][c]));
    if (maxAbs === 0) maxAbs = 1;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      ctx.fillStyle = gray(img[r][c]);
      ctx.fillRect(leftX + c * cell, topY + r * cell, cell - 0.5, cell - 0.5);
      const idx = r * N + c;
      if (out && idx < revealed) { ctx.fillStyle = gray(Math.abs(out[r][c]) / maxAbs); }
      else { ctx.fillStyle = cssVar('--grid'); }
      ctx.fillRect(rightX + c * cell, topY + r * cell, cell - 0.5, cell - 0.5);
    }
    if (scanPos >= 0) {
      const r = Math.floor(scanPos / N), c = scanPos % N;
      ctx.strokeStyle = cssVar('--series-8'); ctx.lineWidth = 2;
      ctx.strokeRect(leftX + (c - 1) * cell, topY + (r - 1) * cell, cell * 3, cell * 3);
      ctx.strokeStyle = cssVar('--series-1');
      ctx.strokeRect(rightX + c * cell, topY + r * cell, cell, cell);
    }
  }
  const btnRow = document.createElement('div'); btnRow.className = 'w-row';
  const btns = {};
  for (const name of Object.keys(kernels)) {
    const b = document.createElement('button'); b.className = 'btn small ghost'; b.textContent = name;
    b.onclick = () => { kname = name; computeAll(); revealed = N * N; scanPos = -1; paintBtns(); outText.innerHTML = describe(); render(); };
    btns[name] = b; btnRow.append(b);
  }
  function paintBtns() { for (const [n, b] of Object.entries(btns)) { const on = n === kname; b.style.background = on ? cssVar('--series-4') : 'transparent'; b.style.color = on ? '#fff' : ''; b.style.borderColor = on ? cssVar('--series-4') : ''; } }
  function describe() { return `Each output cell = the 3×3 filter multiplied against the patch under it, summed. Bright cells in the feature map = where <b>${kname.toLowerCase()}</b> matched.`; }
  const scanRow = document.createElement('div'); scanRow.className = 'w-row';
  const scanBtn = document.createElement('button'); scanBtn.className = 'btn small'; scanBtn.textContent = '▶ Watch it slide';
  scanBtn.onclick = () => {
    if (timer) { clearInterval(timer); timer = null; scanBtn.textContent = '▶ Watch it slide'; revealed = N * N; scanPos = -1; render(); return; }
    computeAll(); revealed = 0; scanBtn.textContent = '⏸ Stop';
    timer = setInterval(() => {
      if (!canvas.isConnected) { clearInterval(timer); timer = null; return; }
      scanPos = revealed; revealed++;
      const r = Math.floor(scanPos / N), c = scanPos % N;
      outText.innerHTML = `filter at row ${r}, col ${c} → activation <b>${out[r][c].toFixed(2)}</b>`;
      render();
      if (revealed >= N * N) { clearInterval(timer); timer = null; scanBtn.textContent = '▶ Watch it slide'; scanPos = -1; outText.innerHTML = describe(); render(); }
    }, 22);
  };
  scanRow.append(scanBtn);
  el.append(btnRow, canvas, scanRow, outText);
  computeAll(); paintBtns(); outText.innerHTML = describe(); render();
};

// ---------- 11. Diffusion (denoise to image) ----------
WIDGETS.diffusion = (el) => {
  const N = 22, STEPS = 18;
  function shape(name, x, y) {
    const X = (x - 0.5) * 2.5, Y = (0.52 - y) * 2.5;
    if (name === 'heart') { const f = Math.pow(X * X + Y * Y - 1, 3) - X * X * Y * Y * Y; return f <= 0; }
    if (name === 'triangle') { return y > 0.28 && y < 0.8 && Math.abs(x - 0.5) < (y - 0.28) * 0.75; }
    return Math.abs(Math.hypot(x - 0.5, y - 0.5) - 0.33) < 0.09; // ring
  }
  function targetGrid(name) {
    const g = [];
    for (let r = 0; r < N; r++) { g[r] = []; for (let c = 0; c < N; c++) g[r][c] = shape(name, (c + 0.5) / N, (r + 0.5) / N) ? 0.93 : 0.08; }
    return g;
  }
  let tname = 'heart', target = targetGrid(tname), base = null, t = STEPS;
  function newNoise() { base = []; for (let r = 0; r < N; r++) { base[r] = []; for (let c = 0; c < N; c++) base[r][c] = Math.random(); } }
  newNoise();

  const canvas = document.createElement('canvas');
  const cell = 11, gs = N * cell, W = gs, H = gs, ctx = setupCanvas(canvas, W, H);
  const outText = document.createElement('div'); outText.className = 'w-out';
  let timer = null;

  function render() {
    const p = (STEPS - t) / STEPS;
    ctx.clearRect(0, 0, W, H);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const v = target[r][c] * p + base[r][c] * (1 - p);
      const g = Math.round(Math.max(0, Math.min(1, v)) * 255);
      ctx.fillStyle = `rgb(${g},${g},${g})`;
      ctx.fillRect(c * cell, r * cell, cell, cell);
    }
    const done = t === 0;
    outText.innerHTML = `step <b>${STEPS - t}/${STEPS}</b> &nbsp;|&nbsp; noise ${Math.round((1 - p) * 100)}%` + (done ? ' &nbsp;<b>image emerged</b>' : '') + `<br><span style="color:${cssVar('--muted')}">prompt: a ${tname}. Each step removes a bit of noise, steered toward the prompt.</span>`;
  }
  const tRow = document.createElement('div'); tRow.className = 'w-row';
  for (const [name, label] of [['heart', '❤ heart'], ['triangle', '▲ triangle'], ['ring', '◎ ring']]) {
    const b = document.createElement('button'); b.className = 'btn small ghost'; b.textContent = label;
    b.onclick = () => { tname = name; target = targetGrid(name); render(); };
    tRow.append(b);
  }
  const row = document.createElement('div'); row.className = 'w-row';
  const genBtn = document.createElement('button'); genBtn.className = 'btn small'; genBtn.textContent = '▶ Generate';
  genBtn.onclick = () => {
    if (timer) { clearInterval(timer); timer = null; genBtn.textContent = '▶ Generate'; return; }
    if (t === 0) { newNoise(); t = STEPS; }
    genBtn.textContent = '⏸ Pause';
    timer = setInterval(() => {
      if (!canvas.isConnected) { clearInterval(timer); timer = null; return; }
      if (t > 0) t--;
      render();
      if (t === 0) { clearInterval(timer); timer = null; genBtn.textContent = '▶ Generate'; }
    }, 130);
  };
  const stepBtn = document.createElement('button'); stepBtn.className = 'btn small ghost'; stepBtn.textContent = 'Denoise 1 step';
  stepBtn.onclick = () => { if (t > 0) { t--; render(); } };
  const resetBtn = document.createElement('button'); resetBtn.className = 'btn small ghost'; resetBtn.textContent = '🎲 New noise';
  resetBtn.onclick = () => { if (timer) { clearInterval(timer); timer = null; genBtn.textContent = '▶ Generate'; } newNoise(); t = STEPS; render(); };
  row.append(genBtn, stepBtn, resetBtn);
  el.append(tRow, canvas, row, outText);
  render();
};

// ---------- 12. Scaling law ----------
WIDGETS.scaling = (el) => {
  const Linf = 1.6, k = 6.0, alpha = 0.095;   // loss = Linf + k · C^(−alpha)
  const loss = C => Linf + k * Math.pow(C, -alpha);
  let logC = 3;                                 // log10 of compute, 0..8
  const canvas = document.createElement('canvas');
  const W = 620, H = 320, ctx = setupCanvas(canvas, W, H);
  const out = document.createElement('div'); out.className = 'w-out';
  const X0 = 0, X1 = 8, Y0 = 1.2, Y1 = 8;
  const px = v => 46 + (v - X0) / (X1 - X0) * (W - 60);
  const py = v => H - 34 - (v - Y0) / (Y1 - Y0) * (H - 54);

  function render() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = cssVar('--surface-1'); ctx.fillRect(0, 0, W, H);
    // floor
    ctx.strokeStyle = cssVar('--baseline'); ctx.lineWidth = 1; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(px(X0), py(Linf)); ctx.lineTo(px(X1), py(Linf)); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = cssVar('--muted'); ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('irreducible floor L∞', px(X0) + 6, py(Linf) - 6);
    // axes labels
    ctx.fillText('loss', 8, 20);
    ctx.textAlign = 'center';
    for (let e = 0; e <= 8; e += 2) ctx.fillText('10^' + e, px(e), H - 14);
    ctx.fillText('compute (FLOPs) →', W / 2, H - 2);
    // curve
    ctx.strokeStyle = cssVar('--series-10'); ctx.lineWidth = 2.5; ctx.beginPath();
    for (let i = 0; i <= 200; i++) { const lc = X0 + (X1 - X0) * i / 200; const L = loss(Math.pow(10, lc)); i === 0 ? ctx.moveTo(px(lc), py(L)) : ctx.lineTo(px(lc), py(L)); }
    ctx.stroke();
    // point
    const C = Math.pow(10, logC), L = loss(C);
    ctx.fillStyle = cssVar('--series-8');
    ctx.beginPath(); ctx.arc(px(logC), py(L), 7, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = cssVar('--surface-1'); ctx.lineWidth = 2; ctx.stroke();
    // diminishing-returns readout: what does the next 10x buy?
    const L2 = loss(Math.pow(10, Math.min(X1, logC + 1)));
    const drop = L - L2;
    out.innerHTML = `compute = <b>10^${logC.toFixed(1)}</b> FLOPs &nbsp;|&nbsp; loss = <b>${L.toFixed(3)}</b> &nbsp;|&nbsp; perplexity = e^loss = <b>${Math.exp(L).toFixed(1)}</b><br>` +
      `<span style="color:${cssVar('--muted')}">the next 10× of compute buys only <b>−${drop.toFixed(3)}</b> loss — diminishing returns as you approach the floor (${Linf})</span>`;
  }
  el.append(canvas, slider('compute (log₁₀ FLOPs)', 0, 8, 0.1, logC, v => { logC = v; render(); }).row, out);
  render();
};

// ---------- 13. RL agent (gridworld Q-learning) ----------
WIDGETS.rlagent = (el) => {
  const R = 6, C = 6;
  const walls = new Set(['1,2', '2,2', '3,2', '1,4', '2,4', '4,4']);
  const goal = '0,5', pit = '3,4', start = '5,0';
  const key = (r, c) => r + ',' + c;
  const isWall = (r, c) => r < 0 || r >= R || c < 0 || c >= C || walls.has(key(r, c));
  const terminal = s => s === goal || s === pit;
  const dr = [-1, 1, 0, 0], dc = [0, 0, -1, 1];   // up, down, left, right
  const gamma = 0.92, alpha = 0.5;
  let Q = {}, episode = 0, eps = 0.35, lastOutcome = '—', agent = null, timer = null, runTimer = null;
  const getQ = s => (Q[s] || (Q[s] = [0, 0, 0, 0]));
  const argmax = a => { let bi = 0; for (let i = 1; i < a.length; i++) if (a[i] > a[bi]) bi = i; return bi; };

  function step(s, a) {
    const [r, c] = s.split(',').map(Number);
    let nr = r + dr[a], nc = c + dc[a];
    if (isWall(nr, nc)) { nr = r; nc = c; }
    const ns = key(nr, nc);
    const rew = ns === goal ? 1 : ns === pit ? -1 : -0.02;
    return { ns, rew };
  }
  function trainEpisodes(n) {
    for (let e = 0; e < n; e++) {
      let s = start, steps = 0;
      while (!terminal(s) && steps < 80) {
        const q = getQ(s);
        const a = Math.random() < eps ? Math.floor(Math.random() * 4) : argmax(q);
        const { ns, rew } = step(s, a);
        const tgt = terminal(ns) ? rew : rew + gamma * Math.max(...getQ(ns));
        q[a] += alpha * (tgt - q[a]);
        s = ns; steps++;
      }
      episode++;
      lastOutcome = s === goal ? 'reached goal 🎯' : s === pit ? 'fell in pit' : 'timed out';
      eps = Math.max(0.05, eps * 0.995);
    }
  }

  const canvas = document.createElement('canvas');
  const cell = 46, gs = C * cell, W = gs, H = gs, ctx = setupCanvas(canvas, W, H);
  const out = document.createElement('div'); out.className = 'w-out';

  function valColor(v) {
    const t = Math.max(-1, Math.min(1, v));
    if (t >= 0) return `rgba(12,163,12,${0.10 + 0.55 * t})`;
    return `rgba(208,59,59,${0.10 + 0.55 * (-t)})`;
  }
  function arrow(r, c, a) {
    const cx = c * cell + cell / 2, cy = r * cell + cell / 2, L = 11;
    const ex = cx + dc[a] * L, ey = cy + dr[a] * L;
    ctx.strokeStyle = cssVar('--ink-2'); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx - dc[a] * L, cy - dr[a] * L); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.fillStyle = cssVar('--ink-2');
    ctx.beginPath(); ctx.arc(ex, ey, 3.2, 0, Math.PI * 2); ctx.fill();
  }
  function render() {
    ctx.clearRect(0, 0, W, H);
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      const s = key(r, c);
      ctx.fillStyle = cssVar('--surface-1'); ctx.fillRect(c * cell, r * cell, cell, cell);
      if (isWall(r, c)) { ctx.fillStyle = cssVar('--ink-2'); ctx.fillRect(c * cell, r * cell, cell, cell); }
      else if (!terminal(s)) { const q = Q[s]; if (q) { ctx.fillStyle = valColor(Math.max(...q)); ctx.fillRect(c * cell, r * cell, cell, cell); } }
      ctx.strokeStyle = cssVar('--grid'); ctx.lineWidth = 1; ctx.strokeRect(c * cell, r * cell, cell, cell);
      if (!isWall(r, c) && !terminal(s) && Q[s] && Math.max(...Q[s].map(Math.abs)) > 0.001) arrow(r, c, argmax(Q[s]));
    }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '600 20px system-ui';
    const gp = goal.split(',').map(Number), pp = pit.split(',').map(Number);
    ctx.fillStyle = cssVar('--good'); ctx.fillText('★', gp[1] * cell + cell / 2, gp[0] * cell + cell / 2);
    ctx.fillStyle = cssVar('--bad'); ctx.fillText('✕', pp[1] * cell + cell / 2, pp[0] * cell + cell / 2);
    ctx.textBaseline = 'alphabetic';
    if (agent) {
      const [r, c] = agent.split(',').map(Number);
      ctx.fillStyle = cssVar('--series-1');
      ctx.beginPath(); ctx.arc(c * cell + cell / 2, r * cell + cell / 2, 12, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = cssVar('--surface-1'); ctx.lineWidth = 2.5; ctx.stroke();
    }
    out.innerHTML = `episodes trained: <b>${episode}</b> &nbsp;|&nbsp; exploration ε = <b>${eps.toFixed(2)}</b> &nbsp;|&nbsp; last: ${lastOutcome}<br>` +
      `<span style="color:${cssVar('--muted')}">green = states the agent learned are valuable · arrows = its chosen action · it learns purely from reward (★ +1, ✕ −1), never told the right move</span>`;
  }
  function runGreedy() {
    if (runTimer) { clearInterval(runTimer); runTimer = null; }
    agent = start; let steps = 0;
    runTimer = setInterval(() => {
      if (!canvas.isConnected) { clearInterval(runTimer); runTimer = null; return; }
      render();
      if (terminal(agent) || steps++ > 40) { clearInterval(runTimer); runTimer = null; return; }
      const q = Q[agent]; if (!q) { clearInterval(runTimer); runTimer = null; return; }
      agent = step(agent, argmax(q)).ns;
    }, 180);
  }

  const row = document.createElement('div'); row.className = 'w-row';
  const trainBtn = document.createElement('button'); trainBtn.className = 'btn small'; trainBtn.textContent = '▶ Train';
  trainBtn.onclick = () => {
    if (timer) { clearInterval(timer); timer = null; trainBtn.textContent = '▶ Train'; return; }
    trainBtn.textContent = '⏸ Pause';
    timer = setInterval(() => {
      if (!canvas.isConnected) { clearInterval(timer); timer = null; return; }
      trainEpisodes(15); render();
      if (episode >= 4000) { clearInterval(timer); timer = null; trainBtn.textContent = '▶ Train'; }
    }, 60);
  };
  const runBtn = document.createElement('button'); runBtn.className = 'btn small ghost'; runBtn.textContent = '🏃 Run agent';
  runBtn.onclick = runGreedy;
  const resetBtn = document.createElement('button'); resetBtn.className = 'btn small ghost'; resetBtn.textContent = 'Reset';
  resetBtn.onclick = () => { if (timer) { clearInterval(timer); timer = null; trainBtn.textContent = '▶ Train'; } if (runTimer) { clearInterval(runTimer); runTimer = null; } Q = {}; episode = 0; eps = 0.35; lastOutcome = '—'; agent = null; render(); };
  row.append(trainBtn, runBtn, resetBtn);
  el.append(canvas, row, out);
  render();
};

// ---------- generic, config-driven widgets ----------
// These read their content from the lesson step object (step.cards / step.pairs / etc.)
// so any lesson can drop in an interactive element without a bespoke build.

function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// ---------- 14. Flashcards: click a card to flip it and reveal the answer ----------
// step.cards = [[front, back], ...]
WIDGETS.flashcards = (el, step) => {
  const cards = step.cards || [];
  const grid = document.createElement('div');
  grid.className = 'flip-grid';
  const out = document.createElement('div');
  out.className = 'w-note';
  let flippedCount = 0;
  cards.forEach(([front, back]) => {
    const card = document.createElement('div');
    card.className = 'flip-card';
    card.textContent = front;
    let flipped = false;
    card.onclick = () => {
      flipped = !flipped;
      card.classList.toggle('flipped', flipped);
      card.textContent = flipped ? back : front;
      if (flipped) { flippedCount++; if (flippedCount === cards.length) out.textContent = 'All flipped — nice.'; }
    };
    grid.append(card);
  });
  out.textContent = `Click a card to flip it. (${cards.length} cards)`;
  el.append(grid, out);
};

// ---------- 15. Match: pair up terms with their definitions ----------
// step.pairs = [[left, right], ...]
WIDGETS.match = (el, step) => {
  const pairs = step.pairs || [];
  const cols = document.createElement('div');
  cols.className = 'match-cols';
  const leftCol = document.createElement('div'); leftCol.className = 'match-col';
  const rightCol = document.createElement('div'); rightCol.className = 'match-col';
  const out = document.createElement('div');
  out.className = 'w-note';
  let solved = 0;
  let selLeft = null, selRight = null;
  const leftChips = pairs.map((p, i) => ({ i, text: p[0] }));
  const rightChips = shuffled(pairs.map((p, i) => ({ i, text: p[1] })));

  function makeChip(item, col, isLeft) {
    const b = document.createElement('button');
    b.className = 'pick-chip';
    b.textContent = item.text;
    b.onclick = () => {
      if (isLeft) { selLeft = item; } else { selRight = item; }
      col.querySelectorAll('.pick-chip').forEach(c => c.classList.remove('sel'));
      b.classList.add('sel');
      if (selLeft && selRight) {
        if (selLeft.i === selRight.i) {
          leftCol.querySelector(`[data-i="${selLeft.i}"]`)?.classList.add('matched');
          rightCol.querySelector(`[data-i="${selRight.i}"]`)?.classList.add('matched');
          leftCol.querySelector(`[data-i="${selLeft.i}"]`).disabled = true;
          rightCol.querySelector(`[data-i="${selRight.i}"]`).disabled = true;
          solved++;
          out.textContent = solved === pairs.length ? `All ${pairs.length} matched!` : `${solved}/${pairs.length} matched`;
        } else {
          [leftCol.querySelector('.sel'), rightCol.querySelector('.sel')].forEach(c => c && c.classList.add('wrong-flash'));
          setTimeout(() => {
            leftCol.querySelectorAll('.pick-chip').forEach(c => c.classList.remove('sel', 'wrong-flash'));
            rightCol.querySelectorAll('.pick-chip').forEach(c => c.classList.remove('sel', 'wrong-flash'));
          }, 500);
        }
        selLeft = null; selRight = null;
      }
    };
    b.dataset.i = item.i;
    col.append(b);
  }
  leftChips.forEach(item => makeChip(item, leftCol, true));
  rightChips.forEach(item => makeChip(item, rightCol, false));
  cols.append(leftCol, rightCol);
  out.textContent = `Click one from each column to pair them. (${pairs.length} pairs)`;
  el.append(cols, out);
};

// ---------- 16. Classify: sort items into the right bucket ----------
// step.buckets = ['Bucket A', 'Bucket B', ...]; step.items = [[label, bucketIndex], ...]
WIDGETS.classify = (el, step) => {
  const buckets = step.buckets || [];
  const items = shuffled(step.items || []);
  let selected = null, correct = 0;
  const pool = document.createElement('div');
  pool.className = 'chip-row';
  const bucketRow = document.createElement('div');
  bucketRow.className = 'bucket-row';
  const out = document.createElement('div');
  out.className = 'w-note';

  const bucketEls = buckets.map((name) => {
    const b = document.createElement('div');
    b.className = 'bucket target';
    const h = document.createElement('h4'); h.textContent = name; b.append(h);
    b.onclick = () => {
      if (selected == null) return;
      const chip = itemEls[selected];
      if (!chip.disabled) {
        if (items[selected][1] === buckets.indexOf(name)) {
          chip.classList.remove('sel'); chip.classList.add('placed');
          chip.disabled = true;
          b.append(chip);
          correct++;
          selected = null;
          out.textContent = correct === items.length ? `All ${items.length} sorted correctly!` : `${correct}/${items.length} correct so far`;
        } else {
          chip.classList.add('wrong-flash');
          setTimeout(() => chip.classList.remove('wrong-flash'), 500);
        }
      }
    };
    return b;
  });

  const itemEls = items.map((item, i) => {
    const chip = document.createElement('button');
    chip.className = 'pick-chip';
    chip.textContent = item[0];
    chip.onclick = () => {
      itemEls.forEach(c => c.classList.remove('sel'));
      selected = i;
      chip.classList.add('sel');
    };
    pool.append(chip);
    return chip;
  });

  bucketRow.append(...bucketEls);
  out.textContent = `Pick an item, then click the bucket it belongs in. (${items.length} items)`;
  el.append(pool, bucketRow, out);
};

// ---------- 17. Order: click items into the correct sequence ----------
// step.items = [...] already in the CORRECT order (widget shuffles for display)
WIDGETS.order = (el, step) => {
  const correctOrder = step.items || [];
  const shownItems = shuffled(correctOrder.map((text, i) => ({ text, i })));
  const placed = [];
  const pool = document.createElement('div');
  pool.className = 'chip-row';
  const slots = document.createElement('div');
  slots.className = 'order-slots';
  const out = document.createElement('div');
  out.className = 'w-note';

  const slotEls = correctOrder.map((_, i) => {
    const s = document.createElement('div');
    s.className = 'order-slot';
    s.textContent = `${i + 1}.`;
    slots.append(s);
    return s;
  });

  const chipEls = shownItems.map((item) => {
    const chip = document.createElement('button');
    chip.className = 'pick-chip';
    chip.textContent = item.text;
    chip.onclick = () => {
      chip.disabled = true;
      chip.classList.add('placed');
      const slot = slotEls[placed.length];
      slot.textContent = item.text;
      slot.classList.add('filled');
      placed.push(item.i);
      if (placed.length === correctOrder.length) {
        let allCorrect = true;
        placed.forEach((origIdx, pos) => {
          const ok = origIdx === pos;
          slotEls[pos].classList.add(ok ? 'correct' : 'incorrect');
          if (!ok) allCorrect = false;
        });
        out.innerHTML = allCorrect
          ? 'Correct order!'
          : 'Not quite the right order — green rows are right, red rows aren\'t. Correct sequence:<br>' + correctOrder.map((t, i) => `${i + 1}. ${t}`).join('<br>');
      }
    };
    pool.append(chip);
    return chip;
  });

  el.append(pool, slots, out);
};
