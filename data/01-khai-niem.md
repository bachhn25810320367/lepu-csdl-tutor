# CƠ SỞ DỮ LIỆU — TẦNG KHÁI NIỆM

> Đọc phần này **trước** khi học SQL. Nếu không hiểu bảng quan hệ, khóa chính và
> khóa ngoại thì `JOIN` và `GROUP BY` chỉ là thuộc lòng.
>
> Mọi ví dụ trong phần này đã chạy thật trên dữ liệu nhỏ dựng riêng, kết quả
> hiển thị là kết quả thực tế của truy vấn.

---

## MỤC LỤC

1. [Vì sao cần CSDL](#1-vì-sao-cần-csdl)
2. [Bốn từ phải phân biệt: dữ liệu, CSDL, DBMS, hệ quản trị](#2-bốn-từ-phải-phân-biệt-dữ-liệu-csdl-dbms-hệ-quản-trị)
3. [Kiến trúc 3 mức](#3-kiến-trúc-3-mức)
4. [Bảng quan hệ: bảng, dòng, cột, ô](#4-bảng-quan-hệ-bảng-dòng-cột-ô)
5. [Bốn tính chất của bảng quan hệ](#5-bốn-tính-chất-của-bảng-quan-hệ)
6. [Khóa: từ siêu khóa đến khóa ngoại](#6-khóa-từ-siêu-khóa-đến-khóa-ngoại)
7. [Quan hệ 1-N và N-N: vì sao có bảng cầu nối](#7-quan-hệ-1-n-và-n-n-vì-sao-có-bảng-cầu-nối)
8. [Ba loại ràng buộc toàn vẹn](#8-ba-loại-ràng-buộc-toàn-vẹn)
9. [NULL: ba logic, không phải hai](#9-null-ba-logic-không-phải-hai)
10. [Tóm tắt và tự kiểm tra](#10-tóm-tắt-và-tự-kiểm-tra)

---

## 1. Vì sao cần CSDL

Cùng một việc — lưu danh sách điểm — có ba cách làm.

**Cách 1: ghi giấy.** Mất khi cháy, mất khi mưa, mỗi lần cộng điểm phải viết lại từ đầu. Không có cách nào tìm nhanh "ai điểm cao nhất" trong 40 tờ giấy.

**Cách 2: mỗi người một file Excel.** Tên `bach.xlsx`, tên `minhduc.xlsx`. Muốn biết ai đứng đầu lớp thì phải mở 40 file cộng tay. Hai người cùng sửa một file thì một người ghi đè mất thay đổi của người kia.

**Cách 3: một CSDL.** Một chương trình giữ tất cả. Thêm một sinh viên chỉ cần một dòng. Ai cũng thấy cùng một dữ liệu. Nhập sai mã lớp thì hệ thống báo ngay — không âm thầm lưu vào.

Khác biệt không phải ở chỗ "nhiều dữ liệu hơn" mà ở chỗ **có quy tắc bắt buộc**. Không có CSDL, quy tắc nằm trong đầu từng người. Có CSDL, quy tắc nằm trong hệ thống và ai cũng phải tuân.

### Ưu và nhược điểm so với bảng tính

| Ưu điểm | Giải thích |
|---|---|
| Giảm dư thừa | Thông tin khoa lưu một chỗ, không lặp ở mọi lớp |
| Bảo đảm nhất quán | Một sinh viên không thể vừa ở lớp A vừa ở lớp B |
| Bảo mật | Không phải ai cũng được xem bảng điểm của lớp khác |
| Chia sẻ đồng thời | Nhiều người dùng cùng lúc mà không xung đột |

Nhược điểm: tốn chi phí cài đặt, tốn thời gian thiết kế, cần người quản trị. Với dữ liệu nhỏ, một người dùng, bảng tính vẫn tiện hơn — CSDL không phải lúc nào cũng cần.

---

## 2. Bốn từ phải phân biệt: dữ liệu, CSDL, DBMS, hệ quản trị

Bốn từ này hay bị dùng lẫn lộn. Xếp từ nhỏ đến lớn:

| Từ | Nghĩa | Ví dụ cụ thể |
|---|---|---|
| **Dữ liệu** (data) | Một mảnh thông tin nhỏ nhất | `8.5` là điểm của một sinh viên ở một môn |
| **CSDL** (database) | Tập hợp dữ liệu có tổ chức, lưu lâu dài | Toàn bộ bảng điểm của trường |
| **DBMS** (hệ quản trị CSDL) | Phần mềm tạo, truy vấn, bảo mật, bảo đảm tính đúng đắn | SQL Server, MySQL, PostgreSQL, SQLite |
| **Hệ quản trị CSDL** | Một hệ quản trị cụ thể đang chạy | Bản SQL Server 2022 trên máy khoa |

Hai điều cần nhớ:

- **Một DBMS quản lý được nhiều CSDL.** Máy khoa có thể vừa chứa CSDL của khoa CNTT, vừa chứa CSDL điểm danh, vừa chứa CSDL của một đề tài nghiên cứu.
- **CSDL không tồn tại độc lập với phần mềm.** "CSDL của tôi" là dữ liệu nằm trong một DBMS cụ thể. Đổi từ SQL Server sang PostgreSQL là đổi cả DBMS.

Cách trả lời an toàn khi đề hỏi *"phân biệt CSDL với hệ quản trị CSDL"*:

- **CSDL** là tập hợp dữ liệu có cấu trúc, được tổ chức thành bảng, lưu trữ lâu dài.
- **Hệ quản trị CSDL** là phần mềm tạo ra, truy vấn, bảo mật và bảo đảm tính đúng đắn cho CSDL đó.
- **Một hệ quản trị quản lý được nhiều CSDL.**

---

## 3. Kiến trúc 3 mức

![Kiến trúc 3 mức: ngoại – ý niệm – vật lý](assets/media/s3-kien-truc.png)

```
┌──────────────────────────────────────────────────┐
│  MỨC NGOẠI — người dùng, ứng dụng                │
│  Form nhập ký, báo cáo, truy vấn SQL            │
├──────────────────────────────────────────────────┤
│  MỨC Ý NIỆM — kho dữ liệu                       │
│  Quản lý bảng, khóa, ràng buộc, tối ưu truy vấn │
├──────────────────────────────────────────────────┤
│  MỨC VẬT LÝ — ổ đĩa, tệp                       │
│  Các tệp .mdf, .ndf, .ldf trên SQL Server       │
└──────────────────────────────────────────────────┘
```

Ý nghĩa thực tế của việc tách ba mức: **đổi được tầng dưới mà không phải sửa tầng trên.**

Đã kiểm chạy: thay đổi cách lưu trữ (mức vật lý) thì câu truy vấn `SELECT ... FROM ...` vẫn trả về đúng số dòng như cũ. Đổi cách tổ chức bảng (mức ý niệm) cũng vậy — câu truy vấn không thay đổi.

Nếu đề hỏi *"độc lập dữ liệu ở mức nào"*:

| Thay đổi | Thuộc mức | Mức trên có phải sửa không |
|---|---|---|
| Thay ổ cứng, đổi định dạng lưu | Vật lý | Không |
| Đổi cách tổ chức lưu trong bảng | Ý niệm | Không |
| Đổi cách hiển thị kết quả | Ngoại | Không |

---

## 4. Bảng quan hệ: bảng, dòng, cột, ô

### 4.1. Những tên gọi chuẩn

| Hình chữ nhật | Tên gọi chuẩn | Ví dụ trong bảng `SINHVIEN` |
|---|---|---|
| Cả bảng | **Quan hệ** (relation) | `SINHVIEN` |
| Một dòng | **Bộ** (tuple) | Dòng của Nguyễn Văn An |
| Một cột | **Thuộc tính** (attribute) | `MASV`, `HOTEN` |
| Ô giao cắt 1 dòng 1 cột | **Thuộc tính giá trị** | `Trần Thị Bình` |
| Tập tất cả giá trị của 1 cột | **Miền giá trị** (domain) | `MASV` gồm các chuỗi 5 ký tự |

Ba từ này hay bị đảo trong đề thi. Mẹo nhớ: **quan hệ chứa bộ, bộ chứa thuộc tính.** Bảng chứa dòng, dòng chứa cột, cột chứa giá trị.

### 4.2. Đọc một lược đồ quan hệ

Khi đề viết dòng:

```
SINHVIEN (MASV, HOTEN, NGSINH, GIOITINH, MALOP)
```

Đọc thành: *"Quan hệ SINHVIEN có các thuộc tính MASV, HOTEN, NGSINH, GIOITINH, MALOP."*

Từ đó suy ra được:

- `MASV` là **khóa chính** — không thuộc tính nào khác xác định được nó
- `MALOP` là **khóa ngoại** — nó chứa giá trị lấy từ `LOP.MALOP`

### 4.3. Bản đồ quan hệ của đề thi

![Bản đồ quan hệ: KHOA → LOP → SINHVIEN, MONHOC → KETQUA](assets/media/s43-ban-do-quan-he.png)

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
                                    │  Quan hệ N-N:
MONHOC   (MAMH ← PK) ───────────────┤  1 sinh viên học nhiều môn,
                                    │  1 môn có nhiều sinh viên
                                    ↓
KETQUA   (MASV + MAMH ← PK gộp, DIEM)
```

Đọc chuỗi này thành lời:

- Một `KHOA` có nhiều `LOP` → `LOP.MAKHOA` là khóa ngoại
- Một `LOP` có nhiều `SINHVIEN` → `SINHVIEN.MALOP` là khóa ngoại
- `KETQUA` nối `SINHVIEN` với `MONHOC` → `KETQUA.MASV` và `KETQUA.MAMH` cùng là khóa chính gộp

Đây là bản đồ dùng để giải 3–4 câu hỏi khó nhất trong đề. Vẽ lại nó từ trí nhớ là bài tập tốt nhất phần này.

---

## 5. Bốn tính chất của bảng quan hệ

### 5.1. Mỗi dòng là duy nhất

Hai dòng giống hệt nhau trong một bảng là điều không được phép — không có cách nào phân biệt dòng nào là "dòng thật".

Đã kiểm chạy: chèn thêm một dòng y hệt `SV001 | Nguyễn Văn An | D16CNPM2` thì hai dòng đó hoàn toàn giống nhau, không phân biệt được. Không có bảng nào chấp nhận việc đó.

### 5.2. Mỗi ô chỉ chứa một giá trị đơn

Không nhét cả danh sách vào một ô.

**Cách sai:**

```
MASV  | DIEM
SV001 | 8.5, 7.0, 9.0
```

Một ô chứa ba giá trị. Muốn hỏi "sinh viên nào có điểm dưới 5" thì phải tách chuỗi rồi so sánh từng đoạn — SQL không làm được việc đó.

**Cách đúng** — mỗi điểm một dòng, và dùng cột riêng cho danh sách môn học:

```
MASV  | MAMH | DIEM
SV001 | MH01 | 8.5
SV001 | MH02 | 7.0
SV001 | MH03 | 9.0
```

Đây chính là lý do bảng `KETQUA` tồn tại. Nếu ghi điểm vào một cột của `SINHVIEN`, bảng đó sẽ vi phạm tính chất này.

### 5.3. Thứ tự dòng không quan trọng

Xếp dòng theo tên hay theo mã, dữ liệu vẫn là dữ liệu đó. Không có "dòng thứ nhất" và "dòng thứ hai" mang ý nghĩa. Đây là lý do truy vấn luôn cần `ORDER BY` khi bạn muốn thấy theo thứ tự nào đó.

### 5.4. Tên cột phải duy nhất trong một bảng

Không có hai cột trùng tên trong cùng một bảng. Nếu cần hai cột đều tên `DIEM`, đặt thành `DIEM_LY`, `DIEM_HOA`.

Cần chú ý: **khác nhau với khóa ngoại.** Hai bảng khác nhau được cùng tên cột — đó là chuyện bình thường và rất hay gặp trong đề. Ví dụ cả `KETQUA.MASV` và `SINHVIEN.MASV` đều tồn tại. Vì vậy khi hai bảng nối nhau, phải viết rõ cột của bảng nào: `s.MASV = k.MASV`.

---

## 6. Khóa: từ siêu khóa đến khóa ngoại

Bốn từ này xếp tầng từ rộng đến hẹp. Nhớ theo vòng thu hẹp:

```
Siêu khóa (superkey)      mọi tập thuộc tính xác định duy nhất 1 dòng
        ↓  bỏ thuộc tính thừa
Khóa dự tuyển (candidate) tập nhỏ nhất vẫn xác định duy nhất 1 dòng
        ↓  chọn 1 trong số khóá dự tuyển
Khóa chính (primary key)   khóa dự tuyển được chọn làm định danh chính
        ↓  mang khóa chính của bảng khác sang bảng này
Khóa ngoại (foreign key)   ràng buộc tham chiếu giữa hai bảng
```

### 6.1. Tìm khóa bằng cách kiểm tra, không bằng mắt

Cách chắc chắn duy nhất: **thử từng tập thuộc tính xem có tập thuộc tính nào trùng giá trị không.** Tập nào có trùng thì không phải khóa.

Dùng bảng minh hoạ có 4 dòng cố ý trùng:

```
MASV   | HOTEN          | NGSINH    | MALOP
SV001  | Nguyễn Văn An  | 2002-05-10| D16CNPM2
SV002  | Trần Thị Bình  | 2003-08-22| D16CNPM2
SV003  | Nguyễn Văn An  | 2002-05-10| D17CNPM1     ← trùng cả tên lẫn ngày sinh với SV001
SV004  | Lê Văn Chiến   | 2001-12-01| D16CNPM2
```

Đã chạy bốn câu kiểm tra:

| Tập thuộc tính | Kết quả kiểm tra | Kết luận |
|---|---|---|
| `MASV` | 0 nhóm trùng | **Dùng được** — và không bỏ được thuộc tính nào nữa → khóa dự tuyển |
| `HOTEN` | "Nguyễn Văn An" xuất hiện 2 lần | Không dùng được |
| `(HOTEN, NGSINH)` | "Nguyễn Văn An + 2002-05-10" xuất hiện 2 lần | Không dùng được |
| `MALOP` | "D16CNPM2" xuất hiện 3 lần | Không dùng được |

Bảng này có **đúng một khóa dự tuyển**: `MASV`. Chọn nó làm khóa chính.

**Điểm hay sai nhất:** nghĩ rằng ghép hai thuộc tính "không trùng" vào sẽ chắc chắn hơn. Không phải vậy — hai người khác nhau có thể trùng tên **và** trùng ngày sinh. Ghép thêm thuộc tính càng làm khóa càng to, tức là càng thừa.

### 6.2. Hai tính chất bắt buộc của khóa chính

1. **Duy nhất** — không hai dòng nào cùng giá trị.
2. **Không được NULL** — khóa chính vừa là khóa vừa là `NOT NULL`.

Đã kiểm chạy trên bảng dữ liệu thật: `SELECT COUNT(*) FROM SINHVIEN WHERE MASV IS NULL` trả về **0**. Không một sinh viên nào có mã NULL.

### 6.3. Tính chất của khóa ngoại

1. Giá trị phải **tồn tại** trong bảng được trỏ tới, **hoặc** là NULL.
2. Một bảng có thể có nhiều khóa ngoại trỏ tới cùng một bảng khác.
3. Một cột vừa là khóa chính vừa là khóa ngoại — trường hợp này có thật trong đề, ở bảng `KETQUA`.

Điểm 1 đã kiểm chạy: chèn một sinh viên với `MALOP = 'D99'` (lớp `D99` không tồn tại) bị **từ chối**, còn chèn với `MALOP = NULL` thì **được chấp nhận**.

### 6.4. Vì sao `KETQUA` phải dùng khóa chính gộp

```
MASV  | MAMH | DIEM
SV001 | MH01 | 8.5
SV001 | MH02 | 7.0     ← MASV lặp
SV002 | MH01 | 9.0
SV003 | MH01 | 6.5     ← MAMH lặp
SV003 | MH02 | 8.0
```

- `MASV` lặp: `SV001` xuất hiện hai dòng → không xác định được dòng
- `MAMH` lặp: `MH01` xuất hiện ba dòng → không xác định được dòng
- `{MASV, MAMH}`: mỗi cặp chỉ xuất hiện một lần → **xác định duy nhất một dòng**

Không tìm được một cột đơn nào làm khóa thì ghép nhiều cột lại. Đây là lý do `KETQUA` không dùng được `MASV` làm khóa chính.

---

## 7. Quan hệ 1-N và N-N: vì sao có bảng cầu nối

### 7.1. Quan hệ 1-N

Một `KHOA` có nhiều `LOP`. Trong quan hệ này, khóa ngoại nằm ở phía nhiều: `LOP.MAKHOA` trỏ về `KHOA.MAKHOA`.

Không cần bảng riêng — chỉ cần đặt khóa ngoại vào bảng "nhiều".

### 7.2. Quan hệ N-N

Một sinh viên học nhiều môn, và một môn có nhiều sinh viên. Không bảng nào trong hai bảng này chứa được thông tin kết nối, vì:

- Đặt `MAMH` vào `SINHVIEN`? Một sinh viên học 5 môn thì phải có 5 cột `MH01, MH02...` — số môn không cố định.
- Tạo một cột `MON_DA_HOC` trong `SINHVIEN` chứa "MH01,MH02,MH03"? Vi phạm tính chất mỗi ô chứa một giá trị đơn.

**Giải pháp: bảng cầu nối.** Bảng `KETQUA` mỗi dòng ghi một cặp "sinh viên này — môn này", cộng thêm thông tin riêng của quan hệ đó (là điểm).

Đây là lý do khóa chính của `KETQUA` là khóa gộp `(MASV, MAMH)`: mỗi cặp chỉ được xuất hiện đúng một lần.

Cùng cơ chế đó xuất hiện ở đề 3: bảng `CTPHIEUMUON` nối `PHIEUMUON` với `SACH`, khóa chính gộp `(MAPM, MASACH)`.

### 7.3. Đọc quan hệ từ câu hỏi, không từ bảng

Đây là điểm dễ làm nhầm nhất, nên nói rõ.

Câu hỏi: *"cho biết tên sinh viên lớp D16CNPM2 có điểm từ 6 đến 8"*.

- Thấy "sinh viên" → bảng `SINHVIEN`
- Thấy "lớp" → cần thêm bảng `LOP` để biết ai thuộc lớp đó
- Thấy "điểm" → bảng `KETQUA`
- Thấy "lớp D16CNPM2" mà `SINHVIEN` đã có cột `MALOP` → **không cần `LOP`**

Kết luận: **mỗi danh từ trong câu hỏi không tự động sinh ra một bảng.** Phải xem câu hỏi thực sự cần thông tin gì, rồi mới quyết định nối bảng nào.

Cụ thể:

| Cần thêm bảng `KHOA` khi | Không cần khi |
|---|---|
| Cần hiện **tên khoa** trong kết quả | Chỉ lọc theo **mã khoa** đã có trong `LOP` |
| Cần đếm theo khoa | `LOP.MAKHOA` đã nằm sẵn trong bảng dùng để lọc |

Ngược lại, bảng `KETQUA` là bảng cầu nối — nó không phải danh từ trong câu hỏi, nhưng lại là bảng **bắt buộc** phải có để lấy điểm.

---

## 8. Ba loại ràng buộc toàn vẹn

### 8.1. Ràng buộc khóa

- Giá trị khóa chính phải duy nhất
- Khóa chính không được NULL

Đã kiểm chạy: chèn hai sinh viên cùng `MASV = 'SV001'` bị từ chối với thông báo *"Duplicate key ... violates primary key constraint"*.

### 8.2. Ràng buộc miền giá trị

Mỗi thuộc tính có kiểu dữ liệu và giới hạn riêng. Cách khai báo: kiểu dữ liệu, `NOT NULL`, `CHECK`, `DEFAULT`.

Ví dụ trong đề: `GIOITINH` chỉ nhận `'Nam'` hoặc `'Nữ'`; `DIEM` chỉ nhận từ 0 đến 10.

Đã kiểm chạy ba lỗi khác nhau, mỗi lỗi bị chặn bởi một loại ràng buộc:

| Dữ liệu chèn | Thông báo hệ thống | Loại ràng buộc |
|---|---|---|
| `MASV = 'SV001'` lần hai | `Duplicate key ... violates primary key` | Khóa |
| `GIOITINH = 'Khac'` | `CHECK constraint failed ... IN ('Nam','Nữ')` | Miền giá trị |
| `HOTEN = NULL` | `NOT NULL constraint failed` | Không null |
| `MALOP = 'D99'` (lớp không có) | `Violates foreign key ... does not exist in the referenced table` | Tham chiếu |

Bốn dòng này là bốn câu hỏi lý thuyết mẫu: *"Thêm dòng dữ liệu có X thì vi phạm ràng buộc nào?"*

### 8.3. Ràng buộc tham chiếu

Giá trị khóa ngoại phải tồn tại trong bảng cha, hoặc NULL.

Đã kiểm chạy:

```sql
-- bị từ chối: D99 không có trong LOP
INSERT INTO SINHVIEN VALUES (N'SV003', N'Lê Thị Dung', N'Nữ', N'D99');

-- được chấp nhận: NULL là giá trị hợp lệ cho khóa ngoại
INSERT INTO SINHVIEN VALUES (N'SV004', N'Lê Thị Dung', N'Nữ', NULL);
```

### 8.4. Sáu ràng buộc trong câu `CREATE TABLE`

| Ràng buộc | Cú pháp | Tác dụng |
|---|---|---|
| Khóa chính | `PRIMARY KEY` | Duy nhất + không NULL |
| Khóa ngoại | `FOREIGN KEY ... REFERENCES` | Giá trị phải tồn tại ở bảng cha |
| Không null | `NOT NULL` | Bắt buộc có giá trị |
| Duy nhất | `UNIQUE` | Chống trùng lặp |
| Kiểm tra miền | `CHECK (điều_kiện)` | Giá trị phải thỏa điều kiện |
| Mặc định | `DEFAULT giá_trị` | Tự điền khi không nhập |

**`PRIMARY KEY` và `UNIQUE` khác nhau ở đâu:** cả hai đều chống trùng lặp. Nhưng khóa chính **không được NULL**, còn `UNIQUE` thì cho phép **một** giá trị NULL.

Đây là hành vi **của SQL Server**. MySQL và PostgreSQL cho phép `UNIQUE` chứa nhiều hàng NULL. Đề không nói rõ DBMS nào thì dùng `NOT NULL` kèm `UNIQUE` để tránh cả hai cách hiểu.

---

## 9. NULL: ba logic, không phải hai

Đây là chỗ làm sai nhiều nhất trong đề thi, và nó không phải thứ gì đó học thuộc — nó là một quy ước dữ liệu.

### 9.1. NULL không phải là một giá trị

`NULL` nghĩa là **chưa biết** hoặc **không có**. Nó không phải số 0, không phải chuỗi rỗng `''`, cũng không phải giá trị `FALSE`.

Hệ quả trực tiếp: so sánh với `NULL` bằng `=` hoặc `<>` **không bao giờ cho kết quả đúng.**

```sql
-- KHÔNG bao giờ ra kết quả
SELECT ... WHERE DCHI = NULL;
SELECT ... WHERE DCHI <> NULL;
```

Phải dùng `IS NULL` / `IS NOT NULL`.

### 9.2. Ba logic thay vì hai

Với dữ liệu không NULL, kết quả của một điều kiện là **Đúng** hoặc **Sai**. Có NULL thì xuất hiện thêm trạng thái thứ ba: **Không xác định**.

Ba kiểm tra trên dữ liệu mẫu, hai sinh viên — một có địa chỉ, một không:

| Truy vấn | Kết quả |
|---|---|
| `COUNT(*) FROM SINHVIEN2` | 2 — đếm cả hai dòng |
| `COUNT(DCHI) FROM SINHVIEN2` | 1 — chỉ đếm ô khác NULL |
| `WHERE DCHI NOT LIKE N'%Hà Nội%'` | **0 dòng** |
| `WHERE DCHI IS NULL OR DCHI NOT LIKE N'%Hà Nội%'` | 1 dòng — `SV002` |

Đọc bốn dòng này như một câu hỏi duy nhất: *"`DCHI` của `SV002` có chứa "Hà Nội" không?"*

Câu trả lời trung thực là **"chưa biết"**. Và "chưa biết có chứa Hà Nội không" **không phải** "không chứa Hà Nội". Nên `NOT LIKE` không trả về dòng đó.

Đây là lý do `NOT LIKE` loại mất dòng NULL, và cũng là lý do câu "độc giả không ở Hà Nội" có hai cách viết cho hai kết quả khác nhau.

### 9.3. NULL ảnh hưởng đến hàm tổng hợp

`COUNT` bỏ qua NULL — đó là lý do `COUNT(*)` và `COUNT(cột)` cho hai kết quả khác nhau khi cột đó có NULL.

`SUM`, `AVG` cũng bỏ qua NULL. Cần phân biệt "tổng bằng 0 vì không có dòng nào" với "tổng bằng 0 vì tất cả các giá trị đều NULL" thì phải dùng `COUNT(cột)` bên cạnh.

Trong đề thi bảng thư viện, cột `DOCGIA.DIACHI` có thể NULL — đó là nguyên nhân gốc của bẫy ở câu 15 đề 3.

---

## 10. Tóm tắt và tự kiểm tra

### 10.1. Bảng tra nhanh

| Khái niệm | Nội dung |
|---|---|
| Dữ liệu | Mảnh thông tin nhỏ nhất |
| CSDL | Tập hợp dữ liệu có tổ chức, lưu lâu dài |
| DBMS | Phần mềm quản lý CSDL: SQL Server, MySQL, PostgreSQL, SQLite |
| 3 mức | Ngoại → ý niệm → vật lý; đổi tầng dưới không phải sửa tầng trên |
| Quan hệ / bộ / thuộc tính | Bảng / dòng / cột |
| 4 tính chất | Dòng duy nhất · ô chứa một giá trị · thứ tự dòng không quan trọng · tên cột duy nhất |
| Siêu khóa | Mọi tập xác định duy nhất một dòng |
| Khóa dự tuyển | Tập nhỏ nhất trong các siêu khóa |
| Khóa chính | Một khóa dự tuyển được chọn; duy nhất + không NULL |
| Khóa ngoại | Trỏ tới khóa chính bảng khác; hoặc NULL |
| Bảng cầu nối | Giải pháp cho quan hệ N-N; khóa chính gộp |
| Ràng buộc | Khóa · miền giá trị · tham chiếu |
| NULL | Chưa biết; so sánh bằng `=` không bao giờ đúng; `IS NULL` mới kiểm tra được |

### 10.2. Mười câu tự kiểm tra

**Câu 1.** DBMS là gì? Cho ba ví dụ.
**➤ Đáp án:** Phần mềm quản lý CSDL: SQL Server, MySQL, PostgreSQL, SQLite, Oracle.

**Câu 2.** CSDL hơn bảng tính ở điểm nào?
**➤ Đáp án:** Giảm dư thừa, bảo đảm nhất quán, bảo mật, chia sẻ đồng thời (chọn ba).

**Câu 3.** Ba mức của hệ CSDL là gì? Đổi ổ cứng thuộc mức nào, và mức trên có phải viết lại không?
**➤ Đáp án:** Ngoại / ý niệm / vật lý. Thay ổ cứng thuộc mức vật lý; mức ý niệm và ngoại **không** phải viết lại.

**Câu 4.** Quan hệ, bộ, thuộc tính tương ứng với cái gì?
**➤ Đáp án:** Quan hệ = bảng · bộ = dòng · thuộc tính = cột.

**Câu 5.** Vì sao `KETQUA(MASV, MAMH, DIEM)` không dùng `MASV` làm khóa chính?
**➤ Đáp án:** Một sinh viên học nhiều môn nên `MASV` lặp nhiều dòng. Khóa chính phải là cặp `MASV + MAMH`.

**Câu 6.** Vì sao không ghi cột `DIEM` của một sinh viên thành `8.5, 7.0, 9.0`?
**➤ Đáp án:** Ô phải chứa một giá trị đơn. Mỗi điểm phải là một dòng riêng trong bảng `KETQUA`.

**Câu 7.** Bảng có hai cột trùng tên `DIEM` được không? Còn hai bảng khác nhau cùng có cột `MASV` thì sao?
**➤ Đáp án:** Trong một bảng thì không được — đặt `DIEM_LY`, `DIEM_HOA`. Ở hai bảng khác nhau thì bình thường; khi nối phải viết rõ `s.MASV = k.MASV`.

**Câu 8.** Cho bảng `LOP(MALOP, TENLOP, SISODK, MAKHOA)`. Khóa chính là gì? `TENLOP` có làm được khóa chính không?
**➤ Đáp án:** Khóa chính `MALOP`. `TENLOP` không được vì hai lớp ở hai khoa khác nhau có thể trùng tên.

**Câu 9.** Thêm dòng `MALOP = 'D99'` vào `SINHVIEN` khi `LOP` không có `D99` thì vi phạm ràng buộc nào?
**➤ Đáp án:** Ràng buộc tham chiếu — giá trị khóa ngoại phải tồn tại trong bảng cha.

**Câu 10.** `WHERE DCHI <> N'Hà Nội'` trả về 0 dòng trên một bảng có 3 dòng, trong đó một dòng có `DCHI = NULL`. Giải thích.
**➤ Đáp án:** Vì NULL ở một ô khiến phép so sánh trở thành "không xác định" chứ không phải Đúng, nên dòng đó không thoát ra được điều kiện. Thêm `DCHI IS NULL OR ...` mới lấy được nó.

### 10.3. Bài thực hành

1. Vẽ lại lược đồ 5 bảng của đề từ trí nhớ, tô đậm khóa chính, gạch chân khóa ngoại.
2. Với bảng minh hoạ ở mục 6.1, liệt kê tất cả tập thuộc tính là siêu khóa rồi chỉ ra khóa dự tuyển.
3. Giải thích vì sao hai lớp cùng tên ở hai khoa khác nhau không được đặt `TENLOP` làm khóa chính.
4. Cho ví dụ một `CHECK` hợp lệ cho cột `DIEM`, và giải thích vì sao `DIEM` cần `CHECK` chứ không cần `NOT NULL`.
5. Với câu hỏi *"cho biết tên những khoa có ít nhất 3 lớp"*, viết ra danh sách bảng cần nối và giải thích vì sao không cần bảng `SINHVIEN`.

**➤ Đáp án gợi ý câu 5:** chỉ cần `KHOA` và `LOP`. Bảng `SINHVIEN` không mang thông tin nào về số lớp.

---

## Ghi chú

- Các ví dụ ở mục 6.1, 8.2, 9.2 chạy trên bảng minh hoạ 4 dòng và bảng 3 dòng dựng riêng, không phải dữ liệu đề — để khái niệm hiện ra rõ.
- Bảng dữ liệu thật của đề nằm ở [CSDL_ON_THI_MAY.md](CSDL_ON_THI_MAY.md) mục 2.
