/* ==========================================================================
   LEPU CSDL Tutor — app logic
   - markdown renderer (no dep) cho ca bai hoc va cau tra loi cua AI
   - doc pane 2/3 + AI pane 1/3
   ========================================================================== */
'use strict';

/* ---------------------------------------------------------------- config */
const CONFIG = {
  // Ban xem thu: dat endpoint proxy o day. Rong = AI offline (chi doc).
  aiEndpoint: 'http://127.0.0.1:2020',
  model: 'oc/space-bunny-free',
  maxHist: 10,
};

const DOCS = [
  { id: 'khai-niem', file: 'data/01-khai-niem.md', label: '01 · Tầng khái niệm' },
  { id: 'on-thi', file: 'data/02-on-thi-may.md', label: '02 · Ôn thi máy' },
];

/* ---------------------------------------------------------------- state */
const S = {
  docId: null,
  raw: '',
  md: '',
  sections: [],
  thread: [],
  busy: false,
  aiOnline: false,
};

/* ---------------------------------------------------------------- dom */
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

/* ---------------------------------------------------------------- escape */
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function escAttr(s) { return esc(s).replace(/'/g, '&#39;'); }

/* ================================================================ markdown
   Thu tu: code fence -> heading -> table -> list -> blockquote -> inline
   Khong dung thu vien ngoai.
   ================================================================ */
function mdToHtml(src) {
  const text = String(src).replace(/\r\n/g, '\n');
  const lines = text.split('\n');
  const out = [];
  let i = 0;
  let listKind = null; // 'ul' | 'ol'

  const closeList = () => { if (listKind) { out.push(`</${listKind}>`); listKind = null; } };

  while (i < lines.length) {
    const line = lines[i];

    // --- code fence (giu nguyen, escape) ---
    if (/^```/.test(line)) {
      closeList();
      const lang = line.slice(3).trim();
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) { buf.push(lines[i]); i++; }
      i++; // dong fence
      out.push(
        '<div class="code-wrap"><button class="copy-code" type="button">SAO CHÉP</button>' +
        '<pre><code' + (lang ? ` data-lang="${escAttr(lang)}"` : '') + '>' +
        esc(buf.join('\n')) + '</code></pre></div>'
      );
      continue;
    }

    // --- heading ---
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      closeList();
      const lvl = h[1].length;
      const text2 = h[2].replace(/\s*#+\s*$/, '').trim();
      const id = slugify(text2);
      out.push(`<h${lvl} id="${escAttr(id)}">${inline(text2)}</h${lvl}>`);
      i++; continue;
    }

    // --- table ---
    if (line.includes('|') && /^\s*\|?[\s:-]*\|[\s:|-]*$/.test(lines[i + 1] || '')) {
      closeList();
      const head = splitRow(line);
      const aligns = splitRow(lines[i + 1]).map(c => {
        const t = c.trim();
        if (/^:.*:$/.test(t)) return 'center';
        if (/:$/.test(t)) return 'right';
        if (/^:/.test(t)) return 'left';
        return '';
      });
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
        rows.push(splitRow(lines[i])); i++;
      }
      let t = '<table><thead><tr>';
      head.forEach((c, k) => {
        t += `<th${aligns[k] ? ` style="text-align:${aligns[k]}"` : ''}>${inline(c.trim())}</th>`;
      });
      t += '</tr></thead><tbody>';
      rows.forEach(r => {
        t += '<tr>';
        for (let k = 0; k < head.length; k++) {
          const al = aligns[k] ? ` style="text-align:${aligns[k]}"` : '';
          t += `<td${al}>${inline((r[k] || '').trim())}</td>`;
        }
        t += '</tr>';
      });
      t += '</tbody></table>';
      out.push(t);
      continue;
    }

    // --- blockquote ---
    if (/^>\s?/.test(line)) {
      closeList();
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, '')); i++;
      }
      const inner = mdToHtml(buf.join('\n'));
      out.push(`<blockquote>${inner}</blockquote>`);
      continue;
    }

    // --- list ---
    const ul = /^(\s*)([-*+])\s+(.*)$/.exec(line);
    const ol = /^(\s*)(\d+)[.)]\s+(.*)$/.exec(line);
    if (ul || ol) {
      const want = ul ? 'ul' : 'ol';
      if (listKind !== want) { closeList(); out.push(`<${want}>`); listKind = want; }
      const item = (ul || ol)[3];
      out.push(`<li>${inline(item)}</li>`);
      i++; continue;
    }

    // --- hr ---
    if (/^\s*([-*_])\s*\1\s*\1[\s\-*_]*$/.test(line)) {
      closeList(); out.push('<hr>'); i++; continue;
    }

    // --- paragraph ---
    if (line.trim() === '') { closeList(); i++; continue; }

    closeList();
    const buf = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== '' &&
           !/^(#{1,6}\s|```|>|\s*([-*+])\s|\s*\d+[.)]\s)/.test(lines[i]) &&
           !lines[i].includes('|')) { buf.push(lines[i]); i++; }
    out.push(`<p>${inline(buf.join('\n'))}</p>`);
  }
  closeList();
  return out.join('\n');
}

function splitRow(line) {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|')) s = s.slice(0, -1);
  // bo qua pipe nam trong backtick
  const cells = [];
  let cur = '', inCode = false;
  for (const ch of s) {
    if (ch === '`') inCode = !inCode;
    if (ch === '|' && !inCode) { cells.push(cur); cur = ''; }
    else cur += ch;
  }
  cells.push(cur);
  return cells;
}

/* --- inline: code > bold > italic > link > text ---
   Luu code inline vao placeholder PHUONG TRONG (\u0000<n>\u0000) truoc khi escape,
   nen escape() khong the cham vao noi dung code. Placeholder phai duoc restore
   SAU escape: neu khong, mot chuoi "\u00005\u0000" trong noi dung cua AI se bi
   thay bang code so 5. --- */
function inline(s) {
  const codes = [];
  let t = String(s).replace(/`([^`]+)`/g, (_, c) => {
    codes.push(c); return `\u0000${codes.length - 1}\u0000`;
  });
  t = esc(t);
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  t = t.replace(/~~([^~]+)~~/g, '<s>$1</s>');
  // URL khong duoc chua dau ) va khong co khoang trang; dung [^\s)] de
  // [x](javascript:alert(1)) lay het nhan, khong cat thanh "x)".
  t = t.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, (_, lbl, url) => {
    if (/^#/.test(url)) return `<a href="${escAttr(url)}" data-sec>${lbl}</a>`;
    // chi cho phep http/https/mailto; chan javascript: va data:
    if (!/^(https?:|mailto:)/i.test(url)) return lbl;
    return `<a href="${escAttr(url)}" target="_blank" rel="noopener noreferrer">${lbl}</a>`;
  });
  t = t.replace(/\n/g, '<br>');
  return t.replace(/\u0000(\d+)\u0000/g, (_, n) => {
    const c = codes[+n];
    return c === undefined ? '' : `<code>${c}</code>`;
  });
}

function slugify(s) {
  return String(s).toLowerCase()
    .replace(/[^\w\sàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ-]/g, '')
    .replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');
}

/* ================================================================ doc pane */
async function loadDoc(id) {
  const meta = DOCS.find(d => d.id === id) || DOCS[0];
  S.docId = meta.id;
  try {
    const res = await fetch(meta.file + '?v=' + VER, { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    S.raw = await res.text();
  } catch (e) {
    $('#docBody').innerHTML =
      `<div class="ai-empty"><h3>Không tải được bài học</h3><p>${esc(meta.file)} — ${esc(e.message)}</p></div>`;
    return;
  }
  S.md = mdToHtml(S.raw);
  $('#docBody').innerHTML = S.md;
  S.sections = collectSections();
  $('#docMeta').textContent =
    meta.label + ' · ' + (S.raw.length / 1024).toFixed(0) + ' KB · ' + S.sections.length + ' mục';
  fillSectionNav();
  $('#docScroll').scrollTop = 0;
}

function collectSections() {
  return $$('#docBody h2, #docBody h3').map(h => ({
    id: h.id,
    text: (h.textContent || '').trim(),
    lvl: Number(h.tagName[1]),
  }));
}

function fillSectionNav() {
  const sel = $('#secNav');
  const cur = S.sections.filter(s => s.lvl === 2);
  const opts = (cur.length ? cur : S.sections)
    .map(s => `<option value="${escAttr(s.id)}">${esc(s.text)}</option>`).join('');
  sel.innerHTML = '<option value="">— Mục lục —</option>' + opts;
  sel.onchange = () => { if (sel.value) gotoSection(sel.value); sel.value = ''; };
}

function gotoSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  el.classList.remove('sec-hl');
  void el.offsetWidth;
  el.classList.add('sec-hl');
}

/* theo doi muc dang doc de dong bo select + nut tro ve AI */
let spy = null;
function startSpy() {
  if (spy) spy.disconnect();
  spy = new IntersectionObserver(entries => {
    const vis = entries.filter(e => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (!vis.length) return;
    const id = vis[0].target.id;
    const sec = S.sections.find(s => s.id === id);
    if (sec && sec.lvl === 2) $('#secNav').value = id;
  }, { root: $('#docScroll'), rootMargin: '-10% 0px -75% 0px', threshold: 0 });
  S.sections.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) spy.observe(el);
  });
}

/* ================================================================ AI pane */
const SUGGESTS = {
  'khai-niem': [
    'Phân biệt siêu khóa, khóa dự tuyển, khóa chính bằng ví dụ thật',
    'Vì sao KETQUA phải dùng khóa chính gộp?',
    'Tại sao WHERE DCHI <> \'Hà Nội\' bỏ sót dòng NULL?',
    'Ba loại ràng buộc toàn vẹn khác nhau thế nào?',
    'Quan hệ N-N tại sao phải có bảng cầu nối?',
  ],
  'on-thi': [
    'Đọc câu "khoa nào có ít nhất 3 lớp" thành SQL như thế nào?',
    'Khi nào dùng DISTINCT, khi nào dùng GROUP BY?',
    'Vì sao NOT IN hỏng khi subquery có NULL?',
    'Câu "nhiều nhất" khác "trên 3" ở chỗ nào?',
    'LEFT JOIN mà đếm COUNT(*) sai ở đâu?',
  ],
};

/* Gợi ý theo bài đang mở. Thread KHÔNG tự xoá khi đổi bài: học sinh có thể
   hỏi tiếp bài mới trong lúc còn lịch sử bài cũ — nhưng gợi ý thì luôn thuộc
   về bài đang mở, nên currentSuggest() không phụ thuộc độ dài thread. */
function currentSuggest() {
  return SUGGESTS[S.docId] || [];
}

function suggestBlock() {
  const list = currentSuggest();
  if (!list.length) return '';
  const cur = S.thread.length ? 'Gợi ý cho bài này' : '';
  return `<div class="suggests-wrap">${cur ? `<div class="suggests-h">${cur}</div>` : ''}
    <div class="suggests">${list.map(q =>
      `<button class="suggest" type="button" data-q="${escAttr(q)}">${esc(q)}</button>`).join('')}</div></div>`;
}

function renderThread() {
  const box = $('#aiThread');
  if (!S.thread.length) {
    box.innerHTML =
      `<div class="ai-empty">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
           <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
         </svg>
         <h3>Gia sư CSDL</h3>
         <p>Chỉ trả lời dựa trên bài học đang mở bên trái. Hỏi bất cứ điều gì trong bài này.</p>
       </div>` + suggestBlock();
    box.scrollTop = 0;
    return;
  }

  box.innerHTML = S.thread.map(m => {
    if (m.role === 'user') {
      return `<div class="msg user"><div class="bubble">${inline(m.text)}</div></div>`;
    }
    if (m.role === 'thinking') {
      return `<div class="msg ai"><div class="role">AI</div>
        <div class="bubble"><div class="thinking"><span class="bars"><i></i><i></i><i></i></span>đang đọc bài và soạn câu trả lời…</div></div></div>`;
    }
    if (m.role === 'error') {
      return `<div class="msg err"><div class="role">LỖI</div><div class="bubble">${inline(m.text)}</div></div>`;
    }
    const jump = m.jump
      ? `<button class="jump" type="button" data-jump="${escAttr(m.jump)}">↩ xem mục "${esc(m.jumpLabel || m.jump)}" trong bài</button>`
      : '';
    return `<div class="msg ai"><div class="role">AI · ${esc(m.model || CONFIG.model)}</div>
      <div class="bubble">${mdToHtml(m.text)}</div>${jump}</div>`;
  }).join('') + suggestBlock();
  box.scrollTop = box.scrollHeight;
}

/* goi proxy */
async function ask(question) {
  const q = (question || '').trim();
  if (!q || S.busy) return;
  S.busy = true;
  $('#btnSend').disabled = true;
  $('#ta').value = '';
  $('#ta').style.height = 'auto';

  S.thread.push({ role: 'user', text: q });
  S.thread.push({ role: 'thinking' });
  renderThread();

  if (!CONFIG.aiEndpoint) {
    S.thread.splice(-1);
    S.thread.push({ role: 'error', text: 'AI đang tắt. Đặt CONFIG.aiEndpoint trong js/app.js để bật.' });
    renderThread(); S.busy = false; $('#btnSend').disabled = false;
    return;
  }

  const hist = S.thread
    .filter(m => m.role === 'user' || (m.role === 'ai' && m.text))
    .slice(-CONFIG.maxHist)
    .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }));

  const t0 = performance.now();
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 120000);
    const res = await fetch(CONFIG.aiEndpoint + '/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: S.raw,
        messages: hist.length ? hist : [{ role: 'user', content: q }],
      }),
      signal: ctl.signal,
    });
    clearTimeout(timer);
    const data = await res.json().catch(() => ({}));
    S.thread.splice(-1); // bo thinking
    if (!res.ok) {
      S.thread.push({ role: 'error', text: data.message || data.error || ('Lỗi ' + res.status) });
    } else if (!data.answer) {
      S.thread.push({ role: 'error', text: 'Mô hình không trả lời được. Thử câu khác.' });
    } else {
      const j = matchSection(data.answer);
      S.thread.push({ role: 'ai', text: data.answer, model: data.model, jump: j && j.id, jumpLabel: j && j.text });
      S.aiOnline = true;
    }
    const secs = ((performance.now() - t0) / 1000).toFixed(1);
    if (S.thread.length > 1) toast('Trả lời trong ' + secs + 's');
  } catch (e) {
    S.thread.splice(-1);
    const msg = e.name === 'AbortError'
      ? 'Mất ' + '120s mà chưa có câu trả lời. Thử câu ngắn hơn.'
      : 'Không kết nối được tới AI. Kiểm tra proxy có chạy không?';
    S.thread.push({ role: 'error', text: msg });
  }
  renderThread();
  S.busy = false;
  $('#btnSend').disabled = false;
  $('#ta').focus();
}

/* Tìm mục trong bài mà AI nhắc tới, để hiện nút "xem mục" bên dưới câu trả lời.
   AI thường nhắc theo SỐ MỤC ("mục 11.1", "mục 5.3") chứ ít khi lặp lại nguyên
   tiêu đề, nên phải so khớp cả hai dạng. Số mục ưu tiên cao hơn vì chính xác hơn:
   "mục 1.3" trong bài 02 và bài 01 là hai mục khác nhau. */
function matchSection(answer) {
  if (!answer || !S.sections.length) return null;
  const a = answer;

  // 1. so theo so muc: "muc 11.1" / "mục 8.2" / "mục 5"
  const byNum = [];
  const reNum = /(?:muc|mục|phụ lục|phu luc|appendix|section)\s+(\d+(?:\.\d+)*)/gi;
  let m;
  while ((m = reNum.exec(a)) !== null) {
    const num = m[1].replace(/\.0+$/, '');
    S.sections.forEach(sec => {
      const secNum = (sec.text.match(/^(\d+(?:\.\d+)*)/) || [])[1];
      if (secNum && secNum.replace(/\.0+$/, '') === num) byNum.push(sec);
    });
  }
  if (byNum.length) return byNum[0];

  // 2. so theo tieu de (bỏ số mục ở đầu)
  const hits = [];
  S.sections.forEach(sec => {
    const key = sec.text.replace(/^\d+(\.\d+)*\.?\s*/, '').trim();
    if (key.length < 8) return;
    if (a.includes(key)) hits.push(sec);
  });
  return hits.length ? hits[0] : null;
}

/* ================================================================ health */
async function checkHealth() {
  const chip = $('#statusChip');
  const set = (state, text) => {
    chip.dataset.state = state;
    chip.querySelector('.txt').textContent = text;
  };
  if (!CONFIG.aiEndpoint) { set('', 'AI tắt'); return; }
  set('checking', 'đang kiểm tra');
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 4000);
    const r = await fetch(CONFIG.aiEndpoint + '/health', { signal: ctl.signal });
    clearTimeout(t);
    const d = await r.json();
    if (r.ok && d.ok) { S.aiOnline = true; set('ok', 'AI sẵn sàng'); }
    else set('bad', 'AI lỗi');
  } catch (e) {
    S.aiOnline = false;
    set('bad', 'AI offline');
  }
}

/* ================================================================ toast */
let toastTimer = null;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ================================================================ init */
const VER = 'v5';

function setTheme(t) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('lepu-theme', t); } catch (e) {}
}

function initTheme() {
  let t = 'dark';
  try { t = localStorage.getItem('lepu-theme') || 'dark'; } catch (e) {}
  document.documentElement.dataset.theme = t;
  $('#btnTheme').onclick = () => {
    const cur = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    setTheme(cur);
  };
}

function init() {
  initTheme();
  $('#aiModel').textContent = CONFIG.model;

  $('#docSel').innerHTML = DOCS.map(d =>
    `<option value="${d.id}">${esc(d.label)}</option>`).join('');
  $('#docSel').value = DOCS[0].id;
  $('#docSel').onchange = e => {
    loadDoc(e.target.value);
    renderThread();
    setTimeout(startSpy, 250);
  };

  $('#ta').addEventListener('keydown', e => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { ask(e.target.value); }
    if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 860) {
      e.preventDefault(); ask(e.target.value);
    }
  });
  $('#ta').addEventListener('input', e => {
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
  });

  $('#btnSend').onclick = () => ask($('#ta').value);
  $('#btnClear').onclick = () => { S.thread = []; renderThread(); };

  $('#aiThread').addEventListener('click', e => {
    const s = e.target.closest('.suggest');
    if (s) { ask(s.dataset.q); return; }
    const j = e.target.closest('.jump');
    if (j && j.dataset.jump) gotoSection(j.dataset.jump);
  });

  $('#aiThread').addEventListener('click', e => {
    const c = e.target.closest('.copy-code');
    if (c) {
      const pre = c.parentElement.querySelector('pre code');
      if (!pre) return;
      navigator.clipboard.writeText(pre.textContent)
        .then(() => { c.textContent = 'ĐÃ COPY'; setTimeout(() => { c.textContent = 'SAO CHÉP'; }, 1400); })
        .catch(() => {});
    }
  });

  $('#docBody').addEventListener('click', e => {
    const a = e.target.closest('a[data-sec]');
    if (a) { e.preventDefault(); gotoSection(a.getAttribute('href').slice(1)); return; }
    const c = e.target.closest('.copy-code');
    if (c) {
      const pre = c.parentElement.querySelector('pre code');
      if (!pre) return;
      navigator.clipboard.writeText(pre.textContent)
        .then(() => { c.textContent = 'ĐÃ COPY'; setTimeout(() => { c.textContent = 'SAO CHÉP'; }, 1400); })
        .catch(() => {});
    }
  });

  // Cmd/Ctrl+K: focus AI
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault(); $('#ta').focus();
    }
  });

  loadDoc(DOCS[0].id);
  setTimeout(startSpy, 200);
  renderThread();
  checkHealth();
  setInterval(checkHealth, 60000);
}

document.addEventListener('DOMContentLoaded', init);
