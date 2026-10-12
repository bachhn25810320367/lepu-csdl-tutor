# CƠ SỞ DỮ LIỆU — ÔN THI MÁY (SQL Server)

> Bản viết lại từ đề thi các khóa trước. Chuẩn duy nhất: **SQL Server (SSMS)**.
> Mọi kết quả trong file này đã chạy thật trên dữ liệu mẫu, không có con số bịa.
> Bỏ hẳn phần lý thuyết phụ thuộc hàm ra phụ lục vì 3 đề đã đọc không hỏi phần đó.

---

## MỤC LỤC

1. [1. Đề thi trông thế nào](#1-đề-thi-trông-thế-nào)
2. [2. Bộ dữ liệu mẫu (dùng cho mọi ví dụ)](#2-bộ-dữ-liệu-mẫu-dùng-cho-mọi-ví-dụ)
3. [3. Bảng đọc đề: từ khóa trong đề → SQL](#3-bảng-đọc-đề-từ-khóa-trong-đề-sql)
4. [4. Dạng 1 — Lọc một bảng](#4-dạng-1-lọc-một-bảng)
5. [5. Dạng 2 — Nối bảng](#5-dạng-2-nối-bảng)
6. [6. Dạng 3 — Gom nhóm và đếm](#6-dạng-3-gom-nhóm-và-đếm)
7. [7. Dạng 4 — So sánh với giá trị lớn nhất](#7-dạng-4-so-sánh-với-giá-trị-lớn-nhất)
8. [8. Dạng 5 — Loại trừ](#8-dạng-5-loại-trừ)
9. [9. Dạng 6 — Lập trình CSDL: ràng buộc, procedure, trigger, backup](#9-dạng-6-lập-trình-csdl-ràng-buộc-procedure-trigger-backup)
10. [10. Đề 3 — Lời giải đầy đủ](#10-đề-3-lời-giải-đầy-đủ)
11. [11. Bản đồ 43 câu của 3 đề + 6 câu đề 4 → dạng đã học](#11-bản-đồ-43-câu-của-3-đề--6-câu-đề-4--dạng-đã-học)
12. [12. Đọc câu hỏi như thế nào — bốn bước tách SQL ra khỏi câu tiếng Việt](#12-đọc-câu-hỏi-như-thế-nào-bốn-bước-tách-sql-ra-khỏi-câu-tiếng-việt)
13. [13. Quy trình làm bài trên máy](#13-quy-trình-làm-bài-trên-máy)
14. [Phụ lục A — 8 lỗi thật trong đề gốc](#phụ-lục-a-8-lỗi-thật-trong-đề-gốc)
15. [Phụ lục B — Phụ thuộc hàm và chuẩn hóa](#phụ-lục-b-phụ-thuộc-hàm-và-chuẩn-hóa)
16. [Phụ lục C — Sai khác SQL Server so với MySQL/PostgreSQL](#phụ-lục-c-sai-khác-sql-server-so-với-mysqlpostgresql)
17. [Ghi chú cuối](#ghi-chú-cuối)

---

## 1. Đề thi trông thế nào

Ba đề thi đã đọc (đề 1 sinh viên, đề 2 sinh viên bản mở rộng, đề 3 thư viện) đều có cùng một đặc trưng: **không có câu hỏi lý thuyết riêng, toàn bộ là viết câu lệnh SQL**. Câu duy nhất cần viết DDL là câu 1 đề 3 (tạo CSDL).

| Đặc trưng | Nội dung |
|---|---|
| Hình thức thi | Trên máy, SQL Server (SSMS) |
| Lược đồ dùng lại | Đề 1 và 2 dùng chung 5 bảng `KHOA / LOP / SINHVIEN / MONHOC / KETQUA` |
| Câu tạo CSDL | Chỉ đề 3 câu 1, với 4 bảng thư viện |
| Câu khó nhất | Câu phải nối 4 bảng trong một truy vấn |
| Dữ liệu | Không phải do bạn chọn → bẫy đến từ dữ liệu trùng tên, NULL, giá trị bằng nhau |

**Hệ quả thực tế:** học SQL là đủ. Phần lý thuyết chỉ cần đúng ba thứ — bảng quan hệ nghĩa là gì, khóa chính/khóa ngoại khác nhau thế nào, và vì sao một số câu phải dùng `DISTINCT` hay `>= ALL`.

### Bốn từ phải phân biệt ngay từ đầu

| Từ | Nghĩa | Ví dụ |
|---|---|---|
| **Dữ liệu** (data) | Một mảnh thông tin nhỏ nhất | `8.5` là điểm của một sinh viên ở một môn |
| **CSDL** (database) | Tập hợp dữ liệu có tổ chức, lưu lâu dài | Toàn bộ bảng điểm của trường |
| **DBMS** (hệ quản trị CSDL) | Phần mềm tạo/truy vấn/bảo đảm tính đúng đắn của CSDL | SQL Server, MySQL, PostgreSQL, SQLite |
| **Bảng quan hệ** | Quan hệ (relation): mỗi dòng là một **bộ** (tuple), mỗi cột là một **thuộc tính** (attribute) | `SINHVIEN` |

Kiến trúc 3 mức, chỉ cần nhớ khi đề hỏi "mức nào chịu trách nhiệm gì":

- **Mức ngoại** — người dùng và ứng dụng. Đổi cách hiển thị.
- **Mức ý niệm** — kho dữ liệu: bảng, khóa, ràng buộc, truy vấn.
- **Mức vật lý** — ổ đĩa, tệp `.mdf / .ndf / .ldf`. Đổi thiết bị lưu trữ.

Đổi ổ cứng thì mức ý niệm không phải viết lại. Đó là toàn bộ ý nghĩa của kiến trúc 3 mức.

---

## 2. Bộ dữ liệu mẫu (dùng cho mọi ví dụ)


![Bộ dữ liệu mẫu của đề thi](assets/media/f0-bo-du-lieu-mau.jpg)
Không có dữ liệu vào và kết quả ra thì không hình dung được `GROUP BY`, `HAVING`, `LEFT JOIN`, `>= ALL` đang làm gì. Bộ dữ liệu dưới đây nhỏ đủ để tính tay nhưng đủ các bẫy để luyện.

**Các bẫy được cài sẵn có chủ ý:**

| Bẫy | Ở đâu | Tác dụng |
|---|---|---|
| `K04 - Điện tử` có 0 lớp | `KHOA` | Phân biệt `INNER JOIN` và `LEFT JOIN` |
| 2 người trùng tên `Nguyễn Văn An`, 2 người trùng tên `Trần Thị Bình` | `SINHVIEN` | Bắt buộc `DISTINCT` khi chỉ xuất họ tên |
| `SV004` có `DCHI` là NULL | `SINHVIEN` | `NOT LIKE` không trả về dòng NULL |
| `MH03` và `MH07` cùng tên `Lập trình C` | `MONHOC` | `GROUP BY TENMH` gộp nhầm 2 môn khác nhau |
| `MH08` viết sai chính tả `HEQTCSDL` | `MONHOC` | `TENMH = 'HQTCSDL'` không tìm thấy môn này |
| `DG05` có địa chỉ NULL | `DOCGIA` | Câu 15 đề 3 thiếu người nếu không xử lý NULL |
| `DG02` mượn đúng 3 cuốn, `S01` được mượn đúng 3 lần | `CTPHIEUMUON` | Thử câu "trên 3" — kẻ đúng bằng 3 không được lấy |

### 2.1. Script tạo (chạy trên SQL Server)

```sql

![Bốn cái bẫn có sẵn trong dữ liệu mẫu](assets/media/f3-bon-cai-ban.jpg)
/* ============ BẢNG SINH VIÊN (đề 1 và đề 2) ============ */
CREATE TABLE KHOA (
    MAKHOA  CHAR(4)       NOT NULL,
    TENKHOA NVARCHAR(50)  NOT NULL,
    CONSTRAINT PK_KHOA PRIMARY KEY (MAKHOA)
);

CREATE TABLE LOP (
    MALOP   CHAR(10)      NOT NULL,
    TENLOP  NVARCHAR(50),
    SISODK  INT,
    MAKHOA  CHAR(4),                      -- KHÔNG đặt NOT NULL: xem bẫy ở mục 8.3
    CONSTRAINT PK_LOP PRIMARY KEY (MALOP),
    CONSTRAINT FK_LOP_KHOA FOREIGN KEY (MAKHOA) REFERENCES KHOA(MAKHOA)
);

CREATE TABLE SINHVIEN (
    MASV     CHAR(5)       NOT NULL,
    HOTEN    NVARCHAR(50)  NOT NULL,
    NGSINH   DATE,
    DCHI     NVARCHAR(100),
    GIOITINH NVARCHAR(3)   NOT NULL,
    MALOP    CHAR(10),
    CONSTRAINT PK_SINHVIEN PRIMARY KEY (MASV),
    CONSTRAINT FK_SV_LOP FOREIGN KEY (MALOP) REFERENCES LOP(MALOP),
    CONSTRAINT CK_SV_GT CHECK (GIOITINH IN (N'Nam', N'Nữ'))
);

CREATE TABLE MONHOC (
    MAMH    CHAR(4)      NOT NULL,
    TENMH   NVARCHAR(50) NOT NULL,
    SOTIET  INT          NOT NULL,
    CONSTRAINT PK_MONHOC PRIMARY KEY (MAMH)
);

CREATE TABLE KETQUA (
    MASV CHAR(5) NOT NULL,
    MAMH CHAR(4) NOT NULL,
    DIEM DECIMAL(4,1),
    CONSTRAINT PK_KETQUA PRIMARY KEY (MASV, MAMH),      -- khóa chính GỘP
    CONSTRAINT FK_KQ_SV  FOREIGN KEY (MASV) REFERENCES SINHVIEN(MASV),
    CONSTRAINT FK_KQ_MH  FOREIGN KEY (MAMH) REFERENCES MONHOC(MAMH),
    CONSTRAINT CK_KQ_DIEM CHECK (DIEM BETWEEN 0 AND 10)
);
GO

INSERT INTO KHOA (MAKHOA, TENKHOA) VALUES
 (N'K01', N'Công nghệ thông tin'),
 (N'K02', N'Kế toán'),
 (N'K03', N'Cơ khí'),
 (N'K04', N'Điện tử');                        -- K04 cố ý không có lớp nào

INSERT INTO LOP (MALOP, TENLOP, SISODK, MAKHOA) VALUES
 (N'D16CNPM2', N'Công nghệ phần mềm 2', 30, N'K01'),
 (N'D13TMDT',  N'D13TMDT',              30, N'K01'),
 (N'D17CNPM1', N'Công nghệ phần mềm 1', 32, N'K01'),
 (N'D16CNPM3', N'Kỹ thuật phần mềm 3',   28, N'K01'),
 (N'D16KTMT1', N'Kế toán 1',             35, N'K02'),
 (N'D16CKMAT2',N'Cơ khí 2',              30, N'K03'),
 (N'D17CKMAT1',N'Cơ khí 1',              29, N'K03');

INSERT INTO SINHVIEN (MASV, HOTEN, NGSINH, DCHI, GIOITINH, MALOP) VALUES
 (N'SV001', N'Nguyễn Văn An',   '20020510', N'Hà Nội',    N'Nam', N'D16CNPM2'),
 (N'SV002', N'Trần Thị Bình',   '20030822', N'Hà Nội',    N'Nữ',  N'D16CNPM2'),
 (N'SV003', N'Nguyễn Văn An',   '20030105', N'Hải Phòng', N'Nam', N'D16CNPM2'),
 (N'SV004', N'Lê Thị Dung',     '20030214', NULL,         N'Nữ',  N'D16CNPM2'),
 (N'SV005', N'Hoàng Minh Đức', '20021130', N'Hà Nội',    N'Nam', N'D17CNPM1'),
 (N'SV006', N'Trần Thị Bình',   '20030418', N'Đà Nẵng',    N'Nữ',  N'D16KTMT1'),
 (N'SV007', N'Phạm Quốc Việt', '20010909', N'Hải Phòng', N'Nam', N'D16CKMAT2'),
 (N'SV008', N'Lê Thị Dung',     '20020707', N'Cần Thơ',    N'Nữ',  N'D17CKMAT1'),
 (N'SV009', N'Vũ Thị Hồng',     '20030303', N'Hà Nội',    N'Nữ',  N'D13TMDT'),
 (N'SV010', N'Đặng Văn Kiên',   '20021212', N'Hải Phòng', N'Nam', N'D13TMDT');

INSERT INTO MONHOC (MAMH, TENMH, SOTIET) VALUES
 (N'MH01', N'HQTCSDL',          45),
 (N'MH02', N'Cơ sở dữ liệu',    60),
 (N'MH03', N'Lập trình C',      90),
 (N'MH04', N'Giải tích 1',      30),
 (N'MH05', N'Mạng máy tính',    75),
 (N'MH06', N'Trí tuệ nhân tạo', 20),
 (N'MH07', N'Lập trình C',      45),   -- trùng TÊN với MH03, khác MAMH
 (N'MH08', N'HEQTCSDL',         40);   -- sai chính tả, dùng cho câu 4 đề 2

INSERT INTO KETQUA (MASV, MAMH, DIEM) VALUES
 (N'SV001',N'MH01',8.5), (N'SV001',N'MH02',9.0), (N'SV001',N'MH03',7.5),
 (N'SV001',N'MH04',8.0), (N'SV001',N'MH05',7.0),
 (N'SV002',N'MH01',6.0), (N'SV002',N'MH03',5.5),
 (N'SV003',N'MH01',7.0), (N'SV003',N'MH05',8.0), (N'SV003',N'MH07',9.5),
 (N'SV004',N'MH02',9.5), (N'SV004',N'MH06',10.0),
 (N'SV005',N'MH01',5.0), (N'SV005',N'MH02',7.5), (N'SV005',N'MH03',6.5),
 (N'SV006',N'MH04',8.5), (N'SV006',N'MH05',9.0),
 (N'SV007',N'MH01',4.5), (N'SV007',N'MH02',6.5), (N'SV007',N'MH04',7.0),
 (N'SV008',N'MH06',8.0),
 (N'SV009',N'MH08',4.0), (N'SV009',N'MH01',6.5), (N'SV009',N'MH05',7.5),
 (N'SV010',N'MH08',7.5), (N'SV010',N'MH02',6.0);
GO

/* ============ BẢNG THƯ VIỆN (đề 3) ============ */
CREATE TABLE SACH (
    MASACH  CHAR(10)      NOT NULL,
    TENSACH NVARCHAR(100) NOT NULL,
    NXB     NVARCHAR(50)  NOT NULL,
    NAMXB   INT,
    THELOAI NVARCHAR(30),
    SOLUONG INT           NOT NULL DEFAULT 0,
    CONSTRAINT PK_SACH PRIMARY KEY (MASACH)
);

CREATE TABLE DOCGIA (
    MADG   CHAR(10)      NOT NULL,
    HOTEN  NVARCHAR(50)  NOT NULL,
    DT     VARCHAR(15),              -- số điện thoại là CHUỖI, không phải số
    DIACHI NVARCHAR(100),
    CONSTRAINT PK_DOCGIA PRIMARY KEY (MADG)
);

CREATE TABLE PHIEUMUON (
    MAPM     CHAR(10) NOT NULL,
    MADG     CHAR(10) NOT NULL,
    NGAYMUON DATE     NOT NULL,
    CONSTRAINT PK_PM PRIMARY KEY (MAPM),
    CONSTRAINT FK_PM_DG FOREIGN KEY (MADG) REFERENCES DOCGIA(MADG)
);

CREATE TABLE CTPHIEUMUON (
    MAPM       CHAR(10) NOT NULL,
    MASACH     CHAR(10) NOT NULL,
    SOLUONG    INT      NOT NULL DEFAULT 1,
    NGAYHENTRA DATE,
    CONSTRAINT PK_CTPM PRIMARY KEY (MAPM, MASACH),
    CONSTRAINT FK_CTPM_PM   FOREIGN KEY (MAPM)   REFERENCES PHIEUMUON(MAPM),
    CONSTRAINT FK_CTPM_SACH FOREIGN KEY (MASACH) REFERENCES SACH(MASACH),
    CONSTRAINT CK_CTPM_SL   CHECK (SOLUONG > 0)
);
GO

INSERT INTO SACH (MASACH, TENSACH, NXB, NAMXB, THELOAI, SOLUONG) VALUES
 (N'S01', N'Lập trình C',             N'Nhà xuất bản Giáo dục', 2022, N'Công nghệ thông tin', 10),
 (N'S02', N'Cơ sở dữ liệu',           N'Nhà xuất bản Giáo dục', 2022, N'Công nghệ thông tin',  8),
 (N'S03', N'Giải tích 1',             N'Nhà xuất bản Giáo dục', 2021, N'Toán',                 5),
 (N'S04', N'Dế Mèn phiêu lưu ký',     N'Nhà xuất bản Kim Đồng', 2022, N'Thiếu nhi',           12),
 (N'S05', N'Truyện cổ tích Việt Nam', N'Nhà xuất bản Kim Đồng', 2020, N'Thiếu nhi',            9),
 (N'S06', N'Đắc nhân tâm',            N'Nhà xuất bản Tổng hợp', 2019, N'Kỹ năng',              6),
 (N'S07', N'Mạng máy tính',           N'Nhà xuất bản Bách khoa',2022, N'Công nghệ thông tin',  4),
 (N'S08', N'Lập trình C++',           N'Nhà xuất bản Giáo dục', 2023, N'Công nghệ thông tin',  7);

INSERT INTO DOCGIA (MADG, HOTEN, DT, DIACHI) VALUES
 (N'DG01', N'Nguyễn Văn An',  '0912345678', N'Hà Nội'),
 (N'DG02', N'Trần Thị Bình',  '0987654321', N'Hà Nội'),
 (N'DG03', N'Lê Văn Chiến',   '0909090909', N'Hải Phòng'),
 (N'DG04', N'Phạm Thị Dung',  '0933445566', N'Đà Nẵng'),
 (N'DG05', N'Hoàng Minh Em',  '0977889900', NULL);

INSERT INTO PHIEUMUON (MAPM, MADG, NGAYMUON) VALUES
 (N'PM01',N'DG01','20231120'), (N'PM02',N'DG02','20231120'),
 (N'PM03',N'DG01','20231118'), (N'PM04',N'DG03','20231121'),
 (N'PM05',N'DG01','20231122'), (N'PM06',N'DG04','20231120');

INSERT INTO CTPHIEUMUON (MAPM, MASACH, SOLUONG, NGAYHENTRA) VALUES
 (N'PM01',N'S01',2,'20231127'), (N'PM01',N'S02',1,'20231127'), (N'PM01',N'S04',1,'20231127'),
 (N'PM02',N'S01',1,'20231127'), (N'PM02',N'S05',2,'20231127'),
 (N'PM03',N'S02',1,'20231125'), (N'PM03',N'S04',2,'20231125'),
 (N'PM04',N'S04',1,'20231128'), (N'PM04',N'S06',1,'20231128'),
 (N'PM05',N'S01',1,'20231129'), (N'PM05',N'S04',1,'20231129'),
 (N'PM06',N'S08',3,'20231130'), (N'PM06',N'S03',1,'20231130');
GO
```

**Ba quy tắc bắt buộc khi viết truy vấn trên SQL Server:**

1. Chuỗi tiếng Việt luôn viết `N'...'` — `NVARCHAR`/`NCHAR` mới hiểu đúng dấu. Thiếu `N` thì dấu tiếng Việt có thể mất khi so sánh với dữ liệu trong bảng.
2. Ngày viết theo thứ tự **năm–tháng–ngày**: `'20231120'` cho SQL Server (không phải `'2023-11-20'`).
3. `GO` là dấu phân tách khối, **không phải ngôn ngữ SQL**. Bôi đen từng khối rồi bấm F5 trong SSMS.

### 2.2. Bốn loại kiểu dữ liệu chỉ cần biết

| Kiểu | Dùng cho | Lỗi thường gặp |
|---|---|---|
| `CHAR(n)` / `VARCHAR(n)` | Chuỗi **không** dấu, hoặc số điện thoại | `VARCHAR` mất dấu tiếng Việt — dùng cho `DT` là đúng, dùng cho tên là sai |
| `NVARCHAR(n)` | Chuỗi có dấu tiếng Việt | Thiếu `N` ở vế so sánh |
| `INT` | Số nguyên: `NAMXB`, `SOLUONG`, `SOTIET` | Bọc nháy `'2022'` → thành chuỗi, so sánh sai |
| `DATE` | Ngày tháng năm | Định dạng phải là `yyyymmdd` |
| `DECIMAL(p,s)` | Số thập phân: `DIEM` | **Không** dùng cho số điện thoại |

Lý do số điện thoại không được dùng `DECIMAL`: `0912345678` bắt đầu bằng `0`. Nếu lưu kiểu số, chữ số `0` đầu tiên bị mất và giá trị trở thành `912345678`.

### 2.3. Sáu ràng buộc

| Ràng buộc | Cú pháp | Tác dụng |
|---|---|---|
| Khóa chính | `PRIMARY KEY` | Duy nhất + không NULL |
| Khóa ngoại | `FOREIGN KEY ... REFERENCES` | Giá trị phải tồn tại ở bảng cha, hoặc NULL |
| Không null | `NOT NULL` | Bắt buộc có giá trị |
| Duy nhất | `UNIQUE` | Chống trùng lặp |
| Kiểm tra miền | `CHECK (điều_kiện)` | Giá trị phải thỏa điều kiện |
| Mặc định | `DEFAULT giá_trị` | Tự điền khi không nhập |

**`PRIMARY KEY` và `UNIQUE` khác nhau ở đâu:** cả hai đều chống trùng lặp. Nhưng khóa chính **không được NULL**, còn `UNIQUE` thì cho phép **một** giá trị NULL.

Lưu ý: đây là hành vi **của SQL Server**. MySQL và PostgreSQL cho phép `UNIQUE` chứa **nhiều** hàng NULL. Nếu đề thi yêu cầu "viết CSDL theo chuẩn phổ quán" mà không nói cụ thể, dùng `NOT NULL` kèm `UNIQUE` để tránh cả hai cách hiểu.

---

## 3. Bảng đọc đề: từ khóa trong đề → SQL


![Bảng đọc đề: từ khóa tiếng Việt → SQL](assets/media/b7-bang-doc-de.jpg)
Dùng bảng này trước khi viết bất kỳ câu nào. Đọc câu hỏi, tìm từ khóa, áp công thức.

| Từ khóa trong đề | Công thức SQL | Lỗi phải tránh |
|---|---|---|
| có số tiết **từ 30 đến 90** | `WHERE SOTIET BETWEEN 30 AND 90` | `BETWEEN` đã bao gồm 2 đầu mốc |
| **lớn nhất** / **nhiều nhất** | `HAVING COUNT(*) >= ALL (SELECT COUNT(*) ... GROUP BY ...)` | `TOP 1` bỏ mất người bằng điểm |
| **trên 3** | `HAVING ... > 3` | Dùng `>= 3` thì người đúng 3 cũng vào |
| **ít nhất 3** | `HAVING COUNT(...) >= 3` | |
| **trong từng khoa** (kể cả khoa chưa có lớp) | `LEFT JOIN` + `COUNT(l.MALOP)` | `INNER JOIN` làm khoa rỗng biến mất |
| **chưa ai học** / **chưa có khách mượn** | `NOT EXISTS (SELECT 1 ...)` | `NOT IN` hỏng khi subquery có NULL |
| **tổng số sách** | `SUM(SOLUONG)` | |
| **điểm trung bình cao nhất** | `HAVING AVG(cột) >= ALL (SELECT AVG(...) ... GROUP BY ...)` | Subquery phải có **alias riêng**, nếu không sẽ thành subquery tự biến và trả về toàn bộ nhóm |
| **số lượt mượn** | `COUNT(*)` | Dùng `SUM` ra kết quả khác hẳn |
| chỉ xuất **họ tên** mà dữ liệu có trùng tên | `SELECT DISTINCT` | Không `DISTINCT` thì một người ra nhiều dòng |

---

## 4. Dạng 1 — Lọc một bảng





![BETWEEN gồm cả hai đầu mốc](assets/media/d2-between-hai-dau.jpg)
![Bốn toán tử lọc trên cùng một bảng](assets/media/d1b-bon-toan-tu.jpg)
![Dạng 1 — Lọc một bảng](assets/media/video-dang-1-loc-mot-bang.mp4)
![Bốn toán tử lọc trên cùng một bảng](assets/media/d1-bon-toan-tu-loc.jpg)
**Bảng vào:** `MONHOC`

```
MAMH  | TENMH          | SOTIET
MH01  | HQTCSDL        | 45
MH02  | Cơ sở dữ liệu  | 60
MH03  | Lập trình C    | 90
MH04  | Giải tích 1    | 30
MH05  | Mạng máy tính  | 75
MH06  | Trí tuệ nhân tạo | 20
MH07  | Lập trình C    | 45
MH08  | HEQTCSDL       | 40
```

**Câu hỏi:** tên những môn học có số tiết từ 30 đến 90.

```sql
SELECT TENMH, SOTIET
FROM MONHOC
WHERE SOTIET BETWEEN 30 AND 90
ORDER BY TENMH;
```

**Kết quả (chạy thật):**

| TENMH | SOTIET |
|---|---|
| Cơ sở dữ liệu | 60 |
| Giải tích 1 | 30 |
| HEQTCSDL | 40 |
| HQTCSDL | 45 |
| Lập trình C | 90 |
| Lập trình C | 45 |
| Mạng máy tính | 75 |

Hai dòng "Lập trình C" là **hai môn khác nhau** (`MH03` và `MH07`), chỉ trùng tên. Đề hỏi "tên môn học" nên cả hai đều đúng.

### `LIKE` — ký tự đại diện


![Ký tự đại diện trong LIKE](assets/media/d3-ky-tu-dai-dien.jpg)
| Ký tự | Nghĩa | Ví dụ |
|---|---|---|
| `%` | **0 hoặc nhiều** ký tự bất kỳ | `N'%Giáo dục%'` khớp "Giáo dục", "Nhà xuất bản Giáo dục Việt Nam" |
| `_` | **đúng 1** ký tự bất kỳ | `N'D_6'` khớp `D16`, không khớp `D126` |

Cần tìm một giá trị cụ thể thì đừng dùng `LIKE` — dùng `=`. `WHERE TENMH = N'HQTCSDL'` không tìm thấy `MH08` vì `MH08` ghi `HEQTCSDL`. Sai chính tả ở đề là sai ở dữ liệu.

### Ba lỗi thường gặp ở dạng này

1. **Bọc nháy số.** `NAMXB = '2022'` so sánh chuỗi với số. Phải là `NAMXB = 2022`.
2. **Thiếu `N` trước chuỗi tiếng Việt.** `WHERE NXB = 'Nhà xuất bản Giáo dục'` — dùng `N'...'`.
3. **Chọn cột không nằm trong bảng đang nối.** `SELECT HOTEN, DIEM FROM KETQUA JOIN MONHOC` là lỗi: `HOTEN` nằm ở `SINHVIEN`, không nằm trong `KETQUA` lẫn `MONHOC`.

### Tự làm

1. Liệt kê môn học có số tiết nhỏ hơn 60.
2. Liệt kê độc giả có địa chỉ chứa "Hà Nội".
3. Tìm môn học có tên chứa chữ "CSDL" (bao gồm cả `HQTCSDL` lẫn `HEQTCSDL`).

---

## 5. Dạng 2 — Nối bảng


![Dạng 2 — Nối bảng: ON khác WHERE](assets/media/video-dang-2-noi-bang.mp4)
**Bản đồ khóa của đề:**

```
KHOA     (MAKHOA ← PK)
              │
              │ 1 khoa có nhiều lớp
              ↓
LOP      (MALOP ← PK, MAKHOA → FK)
              │
              │ 1 lớp có nhiều sinh viên
              ↓
SINHVIEN (MASV ← PK, MALOP → FK) ──┐
                                    │  N-N: 1 sinh viên học nhiều môn
MONHOC   (MAMH ← PK) ───────────────┤  và 1 môn có nhiều sinh viên
                                    ↓
KETQUA   (MASV + MAMH ← PK gộp, DIEM)
```

`KETQUA` là **bảng cầu nối** — nó không mô tả một thực thể mới, nó chỉ ghi quan hệ N-N giữa `SINHVIEN` và `MONHOC`. Vì vậy khóa chính của nó phải là **cặp** `MASV + MAMH`: mỗi sinh viên chỉ có 1 kết quả cho mỗi môn.

### 5.1. Nối 2 bảng

**Câu hỏi:** họ tên sinh viên lớp `D13TMDT` có điểm từ 6 đến 8.

```sql
SELECT DISTINCT s.HOTEN
FROM SINHVIEN s
JOIN KETQUA k  ON k.MASV  = s.MASV
JOIN LOP l     ON l.MALOP = s.MALOP
WHERE l.MALOP = N'D13TMDT'
  AND k.DIEM BETWEEN 6 AND 8;
```

**Kết quả (chạy thật):**

| HOTEN |
|---|
| Vũ Thị Hồng |
| Đặng Văn Kiên |

Bỏ `DISTINCT` thì ra 4 dòng: `Vũ Thị Hồng` xuất hiện 2 lần, `Đặng Văn Kiên` 2 lần — vì học 2 môn và mỗi môn 1 dòng trong `KETQUA`.

**Nguyên tắc chung:** khi `SELECT` ra một cột mà bảng kết quả có thể lặp giá trị, dùng `SELECT DISTINCT`. Rẻ hơn nhiều so với viết thêm một lớp `GROUP BY`.

### 5.2. Nối 4 bảng trong một câu


![Nối 4 bảng: cần N−1 điều kiện](assets/media/d5-noi-4-bang.jpg)
Đây là dạng khó nhất, xuất hiện ở đề 1 câu 3 và đề 2 câu 3.

**Câu hỏi:** tên môn học có số tiết dưới 60, do sinh viên thuộc khoa `K01` học.

```sql
SELECT DISTINCT m.TENMH
FROM MONHOC m
JOIN KETQUA  k ON k.MAMH  = m.MAMH
JOIN SINHVIEN s ON s.MASV  = k.MASV
JOIN LOP l      ON l.MALOP = s.MALOP
WHERE l.MAKHOA = N'K01'
  AND m.SOTIET < 60;
```

**Kết quả (chạy thật):**

| TENMH |
|---|
| Giải tích 1 |
| HEQTCSDL |
| HQTCSDL |
| Lập trình C |
| Trí tuệ nhân tạo |

**Quy tắc số dành riêng cho nối nhiều bảng:** nối N bảng thì cần **N−1** điều kiện khớp. Thiếu một điều kiện là kết quả nhân lên — ví dụ nối 3 bảng mà chỉ có 1 điều kiện khớp thì số dòng ra bằng tích số dòng của 3 bảng.

Bốn bảng ở trên cần 3 điều kiện: `k.MAMH = m.MAMH`, `s.MASV = k.MASV`, `l.MALOP = s.MALOP`.

### 5.3. `LEFT JOIN` — giữ dòng không có dữ liệu bên phải



![LEFT JOIN giữ dòng không khớp](assets/media/d4-left-join.jpg)
![Dòng NULL đi đâu trong LEFT JOIN](assets/media/c7-null-trong-left-join.jpg)
**Câu hỏi:** tên khoa và số lượng lớp **trong từng khoa**.

Cách viết sai — khoa không có lớp nào biến mất:

```sql
SELECT k.TENKHOA, COUNT(*) AS SOLOP
FROM KHOA k JOIN LOP l ON k.MAKHOA = l.MAKHOA
GROUP BY k.TENKHOA;
```

| TENKHOA | SOLOP |
|---|---|
| Công nghệ thông tin | 4 |
| Cơ khí | 2 |
| Kế toán | 1 |

`K04 - Điện tử` không có lớp nào nên bị loại mất. Đề nói "trong từng khoa" — thiếu một khoa là sai.

Cách viết đúng:

```sql
SELECT k.TENKHOA, COUNT(l.MALOP) AS SOLOP
FROM KHOA k
LEFT JOIN LOP l ON k.MAKHOA = l.MAKHOA
GROUP BY k.MAKHOA, k.TENKHOA;
```

| TENKHOA | SOLOP |
|---|---|
| Công nghệ thông tin | 4 |
| Cơ khí | 2 |
| Kế toán | 1 |
| Điện tử | **0** |

Hai điểm bắt buộc khi dùng `LEFT JOIN` để đếm:

- **Đếm cột của bảng bên phải** (`COUNT(l.MALOP)`), không phải `COUNT(*)`. `COUNT(*)` đếm cả dòng không khớp nên khoa rỗng vẫn ra 1.
- **Gom nhóm theo khóa** (`k.MAKHOA`), không chỉ theo tên. Xem mục 6.3.

### 5.4. `WHERE` và `ON` không phải chỗ nào cũng giống nhau



![ON khác WHERE: cùng SQL, kết quả khác](assets/media/d6b-on-khac-where.jpg)
![ON khác WHERE: cùng SQL, kết quả khác](assets/media/d6-on-khac-where.jpg)
Đây là chỗ sai âm thầm, không báo lỗi mà ra sai kết quả.

| Đặt điều kiện ở | Thực tế xảy ra | Kết quả |
|---|---|---|
| `WHERE` sau `LEFT JOIN` | Lọc **sau** khi đã ghép | Biến `LEFT JOIN` thành `INNER JOIN` |
| `ON` | Lọc **trước** khi ghép | Giữ nguyên dòng không khớp, để cột bên phải là NULL |

Chứng minh trên dữ liệu mẫu — tìm lớp không có sinh viên nào:

```sql
-- Đặt trong WHERE: chỉ trả về dòng đã ghép, lớp trống biến mất
SELECT l.MALOP FROM LOP l LEFT JOIN SINHVIEN s ON s.MALOP = l.MALOP
WHERE s.MASV IS NULL;
-- → D16CNPM3     (đúng, vì D16CNPM3 thực sự không có sinh viên)
```

Ngược lại, đặt điều kiện lọc vào `WHERE` khi nó thuộc về bảng bên trái sẽ loại bỏ chính những dòng mà `LEFT JOIN` sinh ra:

```sql
-- SAI: điều kiện về bảng bên phải đặt trong WHERE → LEFT JOIN thành INNER JOIN
SELECT l.MALOP, s.MASV
FROM LOP l LEFT JOIN SINHVIEN s ON s.MALOP = l.MALOP
WHERE l.TENLOP IS NOT NULL AND s.MASV IS NOT NULL;
```

Quy tắc rút gọn: **muốn giữ dòng trống thì lọc ở `ON`; không quan tâm dòng trống thì lọc ở `WHERE`.**

### 5.5. Bẫy cú pháp: đếm trong `WHERE`


![Bẫy cú pháp: đếm trong WHERE](assets/media/d7-dem-trong-where.jpg)
Câu hỏi: lớp nào không có sinh viên nào, đếm số sinh viên.

```sql
-- LỖI CÚ PHÁP: WHERE không được chứa hàm tổng hợp
SELECT l.MALOP, COUNT(s.MASV)
FROM LOP l LEFT JOIN SINHVIEN s ON s.MALOP = l.MALOP
WHERE COUNT(s.MASV) = 0
GROUP BY l.MALOP;
```

SQL Server báo: *WHERE clause cannot contain aggregates*. Cách viết đúng — chuyển điều kiện xuống `HAVING`:

```sql
SELECT l.MALOP, COUNT(s.MASV) AS N
FROM LOP l LEFT JOIN SINHVIEN s ON s.MALOP = l.MALOP
GROUP BY l.MALOP
HAVING COUNT(s.MASV) = 0;
```

| MALOP | N |
|---|---|
| D16CNPM3 | 0 |

### Tự làm

1. Liệt kê sinh viên nữ lớp `D16CNPM2` kèm tên lớp.
2. Liệt kê tên môn mà sinh viên học khoa `K01` học, có điểm dưới 5.
3. Liệt kê các lớp có **sĩ số thực** ít nhất 3 (dùng `LEFT JOIN`, kể cả lớp chưa có sinh viên).

---

## 6. Dạng 3 — Gom nhóm và đếm


![Dạng 3 — Gom nhóm và đếm](assets/media/video-dang-3-gom-nhom-dem.mp4)
### 6.1. `GROUP BY` cơ bản

**Câu hỏi:** sinh viên học trên 3 môn.

```sql
SELECT s.MASV, s.HOTEN, COUNT(DISTINCT k.MAMH) AS SOMON
FROM SINHVIEN s
JOIN KETQUA k ON k.MASV = s.MASV
GROUP BY s.MASV, s.HOTEN
HAVING COUNT(DISTINCT k.MAMH) > 3
ORDER BY s.MASV;
```

| MASV | HOTEN | SOMON |
|---|---|---|
| SV001 | Nguyễn Văn An | 5 |

`COUNT(DISTINCT ...)` an toàn hơn `COUNT(*)` ở đây: nếu dữ liệu trong `KETQUA` có trùng khóa gộp thì `COUNT(*)` đếm số dòng, không phải số môn.

### 6.2. `WHERE` lọc trước, `HAVING` lọc sau


![WHERE lọc trước, HAVING lọc sau](assets/media/d8-where-having.jpg)
| Mệnh đề | Chạy khi nào | Lọc cái gì |
|---|---|---|
| `WHERE` | Trước khi gom nhóm | Từng **dòng** |
| `HAVING` | Sau khi gom nhóm | Từng **nhóm** |

Câu hỏi: môn học có số tiết trên 30 **và** có ít nhất 2 sinh viên theo học.

```sql
SELECT m.MAMH, m.TENMH, COUNT(DISTINCT k.MASV) AS SOSV
FROM MONHOC m
JOIN KETQUA k ON k.MAMH = m.MAMH
WHERE m.SOTIET > 30
GROUP BY m.MAMH, m.TENMH
HAVING COUNT(DISTINCT k.MASV) >= 2
ORDER BY m.TENMH;
```

| MAMH | TENMH | SOSV |
|---|---|---|
| MH02 | Cơ sở dữ liệu | 5 |
| MH01 | HQTCSDL | 6 |
| MH03 | Lập trình C | 3 |
| MH05 | Mạng máy tính | 4 |

Đặt `m.SOTIET > 30` vào `HAVING` cũng ra cùng kết quả, vì trong mỗi nhóm `SOTIET` đều bằng nhau. Nhưng đặt ở `WHERE` đúng hơn: nó lọc sớm, ít dòng phải gom nhóm, và đúng ý nghĩa "môn nào đủ điều kiện để xét".

### 6.3. Nhóm theo khóa, không nhóm theo tên


![Gom nhóm theo mã môn, không theo tên](assets/media/d9-gom-theo-ma.jpg)
Dữ liệu mẫu có `MH03` và `MH07` **cùng tên** "Lập trình C". Hai môn này khác nhau.

Cách viết sai — gộp hai môn làm một:

```sql
SELECT m.TENMH, COUNT(*) AS N
FROM MONHOC m JOIN KETQUA k ON k.MAMH = m.MAMH
GROUP BY m.TENMH;
```

Kết quả gộp chung hai môn dưới một tên, số đếm là tổng của cả hai. Đề hỏi "môn học" — môn là `MAMH`, không phải `TENMH`.

Cách viết đúng:

```sql
SELECT m.MAMH, m.TENMH, COUNT(*) AS N
FROM MONHOC m JOIN KETQUA k ON k.MAMH = m.MAMH
GROUP BY m.MAMH, m.TENMH;
```

| MAMH | TENMH | N |
|---|---|---|
| MH01 | HQTCSDL | 6 |
| MH02 | Cơ sở dữ liệu | 5 |
| MH03 | Lập trình C | 3 |
| MH05 | Mạng máy tính | 4 |
| MH07 | Lập trình C | 1 |

Cùng quy tắc cho `TENKHOA` và `TENLOP`: hai khoa có thể trùng tên, hai lớp ở hai khoa khác nhau có thể trùng tên. **Luôn gom nhóm theo mã, kèm tên để hiển thị.**


### 6.5. `AVG` — câu "điểm trung bình cao nhất"

Hàm tính trung bình dùng đúng như `SUM`: **gom nhóm trước, lọc `HAVING` sau.**

Câu 14 đề 2: *liệt kê mã sinh viên, họ tên những sinh viên nữ có điểm trung bình cao nhất.*

```sql
SELECT s.MASV, s.HOTEN, ROUND(AVG(k.DIEM), 2) AS DIEMTB
FROM SINHVIEN s
JOIN KETQUA k ON k.MASV = s.MASV
WHERE s.GIOITINH = N'Nữ'
GROUP BY s.MASV, s.HOTEN
HAVING AVG(k.DIEM) >= ALL (
    SELECT AVG(k2.DIEM)
    FROM SINHVIEN s2
    JOIN KETQUA k2 ON k2.MASV = s2.MASV
    WHERE s2.GIOITINH = N'Nữ'
    GROUP BY s2.MASV)
ORDER BY s.MASV;
```

**Kết quả (chạy thật):**

| MASV | HOTEN | DIEMTB |
|---|---|---|
| SV004 | Lê Thị Dung | 9.75 |

So sánh với bảng điểm trung bình để thấy vì sao chỉ có một người:

| MASV | HOTEN | DIEMTB |
|---|---|---|
| SV004 | Lê Thị Dung | 9.75 |
| SV006 | Trần Thị Bình | 8.75 |
| SV008 | Lê Thị Dung | 8.0 |
| SV009 | Vũ Thị Hồng | 6.0 |
| SV002 | Trần Thị Bình | 5.75 |

Ba điều chú ý:

1. **Cột lọc thuộc bảng nào định nghĩa "nữ".** `GIOITINH` nằm ở `SINHVIEN`, không phải `KETQUA` — nên điều kiện `GIOITINH = N'Nữ'` phải ở vế ngoài **và** trong subquery. Thiếu ở subquery thì trung bình tính cho cả nam lẫn nữ.
2. **`ROUND(..., 2)`** làm kết quả đẹp; không có nó thì `AVG` ra `8.166666666666666`.
3. **Subquery phải có alias riêng** (`s2`, `k2`). Không có bước này thì xem mục 6.6.

### 6.4. `COUNT(*)`, `COUNT(cột)`, `COUNT(DISTINCT cột)`


![Ba hàm COUNT, ba kết quả khác nhau](assets/media/d10-ba-ham-count.jpg)
| Hàm | Đếm gì | Ví dụ trong dữ liệu mẫu |
|---|---|---|
| `COUNT(*)` | Số **dòng** của nhóm | `DG01` mượn 3 cuốn ở 3 dòng → 3 |
| `COUNT(cột)` | Số **ô khác NULL** | Nếu `NGAYHENTRA` có NULL thì đếm thiếu |
| `COUNT(DISTINCT cột)` | Số **giá trị khác nhau khác NULL** | 1 sinh viên học 5 môn → 5 |

Chênh lệch thực tế ở đề 3:

```sql
-- Đếm số CUỐN (cột SOLUONG trong chi tiết phiếu)
SELECT SUM(c.SOLUONG) FROM PHIEUMUON p JOIN CTPHIEUMUON c ON c.MAPM = p.MAPM
WHERE p.NGAYMUON = '20231120';     -- → 11
```

- Tổng số **số lượt mượn** (số dòng chi tiết): `COUNT(*)` → **7**
- Tổng số **cuốn sách** (tổng `SOLUONG`): `SUM(SOLUONG)` → **11**

Hai con số này khác nhau và đề không phân định. **Ghi rõ cách hiểu của bạn ngay đầu bài làm.** Đây là chỗ hỏi người đã thi khóa trước.

### 6.6. Lỗi nguy hiểm nhất của đề gốc: subquery tự biến


![Subquery tự biến — lỗi nguy hiểm nhất](assets/media/d11-subquery-tu-bien.jpg)
Đáp án gốc câu 14 đề 2 viết thế này:

```sql
select sinhvien.masv, hoten
from sinhvien, ketqua
where sinhvien.masv=ketqua.masv
and gioitinh='nu'
group by sinhvien.masv, hoten
having avg(diem)>=all (select avg(diem)
from sinhvien, ketqua
where sinhvien.masv=ketqua.masv
and gioitinh='nu'
group by sinhvien.masv, hoten);
```

Câu này **trả về toàn bộ sinh viên nữ**, không phải người có điểm cao nhất.

Đã kiểm chạy trên dữ liệu mẫu:

| Cách viết | Số dòng trả về | Đúng không |
|---|---|---|
| Có alias riêng trong subquery | 1 — `SV004 Lê Thị Dung` | Đúng |
| Không alias, y hệt đáp án gốc | 5 — toàn bộ sinh viên nữ | Sai |

**Vì sao?** Khi subquery không dùng alias riêng, các tên bảng `sinhvien` và `ketqua` bên trong nó bị gánh chúi về bảng ở câu lệnh ngoài. Subquery trở thành **subquery tự biến** (correlated subquery): nó chạy lại **cho từng dòng** của câu lệnh ngoài rồi so sánh giá trị của chính dòng đó.

Với một subquery tự biến chỉ trả về **một** giá trị thì phép `>= ALL` luôn Đúng — vì so sánh một giá trị với chính nó thì bằng bao nhiêu cũng thỏa. Kết quả: mọi dòng ngoài đều lọt qua.

**Cách tránh, áp dụng cho mọi subquery trong đề:**

1. Cho mọi bảng trong subquery một **alias riêng**, khác alias ở câu lệnh ngoài.
2. Viết rõ điều kiện nối bảng **bên trong** subquery bằng alias đó.
3. Lặp lại điều kiện lọc (`GIOITINH = N'Nữ'`) trong cả hai vế.

Nếu cần một subquery cố ý tự biến (ví dụ "lấy tất cả sách mà độc giả đó từng mượn"), thì phải dùng `EXISTS` với điều kiện nối rõ ràng, đừng dựa vào tên bảng trùng nhau.

### Tự làm

1. Tên khoa có ít nhất 3 lớp.
2. Tên lớp có sĩ số thực ít nhất 3 sinh viên.
3. Với mỗi nhà xuất bản, tổng số cuốn sách đã được mượn.
4. Với mỗi thể loại, tổng số cuốn sách thuộc thể loại đó đã được mượn.

---

## 7. Dạng 4 — So sánh với giá trị lớn nhất


![Dạng 4 — So sánh với giá trị lớn nhất](assets/media/video-dang-4-gia-tri-lon-nhat.mp4)
Câu hỏi: "độc giả mượn nhiều sách nhất", "môn có số tiết lớn nhất", "sinh viên học nhiều môn nhất".

### 7.1. `>= ALL` — trả về cả những ai bằng nhau

```sql

![Ba cách tìm giá trị lớn nhất: >= ALL, NOT EXISTS, ORDER BY LIMIT 1](assets/media/f2-bang-luu-do.jpg)

![>= ALL trả về cả những ai bằng nhau](assets/media/e2-ge-all-bang-nhau.jpg)
SELECT m.MAMH, m.TENMH, m.SOTIET
FROM MONHOC m
WHERE m.SOTIET >= ALL (SELECT SOTIET FROM MONHOC)
ORDER BY m.TENMH;
```

| TENMH | SOTIET |
|---|---|
| Lập trình C | 90 |

Nếu có hai môn cùng 90 tiết, `>= ALL` trả về cả hai. Đó mới là ý nghĩa của "nhiều nhất".

Kinh nghiệm: tách bước tính thành hai — tính tổng theo từng nhóm, rồi so sánh với giá trị lớn nhất trong chính tập kết quả đó.

```sql
SELECT MADG, HOTEN, TONGSOSACH
FROM (
    SELECT d.MADG, d.HOTEN, SUM(c.SOLUONG) AS TONGSOSACH
    FROM DOCGIA d
    JOIN PHIEUMUON  p ON p.MADG = d.MADG
    JOIN CTPHIEUMUON c ON c.MAPM = p.MAPM
    GROUP BY d.MADG, d.HOTEN
) AS t
WHERE t.TONGSOSACH = (SELECT MAX(TONGSOSACH) FROM (
    SELECT SUM(c2.SOLUONG) AS TONGSOSACH
    FROM PHIEUMUON p2 JOIN CTPHIEUMUON c2 ON c2.MAPM = p2.MAPM
    GROUP BY p2.MADG))
```

### 7.2. `TOP 1 WITH TIES` — cách viết ngắn hơn, chỉ SQL Server

```sql

![So sánh >= ALL và > ALL](assets/media/e2-ge-all-chi-tiet.jpg)
SELECT TOP 1 WITH TIES d.MADG, d.HOTEN, SUM(c.SOLUONG) AS TONGSOSACH
FROM DOCGIA d
JOIN PHIEUMUON  p ON p.MADG = d.MADG
JOIN CTPHIEUMUON c ON c.MAPM = p.MAPM
GROUP BY d.MADG, d.HOTEN
ORDER BY SUM(c.SOLUONG) DESC;
```

`WITH TIES` là phần bắt buộc. `TOP 1` trần thì khi có hai người bằng nhau, chỉ một người được trả về — sai ý đề.

> **Không chạy được trên MySQL/PostgreSQL.** Nếu bạn dùng công cụ khác SQL Server, dùng `RANK()` — cũng chạy thật cho kết quả tương đương:
>
> ```sql
> SELECT MADG, HOTEN, TONGSOSACH FROM (
>     SELECT d.MADG, d.HOTEN, SUM(c.SOLUONG) AS TONGSOSACH,
>            RANK() OVER (ORDER BY SUM(c.SOLUONG) DESC) AS rk
>     FROM DOCGIA d
>     JOIN PHIEUMUON  p ON p.MADG = d.MADG
>     JOIN CTPHIEUMUON c ON c.MAPM = p.MAPM
>     GROUP BY d.MADG, d.HOTEN) t
> WHERE rk = 1;
> ```

### 7.3. `ORDER BY ... LIMIT 1` — không dùng cho câu "nhiều nhất"


![TOP 1 mất người bằng điểm](assets/media/e1-top-1-mat-nguoi.jpg)
| Cách viết | Trả về | Đúng ý đề? |
|---|---|---|
| `ORDER BY ... LIMIT 1` | Đúng 1 dòng duy nhất | Không — mất người bằng điểm |
| `TOP 1` | Đúng 1 dòng duy nhất | Không |
| `ORDER BY ... LIMIT 1 WITH TIES` | Tất cả dòng bằng nhau | Có |
| `TOP 1 WITH TIES` | Tất cả dòng bằng nhau | Có |
| `>= ALL (subquery)` | Tất cả dòng bằng giá trị lớn nhất | Có |

Số `1` trong `LIMIT` / `TOP` chỉ có nghĩa khi đề thật sự hỏi "một người duy nhất" và bạn chắc không có ai bằng.

### Tự làm

1. Cuốn sách được mượn nhiều lần nhất (đếm số lượt mượn).
2. Sinh viên học nhiều môn nhất.
3. Sinh viên nữ có điểm trung bình cao nhất.

---

## 8. Dạng 5 — Loại trừ


![Dạng 5 — Loại trừ: NOT EXISTS và NOT IN](assets/media/video-dang-5-loai-tru.mp4)
### 8.1. `NOT EXISTS` — cách an toàn

```sql
SELECT s.MASACH, s.TENSACH, s.NXB
FROM SACH s
WHERE NOT EXISTS (SELECT 1 FROM CTPHIEUMUON c WHERE c.MASACH = s.MASACH)
ORDER BY s.MASACH;
```

| MASACH | TENSACH | NXB |
|---|---|---|
| S07 | Mạng máy tính | Nhà xuất bản Bách khoa |

### 8.2. Bẫy `NOT IN` — chỉ hỏng khi subquery có NULL



![NOT IN hỏng ở đâu, không hỏng ở đâu](assets/media/c6b-not-in-hong-khi-nao.jpg)
![NOT EXISTS an toàn, NOT IN bẫy NULL](assets/media/c6-not-in-bay.jpg)
Câu hỏi này **không phải** "NOT IN khi không có kết quả thì ra NULL":

```sql
SELECT k.TENKHOA FROM KHOA k
WHERE k.MAKHOA NOT IN (SELECT 'X');
```

Subquery không có dòng nào. Không có NULL nào. Kết quả trả về **toàn bộ** các khoa — đúng.

Bẫy chỉ xảy ra khi **subquery chứa giá trị NULL**:

```sql
-- LOP có 1 lớp chưa gán khoa → LOP.MAKHOA = NULL
SELECT k.TENKHOA FROM KHOA k
WHERE k.MAKHOA NOT IN (SELECT l.MAKHOA FROM LOP l);     -- → 0 dòng, SAI
```

Vì `MAKHOA NOT IN ('K01','K02','K03', NULL)` không thể là ĐÚNG với bất kỳ giá trị nào: với `MAKHOA = 'K01'` thì đúng, với `MAKHOA = NULL` thì không xác định. Không dòng nào thoát ra được.

`NOT EXISTS` cùng câu hỏi trả về đúng:

```sql
SELECT k.TENKHOA FROM KHOA k
WHERE NOT EXISTS (SELECT 1 FROM LOP l WHERE l.MAKHOA = k.MAKHOA);
-- → K04 - Điện tử
```

**Khi nào `NOT IN` vẫn dùng được:** khi cột trong subquery là **khóa chính** thì không bao giờ NULL. Ví dụ `MASACH NOT IN (SELECT MASACH FROM CTPHIEUMUON)` — `MASACH` thuộc khóa chính gộp của `CTPHIEUMUON` nên an toàn, và cho kết quả giống hệt `NOT EXISTS` ở câu trên.

**Quy tắc:** cột khóa ngoại có thể NULL thì dùng `NOT EXISTS`. Không cần suy nghĩ.

### 8.3. `NOT LIKE` không trả về dòng NULL



![Bẫy NOT LIKE: dòng NULL biến mất](assets/media/c5b-bay-not-like.jpg)
![Bẫy NOT LIKE làm dòng NULL biến mất](assets/media/c5-bay-not-like.jpg)
Câu 15 đề 3: độc giả không ở Hà Nội.

```sql
SELECT MADG, HOTEN, DIACHI FROM DOCGIA
WHERE DIACHI NOT LIKE N'%Hà Nội%';
```

| MADG | HOTEN | DIACHI |
|---|---|---|
| DG03 | Lê Văn Chiến | Hải Phòng |
| DG04 | Phạm Thị Dung | Đà Nẵng |

`DG05` có `DIACHI` là NULL nên **không xuất hiện**. Ba ký tự `NULL` không thỏa điều kiện "không chứa Hà Nội" theo logic ba giá trị: NULL ở một ô không trả về TRUE cũng không trả về FALSE.

`DG05` có ở Hà Nội không? Không ai biết — dữ liệu không nói. Vậy nó **không thể khẳng định** là không ở Hà Nội. Cách viết bao gồm cả NULL:

```sql
SELECT MADG, HOTEN, DIACHI FROM DOCGIA
WHERE DIACHI IS NULL OR DIACHI NOT LIKE N'%Hà Nội%';
```

| MADG | HOTEN | DIACHI |
|---|---|---|
| DG03 | Lê Văn Chiến | Hải Phòng |
| DG04 | Phạm Thị Dung | Đà Nẵng |
| DG05 | Hoàng Minh Em | NULL |

Cách quyết định khi nào dùng bản nào: đọc kỹ câu hỏi. "Độc giả **không ở** Hà Nội" theo nghĩa thông thường thì bao gồm cả người chưa cung cấp địa chỉ. Nếu đề ghi rõ "có địa chỉ khác Hà Nội" thì mới loại NULL.

> Đây là lý do cột `DIACHI` nên để trống được, **không phải** lý do phải đặt `NOT NULL`. `NOT NULL` là để bảo đảm mỗi độc giả có một địa chỉ xác định — một ràng buộc về dữ liệu, không liên quan đến câu truy vấn. Nếu cột `DIACHI` được đặt `NOT NULL` thì `DG05` sẽ không tồn tại và bẫy này biến mất, nhưng dữ liệu thực tế vẫn có độc giả chưa cung cấp địa chỉ.

### Tự làm

1. Danh sách môn học chưa có sinh viên nào học.
2. Sinh viên chưa thi môn nào.
3. Nhà xuất bản chưa xuất bản cuốn nào được mượn.

---
---

## 9. Dạng 6 — Lập trình CSDL: ràng buộc, procedure, trigger, backup

![Dạng 6 — Lập trình CSDL: bốn kỹ năng của đề 4](assets/media/de4-dang-6-lap-trinh-csdl.png)
Năm dạng trước đều **trả lời câu hỏi**: đọc bảng, nối, đếm, tìm lớn nhất, loại trừ.
Dạng 6 khác: đề **bắt viết code làm thay đổi cơ sở dữ liệu**. Nếu kỳ thi giữ
3 đề cũ thì bỏ qua. Nhưng đề 4 của học kỳ này đã xuất hiện, và mất trọn điểm
phần này thì còn thiếu.

**Bốn kỹ năng, theo thứ tự đề thường ra:**

| # | Kỹ năng | Câu lệnh | Bẫy chính |
|---|---|---|---|
| 1 | Thêm ràng buộc | `ALTER TABLE ... ADD CONSTRAINT ... CHECK` | Bảng đã có dữ liệu vi phạm thì thêm không được |
| 2 | Stored procedure | `CREATE PROCEDURE ... GO` | `GO` không phải SQL; tham số viết `@TenBien` |
| 3 | Trigger | `CREATE TRIGGER ... AFTER INSERT, UPDATE, DELETE` | `inserted`/`deleted` rỗng tuỳ thao tác |
| 4 | Sao lưu | `BACKUP DATABASE ... TO DISK` | Đường dẫn phải trên máy chạy SQL Server |

Lướt nhanh qua cả bốn, phần sâu nằm ở [bài 03 — Đề 4](13-de4-lap-trinh-csdl.md).

### 9.1. Thêm ràng buộc `CHECK` vào bảng đã có dữ liệu

Đề 4 câu 3: *"Tạo bổ sung ràng buộc cho cột số lượng tồn của bảng hàng hoá nhận
giá trị lớn hơn 0."*

```sql
ALTER TABLE HANGHOA
ADD CONSTRAINT CK_HANGHOA_TON CHECK (SoLuongTon > 0);
```

Ba điều phải biết:

1. **SQL Server kiểm tra dữ liệu đang có trước khi thêm.** Nếu bảng đã có dòng
   vi phạm thì lệnh báo lỗi và ràng buộc **không được tạo** — không phải tạo
   xong rồi mới báo.
2. **Kiểm tra trước mà không đụng tới bảng:**

   ```sql
   SELECT MaHang, TenHang, SoLuongTon FROM HANGHOA WHERE SoLuongTon <= 0;
   ```

3. `CHECK` không tự sinh chỉ mục. Cần nó chạy nhanh thì phải khai báo thêm
   `INDEX` — nhưng đề không yêu cầu.

Sau khi thêm, nhập vi phạm sẽ bị chặn:

```sql
INSERT INTO HANGHOA (MaHang, TenHang, SoLuongTon) VALUES ('H99', N'Thử', -1);
-- Msg 547: The INSERT statement conflicted with the CHECK constraint "CK_HANGHOA_TON".
```

**Bẫy phụ đáng nhớ:** `Msg 547` dùng cho **cả** ràng buộc `CHECK` lẫn khóa ngoại.
Đừng thấy 547 rồi kết luận lỗi khóa ngoại — phải đọc phần message phía sau.

### 9.2. Stored procedure

Đề 4 câu 4: *"Tạo thủ tục hiển thị thông tin của một mặt hàng khi biết mã hàng."*

```sql
CREATE PROCEDURE dbo.HienThiHangHoa
    @MaHang CHAR(10)
AS
BEGIN
    SELECT MaHang, TenHang, SoLuongTon
    FROM HANGHOA
    WHERE MaHang = @MaHang;
END
GO

EXEC dbo.HienThiHangHoa 'H05';
```

Bốn điểm, tất cả đều là bẫy cụ thể của SQL Server:

**1. `GO` không phải SQL.** Trong SSMS, `CREATE PROCEDURE` phải là câu lệnh
đầu tiên của một lô. Không có `GO` ở giữa thì SQL Server báo:
`Msg 102: Incorrect syntax near 'GO'`. Chạy file `.sql` thì bắt buộc có `GO`.

**2. Tham số viết `@TenBien`, không viết kiểu trước.** `WHERE MaHang = CHAR(10)`
là sai — sai cả kiểu dữ liệu lẫn ý nghĩa.

**3. Procedure không nên `SELECT *`.** `SELECT *` khiến kết quả phụ thuộc vào thứ
tự cột trong bảng. Đề muốn *"mã hàng, tên hàng, số lượng tồn"* thì liệt kê đúng
3 cột đó.

**4. `CREATE PROCEDURE` không nằm trong `CREATE TABLE`.** Câu 1 tạo CSDL và bảng,
câu 4 tạo procedure — hai việc tách biệt, điểm số riêng. Không gộp vào một khối.

### 9.3. Trigger — phần khó nhất của đề 4

Đề 4 câu 5: *"Tạo trigger cập nhật lại tiền bán của mỗi hoá đơn khi chỉnh sửa
thông tin mặt hàng được lưu trong bảng CTHOADON. Biết công thức tính tiền bán
trên mỗi hoá đơn là `TienBan = Sum(SoLuong * Dongia)`."*

![Ba bảng tạm trong trigger: inserted và deleted](assets/media/de4-trigger-inserted-deleted.png)
Một trigger `AFTER INSERT, UPDATE, DELETE` nhìn vào **hai bảng tạm**:

- `inserted` — dòng **sau** khi thay đổi
- `deleted` — dòng **trước** khi thay đổi

| Thao tác | `inserted` | `deleted` | Phải tính lại `TienBan` cho |
|---|---|---|---|
| `INSERT` | có dòng | rỗng | `MaHD` trong `inserted` |
| `DELETE` | rỗng | có dòng | `MaHD` trong `deleted` |
| `UPDATE` | có dòng | có dòng | **cả hai** |

```sql
CREATE TRIGGER TR_CTHD_TinhLaiTienBan
ON CTHOADON
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Xoá: inserted rỗng, chỉ còn deleted
    IF NOT EXISTS (SELECT 1 FROM inserted) AND EXISTS (SELECT 1 FROM deleted)
    BEGIN
        UPDATE h
        SET h.TienBan = ISNULL((
                SELECT SUM(ct.SoLuong * ct.Dongia)
                FROM CTHOADON ct WHERE ct.MaHD = h.MaHD), 0)
        FROM HOADON h
        WHERE h.MaHD IN (SELECT MaHD FROM deleted);
        RETURN;
    END

    -- 2. Thêm mới: chỉ có inserted, chưa có deleted
    IF NOT EXISTS (SELECT 1 FROM deleted) AND EXISTS (SELECT 1 FROM inserted)
    BEGIN
        UPDATE h
        SET h.TienBan = ISNULL((
                SELECT SUM(ct.SoLuong * ct.Dongia)
                FROM CTHOADON ct WHERE ct.MaHD = h.MaHD), 0)
        FROM HOADON h
        WHERE h.MaHD IN (SELECT MaHD FROM inserted);
        RETURN;
    END

    -- 3. Sửa: có cả hai. MaHD có thể bị đổi, nên tính lại cả hoá đơn cũ lẫn mới
    UPDATE h
    SET h.TienBan = ISNULL((
            SELECT SUM(ct.SoLuong * ct.Dongia)
            FROM CTHOADON ct WHERE ct.MaHD = h.MaHD), 0)
    FROM HOADON h
    WHERE h.MaHD IN (SELECT MaHD FROM inserted)
       OR h.MaHD IN (SELECT MaHD FROM deleted);
END
GO
```

**Bẫy chết người: viết một khối `UPDATE` chung cho cả ba trường hợp.**

```sql
-- SAI: khi xoá dòng, inserted rỗng nên không khớp dòng nào
UPDATE h SET h.TienBan = ... FROM HOADON h
WHERE h.MaHD IN (SELECT MaHD FROM inserted);
```

Khi xoá, `inserted` rỗng nên `WHERE MaHD IN (SELECT MaHD FROM inserted)` không
khớp dòng nào — tổng tiền hoá đơn đó **không bao giờ được cập nhật** và vẫn giữ
số tiền cũ. Không báo lỗi, chỉ ra sai dữ liệu.

**Bẫy thứ hai, ít ai để ý: sửa `MaHD` của một dòng chi tiết.** Dòng đó chuyển từ
hoá đơn `HD001` sang `HD002`. Nếu chỉ tính lại theo `inserted`, hoá đơn `HD001`
mất một dòng chi tiết mà tổng tiền của nó không được sửa. Vì vậy nhánh `UPDATE`
phải tính cả `inserted` lẫn `deleted`.

**Đã chạy thật, kết quả từng bước:**

| Bước | `TienBan` của `HD001` | Kiểm tra tay |
|---|---|---|
| Nạp dữ liệu xong | 3 450 000 | 2 × 1.500.000 + 1 × 450.000 |
| `UPDATE ... SET SoLuong = 5` | 7 950 000 | 5 × 1.500.000 + 450.000 |
| `DELETE` dòng (HD001, H01) | 450 000 | còn lại 1 × 450.000 |

**Vì sao phải bọc `ISNULL(..., 0)`:** xoá hết dòng chi tiết của một hoá đơn thì
`SUM(SoLuong * Dongia)` trả về `NULL` — hàm tổng hợp trên tập rỗng trả `NULL`,
không phải 0 (xem lại mục 8.3 và bài 01 mục 11.3). Không bọc thì `TienBan` bị ghi
đè bằng `NULL` và mọi câu `WHERE TienBan > 0` sau đó sẽ bỏ sót hoá đơn đó.

`ISNULL(x, 0)` và `COALESCE(x, 0)` cho cùng kết quả ở đây. `COALESCE` là cách viết
chuẩn SQL, dùng được từ 2 tham số trở lên; `ISNULL` chỉ 2 và là hàm riêng của
SQL Server. Đề thi dùng SQL Server nên cả hai đều được.

**Một lựa chọn thiết kế khác, cũng đúng:** nếu giảng viên chấp nhận bỏ cột
`TienBan` khỏi `HOADON` và tính mỗi khi cần, thì không cần trigger:

```sql
SELECT hd.MaHD, SUM(ct.SoLuong * ct.Dongia) AS TienBan
FROM HOADON hd JOIN CTHOADON ct ON ct.MaHD = hd.MaHD
GROUP BY hd.MaHD;
```

Đây là lựa chọn đúng về thiết kế CSDL vì không có nguy cơ dữ liệu sai. Nhưng
**đề đã yêu cầu tạo trigger và cột `TienBan` đã có trong lược đồ**, nên làm bài
phải theo đề.

### 9.4. Sao lưu CSDL

```sql
BACKUP DATABASE QuanLyBanHang
TO DISK = 'D:\Backup\QuanLyBanHang.bak'
WITH INIT;
```

Trên SSMS: chuột phải vào database → **Tasks** → **Back Up…**

- **Source**: `Database`
- **Backup type**: `Full`
- **Destination**: `Disk`, chọn đường dẫn ổ đĩa khác

Ba chỗ dễ sai:

1. **Đường dẫn phải nằm trên máy chạy SQL Server**, không phải máy đang mở
   SSMS. Nếu SQL Server chạy ở máy khác qua mạng, chọn `\\tenserver\share`
   chứ không phải `D:\backup` trên máy bạn.
2. **Đuôi file phải là `.bak`.** SQL Server tự thêm nếu thiếu.
3. **Phải có quyền `sysadmin`** hoặc quyền ghi vào thư mục đích.

Kiểm tra bản sao lưu đã đủ:

```sql
RESTORE FILELISTONLY FROM DISK = 'D:\Backup\QuanLyBanHang.bak';
```

Sao lưu khác với sao chép file: file `.mdf` khi copy tay sẽ sai vì nó đang được
SQL Server giữ khoá. Chỉ `BACKUP DATABASE` mới tạo được bản sao lưu đúng.

### 9.5. Sáu điểm dễ mất trong dạng 6

1. `GO` thiếu sau `CREATE PROCEDURE` và `CREATE TRIGGER` → SQL Server báo lỗi cú pháp.
2. Trigger viết một khối chung cho `INSERT/UPDATE/DELETE` → xoá dòng không cập
   nhật tổng tiền.
3. Sửa `MaHD` của dòng chi tiết → hoá đơn cũ giữ tổng tiền cũ.
4. Không bọc `ISNULL(..., 0)` → xoá hết dòng thì `TienBan` thành `NULL`.
5. `> 20` viết thành `>= 20` → lấy thừa hàng có đúng 20.
6. Tham số procedure viết `WHERE MaHang = CHAR(10)` thay vì `@MaHang`.

### Tự làm

1. Viết `ALTER TABLE` thêm ràng buộc cho cột `DIEM` chỉ nhận từ 0 đến 10, rồi
   chạy câu kiểm tra dữ liệu sẵn có trước khi thêm.
2. Viết stored procedure lấy danh sách hoá đơn theo khoảng ngày, có tham số
   `@Tu` và `@Den`.
3. Viết trigger tính lại `TienBan`, rồi thử đủ ba thao tác INSERT, UPDATE,
   DELETE — kết quả mỗi bước phải khớp tay tính.
4. Đổi nhánh `UPDATE` trong trigger thành chỉ lọc theo `inserted`, chạy lại và
   xác nhận hoá đơn cũ bị sai. Đây là cách tự thấy bẫy thay vì chỉ đọc.

---

## 10. Đề 3 — Lời giải đầy đủ


![Lược đồ quan hệ của bài quản lý thư viện](assets/media/f1-luoc-do-thu-vien.jpg)
Lược đồ:

```
SACH        (MASACH, TENSACH, NXB, NAMXB, THELOAI, SOLUONG)
DOCGIA      (MADG, HOTEN, DT, DIACHI)
PHIEUMUON   (MAPM, MADG, NGAYMUON)          ─┐
                                              ├─ 1-N
CTPHIEUMUON (MAPM, MASACH, SOLUONG, NGAYHENTRA) ─┘
DOCGIA ──1-N── PHIEUMUON
SACH   ──1-N── CTPHIEUMUON
```

**Quan hệ N-N:** một độc giả mượn nhiều cuốn sách trong nhiều phiếu mượn, và một cuốn sách được nhiều độc giả mượn qua nhiều phiếu. Bảng `CTPHIEUMUON` nối `PHIEUMUON` với `SACH` — nó là bảng cầu nối, nên khóa chính gộp `(MAPM, MASACH)`.

**Thứ tự tạo bảng:** `SACH` → `DOCGIA` → `PHIEUMUON` → `CTPHIEUMUON`. Tạo bảng con trước sẽ báo lỗi vì bảng cha chưa tồn tại.

Script đầy đủ ở [mục 2.1](#21-script-tạo-chạy-trên-sql-server).

### 10.1. Câu 1 — Tạo CSDL, bảng, khóa, nhập liệu

**Ghi vào bài ba điều trước khi viết SQL:**

1. "Tổng số sách" = `SUM(CTPHIEUMUON.SOLUONG)` trong chi tiết phiếu mượn
2. "Số lượt mượn" = `COUNT(*)` số dòng chi tiết phiếu mượn
3. Thứ tự tạo bảng cha trước, bảng con sau

```sql
CREATE DATABASE Quanthuvien_HoTenSV;
GO
USE Quanthuvien_HoTenSV;
GO
-- CREATE TABLE + INSERT: xem mục 2.1
```

**Phần "xác định mối quan hệ giữa các bảng" trên máy:** mở SSMS → Database Diagrams → Add New Diagram → thêm 4 bảng → hệ thống tự hiện các đường quan hệ theo khóa ngoại đã khai báo. Nếu thầy chấm theo lược đồ vẽ thì đây là phần cần có.

Đọc lại từng vế của `FOREIGN KEY` — đó là cách nắm quan hệ:

| Cột khóa ngoại | Bảng cha | Nghĩa |
|---|---|---|
| `PHIEUMUON.MADG` | `DOCGIA(MADG)` | 1 độc giả có nhiều phiếu mượn |
| `CTPHIEUMUON.MAPM` | `PHIEUMUON(MAPM)` | 1 phiếu mượn có nhiều dòng chi tiết |
| `CTPHIEUMUON.MASACH` | `SACH(MASACH)` | 1 cuốn sách xuất hiện ở nhiều phiếu |

### 10.2. Câu 2 — Sách của NXB Giáo dục xuất bản năm 2022

```sql
SELECT MASACH, TENSACH, NAMXB FROM SACH
WHERE NXB = N'Nhà xuất bản Giáo dục' AND NAMXB = 2022
ORDER BY MASACH;
```

| MASACH | TENSACH | NAMXB |
|---|---|---|
| S01 | Lập trình C | 2022 |
| S02 | Cơ sở dữ liệu | 2022 |

Sợ gõ lệch dấu tiếng Việt thì dùng `LIKE`:

```sql
WHERE NXB LIKE N'%Giáo dục%' AND NAMXB = 2022
```

**Cảnh báo collation:** so sánh chuỗi không phân biệt hoa thường có thể không nhạy với dấu tiếng Việt tùo collation của database. `Giáo dục` trong dữ liệu và `giao duc` không dấu khi so sánh có thể trùng. Giải pháp chắc chắn: luôn gõ đúng chính tả có dấu, và luôn dùng `N'...'`.

### 10.3. Câu 3 — Độc giả có địa chỉ ở Hà Nội

```sql
SELECT MADG, HOTEN, DIACHI FROM DOCGIA
WHERE DIACHI LIKE N'%Hà Nội%' ORDER BY MADG;
```

| MADG | HOTEN | DIACHI |
|---|---|---|
| DG01 | Nguyễn Văn An | Hà Nội |
| DG02 | Trần Thị Bình | Hà Nội |

### 10.4. Câu 4 — Sách được mượn ngày 20/11/2023

```sql
SELECT DISTINCT s.MASACH, s.TENSACH, p.NGAYMUON
FROM SACH s
JOIN CTPHIEUMUON c ON c.MASACH = s.MASACH
JOIN PHIEUMUON  p ON p.MAPM   = c.MAPM
WHERE p.NGAYMUON = '20231120'
ORDER BY s.MASACH;
```

| MASACH | TENSACH | NGAYMUON |
|---|---|---|
| S01 | Lập trình C | 2023-11-20 |
| S02 | Cơ sở dữ liệu | 2023-11-20 |
| S03 | Giải tích 1 | 2023-11-20 |
| S04 | Dế Mèn phiêu lưu ký | 2023-11-20 |
| S05 | Truyện cổ tích Việt Nam | 2023-11-20 |
| S08 | Lập trình C++ | 2023-11-20 |

**`DISTINCT` là bắt buộc.** `S01` nằm trong cả `PM01` và `PM02`, cả hai đều mượn ngày 20/11. Bỏ `DISTINCT` sẽ ra 7 dòng với `S01` lặp 2 lần — đã kiểm chạy thật.

### 10.5. Câu 5 — Tổng số sách mượn ngày 20/11/2023

```sql

![Một câu hỏi, ba cách đếm, ba con số](assets/media/f2-ba-cach-dem.jpg)
SELECT p.NGAYMUON, SUM(c.SOLUONG) AS TONGSOSACH
FROM PHIEUMUON p JOIN CTPHIEUMUON c ON c.MAPM = p.MAPM
WHERE p.NGAYMUON = '20231120'
GROUP BY p.NGAYMUON;
```

| NGAYMUON | TONGSOSACH |
|---|---|
| 2023-11-20 | 11 |

Cách hiểu thay thế, nếu thầy hiểu "tổng số sách" là số lượt mượn:

```sql
SELECT p.NGAYMUON, COUNT(*) AS TONGLUOTMUON
FROM PHIEUMUON p JOIN CTPHIEUMUON c ON c.MAPM = p.MAPM
WHERE p.NGAYMUON = '20231120'
GROUP BY p.NGAYMUON;
-- → 7
```

### 10.6. Câu 6 — Tổng số sách độc giả DG01 đã mượn

```sql
SELECT d.MADG, d.HOTEN, SUM(c.SOLUONG) AS TONGSOSACH
FROM DOCGIA d
JOIN PHIEUMUON  p ON p.MADG = d.MADG
JOIN CTPHIEUMUON c ON c.MAPM = p.MAPM
WHERE d.MADG = N'DG01'
GROUP BY d.MADG, d.HOTEN;
```

| MADG | HOTEN | TONGSOSACH |
|---|---|---|
| DG01 | Nguyễn Văn An | 9 |

`DG01` có 3 phiếu mượn (PM01, PM03, PM05) với 7 dòng chi tiết. `SUM` ra 9 cuốn, `COUNT(*)` ra 7 lượt.

### 10.7. Câu 7 — Tổng số sách thể loại thiếu nhi đã được mượn

```sql
SELECT s.THELOAI, SUM(c.SOLUONG) AS TONGSOSACH
FROM SACH s JOIN CTPHIEUMUON c ON c.MASACH = s.MASACH
WHERE s.THELOAI = N'Thiếu nhi'
GROUP BY s.THELOAI;
```

| THELOAI | TONGSOSACH |
|---|---|
| Thiếu nhi | 7 |

### 10.8. Câu 8 — Tổng số sách mượn theo thể loại

```sql
SELECT s.THELOAI, SUM(c.SOLUONG) AS TONGSOSACH
FROM SACH s JOIN CTPHIEUMUON c ON c.MASACH = s.MASACH
GROUP BY s.THELOAI ORDER BY s.THELOAI;
```

| THELOAI | TONGSOSACH |
|---|---|
| Công nghệ thông tin | 9 |
| Kỹ năng | 1 |
| Thiếu nhi | 7 |
| Toán | 1 |

### 10.9. Câu 9 — Tổng số sách mượn theo nhà xuất bản

```sql
SELECT s.NXB, SUM(c.SOLUONG) AS TONGSOSACH
FROM SACH s JOIN CTPHIEUMUON c ON c.MASACH = s.MASACH
GROUP BY s.NXB ORDER BY s.NXB;
```

| NXB | TONGSOSACH |
|---|---|
| Nhà xuất bản Giáo dục | 10 |
| Nhà xuất bản Kim Đồng | 7 |
| Nhà xuất bản Tổng hợp | 1 |

Chỉ có 3 dòng vì `S07` (Bách khoa) chưa có ai mượn — câu 14 hỏi chính cuốn đó.

### 10.10. Câu 10 — Độc giả mượn nhiều sách nhất

```sql
SELECT d.MADG, d.HOTEN, SUM(c.SOLUONG) AS TONGSOSACH
FROM DOCGIA d
JOIN PHIEUMUON  p ON p.MADG = d.MADG
JOIN CTPHIEUMUON c ON c.MAPM = p.MAPM
GROUP BY d.MADG, d.HOTEN
HAVING SUM(c.SOLUONG) >= ALL (
    SELECT SUM(c2.SOLUONG)
    FROM PHIEUMUON p2 JOIN CTPHIEUMUON c2 ON c2.MAPM = p2.MAPM
    GROUP BY p2.MADG)
ORDER BY d.MADG;
```

| MADG | HOTEN | TONGSOSACH |
|---|---|---|
| DG01 | Nguyễn Văn An | 9 |

Trong dữ liệu mẫu chỉ có một người đạt đỉnh nên `>= ALL` và `TOP 1 WITH TIES` cho cùng kết quả. Nếu thêm một độc giả mượn 9 cuốn nữa, `>= ALL` trả cả hai, `TOP 1` thì không.

### 10.11. Câu 11 — Độc giả mượn trên 3 cuốn sách

```sql
SELECT d.MADG, d.HOTEN, SUM(c.SOLUONG) AS TONGSOSACH
FROM DOCGIA d
JOIN PHIEUMUON  p ON p.MADG = d.MADG
JOIN CTPHIEUMUON c ON c.MAPM = p.MAPM
GROUP BY d.MADG, d.HOTEN
HAVING SUM(c.SOLUONG) > 3
ORDER BY d.MADG;
```

| MADG | HOTEN | TONGSOSACH |
|---|---|---|
| DG01 | Nguyễn Văn An | 9 |
| DG04 | Phạm Thị Dung | 4 |

"Trên 3" là `> 3`, không phải `>= 3`. `DG02` mượn đúng 3 cuốn nên không có mặt — dùng `>= 3` là sai.

### 10.12. Câu 12 — Cuốn sách được mượn nhiều nhất

Đề nói "tổng số lượt mượn" → đếm số dòng chi tiết:

```sql
SELECT s.MASACH, s.TENSACH, COUNT(*) AS SOLUOTMUON
FROM SACH s JOIN CTPHIEUMUON c ON c.MASACH = s.MASACH
GROUP BY s.MASACH, s.TENSACH
HAVING COUNT(*) >= ALL (SELECT COUNT(*) FROM CTPHIEUMUON GROUP BY MASACH)
ORDER BY s.MASACH;
```

| MASACH | TENSACH | SOLUOTMUON |
|---|---|---|
| S04 | Dế Mèn phiêu lưu ký | 4 |

Đếm lượt bằng `COUNT(*)`, không phải `SUM(SOLUONG)`. Câu này hỏi "lượt mượn" nên dùng `COUNT`.

### 10.13. Câu 13 — Sách được mượn trên 3 lần

```sql
SELECT s.MASACH, s.TENSACH, COUNT(*) AS SOLUOTMUON
FROM SACH s JOIN CTPHIEUMUON c ON c.MASACH = s.MASACH
GROUP BY s.MASACH, s.TENSACH
HAVING COUNT(*) > 3
ORDER BY s.MASACH;
```

| MASACH | TENSACH | SOLUOTMUON |
|---|---|---|
| S04 | Dế Mèn phiêu lưu ký | 4 |

### 10.14. Câu 14 — Sách chưa bao giờ có khách mượn

```sql
SELECT s.MASACH, s.TENSACH, s.NXB FROM SACH s
WHERE NOT EXISTS (SELECT 1 FROM CTPHIEUMUON c WHERE c.MASACH = s.MASACH)
ORDER BY s.MASACH;
```

| MASACH | TENSACH | NXB |
|---|---|---|
| S07 | Mạng máy tính | Nhà xuất bản Bách khoa |

`MASACH NOT IN (SELECT MASACH FROM CTPHIEUMUON)` cho kết quả giống hệt vì `MASACH` thuộc khóa chính gộp nên không NULL. Dùng `NOT EXISTS` vẫn tốt hơn — không phải suy luận.

### 10.15. Câu 15 — Độc giả không ở Hà Nội

```sql
SELECT MADG, HOTEN, DIACHI FROM DOCGIA
WHERE DIACHI NOT LIKE N'%Hà Nội%'
ORDER BY MADG;
```

Bổ sung người có địa chỉ NULL — xem lý do ở [mục 8.3](#83-not-like-không-trả-về-dòng-null):

```sql
WHERE DIACHI IS NULL OR DIACHI NOT LIKE N'%Hà Nội%'
```

### 10.16. Câu 16 — Sách không do NXB Giáo dục xuất bản

```sql
SELECT MASACH, TENSACH, NXB, NAMXB FROM SACH
WHERE NXB <> N'Nhà xuất bản Giáo dục'
ORDER BY MASACH;
```

| MASACH | TENSACH | NXB | NAMXB |
|---|---|---|---|
| S04 | Dế Mèn phiêu lưu ký | Nhà xuất bản Kim Đồng | 2022 |
| S05 | Truyện cổ tích Việt Nam | Nhà xuất bản Kim Đồng | 2020 |
| S06 | Đắc nhân tâm | Nhà xuất bản Tổng hợp | 2019 |
| S07 | Mạng máy tính | Nhà xuất bản Bách khoa | 2022 |

`S08` do Giáo dục xuất bản nên không có mặt. Lỗi hay gặp nhất ở câu này là thiếu `N` — thiếu `N` thì so sánh tiếng Việt có dấu với dữ liệu trong bảng có thể không khớp, kết quả ra sai.

---

## 11. Bản đồ 43 câu của 3 đề + 6 câu đề 4 → dạng đã học



![Bản đồ 43 câu của 3 đề rơi vào 5 dạng](assets/media/f5-ban-do-43-cau.jpg)
![Đề 3 dùng đúng 5 dạng câu hỏi đã học](assets/media/f4-de-3-dung-5-dang.jpg)
Mục này để tự kiểm tra xem đã phủ đề chưa. Mỗi câu đề ánh xạ về đúng một dạng đã dạy ở mục 4–9.

| Đề | Câu | Nội dung | Dạng đã học | Đủ? |
|---|---|---|---|---|
| 1 | 1 | Môn số tiết 30–90 | 4 — `BETWEEN` | ✅ |
| 1 | 2 | SV lớp D16CNPM2 điểm 6–8 | 5 — `JOIN` + `DISTINCT` | ✅ |
| 1 | 3 | Môn <60 tiết của SV khoa K01 | 5 — nối 4 bảng | ✅ |
| 1 | 4 | SV khoa K01 học HQTCSDL điểm <5 | 5 — nối 4 bảng | ✅ |
| 1 | 5 | Tên khoa + số lớp **trong từng khoa** | 5.3 — `LEFT JOIN` + `COUNT(col)` | ✅ |
| 1 | 6 | SV học **trên** 3 môn | 6.1 — `HAVING > 3` | ✅ |
| 1 | 7 | Khoa có ít nhất 3 lớp | 6 — `HAVING >= 3` | ✅ |
| 1 | 8 | Lớp có sĩ số **thực** ít nhất 3 | 5.3 — `LEFT JOIN` + `HAVING` | ✅ |
| 1 | 9 | Khoa có nhiều nhất N sinh viên | 6 — `LEFT JOIN` ×2 + `HAVING` | ✅ |
| 1 | 10 | Môn >30 tiết, ít nhất 2 SV học | 6.2 — `WHERE` + `HAVING` | ✅ |
| 1 | 11 | Môn số tiết lớn nhất | 7 — `>= ALL` | ✅ |
| 2 | 1 | Môn 30–90 tiết | 4 — `BETWEEN` | ✅ |
| 2 | 2 | SV lớp D13TMDT điểm 6–8 | 5 — `JOIN` + `DISTINCT` | ✅ |
| 2 | 3 | Môn <60 tiết khoa K01 | 5 — nối 4 bảng | ✅ |
| 2 | 4 | SV khoa K01 học `HEQTCSDL` điểm <5 | 5 — `JOIN` + `DISTINCT` | ⚠️ đề viết sai chính tả |
| 2 | 5 | Tên khoa + số lớp | 5.3 — `LEFT JOIN` + `GROUP BY` khóa | ✅ |
| 2 | 6 | SV học **trên** 5 môn | 6.1 — `HAVING > 5` | ✅ |
| 2 | 7 | Khoa có ít nhất 3 lớp | 6 — `HAVING >= 3` | ✅ |
| 2 | 8 | Lớp có sĩ số thực ít nhất 3 | 5.3 — `LEFT JOIN` + `HAVING` | ✅ |
| 2 | 9 | Khoa có nhiều nhất N sinh viên | 6 — `LEFT JOIN` ×2 | ✅ |
| 2 | 10 | Môn >30 tiết, ít nhất 3 SV học | 6.2 | ✅ |
| 2 | 11 | Môn số tiết lớn nhất | 7 — `>= ALL` | ✅ |
| 2 | 12 | SV học nhiều môn nhất | 7 — `>= ALL` / `TOP 1 WITH TIES` | ✅ |
| 2 | 13 | Môn có nhiều SV học nhất | 7 + 6.3 — `GROUP BY` khóa | ✅ |
| 2 | 14 | SV **nữ** điểm TB cao nhất | 6.5 — `AVG` + alias riêng | ✅ |
| 2 | 15 | Môn chưa có SV học | 8 — `NOT EXISTS` | ✅ |
| 2 | 16 | Đếm SV theo lớp | 5.3 | ✅ |
| 3 | 1 | Tạo CSDL + 4 bảng + nhập liệu | 2.1 + mục 2.1 | ✅ |
| 3 | 2 | Sách NXB Giáo dục năm 2022 | 4 — `WHERE` + `N'...'` | ✅ |
| 3 | 3 | Độc giả ở Hà Nội | 4 — `LIKE` | ✅ |
| 3 | 4 | Sách mượn ngày 20/11/2023 | 5 — `DISTINCT` bắt buộc | ✅ |
| 3 | 5 | Tổng sách mượn 20/11 | 6.4 — `SUM` hoặc `COUNT` | ⚠️ đề không phân định |
| 3 | 6 | Tổng sách DG01 đã mượn | 6.4 — `SUM` | ✅ |
| 3 | 7 | Tổng sách thiếu nhi đã mượn | 6 — `WHERE` + `GROUP BY` | ✅ |
| 3 | 8 | Tổng sách mượn theo thể loại | 6 — `GROUP BY` | ✅ |
| 3 | 9 | Tổng sách mượn theo NXB | 6 — `GROUP BY` | ✅ |
| 3 | 10 | DG mượn nhiều sách nhất | 7 — `>= ALL` | ✅ |
| 3 | 11 | DG mượn **trên** 3 cuốn | 6.1 — `HAVING > 3` | ✅ |
| 3 | 12 | Sách mượn nhiều nhất (lượt) | 6.4 + 7 — `COUNT` | ✅ |
| 3 | 13 | Sách mượn **trên** 3 lần | 6.1 — `HAVING > 3` | ✅ |
| 3 | 14 | Sách chưa bao giờ có khách mượn | 8 — `NOT EXISTS` | ✅ |
| 3 | 15 | Độc giả không ở Hà Nội | 8.3 — `NOT LIKE` + NULL | ✅ |
| 3 | 16 | Sách không do NXB Giáo dục | 4 — `<>` + `N'...'` | ✅ |

**Đề 4 — dạng 6 (lập trình CSDL), 6 câu:**

| Đề | Câu | Nội dung | Dạng đã học | Đủ? |
|---|---|---|---|---|
| 4 | 1 | Tạo CSDL + 3 bảng + khóa + nhập liệu | 2.1 + mục 2.1 | ✅ |
| 4 | 2 | Mặt hàng tồn **lớn hơn** 20 | 4 — `WHERE > 20` | ✅ |
| 4 | 3 | Thêm ràng buộc `SoLuongTon > 0` | **9.1** — `ALTER TABLE ... CHECK` | ✅ |
| 4 | 4 | Stored procedure xem mặt hàng | **9.2** — `CREATE PROCEDURE` + `GO` | ✅ |
| 4 | 5 | Trigger cập nhật `TienBan` | **9.3** — `inserted`/`deleted` | ⚠️ dễ viết 1 khối chung |
| 4 | 6 | Backup CSDL ra ổ đĩa khác | **9.4** — `BACKUP DATABASE` | ⚠️ dễ chọn sai đường dẫn |

Ba câu cuối **không thuộc 5 dạng truy vấn** — đó là lý do đề 4 tách riêng.
Câu 5 là câu khó nhất của cả đề: chỉ sai ở chỗ viết một khối `UPDATE` chung cho
cả ba thao tác là nhánh `DELETE` không bao giờ cập nhật tổng tiền.

**Đọc bảng này như thế nào:** cột "Đủ?" trả lời "còn thiếu gì". Hai mục ⚠️ ở đề 1–3 đều là **lỗi của đề**, không phải thiếu học — xem Phụ lục A. Hai mục ⚠️ ở đề 4 là **bẫy thật trong cách làm**, nằm ở mục 9.3 và 9.4: nhớ chia ba nhánh trigger và nhớ đường dẫn backup phải nằm trên máy chạy SQL Server.

Muốn tự kiểm tra: đổi cột "Đủ?" thành phần trả lời của bạn, rồi xem đáp ở cuối từng mục.

## 12. Đọc câu hỏi như thế nào — bốn bước tách SQL ra khỏi câu tiếng Việt




![Bốn bước tách SQL khỏi câu tiếng Việt](assets/media/video-bon-buoc-doc-de.mp4)
![Đếm cái gì — đó là điều bài hỏi](assets/media/g2-dem-cai-gi.jpg)
![Bốn bước tách SQL khỏi câu tiếng Việt](assets/media/c4-bon-buoc-doc-de.jpg)
Mục 4–8 dạng công thức. Mục này dạy **làm sao biết dùng công thức nào** khi câu hỏi viết bằng tiếng Việt.

### 12.1. Bốn bước, luôn theo thứ tự này

**Bước 1 — Chốt danh từ: câu hỏi cần những cột nào**

Đọc câu, gạch chân mọi thứ phải xuất hiện trong kết quả. Mỗi cột đó nằm ở một bảng.

> *"Liệt kê họ tên sinh viên lớp D16CNPM2 kèm tên môn và điểm"*

Gạch chân: `HOTEN` → bảng `SINHVIEN`. `TENMH` → bảng `MONHOC`. `DIEM` → bảng `KETQUA`. Chữ "tên lớp" — câu có bảo hiện tên lớp không? Không, chỉ lọc theo mã lớp → **không cần cột `TENLOP`**.

Bước 1 chỉ làm một việc: xác định bảng nào **chắc chắn** phải có. Chưa lo bảng phụ.

**Bước 2 — Chốt đường đi: bắt cầu bằng cách nào**

Bảng `SINHVIEN` và `MONHOC` không chạm nhau. Giữa chúng là `KETQUA`.

Đừng đoán — nhìn vào khóa ngoại:

| Muốn nối | Khóa ngoại nằm ở | Nối bằng |
|---|---|---|
| `SINHVIEN` ↔ `KETQUA` | `KETQUA.MASV` | `s.MASV = k.MASV` |
| `MONHOC` ↔ `KETQUA` | `KETQUA.MAMH` | `m.MAMH = k.MAMH` |
| `SINHVIEN` ↔ `LOP` | `SINHVIEN.MALOP` | `s.MALOP = l.MALOP` |
| `LOP` ↔ `KHOA` | `LOP.MAKHOA` | `l.MAKHOA = k.MAKHOA` |

Nối N bảng cần **N−1** điều kiện. Ba bảng ở trên cần 2.

**Bước 3 — Chốt hình dạng: có gom nhóm không**

Gom nhóm chỉ khi câu hỏi chứa một trong các từ:

> *bao nhiêu, số lượng, tổng, trung bình, mỗi, theo, nhất, nhiều nhất, ít nhất, trên N, dưới N*

Có **"bao nhiêu" hoặc "mỗi/theo"** mà không có điều kiện lọc sau số đếm → `GROUP BY` + `HAVING`.
Có **"nhiều nhất / cao nhất / lớn nhất"** → dạng 7, dùng `>= ALL`.
Không có từ nào trong danh sách → lọc đơn giản, không gom nhóm.

Điểm mấu chốt: **gộp nhóm nhưng câu chỉ hỏi tên** thì không cần gom. *"Tên khoa nào có ít nhất 3 lớp"* cần `HAVING` để đếm, nhưng *"*Tên những khoa có **ít nhất 3 lớp***"* và *"*Liệt kê tên khoa*"* là hai câu khác nhau.

**Bước 4 — Chốt chỗ lọc: `WHERE` hay `HAVING`**

| Điều kiện nói về | Đặt ở |
|---|---|
| Một dòng cụ thể trong bảng gốc (số tiết, điểm, tên lớp) | `WHERE` |
| Kết quả sau khi gom (số lượng, tổng, điểm trung bình) | `HAVING` |
| Cột của bảng bên phải khi dùng `LEFT JOIN` và muốn giữ dòng trống | `ON` |

Ba câu hỏi kiểm tra trước khi viết `WHERE`:

1. Cột này có nằm trong `GROUP BY` không? Nếu có → `HAVING`.
2. Điều kiện có thuộc bảng bên phải của `LEFT JOIN` không? Nếu có và muốn giữ dòng trống → `ON`.
3. Có chữ "sau khi đếm/gom" không? Nếu có → `HAVING`.

### 12.2. Bốn bước áp dụng vào ba câu thật

**Câu A — *"Liệt kê danh sách tên khoa và số lượng lớp trong từng khoa."***

| Bước | Làm | Kết quả |
|---|---|---|
| 1 | Cần `TENKHOA` và "số lượng lớp" | `KHOA` chắc chắn có; số lớp đếm từ `LOP.MALOP` → cần `LOP` |
| 2 | Nối bằng khóa ngoại | `k.MAKHOA = l.MAKHOA` — 1 điều kiện cho 2 bảng |
| 3 | Có "số lượng" + "trong từng" | Gom nhóm, không có điều kiện lọc sau số đếm |
| 4 | Chữ "trong từng" có nghĩa khoa nào cũng phải có mặt | Phải giữ dòng khoa không có lớp → `LEFT JOIN` |

```sql
SELECT k.TENKHOA, COUNT(l.MALOP) AS SOLOP
FROM KHOA k
LEFT JOIN LOP l ON k.MAKHOA = l.MAKHOA
GROUP BY k.MAKHOA, k.TENKHOA;
```

Bước 4 là bước quyết định. Bỏ nó thì câu sai, dù ba bước trước vẫn đúng.

**Câu B — *"Cho biết họ tên những sinh viên nữ có điểm thi từ 6 đến 8."***

| Bước | Làm | Kết quả |
|---|---|---|
| 1 | Cần `HOTEN` và "điểm" | `SINHVIEN` + `KETQUA` |
| 2 | Nối bằng `s.MASV = k.MASV` | 1 điều kiện |
| 3 | Không có từ đếm hay "nhất" | Không gom nhóm |
| 4 | `GIOITINH = N'Nữ'` và `DIEM BETWEEN 6 AND 8` đều là điều kiện dòng | Cả hai ở `WHERE` |

```sql
SELECT s.HOTEN
FROM SINHVIEN s
JOIN KETQUA k ON k.MASV = s.MASV
WHERE s.GIOITINH = N'Nữ' AND k.DIEM BETWEEN 6 AND 8;
```

Chỉ xuất `HOTEN` mà dữ liệu có trùng tên → thêm `DISTINCT`. Đây là bước kiểm thứ năm, xem mục 12.3.

**Câu C — *"Cho biết môn học nào có số tiết trên 30 và có ít nhất 2 sinh viên theo học."***

| Bước | Làm | Kết quả |
|---|---|---|
| 1 | Cần `TENMH`, điều kiện về `SOTIET`, số SV theo học | `MONHOC` + `KETQUA` |
| 2 | Nối bằng `m.MAMH = k.MAMH` | 1 điều kiện |
| 3 | Có "ít nhất 2 sinh viên" | Gom nhóm + `HAVING` |
| 4 | `SOTIET > 30` nói về dòng của `MONHOC`; `COUNT(...) >= 2` nói về nhóm | Một ở `WHERE`, một ở `HAVING` |

```sql
SELECT m.TENMH
FROM MONHOC m
JOIN KETQUA k ON k.MAMH = m.MAMH
WHERE m.SOTIET > 30
GROUP BY m.MAMH, m.TENMH
HAVING COUNT(DISTINCT k.MASV) >= 2;
```

Câu này có cả `WHERE` lẫn `HAVING`. Đó là dấu hiệu câu hỏi ghép **hai điều kiện thuộc hai thời điểm khác nhau**.

### 12.3. Bước kiểm thứ năm: kết quả có lặp không

Sau khi có câu lệnh, hỏi: *cột đầu tiên trong `SELECT` có thể trùng giá trị giữa các dòng không?*

Nếu câu hỏi chỉ xuất **tên** — tên người, tên môn, tên khoa — thì gần như luôn có thể trùng. Thêm `DISTINCT`.

Ba kiểm tra còn lại trước khi chạy:

| Kiểm tra | Hỏi gì |
|---|---|
| Cột đếm | `COUNT(*)` hay `COUNT(cột)`? `COUNT(*)` đếm cả dòng NULL |
| `LEFT JOIN` + đếm | Đang đếm cột của bảng bên phải chưa? |
| "nhiều nhất" | Đang dùng `TOP 1`/`LIMIT 1` trần không? Phải thêm `WITH TIES` hoặc đổi `>= ALL` |

### 12.4. Một câu trả về 0 dòng không phải lúc nào cũng sai

Kết quả rỗng có ba nguyên nhân, phải phân biệt:

| Nguyên nhân | Cách kiểm chứng |
|---|---|
| Truy vấn sai | Chạy lại từng điều kiện một, xem điều kiện nào làm rỗng kết quả |
| Đề sai chính tả | Xem lại đề có ghi đúng không — đề 2 ghi `HEQTCSDL` trong khi dữ liệu ghi `HQTCSDL` |
| **Dữ liệu không có dòng nào thỏa** | Đếm tổng số dòng của bảng, xem có đúng là không có gì cả |

Đã kiểm chứng trường hợp thứ ba. Trên bộ dữ liệu mẫu, câu *"môn học chưa có sinh viên nào học"* trả về **0 dòng**:

| MAMH | TENMH |
|---|---|
| _(0 dòng — không có kết quả)_ |

Để biết đây là **đúng** chứ không phải lỗi, chèn thêm một môn chưa ai học rồi chạy lại:

| MAMH | TENMH |
|---|---|
| MH09 | Kỹ năng mềm |

Xóa `MH09` đi thì về đúng 8 môn như ban đầu. Ba kết luận rút ra:

1. Truy vấn viết đúng.
2. Dữ liệu hiện tại không có môn nào thỏa điều kiện.
3. Kết quả rỗng là **trả lời đúng cho câu hỏi**, không phải lỗi SQL.

Trong kỳ thi, câu nào ra 0 dòng mà đề hỏi "liệt kê danh sách" thì hãy làm ba bước trên trước khi kết luận mình sai. Cách nhanh nhất: **thêm một dòng dữ liệu thử** rồi xem câu có ra không.

### 12.5. Mười hai câu tự làm, có đáp án

Viết SQL trước, xem đáp án sau. Câu nào không ra kết quả thì đọc lại mục 12.1.

**Câu 1.** Liệt kê mã, họ tên sinh viên kèm tên lớp, sắp theo mã.

**➤ Đáp án**
```sql
SELECT s.MASV, s.HOTEN, l.TENLOP
FROM SINHVIEN s JOIN LOP l ON l.MALOP = s.MALOP
ORDER BY s.MASV;
```

| MASV | HOTEN | TENLOP |
|---|---|---|
| SV001 | Nguyễn Văn An | Công nghệ phần mềm 2 |
| SV002 | Trần Thị Bình | Công nghệ phần mềm 2 |
| SV003 | Nguyễn Văn An | Công nghệ phần mềm 2 |
| SV004 | Lê Thị Dung | Công nghệ phần mềm 2 |
| SV005 | Hoàng Minh Đức | Công nghệ phần mềm 1 |
| SV006 | Trần Thị Bình | Kế toán 1 |
| SV007 | Phạm Quốc Việt | Cơ khí 2 |
| SV008 | Lê Thị Dung | Cơ khí 1 |
| SV009 | Vũ Thị Hồng | D13TMDT |
| SV010 | Đặng Văn Kiên | D13TMDT |

**Câu 2.** Với mỗi sinh viên: số môn đã học và điểm trung bình, sắp theo số môn giảm dần.

**➤ Đáp án**
```sql
SELECT s.MASV, s.HOTEN, COUNT(DISTINCT k.MAMH) AS SOMON, ROUND(AVG(k.DIEM),2) AS DIEMTB
FROM SINHVIEN s JOIN KETQUA k ON k.MASV = s.MASV
GROUP BY s.MASV, s.HOTEN
ORDER BY SOMON DESC, s.MASV;
```

| MASV | HOTEN | SOMON | DIEMTB |
|---|---|---|---|
| SV001 | Nguyễn Văn An | 5 | 8.0 |
| SV003 | Nguyễn Văn An | 3 | 8.17 |
| SV005 | Hoàng Minh Đức | 3 | 6.33 |
| SV007 | Phạm Quốc Việt | 3 | 6.0 |
| SV009 | Vũ Thị Hồng | 3 | 6.0 |
| SV002 | Trần Thị Bình | 2 | 5.75 |
| SV004 | Lê Thị Dung | 2 | 9.75 |
| SV006 | Trần Thị Bình | 2 | 8.75 |
| SV010 | Đặng Văn Kiên | 2 | 6.75 |
| SV008 | Lê Thị Dung | 1 | 8.0 |

Đối chiếu để hiểu tại sao phải `DISTINCT`: `SV002` và `SV006` trùng tên, `SV004` và `SV008` cũng trùng tên. Gom theo mã mới tách được từng người.

**Câu 3.** Với **mỗi** môn học, số sinh viên theo học, kể cả môn chưa ai học.

**➤ Đáp án**
```sql
SELECT m.MAMH, m.TENMH, m.SOTIET, COUNT(DISTINCT k.MASV) AS SOSV
FROM MONHOC m LEFT JOIN KETQUA k ON k.MAMH = m.MAMH
GROUP BY m.MAMH, m.TENMH, m.SOTIET
ORDER BY SOSV DESC, m.TENMH;
```

| MAMH | TENMH | SOTIET | SOSV |
|---|---|---|---|
| MH01 | HQTCSDL | 45 | 6 |
| MH02 | Cơ sở dữ liệu | 60 | 5 |
| MH05 | Mạng máy tính | 75 | 4 |
| MH04 | Giải tích 1 | 30 | 3 |
| MH03 | Lập trình C | 90 | 3 |
| MH08 | HEQTCSDL | 40 | 2 |
| MH06 | Trí tuệ nhân tạo | 20 | 2 |
| MH07 | Lập trình C | 45 | 1 |

Hai dòng "Lập trình C" là `MH03` (90 tiết) và `MH07` (45 tiết) — hai môn khác nhau cùng tên. Gom theo tên sẽ gộp lại thành 4.

**Câu 4.** Liệt kê môn học chưa có sinh viên nào học.

**➤ Đáp án**
```sql
SELECT m.MAMH, m.TENMH FROM MONHOC m
WHERE NOT EXISTS (SELECT 1 FROM KETQUA k WHERE k.MAMH = m.MAMH)
ORDER BY m.TENMH;
```

**Kết quả: 0 dòng.** Đọc mục 12.4 — đây là đúng, vì 8 môn trong dữ liệu đều đã có sinh viên học. Thêm môn `MH09` thì câu trả về `MH09`.

**Câu 5.** Tên môn học mà sinh viên **nam** ở khoa `K01` đã học.

**➤ Đáp án**
```sql
SELECT DISTINCT m.TENMH
FROM MONHOC m
JOIN KETQUA  k ON k.MAMH  = m.MAMH
JOIN SINHVIEN s ON s.MASV  = k.MASV
JOIN LOP l      ON l.MALOP = s.MALOP
WHERE s.GIOITINH = N'Nam' AND l.MAKHOA = N'K01';
```

| TENMH |
|---|
| Cơ sở dữ liệu |
| Giải tích 1 |
| HEQTCSDL |
| HQTCSDL |
| Lập trình C |
| Mạng máy tính |

`HQTCSDL` và `HEQTCSDL` là hai môn khác nhau chỉ khác chính tả — cùng tên gần giống nhưng là hai mã khác nhau.

**Câu 6.** Tên lớp có sĩ số thực **dưới** 3 sinh viên, kể cả lớp chưa có sinh viên.

**➤ Đáp án**
```sql
SELECT l.TENLOP, COUNT(s.MASV) AS SISODK
FROM LOP l LEFT JOIN SINHVIEN s ON s.MALOP = l.MALOP
GROUP BY l.MALOP, l.TENLOP
HAVING COUNT(s.MASV) < 3
ORDER BY l.TENLOP;
```

| TENLOP | SISODK |
|---|---|
| Công nghệ phần mềm 1 | 1 |
| Cơ khí 1 | 1 |
| Cơ khí 2 | 1 |
| D13TMDT | 2 |
| Kế toán 1 | 1 |
| Kỹ thuật phần mềm 3 | 0 |

`Kỹ thuật phần mềm 3` có 0 sinh viên và **vẫn xuất hiện**. Dùng `INNER JOIN` thì dòng này biến mất — sai, vì "dưới 3" bao gồm cả 0.

**Câu 7.** Môn học có nhiều sinh viên theo học nhất.

**➤ Đáp án**
```sql
SELECT m.MAMH, m.TENMH, COUNT(DISTINCT k.MASV) AS SOSV
FROM MONHOC m JOIN KETQUA k ON k.MAMH = m.MAMH
GROUP BY m.MAMH, m.TENMH
HAVING COUNT(DISTINCT k.MASV) >= ALL
       (SELECT COUNT(DISTINCT MASV) FROM KETQUA GROUP BY MAMH);
```

| MAMH | TENMH | SOSV |
|---|---|---|
| MH01 | HQTCSDL | 6 |

**Câu 8.** Sinh viên có điểm trung bình cao nhất, chỉ xét những môn có điểm từ 8 trở lên.

**➤ Đáp án**
```sql
SELECT s.MASV, s.HOTEN, ROUND(AVG(k.DIEM),2) AS DIEMTB
FROM SINHVIEN s JOIN KETQUA k ON k.MASV = s.MASV
WHERE k.DIEM >= 8.0
GROUP BY s.MASV, s.HOTEN
HAVING AVG(k.DIEM) >= 8.0
ORDER BY DIEMTB DESC, s.MASV;
```

| MASV | HOTEN | DIEMTB |
|---|---|---|
| SV004 | Lê Thị Dung | 9.75 |
| SV003 | Nguyễn Văn An | 8.75 |
| SV006 | Trần Thị Bình | 8.75 |
| SV001 | Nguyễn Văn An | 8.5 |
| SV008 | Lê Thị Dung | 8.0 |

`DIEM >= 8.0` ở `WHERE` lọc trước, `AVG(...) >= 8.0` ở `HAVING` kiểm sau. Hai con số khác nhau: `WHERE` xét từng điểm, `HAVING` xét cả trung bình. SV008 chỉ có 1 điểm 8.0 nên trung bình bằng 8.0 vẫn qua.

**Câu 9.** Có sinh viên nào (bất kỳ giới tính nào) có điểm dưới 5 không?

**➤ Đáp án**
```sql
SELECT DISTINCT s.GIOITINH
FROM SINHVIEN s JOIN KETQUA k ON k.MASV = s.MASV
WHERE k.DIEM < 5;
```

| GIOITINH |
|---|
| Nam |
| Nữ |

**Câu 10.** Với mỗi môn học **đã có sinh viên học**, in ra mã môn và tên môn, mỗi môn một dòng.

**➤ Đáp án**
```sql
SELECT k.MAMH, k.TENMH
FROM (SELECT DISTINCT m.MAMH, m.TENMH
      FROM MONHOC m JOIN KETQUA q ON q.MAMH = m.MAMH) k
ORDER BY k.TENMH;
```

| MAMH | TENMH |
|---|---|
| MH01 | HQTCSDL |
| MH02 | Cơ sở dữ liệu |
| MH03 | Lập trình C |
| MH04 | Giải tích 1 |
| MH05 | Mạng máy tính |
| MH06 | Trí tuệ nhân tạo |
| MH07 | Lập trình C |
| MH08 | HEQTCSDL |

Câu này dạng `DISTINCT` trong subquery rồi mới in ra — tránh `GROUP BY` khi chỉ cần loại trùng. Nhớ `DISTINCT` áp dụng cho **cả các cột trong `SELECT`**, nên phải chọn `MAMH` và `TENMH` cùng lúc thì `MH03` và `MH07` vẫn là hai dòng.

**Câu 11.** Ba lớp có nhiều sinh viên nhất.

**➤ Đáp án**
```sql
SELECT TENLOP, SISODK FROM (
  SELECT l.MALOP, l.TENLOP, COUNT(s.MASV) AS SISODK,
         RANK() OVER (ORDER BY COUNT(s.MASV) DESC) AS rk
  FROM LOP l LEFT JOIN SINHVIEN s ON s.MALOP = l.MALOP
  GROUP BY l.MALOP, l.TENLOP) t
WHERE rk <= 3
ORDER BY SISODK DESC, TENLOP;
```

| TENLOP | SISODK |
|---|---|
| Công nghệ phần mềm 2 | 4 |
| D13TMDT | 2 |
| Công nghệ phần mềm 1 | 1 |

Trên SQL Server dùng `TOP 3 WITH TIES` gọn hơn nhiều:

```sql
SELECT TOP 3 WITH TIES l.TENLOP, COUNT(s.MASV) AS SISODK
FROM LOP l LEFT JOIN SINHVIEN s ON s.MALOP = l.MALOP
GROUP BY l.MALOP, l.TENLOP
ORDER BY COUNT(s.MASV) DESC;
```

**Câu 12.** Với mỗi lớp: số sinh viên và số môn mà các sinh viên trong lớp đó đã học.

**➤ Đáp án**
```sql
SELECT l.MALOP, l.TENLOP, COUNT(DISTINCT s.MASV) AS SSV, COUNT(DISTINCT k.MAMH) AS SMON
FROM LOP l
LEFT JOIN SINHVIEN s ON s.MALOP = l.MALOP
LEFT JOIN KETQUA  k ON k.MASV   = s.MASV
GROUP BY l.MALOP, l.TENLOP
ORDER BY l.MALOP;
```

| MALOP | TENLOP | SSV | SMON |
|---|---|---|---|
| D13TMDT | D13TMDT | 2 | 4 |
| D16CKMAT2 | Cơ khí 2 | 1 | 3 |
| D16CNPM2 | Công nghệ phần mềm 2 | 4 | 7 |
| D16CNPM3 | Kỹ thuật phần mềm 3 | 0 | 0 |
| D16KTMT1 | Kế toán 1 | 1 | 2 |
| D17CKMAT1 | Cơ khí 1 | 1 | 1 |
| D17CNPM1 | Công nghệ phần mềm 1 | 1 | 3 |

Hai cột đếm dùng `DISTINCT` là bắt buộc: nối `LOP → SINHVIEN → KETQUA` mà không `DISTINCT` thì một sinh viên học 5 môn bị đếm 5 lần. Lớp `Kỹ thuật phần mềm 3` không có sinh viên nên cả hai cột đều 0.

### 12.6. Quy trình đầy đủ khi ngồi thi

1. Đọc câu, gạch ch Danh từ → chốt bảng (bước 1).
2. Nhìn khóa ngoại → chốt điều kiện nối (bước 2).
3. Tìm từ "bao nhiêu / mỗi / nhất" → chốt có gom nhóm không (bước 3).
4. Chọn `WHERE` hay `HAVING` hay `ON` (bước 4).
5. Kiểm tra `DISTINCT` và cột đếm (bước 5).
6. Chạy. Nếu 0 dòng — làm ba kiểm tra ở mục 12.4.
7. So kết quả với câu hỏi: có đúng những gì đề hỏi, không thừa không thiếu?

Bảy bước, mỗi bước một câu hỏi. Nếu làm theo thứ tự thì không cần nhớ tên lệnh — chỉ cần nhớ hỏi đúng câu.

## 13. Quy trình làm bài trên máy

Thi máy nên quy trình khác thi giấy: không ghi ra giấy rồi chép lại, mà **chạy và soi kết quả ngay**.

```sql
SELECT * FROM KETQUA;      -- 1. xem bảng trước khi truy vấn
SELECT COUNT(*) FROM KETQUA;  -- 2. biết có bao nhiêu dòng
```

Sau khi viết xong câu hỏi, chạy câu lệnh và hỏi bốn câu:

1. **Số dòng có hợp lý không?** Trả 0 dòng khi đề hỏi cả một danh sách → sai 90% khả năng là lọc quá chặt, sai chính tả, hoặc thiếu `DISTINCT`.
2. **Có dòng nào bị lặp không?** Trùng họ tên là dấu hiệu thiếu `DISTINCT`.
3. **Có dòng nào đáng lẽ phải có mà lại không?** Khoa không có lớp, lớp không có sinh viên — các bản ghi "0" thường bị `INNER JOIN` nuốt mất.
4. **Số đếm có đúng không?** Cộng tay một nhóm nhỏ để đối chiếu.

**Lưu toàn bộ câu lệnh vào một file `.sql`** với `GO` giữa các khối. Thi xong đối chiếu lại từng câu.

### Kiểm tra trước khi nộp bài

| Kiểm tra | Cách làm |
|---|---|
| Chuỗi tiếng Việt đã có `N` chưa | Tìm `'(` không đứng sau chữ `N` trong các câu `INSERT` |
| Số có bị bọc nháy không | Tìm `= '` ngay sau tên cột kiểu số |
| Cột `SELECT` có nằm trong bảng đang nối không | Đọc lại danh sách bảng trong `FROM`/`JOIN` |
| `LEFT JOIN` nhưng đếm `COUNT(*)` | Đổi thành `COUNT(cột bên phải)` |
| `GROUP BY` theo tên | Thêm mã vào `GROUP BY` |
| Câu "nhiều nhất" dùng `TOP 1`/`LIMIT 1` trần | Thêm `WITH TIES` hoặc đổi sang `>= ALL` |
| Câu "trên N" dùng `>= N` | Đổi thành `> N` |
| `UPDATE`/`DELETE` không có `WHERE` | Luôn xem trước bằng `SELECT` |

### Ba câu SQL nguy hiểm nhất

```sql
UPDATE SinhVien SET HOTEN = N'X';        -- không WHERE = sửa HẾT bảng
DELETE FROM SinhVien;                    -- không WHERE = xóa SẠT bảng
DROP TABLE SinhVien;                     -- không WHERE nào cứu được
```

Trước khi chạy lệnh xóa/sửa trong kỳ thi, chạy `SELECT` với đúng điều kiện `WHERE` đó để xem trước những dòng nào sẽ bị tác động.

### Một đính chính về `DROP` và `TRUNCATE`

| | `DROP TABLE` | `TRUNCATE TABLE` |
|---|---|---|
| Xóa cấu trúc bảng | Có | Không |
| Xóa dữ liệu | Có | Có |
| Có thể `ROLLBACK` được trong transaction | Không | **Có** trên SQL Server |

`TRUNCATE TABLE` xóa sạch và **không ghi vào log từng dòng**, nhưng bên trong một transaction vẫn `ROLLBACK` được trên SQL Server. Nói rằng nó "không có undo" là sai. Nói `DROP TABLE` thì không thể rollback là đúng.

---

## Phụ lục A — 8 lỗi thật trong đề gốc


![Tám lỗi trong đáp án đề gốc](assets/media/c1-8-loi-de-goc.jpg)
Tám lỗi dưới đây có thật trong file đáp án chính thức của Đề 2 (Bài thực hành SQL số 1). Không phải lỗi "có thể có" — đã đối chiếu với đề và kiểm chạy lại trên dữ liệu mẫu.

### Lỗi 1 — Câu 3 và 4 thiếu `DISTINCT`

Đáp án gốc:

```sql
select distinct hoten from sinhvien, ketqua where ...   -- câu 2 có
select hoten from sinhvien, ketqua, monhoc ...            -- câu 3 và 4 KHÔNG có
```

Câu 3 trả về **tên môn học**: một môn có nhiều sinh viên học sẽ xuất hiện nhiều lần. Câu 4 trả về **sinh viên học môn `HQTCSDL` với điểm dưới 5**: một sinh viên có thể trùng tên với người khác, và một sinh viên có thể học lại cùng môn ở nhiều học kỳ.

Đã chạy lại trên dữ liệu mẫu: câu "tên môn học có tiết dưới 60 của khoa K01" cho ra **10 dòng** không `DISTINCT` so với **5 dòng** có `DISTINCT` — `HQTCSDL` lặp 5 lần.

### Lỗi 2 — Câu 5 "trong từng khoa" dùng `INNER JOIN`

Đáp án gốc:

```sql
Select tenkhoa, count(*) as Solop from khoa, lop
where khoa.makhoa = lop.makhoa group by (tenkhoa)
```

Khoa nào không có lớp nào sẽ không xuất hiện trong kết quả. Đề hỏi "trong từng khoa" — một khoa không có lớp vẫn là một khoa và số lớp của nó là 0.

Kiểm chạy trên dữ liệu mẫu (khoa `K04 - Điện tử` không có lớp):

| Cách viết | Kết quả |
|---|---|
| `INNER JOIN` + `COUNT(*)` | 3 khoa — mất `Điện tử` |
| `LEFT JOIN` + `COUNT(l.MALOP)` | 4 khoa — `Điện tử` có 0 lớp |

Còn một lỗi nữa cùng câu: `count(*)` đếm cả dòng không khớp, nên khoa rỗng sẽ ra 1 thay vì 0. Phải dùng `COUNT(l.MALOP)`.

### Lỗi 3 — Câu 7 "ít nhất 3 lớp" nhưng đáp án ghi `>= 2`

Đề: *"Cho biết tên những khoa có ít nhất 3 lớp."*

Đáp án gốc:

```sql
group by tenkhoa having count(*)>=2      -- 2, không phải 3
```

Sai số. Kiểm chạy trên dữ liệu mẫu: `>= 2` trả về 2 khoa, `>= 3` trả về 1 khoa.

### Lỗi 4 — Câu 9 "khoa có nhiều nhất 5 học sinh" đếm nhầm số lượt

Đáp án gốc:

```sql
select tenkhoa from sinhvien, khoa, lop
where sinhvien.malop=lop.malop and khoa.makhoa=lop.makhoa
group by tenkhoa having count(*)<=5
```

Hai lỗi trong một câu:

- `count(*)` đếm **số dòng sau khi nối 3 bảng**, tức là số sinh viên — nhưng chỉ với các khoa **có ít nhất một lớp**. Khoa không có lớp biến mất.
- "Nhiều nhất 5 học sinh" là câu hỏi về **giá trị lớn nhất**, không phải về một ngưỡng. `count(*) <= 5` trả về *mọi* khoa có ít hơn 5 sinh viên — gần như toàn bộ bảng, chứ không phải khoa có nhiều nhất.

Kiểm chạy trên dữ liệu mẫu: `count(*) <= 5` trả về 2 khoa (`K03` Cơ khí = 2, `K02` Kế toán = 1) và bỏ mất khoa `K01` có 7 sinh viên — tức là nó chọn ra những khoa **ít** sinh viên, trái hẳn với câu hỏi.

### Lỗi 5 — Câu 13 nhóm theo tên môn, subquery nhóm theo mã

Đáp án gốc:

```sql
select tenmh from monhoc, ketqua where monhoc.mamh=ketqua.mamh
group by tenmh
having count(*)>=all (select count(*) from ketqua group by mamh)
```

Vế ngoài gom theo `TENMH`, vế trong đếm theo `MAMH`. Hai bên không cùng đơn vị đo. Khi có hai môn trùng tên (`MH03` và `MH07` đều tên "Lập trình C" trong dữ liệu mẫu), vế ngoài gộp hai môn làm một dòng.

Sửa bằng cách gom nhóm theo khóa ở cả hai vế:

```sql
SELECT m.MAMH, m.TENMH, COUNT(DISTINCT k.MASV) AS SOSV
FROM MONHOC m JOIN KETQUA k ON m.MAMH = k.MAMH
GROUP BY m.MAMH, m.TENMH
HAVING COUNT(DISTINCT k.MASV) >= ALL
       (SELECT COUNT(DISTINCT MASV) FROM KETQUA GROUP BY MAMH);
```

Kiểm chạy trên dữ liệu mẫu: nhóm theo `TENMH` gộp `MH03` (3 dòng) với `MH07` (1 dòng) thành một dòng "Lập trình C" = 4, còn nhóm theo `MAMH` tách đúng hai môn. Vế so sánh sửa lại trả `MH01` với **6** sinh viên.

### Lỗi 6 — Câu 6 "học trên 5 môn" nhưng đáp án dùng `>= 5`

Đề: *"học **trên** 5 môn học."* Đáp án gốc dùng `having count(*)>=5`.

"Trên" là `>`. Đề 1 câu 6 hỏi "trên 3 môn" và đáp án tương ứng cũng nên là `> 3`. Cả hai câu đều lệch sang `>=`.

Đây cũng là lý do dữ liệu mẫu cài sẵn `DG02` mượn đúng 3 cuốn: dùng nhầm `>= 3` thì `DG02` bị lấy vào kết quả, dùng đúng `> 3` thì không.

### Lỗi 7 — Thiếu `N'...'` trong toàn bộ phần `INSERT`

Đáp án gốc không có phần `INSERT` (đề cho sẵn dữ liệu), nhưng khi chép lại để nhập liệu thì rất dễ viết:

```sql
INSERT INTO Docgia (HoTen, DT) VALUES ('Nguyễn Văn An', '0912345678');
```

`NVARCHAR` lưu được dấu, nhưng khi **so sánh** chuỗi không có `N` với dữ liệu có dấu trong bảng thì kết quả phụ thuộc collation và có thể không khớp. Câu 2 và 16 đề 3 đều so sánh `NXB` với chuỗi tiếng Việt — thiếu `N` ở đây thì tìm hụt dòng.

Quy tắc: **mọi chuỗi tiếng Việt luôn bắt đầu bằng `N`**, cả trong `INSERT` lẫn trong `WHERE`.

### Lỗi 8 — Câu 4 đề 2 dùng `makhoa='cntt'` trong khi đề ghi `K01`

Đề ghi mã khoa là `K01`, nhưng đáp án gốc viết:

```sql
where ... and makhoa='cntt'
```

Lọc theo **mã** khoa mà điền **tên** khoa, và viết thường. Trên bảng `LOP`, cột `MAKHOA` không chứa giá trị này nên câu trả về **0 dòng**. Nếu đề dùng đúng bộ dữ liệu như bạn nhận, câu này không bao giờ ra kết quả.

Lưu ý thêm: đề 2 câu 4 hỏi môn tên `'HEQTCSDL'` — đây là sai chính tả trong chính đề, không phải trong đáp án. Tìm theo `HQTCSDL` sẽ không khớp nếu dữ liệu cũng ghi sai như đề.

### Sai khác giữa 3 đề mà nên biết

| Nội dung | Đề 1 | Đề 2 |
|---|---|---|
| Lớp | `D16CNPM2` | `D13TMDT` |
| Môn `HQTCSDL` | viết đúng | viết sai thành `HEQTCSDL` |
| Mã khoa | `K01` | `K01` |
| Ngưỡng "trên N môn" | trên 3 | trên 5 |
| Ngưỡng "số tiết, ít nhất N sinh viên" | ít nhất 2 | ít nhất 3 |
| Câu "khoa có ít nhất N lớp" | — | ít nhất 3 |

Đề này **thay đổi mỗi khóa**. Học công thức chứ đừng học thuộc con số.

---

## Phụ lục B — Phụ thuộc hàm và chuẩn hóa


![Bảng từ khóa đề ánh xạ sang hàm SQL](assets/media/g1-dem-cai-gi-2.jpg)
Không nằm trong 3 đề đã đọc. Giữ ở phụ lục để khi nào có đề cương mà thấy hỏi thì lấy ra dùng.

### B.1. Phụ thuộc hàm (FD)

**Định nghĩa:** `X → Y` nghĩa là *biết X thì xác định được Y*, với mọi bộ dữ liệu hợp lệ.

Ba ví dụ trên bảng `SINHVIEN(MASV, HOTEN, NGSINH, GIOITINH, MALOP)`:

| Phụ thuộc | Đúng không | Lý do |
|---|---|---|
| `MASV → HOTEN` | Đúng | Biết mã sinh viên là biết tên |
| `HOTEN → MASV` | Sai | Hai người có thể trùng tên |
| `MALOP → TENLOP` | Đúng | Biết lớp là biết tên lớp |
| `HOTEN, NGSINH → MASV` | **Không chắc** | Có thể có hai người cùng tên **và** cùng ngày sinh |

Trường hợp cuối là chỗ dễ sai nhất: hai thuộc tính riêng lẻ không xác định, nhưng ghép lại có thể vẫn không.

### B.2. Bao đóng `(X)+` — cách tính đúng

`(X)+` là tập tất cả thuộc tính suy ra được từ `X`. **Phải lặp cho tới khi tập không lớn thêm nữa.**

Tập FD: `MASV → HOTEN`, `MASV → NGSINH`, `MASV → MALOP`, `MALOP → TENLOP`

| Khởi đầu | Bước 1 | Bước 2 | Bước 3 | Kết quả |
|---|---|---|---|---|
| `{MASV}` | `+HOTEN`, `+NGSINH`, `+MALOP` | `+TENLOP` (vì có `MALOP`) | không thêm được | `{MASV, HOTEN, NGSINH, MALOP, TENLOP}` |

**Lỗi phổ biến:** dừng ở bước 1 rồi kết luận "`MASV` không xác định được `TENLOP`". Sai — phải lặp tiếp vì `MALOP` vừa được thêm vào lại sinh ra `TENLOP`.

Bắt đầu từ `{HOTEN, NGSINH}`: cả hai vế đều không có FD nào khởi động được → `(HOTEN,NGSINH)+ = {HOTEN, NGSINH}`. Còn `(HOTEN,NGSINH,MASV)+` thì ra toàn bộ 5 thuộc tính.

### B.3. Khóa tối thiểu

Là tập thuộc tính nhỏ nhất mà `(X)+` bằng **toàn bộ** tập thuộc tính. Với bảng trên, khóa tối thiểu là `{MASV}`.

`{MASV, HOTEN}` cũng là siêu khóa nhưng không tối thiểu — bỏ `HOTEN` vẫn còn `{MASV}`.

### B.4. Ba dạng chuẩn hóa

| Dạng | Điều kiện |
|---|---|
| **1NF** | Mỗi ô chỉ chứa **một** giá trị đơn, không chứa danh sách |
| **2NF** | 1NF **và** mọi thuộc tính không khóa đều phụ thuộc **toàn bộ** khóa, không phụ thuộc một phần của khóa |
| **3NF** | 2NF **và** không có thuộc tính không khóa nào phụ thuộc vào một thuộc tính không khóa khác (loại bỏ phụ thuộc bắc cầu) |

**BCNF** (thường không có trong đề cơ bản): với mọi phụ thuộc `X → Y`, X phải là siêu khóa.

### B.5. Ví dụ phân tích — kiểu câu hỏi nếu đề có hỏi

Quan hệ `KETQUA(MASV, MAMH, DIEM)` mở rộng để chứa thêm thông tin: `KETQUA(MASV, MAMH, DIEM, HOTEN, TENLOP)` — tức là lưu cả tên sinh viên và tên lớp vào bảng kết quả để khỏi phải nối.

- Khóa: `(MASV, MAMH)`
- Phụ thuộc: `MASV → HOTEN`, `MASV → TENLOP`, `MAMH → ...`, `(MASV, MAMH) → DIEM`

Kiểm tra 2NF: `MASV → HOTEN` — chỉ phụ thuộc **một phần** của khóa `(MASV, MAMH)`. Vậy **vi phạm 2NF**, chưa cần nói tới 3NF.

**Điểm cần nhớ:** khi một quan hệ vi phạm 2NF và 3NF cùng lúc, hãy nêu mức vi phạm **thấp nhất** trước — 2NF. Nói "vi phạm 3NF" bỏ qua 2NF là thiếu một bước, và thầy có thể chấm là chưa phân tích kỹ.

### B.6. Hệ tiên đề Armstrong

Ba tiên đề đủ để sinh ra **mọi** suy luận logic:

1. **Phản xạ** — `X → X`
2. **Tăng trưởng** — nếu `X → Y` thì `XZ → YZ`
3. **Bắc cầu** — nếu `X → Y` và `YZ → XW` thì `X → YW`

Phép **hợp** (`X → Y` và `X → Z` thì `X → YZ`) và phép **cắt** (`XY → XZ` thì `X → Z`) là **luật suy ra**, không phải tiên đề — chúng được chứng minh được từ ba tiên đề trên.

Thiếu tiên đề tăng trưởng thì câu "ba tiên đề này là đủ để suy luận mọi thứ" trở thành sai.

### B.7. Ví dụ tách bảng — cẩn thận khi gọi tên chuẩn

Quan hệ `R(A, B, C, D, E)` với FD: `A → B`, `B → C`, `C → D`, `A → E`.

Chuỗi phụ thuộc: `A → B → C → D` tạo ra `A → D` và `A → C` là **phụ thuộc bắc cầu**. Vi phạm 3NF.

Tách sai:

```text
R1(A, B, C, D)   -- vẫn còn B → C, C → D: vẫn còn phụ thuộc bắc cầu, CHƯA phải 3NF
R2(A, E)
```

Tách đúng:

```text
R1(A, B)   R2(B, C)   R3(C, D)   R4(A, E)
```

Mỗi bảng chỉ còn một phụ thuộc hàm với vế phải là khóa → đạt 3NF (thực ra còn đạt BCNF). Không mất thông tin và không làm mất phụ thuộc nào.

**Bài học:** tách xong phải kiểm lại từng bảng con xem còn phụ thuộc bắc cầu không. Gọi tên "3NF" khi chưa kiểm là lỗi hay gặp.

---

## Phụ lục C — Sai khác SQL Server so với MySQL/PostgreSQL


![SQL Server khác MySQL và PostgreSQL](assets/media/c3-sqlserver-vs-mysql.jpg)
Thi bằng SQL Server thì dùng cột bên trái. Biết cột bên phải để tránh viết SQL của công cụ khác rồi nộp.

| Việc | MySQL / PostgreSQL | **SQL Server** |
|---|---|---|
| Giới hạn số dòng | `LIMIT 10` | `TOP 10` hoặc `OFFSET ... FETCH` |
| Lấy các dòng bằng nhau ở vị trí đầu | `LIMIT 1` | `TOP 1 WITH TIES` (+ `ORDER BY`) |
| Đổi tên cột | `ALTER TABLE t RENAME COLUMN a TO b` | `EXEC sp_rename 't.a', 'b', 'COLUMN'` |
| Đổi tên bảng | `ALTER TABLE a RENAME TO b` | `EXEC sp_rename 'a', 'b'` |
| Chuỗi tiếng Việt | `'...'` | `N'...'` |
| Ngày | `'2023-11-20'` | `'20231120'` hoặc `'2023-11-20'` |
| Phân tách khối lệnh | `;` | `GO` (là từ khóa của SSMS, không phải SQL) |
| `UNIQUE` cho phép NULL | Nhiều NULL | **Một** NULL |
| Cột `IDENTITY` | `AUTO_INCREMENT` / `SERIAL` | `IDENTITY(1,1)` |
| Lấy số ngẫu nhiên | `RAND()` | `NEWID()` hoặc `RAND()` |

**Về `DROP` và `TRUNCATE`:** khác biệt thường được dạy là "không rollback được". Trên SQL Server, `TRUNCATE TABLE` **vẫn `ROLLBACK` được** nếu nằm trong một transaction. `DROP TABLE` thì không. Với SQL Server mà nói chung "cả hai đều không có undo" là sai.

---

## Ghi chú cuối

- **Ba bản SQL trong file này đã chạy thật** trên bộ dữ liệu mẫu và kết quả hiển thị là kết quả thực tế, không phải ví dụ bịa.
- **Các khẳng định về SQL Server** (`TOP 1 WITH TIES`, `sp_rename`, `UNIQUE` một NULL, `TRUNCATE` rollback được) là hành vi của SQL Server — nếu lớp bạn học dùng MySQL thì đọc lại Phụ lục C và hỏi lại thầy.
- **Đề 3 câu 5 đến 13** phụ thuộc cách hiểu "tổng số sách" là `SUM` hay "lượt mượn" là `COUNT`. File này đưa ra cả hai và nêu rõ giả định. Hỏi người đã thi khóa trước để chốt.
