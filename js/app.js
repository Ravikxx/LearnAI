// LearnAI — SPA engine: hash router, lesson player, progress store.
(function () {
  const app = document.getElementById('app');

  // ---------- progress store ----------
  const store = {
    load() {
      try { return JSON.parse(localStorage.getItem('learnai')) || { done: {}, xp: 0 }; }
      catch { return { done: {}, xp: 0 }; }
    },
    save(s) { localStorage.setItem('learnai', JSON.stringify(s)); },
  };
  let S = store.load();

  function addXP(n) {
    S.xp += n;
    store.save(S);
    updateXPBadge();
  }
  function updateXPBadge() {
    document.getElementById('xp-badge').textContent = `⚡ ${S.xp} XP`;
  }

  function courseProgress(course) {
    const done = course.lessons.filter(l => S.done[course.id + '/' + l.id]).length;
    return { done, total: course.lessons.length };
  }

  // ---------- views ----------
  function renderHome() {
    const cards = COURSES.map(c => {
      const p = courseProgress(c);
      const pct = Math.round(p.done / p.total * 100);
      return `
        <a class="course-card" href="#course/${c.id}" style="--accent:${c.accent}">
          <div class="course-head">
            <div class="course-icon">${c.icon}</div>
            <div>
              <h2>${c.title}</h2>
              <div class="tagline">${c.tagline}</div>
            </div>
          </div>
          <div class="course-progress">
            <div class="pbar"><div style="width:${pct}%"></div></div>
            <span class="pbar-label">${p.done}/${p.total} lessons</span>
          </div>
        </a>`;
    }).join('');
    app.innerHTML = `
      <div class="hero">
        <h1>Learn how AI actually works</h1>
        <p>Bite-size interactive lessons — poke at real neurons, roll balls down loss curves, and train a live neural network. No math degree required.</p>
      </div>
      <div class="course-grid">
        ${cards}
        <div class="course-card locked" style="--accent:var(--series-3)">
          <div class="course-head">
            <div class="course-icon">🔥</div>
            <div>
              <h2>Python &amp; PyTorch <span style="font-size:.8rem;font-weight:600;color:var(--muted)">— coming soon</span></h2>
              <div class="tagline">Tensors, autograd, and training your first real model</div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderCourse(cid) {
    const c = COURSES.find(x => x.id === cid);
    if (!c) return renderHome();
    const rows = c.lessons.map((l, i) => {
      const done = S.done[c.id + '/' + l.id];
      return `
        <a class="lesson-row ${done ? 'done' : ''}" href="#lesson/${c.id}/${l.id}" style="--accent:${c.accent}">
          <div class="lesson-num">${done ? '✓' : i + 1}</div>
          <div class="lesson-info">
            <h3>${l.title}</h3>
            <div class="meta">~${l.minutes} min · ${l.steps.filter(s => s.t === 'quiz').length} questions${l.steps.some(s => s.t === 'widget') ? ' · 🕹 interactive' : ''}</div>
          </div>
          <div class="lesson-go">›</div>
        </a>`;
    }).join('');
    app.innerHTML = `
      <a class="crumb" href="#">‹ All courses</a>
      <div class="course-title" style="--accent:${c.accent}">
        <div class="course-icon">${c.icon}</div>
        <h1>${c.title}</h1>
      </div>
      <p class="course-desc">${c.description}</p>
      <div class="lesson-list">${rows}</div>`;
  }

  // ---------- lesson player (one step per page, animated) ----------
  function renderLesson(cid, lid) {
    const c = COURSES.find(x => x.id === cid);
    const l = c && c.lessons.find(x => x.id === lid);
    if (!l) return renderHome();

    app.innerHTML = `
      <div class="player-top" style="--accent:${c.accent}">
        <a class="exit-btn" href="#course/${c.id}" title="Exit lesson">✕</a>
        <div class="pbar" style="flex:1"><div id="lesson-pbar" style="width:0%"></div></div>
        <span class="step-count" id="step-count"></span>
      </div>
      <div class="stage" id="stage"></div>
      <div class="step-nav" id="step-nav" style="--accent:${c.accent}">
        <button class="btn ghost" id="nav-back">← Back</button>
        <button class="btn" id="nav-next" style="background:${c.accent}">Next →</button>
      </div>`;
    const stage = document.getElementById('stage');
    const pbar = document.getElementById('lesson-pbar');
    const countEl = document.getElementById('step-count');
    const navEl = document.getElementById('step-nav');
    const backBtn = document.getElementById('nav-back');
    const nextBtn = document.getElementById('nav-next');

    let idx = 0;
    let animating = false;
    const answers = {}; // stepIndex -> chosen option index

    function quizLocked(i) {
      return l.steps[i].t === 'quiz' && answers[i] === undefined;
    }

    function updateChrome() {
      pbar.style.width = Math.round((idx + 1) / l.steps.length * 100) + '%';
      countEl.textContent = `${idx + 1} / ${l.steps.length}`;
      backBtn.disabled = idx === 0;
      nextBtn.disabled = quizLocked(idx);
      nextBtn.innerHTML = idx === l.steps.length - 1 ? 'Finish 🎉' : 'Next →';
    }

    function buildStep(i) {
      const step = l.steps[i];
      const wrap = document.createElement('div');
      wrap.className = 'step';
      wrap.style.setProperty('--accent', c.accent);
      const card = document.createElement('div');
      card.className = 'step-card';
      wrap.append(card);

      if (step.t === 'text') {
        card.innerHTML = (step.title ? `<h2>${step.title}</h2>` : '') + step.md;
      } else if (step.t === 'widget') {
        card.innerHTML = (step.title ? `<h2>${step.title}</h2>` : '') + (step.md || '');
        const box = document.createElement('div');
        box.className = 'widget';
        card.append(box);
        try { WIDGETS[step.name](box); }
        catch (e) { box.textContent = 'Widget failed to load: ' + e.message; }
      } else if (step.t === 'quiz') {
        card.innerHTML = `<div class="quiz-q">${step.q}</div>`;
        const opts = document.createElement('div');
        opts.className = 'quiz-opts';
        card.append(opts);

        function paintAnswered(chosen, fresh) {
          opts.querySelectorAll('button').forEach((b, bi) => {
            b.disabled = true;
            if (bi === step.a) b.classList.add('correct');
            else if (bi === chosen) b.classList.add('wrong');
          });
          const correct = chosen === step.a;
          const why = document.createElement('div');
          why.className = 'quiz-why ' + (correct ? 'ok' : 'no');
          why.innerHTML = `<b>${correct ? (fresh ? '✅ Correct! +5 XP' : '✅ Correct!') : '❌ Not quite.'}</b>${step.why}`;
          card.append(why);
        }

        step.opts.forEach((opt, oi) => {
          const b = document.createElement('button');
          b.className = 'quiz-opt';
          b.innerHTML = opt;
          b.onclick = () => {
            if (answers[i] !== undefined) return;
            answers[i] = oi;
            if (oi === step.a) addXP(5);
            paintAnswered(oi, true);
            updateChrome();
          };
          opts.append(b);
        });
        if (answers[i] !== undefined) paintAnswered(answers[i], false);
      }
      return wrap;
    }

    function show(i, dir) {
      if (animating) return;
      animating = true;
      const old = stage.firstElementChild;
      const swap = () => {
        idx = i;
        stage.innerHTML = '';
        const el = buildStep(i);
        el.classList.add(dir >= 0 ? 'enter-right' : 'enter-left');
        stage.append(el);
        updateChrome();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => { animating = false; }, 250);
      };
      if (old && dir !== 0) {
        old.classList.add(dir > 0 ? 'leave-left' : 'leave-right');
        setTimeout(swap, 200);
      } else {
        swap();
      }
    }

    function finish() {
      if (animating) return;
      animating = true;
      const key = c.id + '/' + l.id;
      const first = !S.done[key];
      if (first) {
        S.done[key] = true;
        addXP(20);
        store.save(S);
      }
      const li = c.lessons.indexOf(l);
      const next = c.lessons[li + 1];
      const old = stage.firstElementChild;
      if (old) old.classList.add('leave-left');
      navEl.style.display = 'none';
      pbar.style.width = '100%';
      countEl.textContent = '✓';
      setTimeout(() => {
        stage.innerHTML = '';
        const div = document.createElement('div');
        div.className = 'complete-card enter-right';
        div.innerHTML = `
          <div class="big">${first ? '🏆' : '⭐'}</div>
          <h2>Lesson complete!</h2>
          <p>${first ? '+20 XP earned.' : 'Nice refresher.'} ${next ? 'Keep the momentum going.' : 'That was the last lesson in this course!'}</p>
          <div class="complete-actions">
            ${next ? `<a class="btn" style="background:${c.accent}" href="#lesson/${c.id}/${next.id}">Next: ${next.title} →</a>` : ''}
            <a class="btn ghost" href="#course/${c.id}">Back to course</a>
          </div>`;
        stage.append(div);
        animating = false;
      }, 200);
    }

    backBtn.onclick = () => { if (idx > 0) show(idx - 1, -1); };
    nextBtn.onclick = () => {
      if (quizLocked(idx)) return;
      if (idx < l.steps.length - 1) show(idx + 1, 1);
      else finish();
    };

    // arrow-key navigation (replaced on every lesson render)
    if (window.__lessonKeys) window.removeEventListener('keydown', window.__lessonKeys);
    window.__lessonKeys = (e) => {
      if (e.key === 'ArrowRight' && !nextBtn.disabled && navEl.style.display !== 'none') nextBtn.onclick();
      else if (e.key === 'ArrowLeft' && idx > 0) show(idx - 1, -1);
    };
    window.addEventListener('keydown', window.__lessonKeys);

    show(0, 0);
  }

  // ---------- router ----------
  function route() {
    const h = location.hash.slice(1);
    window.scrollTo(0, 0);
    const parts = h.split('/');
    if (parts[0] !== 'lesson' && window.__lessonKeys) {
      window.removeEventListener('keydown', window.__lessonKeys);
      window.__lessonKeys = null;
    }
    if (parts[0] === 'course' && parts[1]) renderCourse(parts[1]);
    else if (parts[0] === 'lesson' && parts[2]) renderLesson(parts[1], parts[2]);
    else renderHome();
  }
  window.addEventListener('hashchange', route);
  updateXPBadge();
  route();
})();
