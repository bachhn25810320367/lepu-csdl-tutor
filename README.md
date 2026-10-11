# LEPU · Gia sư CSDL

Trang học Cơ sở dữ liệu EPU: **đọc bài bên trái (2/3), hỏi gia sư AI bên phải (1/3).**
AI chỉ trả lời dựa trên bài học đang mở — không dùng kiến thức ngoài tài liệu.

---

## Kiến trúc

```
Trình duyệt (GitHub Pages, static)
  ├── index.html + assets/app.css + js/app.js      giao diện
  ├── data/01-khai-niem.md                          bài 1
  ├── data/02-on-thi-may.md                         bài 2
  └── fetch() → proxy /chat  ──────────────────┐
                                                  │
VPS Debian                                        │
  proxy.py  (127.0.0.1:2020)  ◀──────────────────┘
    │  giữ key trên server, KHÔNG nhúng key vào JS
    ▼
  9Router  (127.0.0.1:20128)
    └── oc/space-bunny-free
```

**Vì sao phải có proxy:** GitHub Pages là static, trình duyệt không gọi được
`127.0.0.1` của VPS. Nếu nhúng API key vào `js/app.js` thì key đó nằm trong repo
và ai cũng đọc được. Proxy giữ key ở server.

---

## Chạy proxy

```bash
python3 proxy.py          # hoặc: PORT=2020 python3 proxy.py
```

Biến môi trường:

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `PORT` | `2020` | Cổng lắng nghe |
| `BIND` | `127.0.0.1` | Chỉ loopback — KHÔNG đổi nếu chưa có reverse proxy có auth |
| `GATEWAY` | `http://127.0.0.1:20128` | Địa chỉ 9Router |
| `MODEL` | `oc/space-bunny-free` | Model dùng cho gia sư |
| `KEY_FILE` | `~/.9router/csdl-tutor.key` | File chứa key (mode 600) |
| `RATE_MAX` / `RATE_WINDOW` | `12` / `60` | Giới hạn 12 request / 60 giây / IP |

### Endpoint

- `GET /health` → `{"ok":true,"model":"oc/space-bunny-free","key_loaded":true}`
- `POST /chat` → `{"source":"<nội dung bài học>","messages":[{"role":"user","content":"câu hỏi"}]}`
  trả `{"answer":"...","model":"oc/space-bunny-free"}`

### Chạy như service (systemd)

```bash
sudo tee /etc/systemd/system/lepu-csdl-tutor.service > /dev/null <<'EOF'
[Unit]
Description=LEPU CSDL Tutor AI proxy
After=network.target 9router.service

[Service]
Type=simple
User=bachhoang
WorkingDirectory=/home/bachhoang/lepu-csdl-tutor
ExecStart=/usr/bin/python3 /home/bachhoang/lepu-csdl-tutor/proxy.py
Environment=PORT=2020
Restart=always
RestartSec=3
MemoryMax=120M
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now lepu-csdl-tutor.service
systemctl is-active lepu-csdl-tutor.service
```

---

## Đưa lên GitHub Pages

```bash
cd /home/bachhoang/lepu-csdl-tutor
git init && git add -A && git commit -m "LEPU CSDL Tutor"
git remote add origin git@github.com:<owner>/<repo>.git
git push -u origin main
```

Rồi bật Pages qua API (source = branch `main`, path `/`).

### Bật AI trên bản deploy

Mặc định `CONFIG.aiEndpoint` trong `js/app.js` là `http://127.0.0.1:2020` — chỉ chạy
trên máy của bạn. Để bản public gọi được, sửa thành endpoint public của proxy và
**đặt proxy sau reverse proxy có auth** (Caddy/nginx + basic auth hoặc Cloudflare
Access). Không mở `BIND=0.0.0.0` cho proxy không có auth — nó tiêu tốn model
của bạn và ai cũng hỏi được.

Nếu chỉ muốn xem giao diện (không cần AI), đặt:

```js
aiEndpoint: ''      // AI tắt, hiện thông báo "AI đang tắt"
```

---

## API key

Key nằm trong SQLite của 9Router (`apiKeys`), tên `csdl-tutor-public-preview`, và
đã bị giới hạn **chỉ cho phép model `oc/space-bunny-free`**.

Xác minh giới hạn đang hoạt động:

```bash
# model được phép → 200
# model khác → 403 "This API key is not allowed to use model ..."
```

Key **không** nằm trong repo này. `proxy.py` đọc từ `KEY_FILE`, fallback sang
SQLite read-only.

---

## Bổ sung bài học mới

1. Thêm `.md` vào `data/`
2. Thêm entry vào mảng `DOCS` trong `js/app.js`
3. Thêm câu hỏi gợi ý vào `SUGGESTS` trong `js/app.js` (cùng `id` bài)
4. Bump `VER` trong `js/app.js` và `?v=` trong `index.html`

Markdown renderer hỗ trợ: tiêu đề, bảng, code block (kèm nút sao chép), danh sách,
blockquote, `**đậm**`, `*nghiêng*`, `` `code` ``, link nội bộ (`[x](#muc)`) để nhảy
mục. HTML thô được escape — không render.

---

## Ghi chú bảo mật

- `innerHTML` chỉ dùng với nội dung đã qua `esc()`; link chỉ cho phép
  `http/https/mailto` (chặn `javascript:` và `data:`).
- Placeholder code inline dùng ký tự `\u0000` nên nội dung do AI trả về không thể
  chèn `<code>` giả.
- Proxy không bao giờ trả key ra response hay log.
- Rate limit 12 req / 60 giây / IP.
