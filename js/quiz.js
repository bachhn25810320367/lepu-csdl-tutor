/* ==========================================================================
   LEPU CSDL Tutor — các chế độ ôn tập
   - Multiple Choice · Flashcards · Fill in the Blanks · Written Test · Notes
   Mọi dữ liệu nằm trong data/qz/*.json, nạp cùng lúc với bài học.
   Tiến độ lưu localStorage theo từng bài (đổi bài thì không mất).
   ========================================================================== */
'use strict';

/* Ngân hàng câu hỏi theo id bài — khai báo ở app.js (QZ_FILES). */
const QZ_FILES = {
  'khai-niem': 'data/qz/01-khai-niem.json',
  'on-thi':    'data/qz/02-on-thi.json',
  'de4':       'data/qz/03-de4.json',
  'giai':      'data/qz/04-giai.json',
};

const MODES = ['content', 'mcq', 'cards', 'fill', 'written', 'notes'];

/* Trạng thái ôn tập — tách khỏi S của app.js vì độc lập hoàn toàn với AI. */
const Q = {
  mode: 'content',       // chế độ đang hiện
  bank: {},              // docId -> {mcq, cards, fill, written}
  prog: {},              // localStorage: docId -> tiến độ các chế độ
  notes: [],             // ghi chú của user
  cardIdx: 0,
  cardOrder: [],
  cardSeen: new Set(),
  cardFlip: false,
};

const LS_PROG = 'lepu-qz-progress';
const LS_NOTES = 'lepu-qz-notes';

/* ---------------------------------------------------------------- helpers */
/* Bỏ dấu + hạ chữ thường: "Điền" ~ "dien". NFD tách dấu tổ hợp ra rồi
   bỏ; riêng chữ đ/Đ không tách được nên phải thay tay SAU khi hạ chữ thường
   (trước khi hạ chữ thường thì 'Đ'.toLowerCase() mới ra 'đ').

   Bỏ cả dấu câu ở hai đầu và khoảng trắng thừa — học sinh gõ tay hay
   dấu lửng, và câu hỏi nào cũng dễ dính dấu chấm cuối. Không bỏ dấu
   BÊN TRONG vì "sĩ số thực" và "câu 5, câu 6" khác nhau thật. */
function norm(s) {
  return String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/đ/g, 'd')
    .replace(/[.,;!?:"'`´]+/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

/* So khớp đáp án: chấp nhận cả "trong từng khoa" và "trong từng khoa." */
function fillMatch(input, answers) {
  const v = norm(input);
  if (!v) return null;
  for (let i = 0; i < answers.length; i++) {
    if (norm(answers[i]) === v) return i;
  }
  return null;
}

function shuffle(a) {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function store(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
}
function unstore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) { return fallback; }
}

/* Tiến độ của 1 bài: {mcq:{i:đáp án đã chọn}, cards:[...idx đã xem], fill:{i:...}, written:bool} */
function progOf(docId) {
  if (!Q.prog[docId]) {
    Q.prog[docId] = { mcq: {}, cards: [], fill: {}, written: {} };
  }
  const p = Q.prog[docId];
  p.mcq = p.mcq || {};
  p.cards = p.cards || [];
  p.fill = p.fill || {};
  p.written = p.written || {};
  return p;
}
function saveProg() { store(LS_PROG, Q.prog); }

function bank(docId) { return Q.bank[docId] || null; }
function listOf(docId, kind) {
  const b = bank(docId);
  return (b && b[kind]) || [];
}

/* -------------------------------------------------------------- load bank */
async function loadBank(docId) {
  if (Q.bank[docId]) return;
  const url = QZ_FILES[docId];
  if (!url) { Q.bank[docId] = { mcq: [], cards: [], fill: [], written: [] }; return; }
  try {
    const res = await fetch(url + '?v=' + VER, { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const d = await res.json();
    Q.bank[docId] = {
      mcq: d.mcq || [], cards: d.cards || [],
      fill: d.fill || [], written: d.written || [],
    };
  } catch (e) {
    Q.bank[docId] = { mcq: [], cards: [], fill: [], written: [], err: e.message };
  }
}

/* Số câu hiện trên nút sidebar. Gọi sau mỗi lần nạp bài. */
function refreshCounts() {
  const docId = Q.docId;
  ['mcq', 'cards', 'fill', 'written'].forEach(kind => {
    const n = listOf(docId, kind).length;
    $$(`[data-n="${kind}"]`).forEach(el => { el.textContent = String(n); });
  });
}

/* ============================================================ chuyển chế độ */
function setMode(mode) {
  if (!MODES.includes(mode)) mode = 'content';
  Q.mode = mode;
  Q.docId = S.docId;

  const updateDOM = () => {
    // nút sidebar
    $$('.smode').forEach(b => b.classList.toggle('on', b.dataset.mode === mode));

    // ẩn/hiện pane
    $('#docScroll').hidden = mode !== 'content';
    $('#paneMcq').hidden = mode !== 'mcq';
    $('#paneCards').hidden = mode !== 'cards';
    $('#paneFill').hidden = mode !== 'fill';
    $('#paneWritten').hidden = mode !== 'written';
    $('#paneNotes').hidden = mode !== 'notes';

    // vùng phụ sidebar: mục lục chỉ có ý nghĩa ở chế độ đọc
    $('#tocZone').hidden = mode !== 'content';
    $('#progZone').hidden = mode === 'content';

    if (mode === 'content') { startSpy(); return; }
    if (spy) spy.disconnect();

    if (mode === 'mcq') renderMcq();
    if (mode === 'cards') renderCards();
    if (mode === 'fill') renderFill();
    if (mode === 'written') renderWritten();
    if (mode === 'notes') renderNotes();
    renderSideProg();
  };

  if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.startViewTransition(updateDOM);
  } else {
    updateDOM();
  }
}

/* Tiến độ nhỏ ở sidebar khi không ở chế độ đọc. */
function renderSideProg() {
  const docId = Q.docId;
  const zone = $('#progZone');
  const p = progOf(docId);
  const rows = [
    ['Trắc nghiệm', `${Object.keys(p.mcq).length}/${listOf(docId, 'mcq').length}`, 'mcq'],
    ['Thẻ bài', `${p.cards.length}/${listOf(docId, 'cards').length}`, 'cards'],
    ['Điền chỗ trống', `${Object.keys(p.fill).length}/${listOf(docId, 'fill').length}`, 'fill'],
    ['Tự luận', `${Object.keys(p.written).length}/${listOf(docId, 'written').length}`, 'written'],
  ];
  zone.innerHTML = rows.map(([label, val, mode]) =>
    `<button class="sp-row" type="button" data-mode="${mode}">
       <span class="sp-l">${esc(label)}</span>
       <span class="sp-v">${esc(val)}</span>
     </button>`).join('');
  zone.querySelectorAll('.sp-row').forEach(b => {
    b.onclick = () => setMode(b.dataset.mode);
  });
}

/* ================================================================ TRẮC NGHIỆM */
function renderMcq() {
  const docId = Q.docId;
  const qs = listOf(docId, 'mcq');
  const p = progOf(docId);
  const body = $('#mcqBody');

  if (!qs.length) {
    body.innerHTML = '<div class="q-empty">Bài này chưa có câu trắc nghiệm.</div>';
    $('#mcqSub').textContent = '0 câu';
    $('#mcqBar').style.width = '0%';
    return;
  }

  $('#mcqSub').textContent =
    `${qs.length} câu · đã làm ${Object.keys(p.mcq).length} · trả lời sai không tính điểm lại`;

  body.innerHTML = '<div class="q-wrap">' + qs.map((q, i) => {
    const chosen = p.mcq[i];
    const answered = chosen !== undefined;
    const opts = q.o.map((o, k) => {
      let cls = 'q-opt';
      if (answered) {
        cls += ' locked';
        if (k === q.a) cls += ' ok';
        else if (k === chosen) cls += ' bad';
      }
      return `<button class="${cls}" type="button" data-i="${i}" data-k="${k}"${answered ? ' disabled' : ''}>
        <span class="k">${'ABCD'[k]}</span>
        <span class="t">${inline(o)}</span>
      </button>`;
    }).join('');
    const isOk = chosen === q.a;
    const why = answered
      ? `<div class="q-why ${isOk ? 'correct' : 'incorrect'}"><b class="${isOk ? 'txt-ok' : 'txt-bad'}">${isOk ? '✓ Đúng.' : '✗ Sai.'}</b> ${inline(q.w || '')} <span class="q-sec">mục ${esc(q.s || '')}</span></div>`
      : '';
    return `<div class="q-item" data-qi="${i}">
      <span class="q-num">CÂU ${i + 1}</span>
      <p class="q-text">${inline(q.q)}</p>
      <div class="q-opts">${opts}</div>
      ${why}
    </div>`;
  }).join('') + '</div>';

  // chấm điểm
  const answeredN = Object.keys(p.mcq).length;
  const rightN = qs.reduce((acc, q, i) => acc + (p.mcq[i] === q.a ? 1 : 0), 0);
  $('#mcqBar').style.width = (qs.length ? (answeredN / qs.length) * 100 : 0) + '%';
  $('#mcqSub').textContent =
    `${qs.length} câu · làm ${answeredN} · đúng ${rightN}` +
    (answeredN ? ` (${Math.round(rightN / answeredN * 100)}%)` : '');
}

function mcqAnswer(i, k) {
  const qs = listOf(Q.docId, 'mcq');
  const q = qs[i];
  if (!q) return;
  const p = progOf(Q.docId);
  if (p.mcq[i] !== undefined) return;   // đã trả lời thì khoá luôn
  p.mcq[i] = k;
  saveProg();
  renderMcq();
  renderSideProg();
}

/* =============================================================== FLASHCARDS */
function resetCards() {
  const qs = listOf(Q.docId, 'cards');
  Q.cardOrder = qs.map((_, i) => i);
  Q.cardOrder = shuffle(Q.cardOrder);
  Q.cardIdx = 0;
  Q.cardFlip = false;
  const p = progOf(Q.docId);
  Q.cardSeen = new Set(p.cards || []);
}

function renderCards() {
  const qs = listOf(Q.docId, 'cards');
  const body = $('#cardsBody');

  if (!qs.length) {
    body.innerHTML = '<div class="q-empty">Bài này chưa có thẻ bài.</div>';
    $('#cardsSub').textContent = '0 thẻ';
    $('#cardsBar').style.width = '0%';
    return;
  }
  if (!Q.cardOrder.length) resetCards();

  const pos = Q.cardOrder[Q.cardIdx];
  const c = qs[pos];
  if (!c) { resetCards(); return renderCards(); }

  $('#cardsSub').textContent =
    `thẻ ${Q.cardIdx + 1}/${qs.length} · đã xem ${Q.cardSeen.size}/${qs.length}`;
  $('#cardsBar').style.width = (Q.cardSeen.size / qs.length * 100) + '%';

  body.innerHTML = '<div class="q-wrap">' +
    `<div class="fc-stage">
       <div class="fc-card${Q.cardFlip ? ' flip' : ''}" id="fcCard">
         <div class="fc-face front">
           <h2 class="fc-q">${inline(c.f)}</h2>
           <div class="fc-hint">Bấm để lật — hoặc dùng phím mũi tên ← →</div>
         </div>
         <div class="fc-face back">
           <div class="fc-a">${inline(c.b)}</div>
         </div>
       </div>
     </div>
     <div class="fc-ctl">
       <button class="btn-ghost" id="fcPrev" type="button">← Trước</button>
       <div class="fc-dots">${Q.cardOrder.map((idx, k) => {
         const seen = Q.cardSeen.has(idx);
         return `<button class="fc-dot${seen ? ' seen' : ''}${k === Q.cardIdx ? ' cur' : ''}" type="button" data-k="${k}" title="Thẻ ${k + 1}"></button>`;
       }).join('')}</div>
       <button class="btn-ghost" id="fcNext" type="button">Sau →</button>
     </div>
     ${Q.cardSeen.size === qs.length && qs.length > 0
       ? `<div style="text-align:center"><span class="fc-complete-badge">✨ Đã xem hết tất cả ${qs.length} thẻ ghi nhớ!</span></div>`
       : `<p class="fc-hint" style="margin-top:14px">Lật thẻ rồi bấm "Sau" để tính vào tiến độ</p>`}
     ` + '</div>';

  // lật
  const card = $('#fcCard');
  let tiltFrame = null;
  card.onmousemove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rx = (-(y / (rect.height / 2)) * 6.5).toFixed(2);
    const ry = ((x / (rect.width / 2)) * 6.5).toFixed(2);
    if (tiltFrame) cancelAnimationFrame(tiltFrame);
    tiltFrame = requestAnimationFrame(() => {
      const baseFlip = Q.cardFlip ? 'rotateY(180deg) ' : '';
      card.style.transform = `${baseFlip}perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
  };
  card.onmouseleave = () => {
    if (tiltFrame) cancelAnimationFrame(tiltFrame);
    card.style.transform = Q.cardFlip ? 'rotateY(180deg)' : '';
  };

  card.onclick = () => {
    if (tiltFrame) cancelAnimationFrame(tiltFrame);
    card.style.transform = '';
    Q.cardFlip = !Q.cardFlip;
    card.classList.toggle('flip', Q.cardFlip);
    if (Q.cardFlip) markSeen(pos);
  };
  $('#fcPrev').onclick = () => cardMove(-1);
  $('#fcNext').onclick = () => cardMove(1);
  body.querySelectorAll('.fc-dot').forEach(d => {
    d.onclick = () => cardGo(+d.dataset.k);
  });
}

function markSeen(pos) {
  if (Q.cardSeen.has(pos)) return;
  Q.cardSeen.add(pos);
  const p = progOf(Q.docId);
  p.cards = Array.from(Q.cardSeen);
  saveProg();
  $('#cardsSub').textContent =
    `thẻ ${Q.cardIdx + 1}/${listOf(Q.docId, 'cards').length} · đã xem ${Q.cardSeen.size}/${listOf(Q.docId, 'cards').length}`;
  $('#cardsBar').style.width = (Q.cardSeen.size / listOf(Q.docId, 'cards').length * 100) + '%';
}

function cardGo(k) {
  const n = Q.cardOrder.length;
  if (!n) return;
  const card = $('#fcCard');
  if (card && card.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    card.animate([
      { opacity: 1, transform: 'scale(1)' },
      { opacity: 0.2, transform: 'scale(0.96) translateY(6px)' }
    ], { duration: 120, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }).onfinish = () => {
      Q.cardIdx = (k + n) % n;
      Q.cardFlip = false;
      renderCards();
      const nextCard = $('#fcCard');
      if (nextCard && nextCard.animate) {
        nextCard.animate([
          { opacity: 0.2, transform: 'scale(0.96) translateY(-6px)' },
          { opacity: 1, transform: 'scale(1) translateY(0)' }
        ], { duration: 220, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
      }
    };
  } else {
    Q.cardIdx = (k + n) % n;
    Q.cardFlip = false;
    renderCards();
  }
}
function cardMove(d) { cardGo(Q.cardIdx + d); }

/* ============================================================ ĐIỀN CHỖ TRỐNG */
function renderFill() {
  const qs = listOf(Q.docId, 'fill');
  const p = progOf(Q.docId);
  const body = $('#fillBody');

  if (!qs.length) {
    body.innerHTML = '<div class="q-empty">Bài này chưa có câu điền vào chỗ trống.</div>';
    $('#fillSub').textContent = '0 câu';
    $('#fillBar').style.width = '0%';
    return;
  }

  const answeredN = Object.keys(p.fill).length;
  const rightN = qs.reduce((a, q, i) => a + (fillDone(q, p.fill[i]) ? 1 : 0), 0);
  $('#fillSub').textContent = `${qs.length} câu · làm ${answeredN} · đúng ${rightN}`;
  $('#fillBar').style.width = (answeredN / qs.length * 100) + '%';

  body.innerHTML = '<div class="q-wrap">' + qs.map((q, i) => {
    const saved = p.fill[i];                       // mảng string, mỗi phần tử là 1 chỗ trống
    const done = Array.isArray(saved);
    /* Tách câu theo dãy gạch dưới: phần giữa hai chỗ trống là câu hỏi,
       nên dựng lại: text0 + ô0 + text1 + ô1 + ... + textN.
       Chỗ trống nằm TRƯỚC parts[k+1], không phải sau nó — duyệt từ
       parts[0] và chèn ô sau mỗi phần trừ phần cuối. */
    const parts = String(q.b).split(/_{2,}/);
    const nb = parts.length - 1;
    const vals = done ? saved : new Array(nb).fill('');
    let sentence = '';
    for (let k = 0; k < parts.length; k++) {
      sentence += inline(parts[k]);
      if (k < nb) {
        const st = done ? (fillMatch(vals[k], altsOf(q, k)) !== null ? 'ok' : 'bad') : '';
        sentence += `<input class="f-blank${st ? ' ' + st : ''}" type="text" data-i="${i}" data-k="${k}"` +
          ` value="${escAttr(vals[k] || '')}" placeholder="…" autocomplete="off" spellcheck="false"${done ? ' disabled' : ''}>`;
      }
    }
    const ans = done
      ? `<div class="f-ans">Đáp án: <b>${esc(q.a.map((_, k) => altsOf(q, k).join(' / ')).join('  ·  '))}</b></div>
         <p class="f-why">${inline(q.w || '')} <span class="q-sec">mục ${esc(q.s || '')}</span></p>`
      : '';
    return `<div class="f-item" data-fi="${i}">
      <span class="q-num">CÂU ${i + 1}</span>
      <p class="f-b">${sentence}</p>
      ${ans}
    </div>`;
  }).join('') + '</div>';

  // Enter chuyển ô; blur hoặc Enter thì chấm
  body.querySelectorAll('.f-blank').forEach(inp => {
    inp.onkeydown = e => {
      if (e.key === 'Enter') { e.preventDefault(); checkFill(inp); }
    };
    inp.onblur = () => { if (inp.value.trim()) checkFill(inp); };
  });
}

/* Đáp án chấp nhận cho một chỗ trống.
   Schema: a[k] là string (một đáp án duy nhất) HOẶC mảng string (nhiều
   cách viết được chấp nhận). Câu nhiều chỗ trống dùng a = [[...],[...]];
   câu một chỗ trống có nhiều cách viết dùng a = ['a','b','c'] — hai kiểu
   này cùng một hàm xử lý, không cần phân biệt vị trí chỗ trống. */
function altsOf(q, k) {
  const raw = q.a[k];
  return Array.isArray(raw) ? raw : [raw === undefined ? '' : raw];
}

/* Số chỗ trống của một câu (số dãy _____ trong đề bài). */
function blankCount(q) {
  return Math.max(0, String(q.b).split(/_{2,}/).length - 1);
}

/* Câu điền chỉ tính đúng khi ĐÃ LÀM HẾT mọi chỗ trống và chỗ nào cũng đúng. */
function fillDone(q, saved) {
  if (!Array.isArray(saved)) return false;
  const nb = blankCount(q);
  if (!nb) return false;
  for (let k = 0; k < nb; k++) {
    if (fillMatch(saved[k] || '', altsOf(q, k)) === null) return false;
  }
  return true;
}

function checkFill(inp) {
  const i = +inp.dataset.i, k = +inp.dataset.k;
  const p = progOf(Q.docId);
  if (Array.isArray(p.fill[i])) return;             // đã chấm câu này rồi
  const q = listOf(Q.docId, 'fill')[i];
  if (!q) return;
  const nb = Math.max(0, (String(q.b).split(/_{2,}/).length - 1));
  const vals = new Array(nb).fill('');
  $$('.f-blank[data-i="' + i + '"]').forEach(el => { vals[+el.dataset.k] = el.value.trim(); });
  p.fill[i] = vals;
  saveProg();
  renderFill();
  renderSideProg();
  // nhảy sang chỗ trống kế tiếp của câu sau, hoặc câu sau nếu hết câu
  const nxt = $(`.f-blank[data-i="${i + 1}"]`) || $('.f-blank:not([disabled])');
  if (nxt) nxt.focus();
}

/* ================================================================== TỰ LUẬN */
function renderWritten() {
  const qs = listOf(Q.docId, 'written');
  const p = progOf(Q.docId);
  const body = $('#writtenBody');

  if (!qs.length) {
    body.innerHTML = '<div class="q-empty">Bài này chưa có câu tự luận.</div>';
    $('#writtenSub').textContent = '0 câu';
    return;
  }

  const doneN = Object.keys(p.written).length;
  $('#writtenSub').textContent =
    `${qs.length} câu · đã xem đáp án ${doneN}` +
    ' — tự trả lời bằng lời rồi mới mở đáp án để tự đối chiếu';

  body.innerHTML = '<div class="q-wrap">' + qs.map((q, i) => {
    const seen = p.written[i];
    return `<div class="w-item" data-wi="${i}">
      <span class="q-num">CÂU ${i + 1}</span>
      <p class="w-q">${inline(q.q)}</p>
      <button class="w-toggle" type="button" data-w="${i}">${seen ? 'Đã xem đáp án' : 'Xem đáp án'}</button>
      <div class="w-answer${seen ? '' : ' hidden'}">${inline(q.m)} <span class="q-sec">mục ${esc(q.s || '')}</span></div>
    </div>`;
  }).join('') + '</div>';

  body.querySelectorAll('.w-toggle').forEach(b => {
    b.onclick = () => {
      const i = +b.dataset.w;
      const pp = progOf(Q.docId);
      pp.written[i] = !pp.written[i];
      saveProg();
      renderWritten();
      renderSideProg();
    };
  });
}

/* ================================================================== GHI CHÚ */
function loadNotes() {
  Q.notes = unstore(LS_NOTES, []);
  if (!Array.isArray(Q.notes)) Q.notes = [];
}

function renderNotes() {
  const body = $('#notesBody');
  const docId = Q.docId;
  const label = (DOCS.find(d => d.id === docId) || {}).label || docId;
  const mine = Q.notes.filter(n => n.doc === docId);
  const other = Q.notes.filter(n => n.doc !== docId);

  $('#notesSub').textContent =
    `${mine.length} ghi chú trong bài này · ${Q.notes.length} ghi chú toàn bộ · lưu trên máy bạn`;

  const card = (n, on) => `<div class="n-card${on ? ' on-doc' : ''}">
      <div class="n-meta">
        <span class="n-tag">${esc(on ? label : (DOCS.find(d => d.id === n.doc) || {label: n.doc}).label)}${on ? '' : ' · bài khác'}</span>
        <button class="n-del" type="button" data-nid="${escAttr(n.id)}">Xoá</button>
      </div>
      <div class="n-body">${esc(n.text)}</div>
    </div>`;

  body.innerHTML = '<div class="q-wrap">' +
    `<div class="n-composer">
       <textarea id="nTa" placeholder="Ghi chú của bạn về bài này… Ctrl+Enter để lưu"></textarea>
       <div class="n-actions">
         <span class="n-hint">${esc(label)} · lưu tự động vào trình duyệt này</span>
         <button class="btn-ghost" id="nSave" type="button">Lưu ghi chú</button>
       </div>
     </div>` +
    (mine.length || other.length
      ? '<div class="n-grid">' + mine.map(n => card(n, true)).join('') +
        other.map(n => card(n, false)).join('') + '</div>'
      : '<div class="q-empty">Chưa có ghi chú nào. Viết ở ô trên rồi bấm Lưu.</div>') +
    '</div>';

  const save = () => {
    const ta = $('#nTa');
    const t = (ta.value || '').trim();
    if (!t) { toast('Viết gì đó trước khi lưu'); ta.focus(); return; }
    Q.notes.unshift({ id: String(Date.now()) + Math.random().toString(36).slice(2, 7), doc: docId, text: t, ts: Date.now() });
    store(LS_NOTES, Q.notes);
    renderNotes();
    renderSideProg();
    toast('Đã lưu ghi chú');
  };
  $('#nSave').onclick = save;
  $('#nTa').addEventListener('keydown', e => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); save(); }
  });
  body.querySelectorAll('.n-del').forEach(b => {
    b.onclick = () => {
      Q.notes = Q.notes.filter(n => n.id !== b.dataset.nid);
      store(LS_NOTES, Q.notes);
      renderNotes();
    };
  });
}

/* Tải ghi chú ra file .md để in hoặc paste vào tài liệu riêng. */
function exportNotes() {
  if (!Q.notes.length) { toast('Chưa có ghi chú nào'); return; }
  const byDoc = {};
  Q.notes.forEach(n => { (byDoc[n.doc] = byDoc[n.doc] || []).push(n); });
  let md = '# Ghi chú CSDL\n\n';
  Object.keys(byDoc).forEach(docId => {
    const label = (DOCS.find(d => d.id === docId) || { label: docId }).label;
    md += `## ${label}\n\n`;
    byDoc[docId].forEach(n => {
      const d = new Date(n.ts);
      md += `### ${d.toLocaleString('vi-VN')}\n\n${n.text}\n\n`;
    });
  });
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'ghi-chu-csdl.md';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  toast(`Đã tải ${Q.notes.length} ghi chú`);
}

/* ================================================================ sự kiện */
function initModes() {
  Q.docId = S.docId;
  Q.prog = unstore(LS_PROG, {}) || {};
  loadNotes();

  $('#sideModes').addEventListener('click', e => {
    const b = e.target.closest('.smode');
    if (!b) return;
    setMode(b.dataset.mode);
    if (window.innerWidth <= 860) toggleSidebar(false);
  });

  // Trắc nghiệm
  $('#mcqBody').addEventListener('click', e => {
    const b = e.target.closest('.q-opt');
    if (!b || b.disabled) return;
    mcqAnswer(+b.dataset.i, +b.dataset.k);
  });
  $('#mcqReset').onclick = () => {
    progOf(Q.docId).mcq = {};
    saveProg();
    renderMcq(); renderSideProg();
    toast('Đã xoá kết quả trắc nghiệm của bài này');
  };

  // Flashcards
  $('#cardsReset').onclick = () => { resetCards(); renderCards(); };

  // Điền chỗ trống
  $('#fillReset').onclick = () => {
    progOf(Q.docId).fill = {};
    saveProg();
    renderFill(); renderSideProg();
    toast('Đã xoá đáp án điền chỗ trống của bài này');
  };

  // Tự luận
  $('#writtenReset').onclick = () => {
    progOf(Q.docId).written = {};
    saveProg();
    renderWritten(); renderSideProg();
    toast('Đã ẩn toàn bộ đáp án tự luận');
  };

  // Ghi chú
  $('#notesExport').onclick = exportNotes;
  $('#notesClear').onclick = () => {
    if (!Q.notes.length) { toast('Chưa có ghi chú nào'); return; }
    if (!confirm(`Xoá toàn bộ ${Q.notes.length} ghi chú? Không hoàn tác được.`)) return;
    Q.notes = [];
    store(LS_NOTES, Q.notes);
    renderNotes();
    toast('Đã xoá ghi chú');
  };

  // Phím tắt: 1-6 chuyển chế độ (trừ khi đang gõ trong ô nhập)
  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;

    const n = '123456'.indexOf(e.key);
    if (n >= 0) { setMode(MODES[n]); return; }

    if (Q.mode === 'cards') {
      if (e.key === 'ArrowLeft') { e.preventDefault(); cardMove(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); cardMove(1); }
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        Q.cardFlip = !Q.cardFlip;
        const c = $('#fcCard');
        if (c) { c.classList.toggle('flip', Q.cardFlip); if (Q.cardFlip) markSeen(Q.cardOrder[Q.cardIdx]); }
      }
    }
    if (Q.mode === 'mcq') {
      const k = 'abcd'.indexOf(e.key.toLowerCase());
      if (k >= 0) {
        const item = $('.q-item:not([data-done])') || null;
        // bấm phím chọn cho câu đầu tiên chưa làm
        const first = $$('.q-item').find(el => {
          const b2 = el.querySelector('.q-opt');
          return b2 && !b2.disabled;
        });
        if (first) {
          const opts = first.querySelectorAll('.q-opt');
          if (opts[k]) { e.preventDefault(); opts[k].click(); }
        }
      }
    }
  });
}

/* Khi đổi bài học: nạp ngân hàng tương ứng rồi vẽ lại chế độ đang mở. */
async function onDocChanged(docId) {
  Q.docId = docId;
  await loadBank(docId);
  refreshCounts();
  resetCards();
  renderSideProg();
  if (Q.mode !== 'content') setMode(Q.mode);
}