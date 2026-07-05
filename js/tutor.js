// AI Tutor — bring-your-own-key chat grounded in the current lesson step.
// The key is stored in localStorage and sent only to the chosen AI provider.
window.TUTOR = (function () {
  const PROVIDERS = {
    groq: {
      name: 'Groq',
      url: 'https://api.groq.com/openai/v1/chat/completions',
      model: 'llama-3.3-70b-versatile',
      keysUrl: 'https://console.groq.com/keys',
      hint: 'recommended — fast, generous free tier',
    },
    mistral: {
      name: 'Mistral',
      url: 'https://api.mistral.ai/v1/chat/completions',
      model: 'mistral-small-latest',
      keysUrl: 'https://console.mistral.ai/api-keys',
      hint: 'free tier available',
    },
  };

  function getCfg() {
    try { return JSON.parse(localStorage.getItem('learnai-tutor')) || null; }
    catch { return null; }
  }
  function saveCfg(cfg) { localStorage.setItem('learnai-tutor', JSON.stringify(cfg)); }

  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }
  // minimal markdown: **bold**, `code`, paragraphs
  function mdLite(s) {
    return esc(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .split(/\n{2,}/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
  }

  async function ask(question, context) {
    const cfg = getCfg();
    const p = PROVIDERS[cfg.provider];
    const res = await fetch(p.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cfg.key,
      },
      body: JSON.stringify({
        model: p.model,
        max_tokens: 600,
        temperature: 0.6,
        messages: [
          {
            role: 'system',
            content: 'You are a friendly, concise tutor inside an interactive course about AI and PyTorch. ' +
              'The student is a beginner. Answer in 2-6 short paragraphs max, plain language, small concrete examples. ' +
              'Use **bold** and `code` sparingly; no headers or lists of links. ' +
              'Here is the lesson step the student is currently on:\n\n' + context,
          },
          { role: 'user', content: question },
        ],
      }),
    });
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) throw new Error('That API key was rejected (' + res.status + '). Double-check it, or save a new one below.');
      if (res.status === 429) throw new Error('Rate limit hit — wait a moment and try again.');
      throw new Error('The AI service returned an error (' + res.status + ').');
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '(empty response)';
  }

  // ---------- UI ----------
  function buildSetup(panel, onReady) {
    const cfg = getCfg() || { provider: 'groq', key: '' };
    panel.innerHTML = `
      <div class="tutor-setup">
        <p><strong>Set up your AI tutor</strong> — pick a provider and paste a free API key. The key is saved only in this browser and sent only to the provider you choose.</p>
        <div class="w-row">
          ${Object.entries(PROVIDERS).map(([id, p]) => `
            <label class="tutor-provider">
              <input type="radio" name="tutor-provider" value="${id}" ${cfg.provider === id ? 'checked' : ''}>
              <span><strong>${p.name}</strong> <em>${p.hint}</em></span>
            </label>`).join('')}
        </div>
        <p class="w-note">Get a key: <a href="${PROVIDERS.groq.keysUrl}" target="_blank" rel="noopener">Groq</a> · <a href="${PROVIDERS.mistral.keysUrl}" target="_blank" rel="noopener">Mistral</a> (both have free tiers — sign up, create a key, paste it here yourself)</p>
        <div class="w-row">
          <input type="password" class="w-input" id="tutor-key" placeholder="paste your API key" autocomplete="off">
          <button class="btn small" id="tutor-save">Save</button>
        </div>
        <div class="tutor-error" id="tutor-setup-err"></div>
      </div>`;
    panel.querySelector('#tutor-save').onclick = () => {
      const key = panel.querySelector('#tutor-key').value.trim();
      const provider = panel.querySelector('input[name=tutor-provider]:checked').value;
      if (!key) {
        panel.querySelector('#tutor-setup-err').textContent = 'Paste a key first.';
        return;
      }
      saveCfg({ provider, key });
      onReady();
    };
  }

  function buildChat(panel, getContext) {
    const ctx = getContext();
    const quicks = ctx.quickPrompts || [];
    panel.innerHTML = `
      <div class="tutor-quicks">${quicks.map((q, i) => `<button class="btn small ghost tutor-quick" data-i="${i}">${esc(q)}</button>`).join('')}</div>
      <div class="w-row" style="align-items:stretch">
        <textarea class="w-input tutor-input" rows="2" placeholder="or ask your own question about this step…"></textarea>
        <button class="btn small" id="tutor-send">Ask</button>
      </div>
      <div class="tutor-thread"></div>
      <div class="w-note">Answers come from ${PROVIDERS[getCfg().provider].name} using your key · <a href="#" id="tutor-reset">change provider / key</a></div>`;

    const thread = panel.querySelector('.tutor-thread');
    const input = panel.querySelector('.tutor-input');

    async function submit(q) {
      if (!q.trim()) return;
      const qEl = document.createElement('div');
      qEl.className = 'tutor-msg tutor-q';
      qEl.textContent = q;
      const aEl = document.createElement('div');
      aEl.className = 'tutor-msg tutor-a';
      aEl.innerHTML = '<em>thinking…</em>';
      thread.prepend(aEl);
      thread.prepend(qEl);
      try {
        const reply = await ask(q, ctx.text);
        aEl.innerHTML = mdLite(reply);
      } catch (e) {
        aEl.innerHTML = `<span class="tutor-error">${esc(e.message)}</span>`;
      }
    }

    panel.querySelectorAll('.tutor-quick').forEach(b => {
      b.onclick = () => submit(quicks[+b.dataset.i]);
    });
    panel.querySelector('#tutor-send').onclick = () => { submit(input.value); input.value = ''; };
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submit(input.value);
        input.value = '';
      }
      e.stopPropagation(); // don't trigger lesson arrow-key nav while typing
    });
    panel.querySelector('#tutor-reset').onclick = (e) => {
      e.preventDefault();
      buildSetup(panel, () => buildChat(panel, getContext));
    };
  }

  // Toggle the tutor panel inside a lesson step.
  // getContext() -> { text: string for the model, quickPrompts: [strings] }
  function toggle(host, getContext) {
    const existing = host.querySelector('.tutor-panel');
    if (existing) { existing.remove(); return; }
    const panel = document.createElement('div');
    panel.className = 'tutor-panel';
    host.append(panel);
    if (!getCfg()) buildSetup(panel, () => buildChat(panel, getContext));
    else buildChat(panel, getContext);
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  return { toggle };
})();
