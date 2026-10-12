/* ==========================================================================
   LEPU CSDL Tutor — app logic
   - markdown renderer (no dep) cho ca bai hoc va cau tra loi cua AI
   - doc pane 2/3 + AI pane 1/3
   ========================================================================== */
'use strict';

/* ---------------------------------------------------------------- config */
/* AI chay o hai che do, tu chon theo noi dang mo trang:
   - 'remote': goi thang 9Router public qua Cloudflare. Key nam trong file nay
     nen BAT KHOA cho ai mo DevTools — nhung key do CHI mo duoc model
     'oc/space-bunny-free' (mien phi), khong len toi model tra phi.
   - 'local' : goi proxy tren may (proxy.py), key giu o server, an toan hon.
   'auto' thu local truoc, remote sau.
   Doi sang 'off' de chi doc, khong hoi AI. */
const KEY = 'sk-e32af99e3404486589650fc63db3ef0b9e629e57df0f6ca62bf99fcf0856d40b-3cw4wz-d8ff256b';
const REMOTE = 'https://proxy.hoangngocbach.id.vn';
const LOCAL = 'http://127.0.0.1:2020';

const CONFIG = {
  mode: 'auto',            // 'auto' | 'remote' | 'local' | 'off'
  apiKey: KEY,
  model: 'oc/space-bunny-free',
  maxHist: 10,
  probeMs: 4000,
  // Model nay ton mot khoang 'reasoning' rat lon truoc khi tra loi that.
  // max_tokens 1400 bi reasoning nuot het nen content rong. 6000 cho
  // mot cau hoi co tai lieu day du; 12000 cho cau can giai chi tiet.
  maxTokens: 6000,
};

// Ben chat dang dung: {kind:'local'|'remote', url}
let ACTIVE = null;

const DOCS = [
  { id: 'khai-niem', file: 'data/01-khai-niem.md', label: '01 · Tầng khái niệm' },
  { id: 'on-thi', file: 'data/02-on-thi-may.md', label: '02 · Ôn thi máy' },
  { id: 'de4', file: 'data/13-de4-lap-trinh-csdl.md', label: '03 · Đề 4: lập trình CSDL' },
  { id: 'giai', file: 'data/14-giai-chi-tiet-43-cau.md', label: '04 · Giải chi tiết 43 câu' },
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

/* Duong dan media: chi cho phep tep cuc bo trong repo + http(s)/
   file:// bat buoc (khong duoc goi bo bang video src). Chan data:/
   javascript: nhu phan link. */
const MEDIA_EXT = /\.(png|jpe?g|webp|gif|svg|mp4|webm|ogv)$/i;
function mediaUrl(u) {
  const s = String(u).trim();
  if (/^data:/i.test(s) || /^javascript:/i.test(s)) return null;
  if (/^https?:\/\//i.test(s)) return s;
  // "//host/x.png" la protocol-relative -> tro sang domain khac, tu choi
  if (s.startsWith('//')) return null;
  // duong dan tuong doi trong repo: "assets/media/sodo.png" hoac "/assets/media/sodo.png"
  if (/^\/?[A-Za-z0-9_][\w\-./]*$/.test(s) && MEDIA_EXT.test(s)) return s;
  return null;
}
function mediaTag(u, alt, isVideo) {
  const src = mediaUrl(u);
  if (!src) return null;
  const a = escAttr(alt || '');
  if (isVideo) {
    return `<figure class="md-fig"><video controls preload="metadata" playsinline`
      + ` src="${escAttr(src)}"></video>`
      + `<figcaption class="md-cap">▶ ${a}</figcaption></figure>`;
  }
  return `<figure class="md-fig"><img loading="lazy" decoding="async"`
    + ` src="${escAttr(src)}" alt="${a}"></figure>`;
}

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

    // --- media block: ![alt](path) | ![alt](path.mp4) | <video src="x.mp4"> ---
    const mm = /^\s*!\[([^\]]*)\]\(([^)\s]+)\)\s*$/.exec(line);
    if (mm) {
      closeList();
      const isVid = /\.(mp4|webm|ogv)$/i.test(mm[2]);
      const tag = mediaTag(mm[2], mm[1], isVid);
      out.push(tag || `<p>${inline(line)}</p>`);
      i++; continue;
    }
    // the <video src="..."> nguyen ban: chi lay src, bo qua phan con lai
    const vv = /^\s*<video[^>]*\ssrc=["']([^"']+)["']/.exec(line);
    if (vv) {
      closeList();
      const tag = mediaTag(vv[1], 'Video', true);
      out.push(tag || `<p>${inline(line)}</p>`);
      i++; continue;
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
  /* Tính offset thủ công rồi scrollTo, KHÔNG dùng scrollIntoView({smooth}).
     smooth trên một mục cách đỉnh hàng chục nghìn px làm main thread bận
     hàng giây — thao tác chuột sau đó bị treo. Cuộn tức thì tới đúng vị trí,
     rồi tô sáng để mắt bắt đầu từ đó. */
  const box = $('#docScroll');
  const top = el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - 12;
  box.scrollTo({ top, behavior: 'auto' });
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

  S.thread.push({ role: 'user', text: q, doc: S.docId });
  S.thread.push({ role: 'thinking' });
  renderThread();

  if (!ACTIVE) {
    S.thread.splice(-1);
    S.thread.push({ role: 'error', text:
      'AI đang tắt vì không tìm thấy proxy. Nếu bạn mở trang này trên máy khác, hãy mở trên máy đang chạy proxy — hoặc chạy: python3 proxy.py' });
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

    /* LUÔN gửi system prompt + tài liệu, kể cả khi đã có lịch sử.
       Trước đây dùng `hist.length ? hist : [...]` nên từ câu hỏi thứ hai trở
       đi, cả prompt lẫn tài liệu biến mất khỏi request — model trả lời bằng
       kiến thức chung và không trích mục nào. */
    const sysPrompt = buildSystemPrompt();
    const userTurn = buildUserTurn(q);
    let body;

    if (ACTIVE.kind === 'remote') {
      // Lịch sử: các lượt hỏi trước, bỏ câu hỏi vừa rồi (đã gộp vào userTurn).
      const past = hist.slice(0, -1).filter(m => (m.content || '').trim());
      body = JSON.stringify({
        model: CONFIG.model,
        stream: true,
        max_tokens: CONFIG.maxTokens,
        temperature: 0.3,
        messages: [
          { role: 'system', content: sysPrompt },
          ...past,
          { role: 'user', content: userTurn },
        ],
      });
    } else {
      // Kênh local: proxy.py tự ghép tài liệu + system prompt, chỉ gửi câu hỏi.
      const past = hist.slice(0, -1).filter(m => (m.content || '').trim());
      body = JSON.stringify({
        source: S.raw,
        messages: [...past, { role: 'user', content: q }],
      });
    }

  const res = await fetch(chatUrl(), {
      method: 'POST',
      headers: chatHeaders(),
      body,
      signal: ctl.signal,
    });
    const rawText = await readBody(res, res.headers.get('content-type') || '');
    clearTimeout(timer);
    let data = {};
    try { data = JSON.parse(rawText); } catch (e) {}
    // SSE: noi cac chunk delta thanh mot chuoi
    const streamed = rawText.trimStart().startsWith('data:')
      ? joinStream(rawText) : '';
    const answer = streamed || data.answer || pickContent(data);
    S.thread.splice(-1); // bo thinking
    if (!res.ok) {
      const msg = (data.error && data.error.message) || data.message || rawText.slice(0, 180) || ('Lỗi ' + res.status);
      S.thread.push({ role: 'error', text: msg });
    } else if (!answer) {
      S.thread.push({ role: 'error', text: 'Mô hình không trả lời được. Thử câu khác.' });
    } else {
      const j = matchSection(answer);
      S.thread.push({ role: 'ai', text: answer, model: data.model || CONFIG.model, doc: S.docId, jump: j && j.id, jumpLabel: j && j.text });
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
  // Chi lay dau tien theo THU TU xuat hien trong cau tra loi, dung tai dayo nhat
  // — AI thuong mo ta bai bang muc chinh truoc, cac muc sau chi la trich dan.
  const reNum = /(?:muc|mục|phụ lục|phu luc|appendix|section)\s+(\d+(?:\.\d+)*)/gi;
  let m;
  while ((m = reNum.exec(a)) !== null) {
    const num = m[1].replace(/\.0+$/, '');
    for (const sec of S.sections) {
      const secNum = (sec.text.match(/^(\d+(?:\.\d+)*)/) || [])[1];
      if (secNum && secNum.replace(/\.0+$/, '') === num) return sec;
    }
  }

  // 2. so theo tieu de (bỏ số mục ở đầu)
  const hits = [];
  S.sections.forEach(sec => {
    const key = sec.text.replace(/^\d+(\.\d+)*\.?\s*/, '').trim();
    if (key.length < 8) return;
    if (a.includes(key)) hits.push(sec);
  });
  return hits.length ? hits[0] : null;
}

/* Prompt dung chung cho ca hai kenh. Proxy local tu them tai lieu vao
   <tai_lieu>; kenh remote thi app phai lam phan dinh ngay. */
const SYS_PROMPT = [
"Bạn là Gia sư CSDL của sinh viên Đại học Điện lực (EPU), đang ôn môn Cơ sở dữ liệu.",
"",
"NGUỒN SỰ THẬT",
"- Chỉ dựa vào TÀI LIỆU trong thẻ <tai_lieu> của tin nhắn người dùng.",
"- Tài liệu là nguồn sự thật duy nhất cho nội dung môn học.",
"- Tài liệu không đủ để trả lời thì nói rõ: \"Tài liệu hiện tại chưa đề cập phần này\", rồi gợi ý nên xem mục nào.",
"",
"CÁCH TRẢ LỜI",
"- Tiếng Việt, đúng giọng sinh viên năm 3.",
"- Giảng giải chứ không chỉ đưa đáp án. Hỏi \"tại sao\" thì giải thích cơ chế.",
"- Cấu trúc: mốc mục → công thức → ví dụ trong tài liệu → lỗi hay gặp.",
"- BẮT BUỘC trích dẫn mục: mỗi ý chính kèm số mục trong tài liệu, ví dụ \"(mục 6.3)\". Đây là cách duy nhất học sinh tự tra lại, thiếu nó thì câu trả lời vô dụng.",
"- SQL luôn theo SQL Server: có GO giữa các khối, chuỗi tiếng Việt có N\'...\'.",
"- Câu hỏi mơ hồ thì hỏi lại đúng một câu cụ thể, đừng đoán.",
"",
"KHONG ĐƯỢC",
"- Không bịa số liệu, không tự tạo ví dụ rồi gọi là kết quả trong tài liệu.",
"- Không nói \"đã kiểm chứng\" nếu chưa chạy kiểm tra.",
].join("\n");

function buildSystemPrompt() { return SYS_PROMPT; }

function buildUserTurn(question) {
  return "<tai_lieu>\n" + S.raw.trim() + "\n</tai_lieu>\n\n" +
         "<cau_hoi>\n" + question.trim() + "\n</cau_hoi>";
}

/* Doc noi dung tu response cua 9Router (chat.completion) va tu phong proxy
   ({"answer": "..."}). Chuyen chat/completion sang phoi hien thi. */
function pickContent(data) {
  if (!data) return "";
  if (typeof data.answer === 'string') return data.answer;
  const choice = (data.choices || [])[0];
  if (!choice) return "";
  const m = choice.message || {};
  let t = typeof m.content === 'string' ? m.content : '';
  if (!t && typeof choice.text === 'string') t = choice.text;
  if (Array.isArray(m.content)) {
    t = m.content.map(c => (typeof c === 'string' ? c : (c && c.text) || '')).join('');
  }
  return t;
}

/* Doc body cua fetch. 9Router/Cloudflare co the tra SSE ngay ca khi client
   khong yeu cau stream, nen phai doc dua tren content-type chu khong do vao
   res.text() roi hy vong no la JSON. */
async function readBody(res, ct) {
  try {
    if ((ct || '').includes('text/event-stream')) return await res.text();
    return await res.text();
  } catch (e) {
    return '';
  }
}

/* Noi cac chunk SSE thanh mot chuoi hoan chinh. */
function joinStream(raw) {
  const parts = [];
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t.startsWith('data:')) continue;
    const b = t.slice(5).trim();
    if (!b || b === '[DONE]') continue;
    let o;
    try { o = JSON.parse(b); } catch (e) { continue; }
    for (const ch of (o.choices || [])) {
      const d = ch.delta || {};
      if (typeof d.content === 'string') parts.push(d.content);
      else if (typeof ch.text === 'string') parts.push(ch.text);
    }
  }
  return parts.join('');
}

/* Chon ben chat.
   'local'  -> proxy.py tren may (key giu o server). Tra /_config de xac nhan.
   'remote' -> 9Router public qua Cloudflare, key gui trong header Authorization.
   'auto'   -> thu local truoc, remote sau.
   Endpoint nao tra 401/403 co nghia la proxy dang bat -> thu tiep muc sau. */
async function pingLocal() {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), CONFIG.probeMs);
    const r = await fetch(LOCAL + '/_config', { signal: ctl.signal, cache: 'no-store' });
    clearTimeout(t);
    if (!r.ok) return false;
    const d = await r.json().catch(() => ({}));
    return !!(d && d.ok);
  } catch (e) { return false; }
}

async function pingRemote() {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), CONFIG.probeMs);
    const r = await fetch(REMOTE + '/v1/models', {
      signal: ctl.signal, cache: 'no-store',
      headers: { 'Authorization': 'Bearer ' + CONFIG.apiKey },
    });
    clearTimeout(t);
    return r.ok;
  } catch (e) { return false; }
}

async function resolveEndpoint() {
  if (CONFIG.mode === 'off') return null;
  if (CONFIG.mode === 'local')  return (await pingLocal())  ? { kind: 'local',  url: LOCAL }  : null;
  if (CONFIG.mode === 'remote') return (await pingRemote()) ? { kind: 'remote', url: REMOTE } : null;
  if (await pingLocal())  return { kind: 'local',  url: LOCAL };
  if (await pingRemote()) return { kind: 'remote', url: REMOTE };
  return null;
}

function chatUrl() {
  return ACTIVE.kind === 'remote' ? ACTIVE.url + '/v1/chat/completions'
                                   : ACTIVE.url + '/chat';
}

function chatHeaders() {
  if (ACTIVE.kind === 'remote') {
    return { 'Content-Type': 'application/json',
             'Authorization': 'Bearer ' + CONFIG.apiKey };
  }
  return { 'Content-Type': 'application/json' };
}

async function checkHealth() {
  const chip = $('#statusChip');
  const set = (state, text, title) => {
    chip.dataset.state = state;
    chip.querySelector('.txt').textContent = text;
    chip.title = title || '';
  };
  if (CONFIG.mode === 'off') { set('', 'AI tắt', 'Đặt CONFIG.mode để bật'); return; }
  set('checking', 'đang kiểm tra');
  ACTIVE = await resolveEndpoint();
  if (!ACTIVE) {
    S.aiOnline = false;
    set('bad', 'AI offline', 'Không gọi được 9Router. Kiểm tra mạng hoặc key.');
    return;
  }
  S.aiOnline = true;
  set('ok', 'AI sẵn sàng', 'Kênh: ' + ACTIVE.kind + ' · ' + ACTIVE.url);
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
const VER = 'v17';

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
    // Xoá lịch sử của bài cũ: hai bài khác nhau, đem lịch sử bài trước sang bài
    // sau sẽ khiến model trộn nội dung và trích nhầm mục.
    S.thread = S.thread.filter(m => m.doc === e.target.value);
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
