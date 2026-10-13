# ĐỀ THI MÁY — QUẢN LÝ NHÂN VIÊN (SQL SERVER)

> Bộ đề thi thực hành chính thức trên máy tại EPU (Chuẩn SQL Server / SSMS).
> Cơ sở dữ liệu: `Quanlynhanvien_Hotensv` (gồm 3 bảng: `CHUCVU`, `PHONG`, `NHANVIEN`).
> Mọi truy vấn và logic trigger đã được kiểm chứng thực tế trên tập dữ liệu mẫu.

---

## 1. Phân Tích Lược Đồ Quan Hệ & Khởi Tạo CSDL

### 1.1. Lược đồ 3 bảng

- **`CHUCVU`** (`Macv`, `Tencv`, `Hesopc`): Bảng danh mục chức vụ và hệ số phụ cấp tương ứng (VD: Trưởng phòng `0.4`, Phó phòng `0.3`).
- **`PHONG`** (`Maph`, `Tenph`, `Diachiphong`): Bảng danh mục phòng ban và địa chỉ phòng (VD: Phòng Hành chính, Nhà A).
- **`NHANVIEN`** (`Manv`, `Tennv`, `Diachi`, `Hsluong`, `Macv`, `Maph`, `Luong`, `Thuclinh`): Bảng nhân viên, liên kết với chức vụ qua `Macv` (khóa ngoại) và phòng ban qua `Maph` (khóa ngoại).

```
   [CHUCVU] 1 ────────── N [NHANVIEN] N ────────── 1 [PHONG]
   (Macv)                   (Macv, Maph)              (Maph)
```

### 1.2. Mã DDL Khởi tạo CSDL, Khóa chính, Khóa ngoại

> **Quy tắc tạo bảng tránh lỗi khóa ngoại:** Bảng cha (`CHUCVU`, `PHONG`) phải tạo trước, bảng con (`NHANVIEN`) tạo sau.

```sql
-- Tạo CSDL
CREATE DATABASE Quanlynhanvien_HoangNgocBach;
GO

USE Quanlynhanvien_HoangNgocBach;
GO

-- 1. Bảng Chức vụ (Bảng cha)
CREATE TABLE CHUCVU (
    Macv        VARCHAR(10)     PRIMARY KEY,
    Tencv       NVARCHAR(50)    NOT NULL,
    Hesopc      DECIMAL(4,2)    DEFAULT 0
);
GO

-- 2. Bảng Phòng (Bảng cha)
CREATE TABLE PHONG (
    Maph        VARCHAR(10)     PRIMARY KEY,
    Tenph       NVARCHAR(50)    NOT NULL,
    Diachiphong NVARCHAR(100)   DEFAULT N'Nhà A'
);
GO

-- 3. Bảng Nhân viên (Bảng con tham chiếu CHUCVU và PHONG)
CREATE TABLE NHANVIEN (
    Manv        VARCHAR(10)     PRIMARY KEY,
    Tennv       NVARCHAR(50)    NOT NULL,
    Diachi      NVARCHAR(100)   DEFAULT N'Chưa xác định',
    Hsluong     DECIMAL(4,2)    NOT NULL,
    Macv        VARCHAR(10),
    Maph        VARCHAR(10),
    Luong       DECIMAL(15,2)   DEFAULT 1800000,
    Thuclinh    DECIMAL(15,2)   DEFAULT 0,
    CONSTRAINT FK_NV_CV    FOREIGN KEY (Macv) REFERENCES CHUCVU(Macv),
    CONSTRAINT FK_NV_PHONG FOREIGN KEY (Maph) REFERENCES PHONG(Maph)
);
GO
```

### 1.3. Nhập dữ liệu mẫu (Tối thiểu 5 bản ghi mỗi bảng)

```sql
-- Dữ liệu Chức vụ
INSERT INTO CHUCVU (Macv, Tencv, Hesopc) VALUES
('CV01', N'Trưởng phòng', 0.40),
('CV02', N'Phó phòng',    0.30),
('CV03', N'Chuyên viên',  0.20),
('CV04', N'Nhân viên',    0.10),
('CV05', N'Thực tập sinh',0.00);

-- Dữ liệu Phòng
INSERT INTO PHONG (Maph, Tenph, Diachiphong) VALUES
('PH01', N'Hành chính', N'Nhà A'),
('PH02', N'Kế toán',    N'Nhà B'),
('PH03', N'Kỹ thuật',   N'Nhà M'),
('PH04', N'Kinh doanh', N'Nhà A'),
('PH05', N'Nhân sự',    N'Nhà B');

-- Dữ liệu Nhân viên (Luong = Hsluong * 2450000, Thuclinh = Luong + Luong * Hesopc)
INSERT INTO NHANVIEN (Manv, Tennv, Diachi, Hsluong, Macv, Maph, Luong, Thuclinh) VALUES
('NV01', N'Nguyễn Văn An',  N'Hà nội',    3.50, 'CV01', 'PH01', 8575000.00, 12005000.00),
('NV02', N'Trần Thị Bình',  N'Hải Phòng', 2.34, 'CV02', 'PH01', 5733000.00,  7452900.00),
('NV03', N'Lê Văn Cường',   N'Hà nội',    2.67, 'CV03', 'PH01', 6541500.00,  7849800.00),
('NV04', N'Phạm Thị Dung',  N'Nam Định',  2.34, 'CV04', 'PH02', 5733000.00,  6306300.00),
('NV05', N'Hoàng Văn Em',   N'Hà nội',    4.00, 'CV01', 'PH03', 9800000.00, 13720000.00),
('NV06', N'Vũ Thị Phương',  N'Bắc Ninh',  2.34, 'CV04', 'PH01', 5733000.00,  6306300.00);
GO
```

---

## 2. Hệ Thống View & Truy Vấn Dữ Liệu Phòng Thi

### 2.1. View lưu thông tin các nhân viên phòng Hành chính
*Yêu cầu hiển thị:* `Mã nhân viên`, `Tên nhân viên`, `Tên phòng`.

```sql
CREATE VIEW V_NhanVien_HanhChinh AS
SELECT nv.Manv, nv.Tennv, p.Tenph
FROM NHANVIEN nv
JOIN PHONG p ON nv.Maph = p.Maph
WHERE p.Tenph = N'Hành chính';
GO

-- Kiểm tra view
SELECT * FROM V_NhanVien_HanhChinh;
```

### 2.2. View lưu thông tin những nhân viên có hệ số lương cao nhất
*Tư duy suy ra:* Hệ số lương cao nhất có thể có nhiều người đồng hạng, dùng Subquery `(SELECT MAX(Hsluong) FROM NHANVIEN)` hoặc `TOP 1 WITH TIES`.

```sql
CREATE VIEW V_NhanVien_HsLuongCaoNhat AS
SELECT Manv, Tennv, Hsluong
FROM NHANVIEN
WHERE Hsluong = (SELECT MAX(Hsluong) FROM NHANVIEN);
GO
```

### 2.3. Hiển thị thông tin những nhân viên có địa chỉ ở Hà Nội
```sql
SELECT Manv, Tennv, Diachi
FROM NHANVIEN
WHERE Diachi = N'Hà nội';
```

### 2.4. Hiển thị thông tin những nhân viên có chức vụ là Trưởng phòng
```sql
SELECT nv.Manv, nv.Tennv, cv.Tencv
FROM NHANVIEN nv
JOIN CHUCVU cv ON nv.Macv = cv.Macv
WHERE cv.Tencv = N'Trưởng phòng';
```

### 2.5. Hiển thị thông tin những nhân viên có hệ số lương thấp nhất
```sql
SELECT Manv, Tennv, Hsluong
FROM NHANVIEN
WHERE Hsluong = (SELECT MIN(Hsluong) FROM NHANVIEN);
```

### 2.8 & 2.15. View lưu thông tin những phòng có nhiều nhân viên nhất
*Tư duy suy ra:* Đếm số nhân viên mỗi phòng qua `COUNT(nv.Manv)` với `GROUP BY`, sau đó lọc bằng `TOP 1 WITH TIES ... ORDER BY COUNT(nv.Manv) DESC`.

```sql
CREATE VIEW V_Phong_NhieuNVNhat AS
SELECT TOP 1 WITH TIES 
    p.Maph, 
    p.Tenph, 
    p.Diachiphong, 
    COUNT(nv.Manv) AS TongSoNV
FROM PHONG p
LEFT JOIN NHANVIEN nv ON p.Maph = nv.Maph
GROUP BY p.Maph, p.Tenph, p.Diachiphong
ORDER BY COUNT(nv.Manv) DESC;
GO
```

### 2.10. Hiển thị những phòng có từ 3 nhân viên trở lên
*Tư duy suy ra:* Điều kiện lọc theo nhóm bắt buộc đặt trong mệnh đề `HAVING`.
```sql
SELECT p.Maph, p.Tenph, COUNT(nv.Manv) AS TongSoNV
FROM PHONG p
JOIN NHANVIEN nv ON p.Maph = nv.Maph
GROUP BY p.Maph, p.Tenph
HAVING COUNT(nv.Manv) >= 3;
```

### 2.11. Hiển thị những phòng có nhiều nhất 3 nhân viên
```sql
SELECT p.Maph, p.Tenph, COUNT(nv.Manv) AS TongSoNV
FROM PHONG p
LEFT JOIN NHANVIEN nv ON p.Maph = nv.Maph
GROUP BY p.Maph, p.Tenph
HAVING COUNT(nv.Manv) <= 3;
```

### 2.12. Hiển thị nhân viên có địa chỉ khác Hà Nội và có hệ số lương là 2.34
```sql
SELECT Manv, Tennv, Diachi, Hsluong
FROM NHANVIEN
WHERE Diachi <> N'Hà nội' AND Hsluong = 2.34;
```

### 2.13. Hiển thị những nhân viên có hệ số phụ cấp cao nhất
```sql
SELECT nv.Manv, nv.Tennv, cv.Hesopc
FROM NHANVIEN nv
JOIN CHUCVU cv ON nv.Macv = cv.Macv
WHERE cv.Hesopc = (SELECT MAX(Hesopc) FROM CHUCVU);
```

### 2.14. Hiển thị những nhân viên có tiền thực lĩnh cao nhất
```sql
SELECT Manv, Tennv, Thuclinh
FROM NHANVIEN
WHERE Thuclinh = (SELECT MAX(Thuclinh) FROM NHANVIEN);
```

### 2.17. Hiển thị những nhân viên có hệ số lương > 3.0
```sql
SELECT nv.Manv, nv.Tennv, p.Tenph, nv.Hsluong
FROM NHANVIEN nv
JOIN PHONG p ON nv.Maph = p.Maph
WHERE nv.Hsluong > 3.0;
```

### 2.19. Hiển thị những phòng có ít hơn 10 nhân viên
```sql
SELECT p.Maph, p.Tenph, COUNT(nv.Manv) AS TongSoNV
FROM PHONG p
LEFT JOIN NHANVIEN nv ON p.Maph = nv.Maph
GROUP BY p.Maph, p.Tenph
HAVING COUNT(nv.Manv) < 10;
```

---

## 3. Ràng Buộc Rule & Default (Đặc Trưng EPU)

> **Lưu ý phòng thi:** Giảng viên EPU thường yêu cầu dùng cú pháp riêng của SQL Server (`CREATE RULE` / `sp_bindrule` và `CREATE DEFAULT` / `sp_bindefault`). Dưới đây cung cấp chuẩn cú pháp này cùng cú pháp ANSI chuẩn (`CONSTRAINT`).

### 3.1 & 3.4 & 3.5 & 3.7 & 3.8. Ràng buộc DEFAULT

#### Cách 1: Dùng lệnh `CREATE DEFAULT` và thủ tục `sp_bindefault`
```sql
-- 3.1 Default cho Hesopc bảng CHUCVU nhận 0
CREATE DEFAULT DF_Hesopc AS 0;
GO
EXEC sp_bindefault 'DF_Hesopc', 'CHUCVU.Hesopc';
GO

-- 3.4 Default cho Thuclinh bảng NHANVIEN nhận 0
CREATE DEFAULT DF_Thuclinh AS 0;
GO
EXEC sp_bindefault 'DF_Thuclinh', 'NHANVIEN.Thuclinh';
GO

-- 3.5 Default cho Diachiphong bảng PHONG nhận 'Nhà A'
CREATE DEFAULT DF_Diachiphong AS N'Nhà A';
GO
EXEC sp_bindefault 'DF_Diachiphong', 'PHONG.Diachiphong';
GO

-- 3.7 Default cho Diachi bảng NHANVIEN nhận 'Chưa xác định'
CREATE DEFAULT DF_Diachi AS N'Chưa xác định';
GO
EXEC sp_bindefault 'DF_Diachi', 'NHANVIEN.Diachi';
GO

-- 3.8 Default cho Luong bảng NHANVIEN nhận 1800000
CREATE DEFAULT DF_Luong AS 1800000;
GO
EXEC sp_bindefault 'DF_Luong', 'NHANVIEN.Luong';
GO
```

#### Cách 2: Dùng `ALTER TABLE ... ADD CONSTRAINT DEFAULT` (Chuẩn ANSI)
```sql
ALTER TABLE CHUCVU   ADD CONSTRAINT DF_CHUCVU_Hesopc     DEFAULT 0 FOR Hesopc;
ALTER TABLE NHANVIEN ADD CONSTRAINT DF_NHANVIEN_Thuclinh   DEFAULT 0 FOR Thuclinh;
ALTER TABLE PHONG    ADD CONSTRAINT DF_PHONG_Diachiphong   DEFAULT N'Nhà A' FOR Diachiphong;
ALTER TABLE NHANVIEN ADD CONSTRAINT DF_NHANVIEN_Diachi     DEFAULT N'Chưa xác định' FOR Diachi;
ALTER TABLE NHANVIEN ADD CONSTRAINT DF_NHANVIEN_Luong      DEFAULT 1800000 FOR Luong;
```

### 3.10 & 3.12 & 3.15. Ràng buộc RULE

#### Cách 1: Dùng `CREATE RULE` và `sp_bindrule`
```sql
-- 3.10 Rule cho cột Hsluong nhận từ 2.67 đến 9.0
CREATE RULE R_HsLuong AS @hsl BETWEEN 2.67 AND 9.0;
GO
EXEC sp_bindrule 'R_HsLuong', 'NHANVIEN.Hsluong';
GO

-- 3.12 Rule cho cột Diachiphong chỉ nhận 'Nhà A', 'Nhà B', 'Nhà M'
CREATE RULE R_DiachiPhong AS @dc IN (N'Nhà A', N'Nhà B', N'Nhà M');
GO
EXEC sp_bindrule 'R_DiachiPhong', 'PHONG.Diachiphong';
GO

-- 3.15 Rule cho cột Thuclinh nhận giá trị > 2000000
CREATE RULE R_ThucLinh AS @tl > 2000000;
GO
EXEC sp_bindrule 'R_ThucLinh', 'NHANVIEN.Thuclinh';
GO
```

#### Cách 2: Dùng `ALTER TABLE ... ADD CONSTRAINT CHECK`
```sql
ALTER TABLE NHANVIEN ADD CONSTRAINT CK_NHANVIEN_Hsluong     CHECK (Hsluong BETWEEN 2.67 AND 9.0);
ALTER TABLE PHONG    ADD CONSTRAINT CK_PHONG_Diachiphong     CHECK (Diachiphong IN (N'Nhà A', N'Nhà B', N'Nhà M'));
ALTER TABLE NHANVIEN ADD CONSTRAINT CK_NHANVIEN_Thuclinh    CHECK (Thuclinh > 2000000);
```

---

## 4. Stored Procedure (Thủ Tục Lưu Trữ)

### 4.1. Hiển thị nhân viên khi biết mã phòng
```sql
CREATE PROCEDURE sp_NhanVienTheoPhong
    @Maph VARCHAR(10)
AS
BEGIN
    SELECT nv.Manv, nv.Tennv, p.Tenph
    FROM NHANVIEN nv
    JOIN PHONG p ON nv.Maph = p.Maph
    WHERE nv.Maph = @Maph;
END;
GO

-- Gọi thực thi:
EXEC sp_NhanVienTheoPhong 'PH01';
```

### 4.3 & 4.7. Hiển thị thông tin phòng và tổng số nhân viên khi biết mã phòng
```sql
CREATE PROCEDURE sp_ThongTinPhong_TheoMa
    @Maph VARCHAR(10)
AS
BEGIN
    SELECT p.Maph, p.Tenph, COUNT(nv.Manv) AS TongSoNV
    FROM PHONG p
    LEFT JOIN NHANVIEN nv ON p.Maph = nv.Maph
    WHERE p.Maph = @Maph
    GROUP BY p.Maph, p.Tenph;
END;
GO
```

### 4.5. Hiển thị tổng số nhân viên khi biết tên phòng
```sql
CREATE PROCEDURE sp_TongNV_TheoTenPhong
    @Tenph NVARCHAR(50)
AS
BEGIN
    SELECT p.Maph, p.Tenph, COUNT(nv.Manv) AS TongSoNV
    FROM PHONG p
    LEFT JOIN NHANVIEN nv ON p.Maph = nv.Maph
    WHERE p.Tenph = @Tenph
    GROUP BY p.Maph, p.Tenph;
END;
GO
```

### 4.6. Hiển thị Mã chức vụ, tên chức vụ, tổng số nhân viên khi biết mã chức vụ
```sql
CREATE PROCEDURE sp_ThongTinCV_TheoMa
    @Macv VARCHAR(10)
AS
BEGIN
    SELECT cv.Macv, cv.Tencv, COUNT(nv.Manv) AS TongSoNV
    FROM CHUCVU cv
    LEFT JOIN NHANVIEN nv ON cv.Macv = nv.Macv
    WHERE cv.Macv = @Macv
    GROUP BY cv.Macv, cv.Tencv;
END;
GO
```

### 4.8. Thủ tục tính Thực lĩnh: `Thực lĩnh = Lương + Lương * Hệ số phụ cấp`
```sql
CREATE PROCEDURE sp_CapNhatThucLinh
AS
BEGIN
    UPDATE nv
    SET nv.Thuclinh = nv.Luong + (nv.Luong * cv.Hesopc)
    FROM NHANVIEN nv
    JOIN CHUCVU cv ON nv.Macv = cv.Macv;
END;
GO

EXEC sp_CapNhatThucLinh;
```

### 4.9. Thủ tục tính Lương: `Lương = 2450000 * Hệ số lương`
```sql
CREATE PROCEDURE sp_CapNhatLuong
AS
BEGIN
    UPDATE NHANVIEN
    SET Luong = 2450000 * Hsluong;
END;
GO

EXEC sp_CapNhatLuong;
```

### 4.10. Hiển thị thông tin nhân viên khi biết mã nhân viên
```sql
CREATE PROCEDURE sp_NhanVien_TheoMa
    @Manv VARCHAR(10)
AS
BEGIN
    SELECT Manv, Tennv, Diachi
    FROM NHANVIEN
    WHERE Manv = @Manv;
END;
GO
```

### 4.11. Hiển thị thông tin nhân viên khi biết địa chỉ
```sql
CREATE PROCEDURE sp_NhanVien_TheoDiaChi
    @Diachi NVARCHAR(100)
AS
BEGIN
    SELECT Manv, Tennv, Diachi
    FROM NHANVIEN
    WHERE Diachi = @Diachi;
END;
GO
```

### 4.12. Hiển thị thông tin nhân viên khi biết hệ số lương
```sql
CREATE PROCEDURE sp_NhanVien_TheoHsLuong
    @Hsluong DECIMAL(4,2)
AS
BEGIN
    SELECT Manv, Tennv, Hsluong
    FROM NHANVIEN
    WHERE Hsluong = @Hsluong;
END;
GO
```

### 4.13. Hiển thị thông tin nhân viên khi biết tên chức vụ
```sql
CREATE PROCEDURE sp_NhanVien_TheoTenCV
    @Tencv NVARCHAR(50)
AS
BEGIN
    SELECT nv.Manv, nv.Tennv, cv.Tencv
    FROM NHANVIEN nv
    JOIN CHUCVU cv ON nv.Macv = cv.Macv
    WHERE cv.Tencv = @Tencv;
END;
GO
```

---

## 5. Hệ Thống 16 Trigger Phòng Thi EPU

### Phân loại Trigger trong đề thi:
1. **Nhóm tính toán tự động (DML Updates):** Tự động tính Lương và Thực lĩnh khi thêm/sửa dữ liệu.
2. **Nhóm kiểm tra hợp lệ dữ liệu (Integrity Validation):** Nếu vi phạm điều kiện thì hiển thị thông báo lỗi và `ROLLBACK TRANSACTION`.

---

### NHÓM 1: TRIGGER TÍNH TOÁN DỮ LIỆU TỰ ĐỘNG

#### 5.1 & 5.12. Tính tiền Lương khi thêm nhân viên mới (`Luong = Hsluong * 2450000`)
*Tư duy suy ra:* Dữ liệu mới nằm trong bảng ảo `inserted`. Phải dùng câu lệnh `UPDATE ... FROM NHANVIEN JOIN inserted` để áp dụng được cho cả trường hợp nhập hàng loạt nhiều dòng.

```sql
CREATE TRIGGER TR_NHANVIEN_Insert_TinhLuong
ON NHANVIEN
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE nv
    SET nv.Luong = ins.Hsluong * 2450000
    FROM NHANVIEN nv
    JOIN inserted ins ON nv.Manv = ins.Manv;
END;
GO
```

#### 5.2 & 5.13. Tính tiền Lương khi sửa thông tin nhân viên (đặc biệt khi sửa hệ số lương)
```sql
CREATE TRIGGER TR_NHANVIEN_Update_TinhLuong
ON NHANVIEN
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF UPDATE(Hsluong)
    BEGIN
        UPDATE nv
        SET nv.Luong = ins.Hsluong * 2450000
        FROM NHANVIEN nv
        JOIN inserted ins ON nv.Manv = ins.Manv;
    END
END;
GO
```

#### 5.4 & 5.5 & 5.14. Tính tiền Thực lĩnh khi thay đổi hệ số phụ cấp của nhân viên
*Tư duy suy ra:* Hệ số phụ cấp nằm ở bảng `CHUCVU`. Khi `CHUCVU` thay đổi `Hesopc`, tất cả nhân viên thuộc chức vụ đó phải được cập nhật lại `Thuclinh`.

```sql
CREATE TRIGGER TR_CHUCVU_Update_TinhThucLinh
ON CHUCVU
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF UPDATE(Hesopc)
    BEGIN
        UPDATE nv
        SET nv.Thuclinh = nv.Luong + (nv.Luong * ins.Hesopc)
        FROM NHANVIEN nv
        JOIN inserted ins ON nv.Macv = ins.Macv;
    END
END;
GO
```

---

### NHÓM 2: TRIGGER KIỂM TRA RÀNG BUỘC & ROLLBACK

#### 5.3. Kiểm tra Hệ số lương từ 2.34 đến 9.0 khi thêm dữ liệu vào bảng NHANVIEN
```sql
CREATE TRIGGER TR_NHANVIEN_Insert_CheckHsl
ON NHANVIEN
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted WHERE Hsluong < 2.34 OR Hsluong > 9.0)
    BEGIN
        RAISERROR (N'Lỗi: Hệ số lương của nhân viên phải từ 2.34 đến 9.0!', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO
```

#### 5.8 & 5.11. Ràng buộc Hệ số lương từ 0 đến 8.0 khi thêm hoặc sửa nhân viên
```sql
CREATE TRIGGER TR_NHANVIEN_CheckHsl_0_to_8
ON NHANVIEN
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted WHERE Hsluong < 0 OR Hsluong > 8.0)
    BEGIN
        RAISERROR (N'Lỗi: Hệ số lương nhân viên chỉ được nhận giá trị từ 0 đến 8.0!', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO
```

#### 5.6 & 5.7 & 5.15 & 5.16. Ràng buộc Hệ số phụ cấp từ 0 đến 0.4 khi thêm hoặc sửa bảng CHUCVU
```sql
CREATE TRIGGER TR_CHUCVU_CheckHesopc
ON CHUCVU
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted WHERE Hesopc < 0 OR Hesopc > 0.4)
    BEGIN
        RAISERROR (N'Lỗi: Hệ số phụ cấp chức vụ chỉ được nhận từ 0 đến 0.4!', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO
```

#### 5.9 & 5.10. Kiểm tra Thực lĩnh phải > 2,450,000 khi thêm hoặc sửa nhân viên
```sql
CREATE TRIGGER TR_NHANVIEN_CheckThucLinh
ON NHANVIEN
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted WHERE Thuclinh <= 2450000)
    BEGIN
        RAISERROR (N'Lỗi: Tiền thực lĩnh của nhân viên phải lớn hơn 2,450,000 VNĐ!', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO
```

---

## 6. Tổng Kết 5 Điểm Trọng Yếu Khi Thi Đề Này

1. **Thứ tự nhập và xóa dữ liệu:** Bảng `CHUCVU` và `PHONG` là cha, phải có bản ghi trước thì mới `INSERT` được vào `NHANVIEN`. Khi xóa phải xóa ở `NHANVIEN` trước rồi mới xóa ở bảng cha.
2. **Bẫy đơn vị lương:** Trong đề bài `Luong` và `Thuclinh` là con số tiền hàng triệu (VD: `2,450,000 * 3.5 = 8,575,000`), bắt buộc kiểu dữ liệu phải là `DECIMAL(15,2)` hoặc `BIGINT`. Dùng `INT` có thể đủ nhưng dễ bị tràn nếu phép nhân lớn.
3. **Phân biệt Rule vs Check:** Khi đề yêu cầu "Tạo bổ sung ràng buộc Rule" thì giáo viên muốn thấy cú pháp `CREATE RULE` và `sp_bindrule`. Nếu quên thì viết `CHECK CONSTRAINT` vẫn được chấm điểm nếu barem linh động.
4. **Cơ chế Trigger cập nhật nhiều bảng:** Khi sửa chức vụ ở bảng `CHUCVU`, trigger trên `CHUCVU` phải `UPDATE` sang bảng `NHANVIEN`. Rất nhiều sinh viên viết nhầm trigger trên `NHANVIEN` nên khi sửa phụ cấp bảng chức vụ không thấy lương thực lĩnh thay đổi.
5. **Cú pháp `SET NOCOUNT ON` và `GO`:** Mọi Procedure và Trigger đều phải tách biệt bằng lệnh `GO`. Trong trigger luôn đặt `SET NOCOUNT ON;` ở dòng đầu để tránh trả về số dòng bị ảnh hưởng gây nhiễu ứng dụng client.
