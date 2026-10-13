# CẨM NANG NGÔN NGỮ SQL EPU (SLIDE 3.2 & 8 BÀI TẬP KINH ĐIỂN)

> Tài liệu hệ thống hóa toàn bộ lý thuyết Slide Chương 3 (3.2 Ngôn ngữ SQL) giảng dạy tại EPU.
> Chuẩn cú pháp: **T-SQL / SQL Server**.
> Kèm bộ lời giải 8 câu truy vấn mẫu kinh điển trên lược đồ Quản lý sinh viên.

---

## 1. Ngôn Ngữ Định Nghĩa Dữ Liệu (DDL - Data Definition Language)

DDL dùng để tạo lập, sửa đổi cấu trúc và hủy bỏ các đối tượng cơ sở dữ liệu.

### 1.1. Quản lý Cơ sở dữ liệu

```sql
-- Tạo CSDL mới
CREATE DATABASE QLSV_EPU;
GO

-- Chuyển ngữ cảnh sang CSDL vừa tạo
USE QLSV_EPU;
GO

-- Xóa CSDL (chỉ xóa khi không có kết nối nào đang mở)
DROP DATABASE QLSV_EPU;
GO
```

### 1.2. Tạo cấu trúc bảng (`CREATE TABLE`)

```sql
CREATE TABLE <Tên_bảng> (
    <Tên_cột_1> <Kiểu_dữ_liệu> [NULL | NOT NULL] [Khóa/Ràng_buộc],
    <Tên_cột_2> <Kiểu_dữ_liệu> [NULL | NOT NULL],
    ...
    [CONSTRAINT <Tên_ràng_buộc> ...]
);
```

### 1.3. Sửa đổi cấu trúc bảng (`ALTER TABLE`) — Bẫy thi thường gặp

![Hình 6.1: Violet làm thợ rèn: Đục thêm ô ngọc ADD, gỡ mảnh giáp hỏng DROP, tôi rèn lại giáp ALTER COLUMN](assets/media/csdl/valhein_violet/b06_01.jpg)

Giảng viên EPU thường yêu cầu sửa đổi bảng đã có dữ liệu bằng lệnh `ALTER TABLE`:

```sql
-- 1. Thêm cột mới vào bảng
ALTER TABLE SINHVIEN
ADD GIOITINH NVARCHAR(10) NULL;

-- 2. Xóa cột hiện có trong bảng
ALTER TABLE SINHVIEN
DROP COLUMN NGSINH;

-- 3. Sửa đổi kiểu dữ liệu của cột
ALTER TABLE SINHVIEN
ALTER COLUMN HOTEN NVARCHAR(100);
```

> **Lưu ý:** Trong SQL Server, lệnh sửa kiểu dữ liệu dùng `ALTER COLUMN`, khác với MySQL dùng `MODIFY COLUMN` hay Oracle dùng `MODIFY`.

### 1.4. Xóa cấu trúc bảng (`DROP TABLE`)

```sql
DROP TABLE SINHVIEN;
```
> **Nguyên tắc:** Nếu bảng `SINHVIEN` đang được bảng `KETQUA` tham chiếu khóa ngoại, SQL Server sẽ chặn không cho xóa `SINHVIEN`. Phải xóa bảng con trước hoặc xóa ràng buộc Foreign Key trước.

---

## 2. Ngôn Ngữ Thao Tác Dữ Liệu (DML - Data Manipulation Language)

### 2.1. Thêm bản ghi (`INSERT INTO`)

#### Cách 1: Thêm giá trị trực tiếp (`VALUES`)
```sql
INSERT INTO SINHVIEN (MASV, HOTEN, NGSINH, DCHI, MALOP)
VALUES ('SV01', N'Nguyễn Khánh An', '2000-02-01', N'Hà Nội', 'D15CNPM1');
```

#### Cách 2: Nhập dữ liệu tự động từ bảng khác (`INSERT INTO ... SELECT`)

![Hình 6.2: Valhein mở Cổng Teleport Không Gian dịch chuyển nguyên quân đoàn lính (INSERT INTO ... SELECT)](assets/media/csdl/valhein_violet/b06_02.jpg)
Đây là dạng câu hỏi thường gặp khi cần trích xuất dữ liệu sang bảng lưu trữ phụ:

```sql
-- Ví dụ: Lấy danh sách sinh viên lớp D15CNPM1 nạp vào bảng SV_LOP
INSERT INTO SV_LOP (MASV, HOTEN)
SELECT sv.MASV, sv.HOTEN
FROM SINHVIEN sv
JOIN LOP l ON sv.MALOP = l.MALOP
WHERE l.TENLOP = 'D15CNPM1';
```

---

## 3. Ngôn Ngữ Truy Vấn Dữ Liệu (DQL - Data Query Language)

### 3.1. Cú pháp tổng quát của câu lệnh `SELECT`

```sql
SELECT [DISTINCT] <Danh sách cột | Biểu thức | *>
FROM <Danh sách các bảng>
[WHERE <Điều kiện lọc từng dòng>]
[GROUP BY <Danh sách cột gom nhóm>]
[HAVING <Điều kiện lọc trên nhóm sau khi gom>]
[ORDER BY <Tên cột> [ASC | DESC]];
```

### 3.2. Thứ tự thực thi logic của SQL Server

![Hình 6.3: Violet giám sát băng chuyền ma thuật 7 trạm thực thi SQL (FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY)](assets/media/csdl/valhein_violet/b06_03.jpg)

Hiểu thứ tự thực thi giúp không bao giờ bị nhầm lẫn giữa `WHERE` và `HAVING`:

```
1. FROM ➔ 2. WHERE ➔ 3. GROUP BY ➔ 4. HAVING ➔ 5. SELECT ➔ 6. DISTINCT ➔ 7. ORDER BY
```

- `WHERE` chạy **trước** khi nhóm: lọc từng dòng đơn lẻ, **không được chứa hàm gộp** (như `SUM`, `COUNT`).
- `HAVING` chạy **sau** khi nhóm: lọc kết quả của nhóm, **chuyên dùng với hàm gộp**.

---

## 4. Các Hàm Tích Hợp Sẵn Trong T-SQL

![Hình 6.4: Valhein múa phi tiêu cắt chuỗi (LEFT, RIGHT, SUBSTRING), Violet xoay đồng hồ cát thời gian (DAY, MONTH, YEAR)](assets/media/csdl/valhein_violet/b06_04.jpg)

### 4.1. Hàm Gom Nhóm (Aggregate Functions)

- `SUM(cot)`: Tính tổng các giá trị số (bỏ qua `NULL`).
- `AVG(cot)`: Tính giá trị trung bình (bỏ qua `NULL`).
- `MIN(cot)`: Lấy giá trị nhỏ nhất.
- `MAX(cot)`: Lấy giá trị lớn nhất.
- `COUNT(*)`: Đếm tổng số dòng (tính cả dòng chứa `NULL`).
- `COUNT(cot)`: Đếm số giá trị khác `NULL` của cột đó.
- `COUNT(DISTINCT cot)`: Đếm số giá trị duy nhất (không trùng lặp).

### 4.2. Hàm Chuỗi & Ký Tự

- `LEN(str)`: Trả về độ dài chuỗi ký tự.
- `LEFT(str, n)`: Lấy `n` ký tự từ bên trái.
- `RIGHT(str, n)`: Lấy `n` ký tự từ bên phải.
- `SUBSTRING(str, pos, len)`: Cắt chuỗi từ vị trí `pos` (bắt đầu từ 1) với độ dài `len`. *(Lưu ý: Slide ghi `MID` là tên hàm của MS Access; trên SQL Server bắt buộc viết `SUBSTRING`)*.
- `UPPER(str)` / `LOWER(str)`: Đổi thành chữ hoa / chữ thường.
- `LTRIM(str)` / `RTRIM(str)`: Cắt khoảng trắng đầu / cuối chuỗi.

### 4.3. Hàm Ngày Tháng & Thời Gian

- `GETDATE()`: Trả về ngày giờ hiện tại của hệ thống.
- `DAY(date)`: Lấy ngày trong tháng (1 đến 31).
- `MONTH(date)`: Lấy tháng trong năm (1 đến 12).
- `YEAR(date)`: Lấy năm (VD: 2026).
- `DATEDIFF(datepart, startdate, enddate)`: Tính khoảng cách giữa hai mốc thời gian.

### 4.4. Hàm Toán Học

- `ABS(x)`: Giá trị tuyệt đối.
- `SQRT(x)`: Căn bậc hai.
- `ROUND(x, n)`: Làm tròn số tới `n` chữ số thập phân.
- `SIGN(x)`: Dấu của số (-1 nếu âm, 0 nếu bằng 0, 1 nếu dương).

---

## 5. Các Toán Tử Điều Kiện Nâng Cao Trong Mệnh Đề `WHERE`

### 5.1. Toán tử `BETWEEN ... AND`
Kiểm tra giá trị nằm trong đoạn đóng `[a, b]`:
```sql
WHERE Diem BETWEEN 5.0 AND 8.0
-- Tương đương: WHERE Diem >= 5.0 AND Diem <= 8.0
```

### 5.2. Toán tử `LIKE` (Tìm kiếm xấp xỉ chuỗi)
- `%`: Đại diện cho **chuỗi ký tự bất kỳ** (0, 1 hoặc nhiều ký tự).
- `_`: Đại diện cho **đúng 1 ký tự bất kỳ**.
- `[ ]`: Đại diện cho 1 ký tự nằm trong tập hợp liệt kê (VD: `[A-M]%`).

```sql
-- Tìm sinh viên có họ 'Nguyễn'
WHERE HOTEN LIKE N'Nguyễn%'

-- Tìm mã có 4 ký tự bắt đầu bằng 'D'
WHERE MALOP LIKE 'D___'
```

### 5.3. Toán tử `IN` và `NOT IN`
So sánh với một danh sách hoặc tập kết quả con:
```sql
WHERE DCHI IN (N'Hà Nội', N'Hải Phòng', N'Nam Định')
```

### 5.4. Toán tử `IS NULL` và `IS NOT NULL`

![Hình 6.6: Violet rọi đèn tia cực tím hiện hình bóng ma tàng hình (Toán tử IS NULL)](assets/media/csdl/valhein_violet/b06_06.jpg)
`NULL` biểu diễn dữ liệu chưa biết/rỗng. **Không bao giờ dùng `= NULL`**:
```sql
-- Đúng:
WHERE DIEM IS NULL;

-- Sai (luôn trả về UNKNOWN / rỗng):
WHERE DIEM = NULL;
```

### 5.5. Toán tử tập con: `SOME / ANY / ALL`

![Hình 6.5: Valhein trên đấu trường: Vượt qua một người ANY vs Đánh bại tất cả đấu sĩ ALL](assets/media/csdl/valhein_violet/b06_05.jpg)

- `< ANY (Subquery)` / `< SOME (Subquery)`: Nhỏ hơn **ít nhất một** giá trị trong tập con (tức là nhỏ hơn giá trị lớn nhất của tập con).
- `< ALL (Subquery)`: Nhỏ hơn **tất cả** các giá trị trong tập con (tức là nhỏ hơn giá trị nhỏ nhất của tập con).
- `= ANY (Subquery)`: Tương đương với toán tử `IN`.

```sql
-- Tìm sinh viên có điểm thi lớn hơn TẤT CẢ các điểm thi của lớp D15
WHERE Diem > ALL (SELECT Diem FROM KETQUA WHERE MALOP = 'D15')
```

---

## 6. Lời Giải 8 Bài Tập Kinh Điển EPU (Slide Chương 3)

![Hình 6.7: Valhein và Violet giải thế cờ trên sa bàn 5 đại bản doanh: Khoa, Lớp, Sinh viên, Môn học, Kết quả](assets/media/csdl/valhein_violet/b06_07.jpg)

### Lược đồ CSDL Quản lý sinh viên:
```
KHOA     (MAKHOA, TENKHOA)
LOP      (MALOP, TENLOP, SISODK, MAKHOA)
SINHVIEN (MASV, HOTEN, NGSINH, DCHI, GIOITINH, MALOP)
MONHOC   (MAMH, TENMH, SOTIET)
KETQUA   (MASV, MAMH, DIEM)
```

---

### Câu 1: Hiển thị danh sách sinh viên có địa chỉ ở 'Hà nội'
```sql
SELECT MASV, HOTEN, NGSINH, DCHI, GIOITINH, MALOP
FROM SINHVIEN
WHERE DCHI = N'Hà nội';
```

---

### Câu 2: Hiển thị danh sách sinh viên thuộc lớp D14CNPM8 và có địa chỉ ở Hà Nội
```sql
SELECT sv.MASV, sv.HOTEN, sv.DCHI, l.TENLOP
FROM SINHVIEN sv
JOIN LOP l ON sv.MALOP = l.MALOP
WHERE l.TENLOP = 'D14CNPM8' 
  AND sv.DCHI = N'Hà Nội';
```

---

### Câu 3: Hiển thị danh sách các môn học có số tiết > 30
```sql
SELECT MAMH, TENMH, SOTIET
FROM MONHOC
WHERE SOTIET > 30;
```

---

### Câu 4: Hiển thị mã sinh viên, điểm của sinh viên học môn CSDL
```sql
SELECT kq.MASV, mh.TENMH, kq.DIEM
FROM KETQUA kq
JOIN MONHOC mh ON kq.MAMH = mh.MAMH
WHERE mh.TENMH = N'CSDL';
```

---

### Câu 5: Hiển thị mã lớp và số sinh viên của từng lớp
*Tư duy suy ra:* Đếm số lượng sinh viên theo từng lớp cần gom nhóm bằng `GROUP BY MALOP`. Dùng `LEFT JOIN` để giữ lại cả những lớp hiện chưa có sinh viên nào (`COUNT` trả về 0 thay vì mất dòng).

```sql
SELECT l.MALOP, l.TENLOP, COUNT(sv.MASV) AS SoSinhVien
FROM LOP l
LEFT JOIN SINHVIEN sv ON l.MALOP = sv.MALOP
GROUP BY l.MALOP, l.TENLOP;
```

---

### Câu 6: Hiển thị tên Khoa và số sinh viên của từng khoa
*Tư duy suy ra:* Sinh viên nằm ở `SINHVIEN`, Khoa nằm ở `KHOA`. Hai bảng này kết nối với nhau bắc cầu qua bảng trung gian `LOP` (`KHOA ➔ LOP ➔ SINHVIEN`).

```sql
SELECT k.MAKHOA, k.TENKHOA, COUNT(sv.MASV) AS TongSoSinhVien
FROM KHOA k
LEFT JOIN LOP l ON k.MAKHOA = l.MAKHOA
LEFT JOIN SINHVIEN sv ON l.MALOP = sv.MALOP
GROUP BY k.MAKHOA, k.TENKHOA;
```

---

### Câu 7: Hiển thị tên của những sinh viên nữ sinh năm 2003
*Tư duy suy ra:* Năm sinh được trích xuất bằng hàm `YEAR(NGSINH)`. Giới tính nữ so sánh `GIOITINH = N'Nữ'`.

```sql
SELECT HOTEN, NGSINH, GIOITINH
FROM SINHVIEN
WHERE GIOITINH = N'Nữ' 
  AND YEAR(NGSINH) = 2003;
```

---

### Câu 8: Môn học CSDL đã có bao nhiêu sinh viên theo học
*Tư duy suy ra:* Đếm số lượng sinh viên trong bảng kết quả học môn CSDL. Cần dùng `COUNT(DISTINCT kq.MASV)` để nếu một sinh viên học cải thiện/học lại thì cũng chỉ tính là 1 sinh viên.

```sql
SELECT mh.MAMH, mh.TENMH, COUNT(DISTINCT kq.MASV) AS SoSinhVienTheoHoc
FROM MONHOC mh
JOIN KETQUA kq ON mh.MAMH = kq.MAMH
WHERE mh.TENMH = N'CSDL'
GROUP BY mh.MAMH, mh.TENMH;
```


![Hình 6.8: Valhein và Violet giơ cao Cuốn Bí Kíp Vàng CSDL EPU tự tin bước vào phòng thi thực hành máy](assets/media/csdl/valhein_violet/b06_08.jpg)
