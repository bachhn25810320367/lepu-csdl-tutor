# LỜI GIẢI CHI TIẾT 43 CÂU — ĐỀ 1, ĐỀ 2, ĐỀ 3

> **Chiến dịch tiến công 43 ải:** Valhein và Violet cùng trải tấm sa bàn quân sự trải dài 43 cứ điểm phòng thi thực hành EPU. Mỗi câu hỏi là một cạm bẫy phục kích (từ bẫy mất dòng, bẫy đếm trùng đến bẫy subquery tự biến). Hai chiến binh phối hợp nhuần nhuyễn giải mã từng ải một cách triệt để!

![Hình 4.1: Valhein và Violet bàn chiến thuật trước sa bàn 43 cứ điểm phòng thi EPU](assets/media/csdl/valhein_violet/b04_01.jpg)

Mọi bảng kết quả dưới đây **đã chạy thật** trên dữ liệu mẫu của đề, không phải
tự tính tay. Script kiểm chứng:

```
/home/bachhoang/sql_kiem_chung/giai_de12.py    — đề 1 (11 câu) + đề 2 (16 câu)
/home/bachhoang/sql_kiem_chung/giai_de23.py    — đề 2 câu 12–16, đề 3 câu 2,3,5,12–16
/home/bachhoang/sql_kiem_chung/giai_de3b.py    — đề 3 câu 4, 6–11, 16
/home/bachhoang/sql_kiem_chung/run_de4.py      — đề 4 (lập trình CSDL)
```

Dữ liệu mẫu: 4 khoa, 7 lớp, 10 sinh viên, 8 môn, 26 dòng điểm, 8 sách, 5 độc giả,
6 phiếu mượn.

---

## ĐỀ 1 — 11 câu

Lược đồ: `KHOA / LOP / SINHVIEN / MONHOC / KETQUA`.

### Câu 1 — Môn có số tiết từ 30 đến 90

```sql
SELECT MAMH, TENMH, SOTIET FROM MONHOC
WHERE SOTIET BETWEEN 30 AND 90
ORDER BY MAMH;
```

| MAMH | TENMH | SOTIET |
|---|---|---|
| MH01 | HQTCSDL | 45 |
| MH02 | Cơ sở dữ liệu | 60 |
| MH03 | Lập trình C | 90 |
| MH04 | Giải tích 1 | 30 |
| MH05 | Mạng máy tính | 75 |
| MH07 | Lập trình C | 45 |
| MH08 | HEQTCSDL | 40 |

`MH06` bị loại vì 20 tiết, nằm ngoài khoảng. `BETWEEN` gồm cả hai đầu mốc nên
`30` và `90` vẫn còn — đó là lý do có cả `MH04` (30) và `MH03` (90).

### Câu 2 — Sinh viên lớp D16CNPM2 có điểm từ 6 đến 8

```sql
SELECT DISTINCT sv.MASV, sv.HOTEN
FROM SINHVIEN sv JOIN KETQUA k ON k.MASV = sv.MASV
WHERE sv.MALOP = 'D16CNPM2' AND k.DIEM BETWEEN 6 AND 8
ORDER BY sv.MASV;
```

| MASV | HOTEN |
|---|---|
| SV001 | Nguyễn Văn An |
| SV002 | Trần Thị Bình |
| SV003 | Nguyễn Văn An |

`DISTINCT` bắt buộc: một sinh viên học nhiều môn thì ra nhiều dòng, mà đề chỉ hỏi
"danh sách sinh viên". Thiếu `DISTINCT` là lỗi hay gặp nhất ở dạng này.

### Câu 3 — Tên môn dưới 60 tiết do sinh viên khoa K01 học

![Hình 4.2: Violet dùng kính thần xóa tan 4 phân thân trùng lặp của Valhein (Bùa lọc trùng DISTINCT)](assets/media/csdl/valhein_violet/b04_02.jpg)

```sql
SELECT DISTINCT m.TENMH
FROM MONHOC m
JOIN KETQUA  k ON k.MAMH  = m.MAMH
JOIN SINHVIEN sv ON sv.MASV = k.MASV
JOIN LOP l       ON l.MALOP = sv.MALOP
WHERE l.MAKHOA = 'K01' AND m.SOTIET < 60
ORDER BY m.TENMH;
```

| TENMH |
|---|
| Giải tích 1 |
| HEQTCSDL |
| HQTCSDL |
| Lập trình C |
| Trí tuệ nhân tạo |

Nối 4 bảng cần **3 điều kiện khớp** (quy tắc N−1). `Lập trình C` xuất hiện một lần dù
có hai mã `MH03` và `MH07` — vì `DISTINCT` gộp theo tên. Nếu đề hỏi "mã môn" thì phải
`SELECT DISTINCT m.MAMH` và sẽ ra hai dòng.

### Câu 4 — Sinh viên khoa K01 học HQTCSDL điểm dưới 5

```sql
SELECT DISTINCT sv.MASV, sv.HOTEN
FROM SINHVIEN sv
JOIN LOP l      ON l.MALOP = sv.MALOP
JOIN KETQUA k   ON k.MASV  = sv.MASV
JOIN MONHOC m   ON m.MAMH  = k.MAMH
WHERE l.MAKHOA = 'K01' AND m.TENMH = 'HQTCSDL' AND k.DIEM < 5
ORDER BY sv.MASV;
```

**Kết quả: 0 dòng.**

Đây không phải lỗi. Trong dữ liệu mẫu, sinh viên duy nhất có điểm `HQTCSDL` dưới 5 là
`SV007` (4.5), nhưng `SV007` học lớp `D16CKMAT2` thuộc khoa `K03`, không phải `K01`.
Kết quả rỗng là đúng.

Khi gặp 0 dòng, đừng vội sửa câu lệnh. Kiểm tra lại từng điều kiện một:

```sql
SELECT MASV, DIEM FROM KETQUA WHERE MAMH='MH01' AND DIEM < 5;   -- SV007, 4.5
SELECT MALOP FROM SINHVIEN WHERE MASV='SV007';                  -- D16CKMAT2
SELECT MAKHOA FROM LOP WHERE MALOP='D16CKMAT2';                 -- K03
```

Ba truy vấn này cho thấy điều kiện nào lọc mất dòng.

### Câu 5 — Tên khoa và số lớp, trong từng khoa

![Hình 4.3: Violet bắn dây neo giữ căn cứ khoa không bị trượt xuống vực thẳm (Bẫy INNER JOIN vs LEFT JOIN)](assets/media/csdl/valhein_violet/b04_03.jpg)

```sql
SELECT k.TENKHOA, COUNT(l.MALOP) AS SoLop
FROM KHOA k LEFT JOIN LOP l ON l.MAKHOA = k.MAKHOA
GROUP BY k.MAKHOA, k.TENKHOA
ORDER BY k.MAKHOA;
```

| TENKHOA | SoLop |
|---|---|
| Công nghệ thông tin | 4 |
| Kế toán | 1 |
| Cơ khí | 2 |
| Điện tử | 0 |

Ba điều kiện phải đúng cùng lúc:

- `LEFT JOIN` — giữ khoa không có lớp (`Điện tử` có 0 lớp)
- `COUNT(l.MALOP)` — đếm cột **của bảng phải**. `COUNT(*)` sau `LEFT JOIN` luôn ≥ 1
- `GROUP BY k.MAKHOA, k.TENKHOA` — gom theo mã khoa, kèm tên để hiển thị

### Câu 6 — Sinh viên học trên 3 môn

```sql
SELECT sv.MASV, sv.HOTEN
FROM SINHVIEN sv JOIN KETQUA k ON k.MASV = sv.MASV
GROUP BY sv.MASV, sv.HOTEN
HAVING COUNT(*) > 3
ORDER BY sv.MASV;
```

| MASV | HOTEN |
|---|---|
| SV001 | Nguyễn Văn An |

"**trên** 3 môn" là `> 3`, tức từ 4 môn trở lên. Đáp án đề gốc dùng `>= 3` — sai, vì
những sinh viên học đúng 3 môn cũng bị lấy vào. Trong dữ liệu mẫu chỉ `SV001` học 5 môn
nên hai cách khác nhau.

### Câu 7 — Khoa có ít nhất 3 lớp

![Hình 4.4: Valhein dẫn đội đúng 3 người vượt qua chốt kiểm tra an toàn (Bẫy ít nhất 3: >= 3 vs > 3)](assets/media/csdl/valhein_violet/b04_04.jpg)

```sql
SELECT k.TENKHOA FROM KHOA k JOIN LOP l ON l.MAKHOA = k.MAKHOA
GROUP BY k.MAKHOA, k.TENKHOA HAVING COUNT(*) >= 3;
```

| TENKHOA |
|---|
| Công nghệ thông tin |

**Đáp án đề gốc ghi `>= 2`, sai.** Đề hỏi "ít nhất 3 lớp" thì phải là `>= 3`. Với
`>= 2` sẽ ra 3 khoa thay vì 1.

Câu này là lỗi số 3 trong Phụ lục A. Chạy cả hai để thấy khác biệt:

```sql
-- sai: >= 2 → Cơ khí, Kế toán, Công nghệ thông tin
-- đúng: >= 3 → chỉ Công nghệ thông tin
```

### Câu 8 — Lớp có sĩ số thực ít nhất 3

```sql
SELECT l.MALOP, l.TENLOP
FROM LOP l JOIN SINHVIEN sv ON sv.MALOP = l.MALOP
GROUP BY l.MALOP, l.TENLOP HAVING COUNT(sv.MASV) >= 3;
```

| MALOP | TENLOP |
|---|---|
| D16CNPM2 | Công nghệ phần mềm 2 |

Chữ "**thực**" trong câu hỏi là gợi ý dùng `LEFT JOIN` để không bỏ sót lớp rỗng, rồi
chặn lớp rỗng ở `HAVING`:

```sql
SELECT l.MALOP, l.TENLOP, COUNT(sv.MASV) AS SiSo
FROM LOP l LEFT JOIN SINHVIEN sv ON sv.MALOP = l.MALOP
GROUP BY l.MALOP, l.TENLOP HAVING COUNT(sv.MASV) >= 3;
```

Cách này cho cùng kết quả nhưng đúng ý "sĩ số thực" và trả lời được câu hỏi biến thể
"liệt kê lớp kèm sĩ số".

### Câu 9 — Khoa có nhiều nhất sinh viên

```sql
SELECT k.TENKHOA
FROM KHOA k
LEFT JOIN LOP l      ON l.MAKHOA = k.MAKHOA
LEFT JOIN SINHVIEN sv ON sv.MALOP = l.MALOP
GROUP BY k.MAKHOA, k.TENKHOA
HAVING COUNT(sv.MASV) >= ALL (
    SELECT COUNT(sv2.MASV)
    FROM KHOA k2
    LEFT JOIN LOP l2      ON l2.MAKHOA = k2.MAKHOA
    LEFT JOIN SINHVIEN sv2 ON sv2.MALOP = l2.MALOP
    GROUP BY k2.MAKHOA);
```

| TENKHOA |
|---|
| Công nghệ thông tin |

Bẫy ở câu này: **không được viết `NOT EXISTS` hay `IN`, phải dùng `>= ALL`.** Vì
`K04 Điện tử` có 0 sinh viên, nếu dùng `MAX(...) = COUNT(...)` thì giá trị 0 có thể khớp
nhầm. `>= ALL` so sánh với **mọi** nhóm nên loại được nhóm 0.

Đếm bằng `COUNT(sv.MASV)` chứ không `COUNT(*)`: sau `LEFT JOIN` x2, một khoa không có
sinh viên vẫn ra đúng 1 dòng, và `COUNT(*)` sẽ đếm dòng đó thành 1.

### Câu 10 — Môn trên 30 tiết, có ít nhất 2 sinh viên học

```sql
SELECT m.MAMH, m.TENMH
FROM MONHOC m JOIN KETQUA k ON k.MAMH = m.MAMH
WHERE m.SOTIET > 30
GROUP BY m.MAMH, m.TENMH
HAVING COUNT(DISTINCT k.MASV) >= 2
ORDER BY m.MAMH;
```

| MAMH | TENMH |
|---|---|---|
| MH01 | HQTCSDL |
| MH02 | Cơ sở dữ liệu |
| MH03 | Lập trình C |
| MH05 | Mạng máy tính |
| MH08 | HEQTCSDL |

`WHERE m.SOTIET > 30` lọc **trước** khi gom nhóm — đúng chỗ. `COUNT(DISTINCT k.MASV)`
đếm số **người**, không phải số lượt. Trong dữ liệu mẫu mỗi SV học mỗi môn một lần
nên `COUNT(*)` và `COUNT(DISTINCT)` ra cùng kết quả, nhưng khi cấu trúc bảng khác thì
khác.

### Câu 11 — Môn có số tiết lớn nhất

```sql
SELECT MAMH, TENMH, SOTIET FROM MONHOC
WHERE SOTIET >= ALL (SELECT SOTIET FROM MONHOC);
```

| MAMH | TENMH | SOTIET |
|---|---|---|
| MH03 | Lập trình C | 90 |

Dùng `>= ALL` trả về **mọi** môn có số tiết lớn nhất. Nếu có hai môn cùng 90 tiết,
cả hai đều xuất hiện — đó mới đúng nghĩa "số tiết lớn nhất".

Cách sai, và bằng chứng:

```sql
SELECT MAMH, TENMH, SOTIET FROM MONHOC ORDER BY SOTIET DESC LIMIT 1;
-- trên dữ liệu mẫu cũng ra MH03 — nên dễ bị chấp nhận nhầm
```

Trong dữ liệu mẫu cả hai cách cho cùng kết quả, nhưng khi có hai môn bằng nhau thì
`LIMIT 1` chỉ lấy một và **bỏ mất** người còn lại. Xem mục 7.3.

---

## ĐỀ 2 — 16 câu

Câu 1–11 giống hệt đề 1, chỉ khác: câu 2 dùng lớp `D13TMDT`, câu 4 hỏi môn
`HEQTCSDL`, câu 6 hỏi "trên 5 môn", câu 10 hỏi "ít nhất 3 sinh viên". Chỉ ghi lời giải
những câu khác.

### Câu 4 — Sinh viên khoa K01 học HEQTCSDL điểm dưới 5

Đề ghi môn là `HEQTCSDL`. Trong dữ liệu mẫu có **cả hai**:

- `MH01` tên `HQTCSDL` — 6 sinh viên học
- `MH08` tên `HEQTCSDL` — 2 sinh viên học (chính là bản viết sai chính tả, cố ý)

Lọc `m.TENMH = 'HEQTCSDL'` sẽ khớp `MH08` chứ không phải `MH01`. Đáp án đề gốc dùng
`makhoa = 'cntt'` — sai mã (đề dùng `K01`) nên lọc ra 0 dòng.

**Đây là lỗi số 8 trong Phụ lục A: lỗi của đề, không phải của đáp án.**

### Câu 6 — Sinh viên học trên 5 môn

```sql
SELECT sv.MASV, sv.HOTEN FROM SINHVIEN sv JOIN KETQUA k ON k.MASV = sv.MASV
GROUP BY sv.MASV, sv.HOTEN HAVING COUNT(*) > 5;
```

**Kết quả: 0 dòng.** Trong dữ liệu mẫu sinh viên nhiều nhất học 5 môn (`SV001`), không
ai học trên 5. Đáp án đề gốc dùng `>= 5` thì ra `SV001` — sai, vì "trên 5" là `> 5`.

### Câu 12 — Sinh viên học nhiều môn nhất

```sql
SELECT sv.MASV, sv.HOTEN, COUNT(*) AS SoMon
FROM SINHVIEN sv JOIN KETQUA k ON k.MASV = sv.MASV
GROUP BY sv.MASV, sv.HOTEN
HAVING COUNT(*) >= ALL (SELECT COUNT(*) FROM KETQUA GROUP BY MASV)
ORDER BY sv.MASV;
```

| MASV | HOTEN | SoMon |
|---|---|---|
| SV001 | Nguyễn Văn An | 5 |

Subquery phải có `GROUP BY MASV` riêng. Không có nó thì subquery chỉ trả một số duy nhất
và `>= ALL` trở thành so sánh với chính mình — luôn đúng, mọi sinh viên đều lọt.

### Câu 13 — Môn có nhiều sinh viên học nhất

```sql
SELECT m.MAMH, m.TENMH, COUNT(DISTINCT k.MASV) AS SoSV
FROM MONHOC m JOIN KETQUA k ON k.MAMH = m.MAMH
GROUP BY m.MAMH, m.TENMH
HAVING COUNT(DISTINCT k.MASV) >= ALL (
    SELECT COUNT(DISTINCT MASV) FROM KETQUA GROUP BY MAMH)
ORDER BY m.MAMH;
```

| MAMH | TENMH | SoSV |
|---|---|---|
| MH01 | HQTCSDL | 6 |

Phải gom theo `MAMH` ở cả hai vế. Đáp án đề gốc gom ngoài theo tên môn, trong theo mã
môn — hai bộ khác nhau nên kết quả sai.

### Câu 14 — Sinh viên nữ có điểm trung bình cao nhất

![Hình 4.5: Violet đội vòng nguyệt quế thủ khoa nữ có điểm trung bình cao nhất (GIOITINH = N'Nữ' AND AVG(Diem))](assets/media/csdl/valhein_violet/b04_05.jpg)

```sql
SELECT SV.MASV, SV.HOTEN
FROM SINHVIEN SV JOIN KETQUA KQ ON KQ.MASV = SV.MASV
WHERE SV.GIOITINH = 'Nu'
GROUP BY SV.MASV, SV.HOTEN
HAVING AVG(KQ.DIEM) >= ALL (
    SELECT AVG(KQ2.DIEM)
    FROM SINHVIEN SV2 JOIN KETQUA KQ2 ON KQ2.MASV = SV2.MASV
    WHERE SV2.GIOITINH = 'Nu'
    GROUP BY SV2.MASV);
```

**Kết quả trên dữ liệu mẫu: 0 dòng.** Lý do: dữ liệu ghi giới tính bằng `'Nữ'` (có dấu).
Chuỗi không có dấu không khớp chuỗi có dấu.

Đây là bài học thật về kiểu dữ liệu (mục 2.2): khi so sánh chuỗi tiếng Việt trong SQL
Server phải viết `N'...'` và dùng **đúng** chính tả trong dữ liệu.

Đáp án đề gốc viết `gioitinh='nu'` không có dấu, và thêm một lỗi nữa: dùng chung tên bảng
không alias, biến thành subquery tự biến. Sửa cả hai thì câu này trả về đúng
`SV004 Lê Thị Dung` (điểm TB 9.75, cao nhất trong các sinh viên nữ).

### Câu 15 — Môn chưa có sinh viên học

![Hình 4.6: Violet mở rương cổ thư chứa bí kíp chưa từng ai theo học (NOT IN / NOT EXISTS)](assets/media/csdl/valhein_violet/b04_06.jpg)

```sql
SELECT m.MAMH, m.TENMH FROM MONHOC m
WHERE NOT EXISTS (SELECT 1 FROM KETQUA k WHERE k.MAMH = m.MAMH)
ORDER BY m.MAMH;
```

**Kết quả: 0 dòng.** Cả 8 môn đều có ít nhất một sinh viên học — đúng với dữ liệu mẫu.
Câu này hỏi "chưa có" nên đáp án rỗng là hợp lệ, không phải là làm sai.

Muốn kiểm chứng câu hỏi có đúng không, chạy ngược lại:

```sql
SELECT m.MAMH, COUNT(k.MASV) AS SoSV FROM MONHOC m
LEFT JOIN KETQUA k ON k.MAMH = m.MAMH GROUP BY m.MAMH ORDER BY SoSV;
```

### Câu 16 — Đếm sinh viên theo lớp

```sql
SELECT l.MALOP, l.TENLOP, COUNT(sv.MASV) AS SoSV
FROM LOP l LEFT JOIN SINHVIEN sv ON sv.MALOP = l.MALOP
GROUP BY l.MALOP, l.TENLOP ORDER BY l.MALOP;
```

| MALOP | TENLOP | SoSV |
|---|---|---|
| D13TMDT | D13TMDT | 2 |
| D16CKMAT2 | Cơ khí 2 | 1 |
| D16CNPM2 | Công nghệ phần mềm 2 | 4 |
| D16CNPM3 | Kỹ thuật phần mềm 3 | 0 |
| D16KTMT1 | Kế toán 1 | 1 |
| D17CKMAT1 | Cơ khí 1 | 1 |
| D17CNPM1 | Công nghệ phần mềm 1 | 1 |

`LEFT JOIN` + `COUNT(sv.MASV)` giữ lớp `D16CNPM3` không có sinh viên, số đếm là 0.
Dùng `INNER JOIN` thì lớp này biến mất.

---

## ĐỀ 3 — 16 câu

Lược đồ thư viện: `SACH / DOCGIA / PHIEUMUON / CTPHIEUMUON`.

### Câu 4 — Sách được mượn ngày 20/11/2023

```sql
SELECT DISTINCT s.MASACH, s.TENSACH
FROM PHIEUMUON p
JOIN CTPHIEUMUON c ON c.MAPM = p.MAPM
JOIN SACH s ON s.MASACH = c.MASACH
WHERE p.NGAYMUON = '2023-11-20'
ORDER BY s.MASACH;
```

| MASACH | TENSACH |
|---|---|
| S01 | Lập trình C |
| S02 | Cơ sở dữ liệu |
| S03 | Giải tích 1 |
| S04 | Dế Mèn phiêu lưu ký |
| S05 | Truyện cổ tích Việt Nam |
| S08 | Lập trình C++ |

`DISTINCT` bắt buộc: một phiếu mượn có thể chứa nhiều cuốn, và cùng một cuốn có thể
được mượn ở nhiều phiếu cùng ngày.

### Câu 5 — Tổng số sách mượn ngày 20/11/2023

Hai cách cho hai con số khác nhau:

```sql
-- TỔNG SỐ CUỐN
SELECT SUM(c.SOLUONG) AS TongSoCuon
FROM PHIEUMUON p JOIN CTPHIEUMUON c ON c.MAPM = p.MAPM
WHERE p.NGAYMUON = '2023-11-20';
-- → 11

-- SỐ LƯỢT MƯỢN
SELECT COUNT(*) AS SoLuot FROM PHIEUMUON WHERE NGAYMUON = '2023-11-20';
-- → 3
```

Đề ghi "tổng số sách" nên lấy **11**. Nhưng tài liệu ghi cả hai cách vì đề không phân
định rõ. Nếu giảng viên hỏi, đáp án là `SUM` — "cuốn" là đơn vị của `SOLUONG`.

### Câu 10 — Độc giả mượn nhiều sách nhất

```sql
SELECT p.MADG, d.HOTEN, SUM(c.SOLUONG) AS TongSoCuon
FROM CTPHIEUMUON c
JOIN PHIEUMUON p ON p.MAPM = c.MAPM
JOIN DOCGIA d ON d.MADG = p.MADG
GROUP BY p.MADG, d.HOTEN
HAVING SUM(c.SOLUONG) >= ALL (
    SELECT SUM(SOLUONG) FROM CTPHIEUMUON c2
    JOIN PHIEUMUON p2 ON p2.MAPM = c2.MAPM
    GROUP BY p2.MADG)
ORDER BY p.MADG;
```

| MADG | HOTEN | TongSoCuon |
|---|---|---|
| DG01 | Nguyễn Văn An | 9 |

Phải nối 3 bảng: `CTPHIEUMUON` không có cột `MADG`, chỉ có `MAPM`. Muốn biết ai mượn
phải đi qua `PHIEUMUON`.

### Câu 11 — Độc giả mượn trên 3 cuốn

```sql
... HAVING SUM(c.SOLUONG) > 3;
```

| MADG | HOTEN | N |
|---|---|---|
| DG01 | Nguyễn Văn An | 9 |
| DG04 | Phạm Thị Dung | 4 |

"trên 3" là `> 3`, không phải `>= 3`.

### Câu 15 — Độc giả không ở Hà Nội (câu bẫy NULL)

![Hình 4.7: Valhein chiếu hào quang kép gom cả lính ngoại tỉnh và lính vô danh ẩn náu trong sương (Bẫy NULL trong NOT EQUAL)](assets/media/csdl/valhein_violet/b04_07.jpg)

Ba cách viết, ba kết quả khác nhau:

```sql
-- Cách 1: NOT LIKE — BỎ SÓT dòng NULL
SELECT MADG, HOTEN FROM DOCGIA WHERE DIACHI NOT LIKE '%Hà Nội%';
-- → DG03, DG04.  DG05 (DIACHI = NULL) biến mất.
```

```sql
-- Cách 2: thêm OR IS NULL
SELECT MADG, HOTEN, DIACHI FROM DOCGIA
WHERE DIACHI NOT LIKE '%Hà Nội%' OR DIACHI IS NULL;
-- → DG03, DG04, DG05
```

```sql
-- Cách 3: NOT EXISTS — an toàn, không cần nghĩ về NULL
SELECT d.MADG, d.HOTEN, d.DIACHI FROM DOCGIA d
WHERE NOT EXISTS (SELECT 1 FROM DOCGIA d2
                  WHERE d2.DIACHI LIKE '%Hà Nội%' AND d2.MADG = d.MADG);
-- → DG03, DG04, DG05
```

| MADG | HOTEN | DIACHI |
|---|---|---|
| DG03 | Lê Văn Chiến | Hải Phòng |
| DG04 | Phạm Thị Dung | Đà Nẵng |
| DG05 | Hoàng Minh Em | NULL |

Đây là bằng chứng cụ thể cho bẫy `NOT LIKE` ở mục 8.3: `NULL` không chứa chuỗi nào
nên `NOT LIKE` trả `UNKNOWN`, dòng đó bị loại **không có báo lỗi nào**.

### Câu 16 — Sách không do NXB Giáo dục xuất bản

| MASACH | TENSACH | NXB | NAMXB |
|---|---|---|---|
| S04 | Dế Mèn phiêu lưu ký | Nhà xuất bản Kim Đồng | 2022 |
| S05 | Truyện cổ tích Việt Nam | Nhà xuất bản Kim Đồng | 2020 |
| S06 | Đắc nhân tâm | Nhà xuất bản Tổng hợp | 2019 |
| S07 | Mạng máy tính | Nhà xuất bản Bách khoa | 2022 |

Thiếu chữ `N` ở `N'Nhà xuất bản Giáo dục'` là lỗi hay gặp nhất ở câu này.

---

> **Vinh quang Dũng Sĩ:** Sau khi giải mã thành công toàn bộ 43 câu hỏi hóc búa, Valhein và Violet cùng nâng cao chiếc Cúp Quán Quân SQL Server trên đỉnh thành lũy!

![Hình 4.8: Valhein và Violet nâng cúp vô địch Dũng Sĩ SQL Server vượt trọn 43 ải phòng thi](assets/media/csdl/valhein_violet/b04_08.jpg)

## Tổng kết: 5 câu trong 43 câu cho kết quả rỗng hoặc bất ngờ

| Câu | Kết quả | Vì sao |
|---|---|---|
| Đ1 C4 | 0 dòng | SV007 điểm thấp nhưng ở khoa K03, không phải K01 |
| Đ1 C6 | chỉ 1 SV | "trên 3 môn" = `> 3`, đáp án đề gốc dùng `>= 3` |
| Đ1 C7 | chỉ 1 khoa | đề ghi `>= 2`, đúng phải là `>= 3` |
| Đ2 C6 | 0 dòng | "trên 5 môn", không ai học quá 5 môn |
| Đ2 C14 | 0 dòng | dữ liệu ghi `Nữ` có dấu, đáp án so sánh `'nu'` không dấu |
| Đ2 C15 | 0 dòng | cả 8 môn đều có sinh viên học — đáp án rỗng là đúng |
| Đ3 C15 | mất 1 dòng | `NOT LIKE` không trả về dòng `DIACHI = NULL` |

**Bài học:** kết quả 0 dòng **không phải** tín hiệu làm sai. Trước khi sửa câu lệnh,
chạy từng điều kiện riêng để xem dữ liệu thật. Nếu đúng là phải rỗng, ghi rõ lý do
vào bài — có khi đó là điểm cộng vì bạn hiểu dữ liệu.