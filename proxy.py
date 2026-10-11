#!/usr/bin/env python3
"""
LEPU CSDL Tutor — AI proxy.

Giu key 9Router o server. Client browser goi proxy nay, proxy goi 9Router
(127.0.0.1:20128) voi model oc/space-bunny-free.

KHONG bao gio ghi key ra log, ra response body, hay ra loi.
Doc key tu file 600, fallback sang 9Router DB read-only.
"""
import json
import os
import re
import sqlite3
import sys
import time
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PORT = int(os.environ.get("PORT", "2020"))
BIND = os.environ.get("BIND", "127.0.0.1")
GATEWAY = os.environ.get("GATEWAY", "http://127.0.0.1:20128")
MODEL = os.environ.get("MODEL", "oc/space-bunny-free")
KEY_FILE = os.environ.get("KEY_FILE", "/home/bachhoang/.9router/csdl-tutor.key")
DB = os.environ.get("ROUTER_DB", "/home/bachhoang/.9router/db/data.sqlite")
KEY_NAME = os.environ.get("KEY_NAME", "csdl-tutor-public-preview")

# gioi han cung nhat: 12 req / 60 giay / 1 IP
RATE_MAX = int(os.environ.get("RATE_MAX", "12"))
RATE_WINDOW = int(os.environ.get("RATE_WINDOW", "60"))
_hits = {}

MAX_BODY = 1_500_000  # 1.5 MB: bai CSDL 85 KB + lich su hoi thoại
MAX_Q = 12           # so luot hoi gan nhat gui len model
MAX_HISTORY_CHARS = 12000


def load_key() -> str:
    try:
        with open(KEY_FILE) as f:
            k = f.read().strip()
            if k.startswith("sk-"):
                return k
    except OSError:
        pass
    try:
        con = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)
        row = con.execute("SELECT key FROM apiKeys WHERE name=?", (KEY_NAME,)).fetchone()
        con.close()
        if row and row[0]:
            return row[0]
    except sqlite3.Error:
        pass
    return ""


KEY = load_key()


def rate_ok(ip: str) -> bool:
    now = time.time()
    window = [t for t in _hits.get(ip, []) if now - t < RATE_WINDOW]
    if len(window) >= RATE_MAX:
        _hits[ip] = window
        return False
    window.append(now)
    _hits[ip] = window
    return True


def clean_history(messages: list) -> list:
    """Giu lai it nhat MAX_Q luot gan nhat, cat boi san cho phong context."""
    out = []
    for m in messages[-MAX_Q:]:
        role = m.get("role") if isinstance(m, dict) else None
        content = m.get("content") if isinstance(m, dict) else None
        if role not in ("user", "assistant") or not isinstance(content, str):
            continue
        if len(content) > MAX_HISTORY_CHARS:
            content = content[:MAX_HISTORY_CHARS] + "\n…"
        out.append({"role": role, "content": content})
    return out


SYSTEM = """Bạn là Gia sư CSDL của sinh viên Đại học Điện lực (EPU), đang ôn môn Cơ sở dữ liệu.

NGUỒN SỰ THẬT
- Chỉ dựa vào TÀI LIỆU ĐƯỢC CUNG CẤP trong phần <tai_lieu> của tin nhắn người dùng.
- Tài liệu là nguồn sự thật duy nhất. Không dùng kiến thức ngoài tài liệu để khẳng định nội dung môn học.
- Nếu tài liệu không đủ để trả lời, nói rõ: "Tài liệu hiện tại chưa đề cập phần này" rồi gợi ý câu hỏi nên xem ở mục nào.

CÁCH TRẢ LỜI
- Trả lời bằng tiếng Việt, đúng giọng với sinh viên năm 3.
- Giảng giải, không chỉ đưa đáp án. Nếu hỏi "tại sao" thì giải thích cơ chế, không lặp lại khẳng định.
- Dẫn dẫn bằng cấu trúc: mốc mục -> công thức -> ví dụ trong tài liệu -> lỗi hay gặp.
- Trích dẫn cụ thể khi dẫn ("mục 6.3", "bảng ở Phụ lục A"), để học sinh tự tra.
- Khi viết SQL: luôn dùng SQL Server, luôn có GO giữa các khối, chuỗi tiếng Việt có N'...'.
- Ưu tiên giải thích ngắn gọn rồi mới mở rộng. Không dồn một khối dài không tiêu đề.
- Nếu câu hỏi mơ hồ, hỏi lại đúng một câu cụ thể thay vì đoán.

TUYỆT ĐỐI KHÔNG
- Không bịa số liệu, không tự tạo ví dụ ngẫu nhiên rồi gọi là kết quả trong tài liệu.
- Nếu chưa chạy kiểm tra thì không nói "đã kiểm chứng".
- Không trả lời câu ngoài phạm vi môn CSDL nếu không liên quan."""


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    server_version = "LEPU-CSDL-Tutor/1.0"

    def log_message(self, fmt, *args):
        sys.stderr.write("[%s] %s\n" % (time.strftime("%H:%M:%S"), fmt % args))

    def _json(self, code: int, payload: dict):
        body = json.dumps(payload, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.startswith("/health"):
            ok = bool(KEY)
            self._json(200 if ok else 503, {
                "ok": ok,
                "model": MODEL,
                "key_loaded": ok,
                "gateway": GATEWAY,
            })
            return
        self._json(404, {"error": "not_found"})

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Max-Age", "86400")
        self.end_headers()

    def do_POST(self):
        if not self.path.startswith("/chat"):
            self._json(404, {"error": "not_found"})
            return
        if not KEY:
            self._json(503, {"error": "key_unavailable",
                             "message": "Chưa cấu hình key. Xem README."})
            return
        ip = self.client_address[0]
        if not rate_ok(ip):
            self._json(429, {"error": "rate_limited",
                             "message": "Quá nhiều câu hỏi. Chờ một lát rồi thử lại."})
            return

        try:
            n = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            n = 0
        if n <= 0 or n > MAX_BODY:
            self._json(413, {"error": "bad_size",
                             "message": "Nội dung gửi lên quá lớn."})
            return
        try:
            req = json.loads(self.rfile.read(n).decode())
        except (ValueError, UnicodeDecodeError):
            self._json(400, {"error": "bad_json"})
            return

        source = req.get("source")
        if not isinstance(source, str) or len(source) < 200:
            self._json(400, {"error": "missing_source",
                             "message": "Thiếu tài liệu bài học."})
            return

        history = clean_history(req.get("messages") or [])
        question = history[-1]["content"] if history else ""
        if not question.strip():
            self._json(400, {"error": "empty_question"})
            return

        prompt = (
            "<tai_lieu>\n" + source.strip() + "\n</tai_lieu>\n\n"
            "<cau_hoi>\n" + question.strip() + "\n</cau_hoi>"
        )
        messages = [{"role": "system", "content": SYSTEM},
                    {"role": "user", "content": prompt}]
        # them lich su vao truoc cau hoi cuoi
        messages.extend(history[:-1])
        messages.append({"role": "user", "content": prompt})

        payload = json.dumps({
            "model": MODEL,
            "messages": messages,
            "stream": False,
            "max_tokens": 1400,
            "temperature": 0.3,
        }).encode()

        try:
            gq = urllib.request.Request(
                GATEWAY + "/v1/chat/completions", data=payload,
                headers={"Authorization": "Bearer " + KEY,
                         "Content-Type": "application/json"})
            with urllib.request.urlopen(gq, timeout=120) as r:
                raw = r.read()
        except urllib.error.HTTPError as e:
            self.log_message("gateway HTTP %s", e.code)
            self._json(502, {"error": "gateway_error",
                             "message": "Không gọi được mô hình. Thử lại sau."})
            return
        except Exception as e:  # noqa: BLE001
            self.log_message("gateway fail: %s", type(e).__name__)
            self._json(502, {"error": "gateway_unreachable",
                             "message": "Không gọi được mô hình. Thử lại sau."})
            return

        text = extract_text(raw)
        if not text:
            self._json(502, {"error": "empty_response",
                             "message": "Mô hình trả về rỗng. Thử lại."})
            return
        self._json(200, {"answer": text, "model": MODEL})


def extract_text(raw: bytes) -> str:
    """
    9Router thuong tra ve JSON, nhung co luc tra SSE body hoac nhieu object
    noi tiep. Phai parse phong truong: doc tu dau, bo qua tien to data:.
    """
    s = raw.decode("utf-8", errors="replace")
    if s.lstrip().startswith("data:"):
        parts = []
        for line in s.splitlines():
            line = line.strip()
            if not line.startswith("data:"):
                continue
            body = line[5:].strip()
            if body in ("", "[DONE]"):
                continue
            try:
                obj = json.loads(body)
            except ValueError:
                continue
            parts.append(delta_text(obj))
        return "".join(p for p in parts if p).strip()

    dec = json.JSONDecoder()
    idx, chunks = 0, []
    while idx < len(s):
        m = re.search(r"[{\[]", s[idx:])
        if not m:
            break
        start = idx + m.start()
        try:
            obj, end = dec.raw_decode(s, start)
        except ValueError:
            break
        chunks.append(delta_text(obj))
        idx = end
    return "".join(c for c in chunks if c).strip()


def delta_text(obj) -> str:
    """Lay noi dung text tu ca object chat.completion va chunk."""
    if not isinstance(obj, dict):
        return ""
    out = []
    for choice in obj.get("choices") or []:
        if not isinstance(choice, dict):
            continue
        msg = choice.get("message") or {}
        content = msg.get("content") if isinstance(msg, dict) else None
        if isinstance(content, str):
            out.append(content)
        delta = choice.get("delta") or {}
        if isinstance(delta, dict) and isinstance(delta.get("content"), str):
            out.append(delta["content"])
    return "".join(out)


if __name__ == "__main__":
    if not KEY:
        sys.stderr.write("WARNING: khong tim thay key, /health se tra 503\n")
    srv = ThreadingHTTPServer((BIND, PORT), Handler)
    srv.daemon_threads = True
    sys.stderr.write("LEPU CSDL Tutor proxy tren %s:%d, model %s\n" % (BIND, PORT, MODEL))
    sys.stderr.flush()
    srv.serve_forever()
