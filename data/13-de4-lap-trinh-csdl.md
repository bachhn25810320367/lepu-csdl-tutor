# ĐỀ 4 — QUẢN LÝ BÁN HÀNG: FULL VIEW, RULE, PROCEDURE & 19 TRIGGER

> Bản viết lại và mở rộng toàn diện từ ngân hàng đề thi thực hành chính thức EPU.
> Chuẩn duy nhất: **SQL Server (SSMS)**.
> CSDL: `QuanLyBanHang_Hotensv` (3 bảng: `HANGHOA`, `HOADON`, `CTHOADON`).
> Mọi kết quả trong file này đã chạy thật trên dữ liệu mẫu, không có con số bịa.

---

## 1. Phân Tích Lược Đồ & Mã DDL Khởi Tạo

### 1.1. Lược đồ 3 bảng

![Hình 3.1: Violet đứng quầy Shop Vũ Khí & Valhein khiêng thùng hàng: 3 bảng HANGHOA, HOADON, CTHOADON](assets/media/csdl/valhein_violet/b03_01.jpg)

- **`HANGHOA`** (`MaHang`, `TenHang`, `DonViTinh`, `SoLuongTon`)
- **`HOADON`** (`MaHD`, `NgayHD`, `TienBan`, `GiamGia`, `ThanhToan`)
- **`CTHOADON`** (`MaHD`, `MaHang`, `SoLuong`, `Dongia`)

```
   [HOADON] 1 ────────── N [CTHOADON] N ────────── 1 [HANGHOA]
   (MaHD)                   (MaHD, MaHang)            (MaHang)
```

- `CTHOADON` là bảng cầu nối N-N giữa `HOADON` và `HANGHOA`.
- Khóa chính gộp `(MaHD, MaHang)` đảm bảo mỗi mặt hàng chỉ xuất hiện 1 lần trong 1 đơn.
- **Điểm then chốt:** Cột `TienBan` và `ThanhToan` trong `HOADON` là dữ liệu tính toán từ `CTHOADON` (`TienBan = SUM(SoLuong * Dongia)`, `ThanhToan = TienBan - (TienBan * GiamGia)`). Đây là lý do đề thi yêu cầu viết các Stored Procedure và Trigger tự động đồng bộ.

### 1.2. Mã DDL Khởi Tạo

```sql
CREATE DATABASE QuanLyBanHang_HoangNgocBach;
GO

USE QuanLyBanHang_HoangNgocBach;
GO

CREATE TABLE HANGHOA (
    MaHang      VARCHAR(10)     PRIMARY KEY,
    TenHang     NVARCHAR(100)   NOT NULL,
    DonViTinh   NVARCHAR(20),
    SoLuongTon  INT             NOT NULL DEFAULT 0
);
GO

CREATE TABLE HOADON (
    MaHD        VARCHAR(10)     PRIMARY KEY,
    NgayHD      DATE            DEFAULT GETDATE(),
    TienBan     DECIMAL(15,2)   DEFAULT 0,
    GiamGia     DECIMAL(4,2)    DEFAULT 0,
    ThanhToan   DECIMAL(15,2)   DEFAULT 0
);
GO

CREATE TABLE CTHOADON (
    MaHD        VARCHAR(10)     NOT NULL,
    MaHang      VARCHAR(10)     NOT NULL,
    SoLuong     INT             DEFAULT 0,
    Dongia      DECIMAL(15,2)   DEFAULT 0,
    CONSTRAINT PK_CTHD PRIMARY KEY (MaHD, MaHang),
    CONSTRAINT FK_CTHD_HD FOREIGN KEY (MaHD)   REFERENCES HOADON(MaHD),
    CONSTRAINT FK_CTHD_HH FOREIGN KEY (MaHang) REFERENCES HANGHOA(MaHang)
);
GO
```

### 1.3. Dữ liệu mẫu kiểm thử

```sql
INSERT INTO HANGHOA (MaHang, TenHang, DonViTinh, SoLuongTon) VALUES
('H01', N'Bàn phím cơ',    N'Chiếc', 50),
('H02', N'Chuột không dây', N'Chiếc', 30),
('H03', N'Màn hình 24inch', N'Thùng', 15),
('H04', N'Tai nghe Gaming', N'Hộp',   120),
('H05', N'Ổ cứng SSD 1TB',  N'Chiếc', 22),
('H06', N'USB 128GB',       N'Thùng', 200);

INSERT INTO HOADON (MaHD, NgayHD, TienBan, GiamGia, ThanhToan) VALUES
('HD01', '2023-10-02', 3450000.00, 0.00, 3450000.00),
('HD02', '2023-10-02', 4500000.00, 0.10, 4050000.00),
('HD03', '2023-10-05', 2670000.00, 0.05, 2536500.00),
('HD04', '2023-10-08', 1900000.00, 0.00, 1900000.00),
('HD05', '2023-10-10', 3950000.00, 0.20, 3160000.00);

INSERT INTO CTHOADON (MaHD, MaHang, SoLuong, Dongia) VALUES
('HD01', 'H01', 2,  1500000.00),
('HD01', 'H02', 1,   450000.00),
('HD02', 'H03', 1,  4500000.00),
('HD03', 'H04', 3,   500000.00),
('HD03', 'H05', 1,  1170000.00),
('HD04', 'H02', 2,   450000.00),
('HD04', 'H06', 5,   200000.00),
('HD05', 'H01', 1,  1500000.00),
('HD05', 'H04', 2,   500000.00),
('HD05', 'H05', 1,  1450000.00);
GO
```

---

## 2. Hệ Thống View & Truy Vấn Dữ Liệu

### 2.0. Hiển thị thông tin các mặt hàng có số lượng tồn lớn hơn 30
```sql
SELECT MaHang, TenHang, SoLuongTon
FROM HANGHOA
WHERE SoLuongTon > 30;
```

### 2.1. Hiển thị mặt hàng có đơn vị tính là 'Thùng'
```sql
SELECT MaHang, TenHang, SoLuongTon
FROM HANGHOA
WHERE DonViTinh = N'Thùng';
```

### 2.2. Hiển thị các hóa đơn được lập trong ngày 2/10/2023
```sql
SELECT MaHD, NgayHD, TienBan
FROM HOADON
WHERE NgayHD = '2023-10-02';
```

### 2.3. Tạo View hiển thị mặt hàng chưa có khách mua

![Hình 3.2: Violet rọi đèn pin vào góc tối kho phát hiện nỏ thần phủ mạng nhện chưa từng ai mua (LEFT JOIN ... IS NULL)](assets/media/csdl/valhein_violet/b03_02.jpg)
*Tư duy suy ra:* Dùng `NOT EXISTS` hoặc `LEFT JOIN ... WHERE CTHOADON.MaHD IS NULL`.
```sql
CREATE VIEW V_HangHoa_ChuaBan AS
SELECT hh.MaHang, hh.TenHang, hh.DonViTinh
FROM HANGHOA hh
LEFT JOIN CTHOADON ct ON hh.MaHang = ct.MaHang
WHERE ct.MaHang IS NULL;
GO
```

### 2.4. Tạo View hiển thị mặt hàng được khách mua với số lượng nhiều nhất

![Hình 3.3: Valhein mở Bảng Vàng vinh danh món đồ Hot Sale bán nhiều nhất (TOP 1 WITH TIES ... SUM(SoLuong))](assets/media/csdl/valhein_violet/b03_03.jpg)
*Tư duy suy ra:* Tính tổng số lượng bán bằng `SUM(ct.SoLuong)`, gom theo mặt hàng, dùng `TOP 1 WITH TIES` để không bỏ sót các mặt hàng đồng hạng nhất.

```sql
CREATE VIEW V_HangHoa_BanNhieuNhat AS
SELECT TOP 1 WITH TIES
    hh.MaHang,
    hh.TenHang,
    SUM(ct.SoLuong) AS TongSoLuongDaBan
FROM HANGHOA hh
JOIN CTHOADON ct ON hh.MaHang = ct.MaHang
GROUP BY hh.MaHang, hh.TenHang
ORDER BY SUM(ct.SoLuong) DESC;
GO
```

### 2.6. Tạo View hiển thị các mặt hàng được bán trên 20 đơn vị tính
```sql
CREATE VIEW V_HangHoa_BanTren20 AS
SELECT hh.MaHang, hh.TenHang, SUM(ct.SoLuong) AS TongBan
FROM HANGHOA hh
JOIN CTHOADON ct ON hh.MaHang = ct.MaHang
GROUP BY hh.MaHang, hh.TenHang
HAVING SUM(ct.SoLuong) > 20;
GO
```

### 2.7. Hiển thị các hóa đơn bán được trên 3 mặt hàng
*Tư duy suy ra:* Một hóa đơn bán được bao nhiêu *mặt hàng* (số lượng chủng loại) tính bằng `COUNT(DISTINCT ct.MaHang)`.

```sql
SELECT hd.MaHD, hd.NgayHD, COUNT(DISTINCT ct.MaHang) AS TongSoMatHang
FROM HOADON hd
JOIN CTHOADON ct ON hd.MaHD = ct.MaHD
GROUP BY hd.MaHD, hd.NgayHD
HAVING COUNT(DISTINCT ct.MaHang) > 3;
```

### 2.9. Hiển thị hóa đơn bán được nhiều mặt hàng nhất
```sql
SELECT TOP 1 WITH TIES
    hd.MaHD, 
    hd.NgayHD, 
    COUNT(DISTINCT ct.MaHang) AS TongSoMatHang
FROM HOADON hd
JOIN CTHOADON ct ON hd.MaHD = ct.MaHD
GROUP BY hd.MaHD, hd.NgayHD
ORDER BY COUNT(DISTINCT ct.MaHang) DESC;
```

### 2.11. Hiển thị hóa đơn có số tiền thanh toán nhiều nhất
```sql
SELECT TOP 1 WITH TIES MaHD, NgayHD, ThanhToan
FROM HOADON
ORDER BY ThanhToan DESC;
```

### 2.12. Hiển thị mặt hàng có số lần mua dưới 3 lần
*Tư duy suy ra:* "Số lần mua" là số hóa đơn chứa mặt hàng đó (`COUNT(ct.MaHD)`).

```sql
SELECT hh.MaHang, hh.TenHang, COUNT(ct.MaHD) AS SoLanMua
FROM HANGHOA hh
LEFT JOIN CTHOADON ct ON hh.MaHang = ct.MaHang
GROUP BY hh.MaHang, hh.TenHang
HAVING COUNT(ct.MaHD) < 3;
```

### 2.13. Hiển thị mặt hàng có số lượng tồn ít nhất
```sql
SELECT TOP 1 WITH TIES MaHang, TenHang, SoLuongTon
FROM HANGHOA
ORDER BY SoLuongTon ASC;
```

---

## 3. Ràng Buộc Rule & Default

### 3.1 & 3.2. Ràng buộc RULE (`CREATE RULE` & `sp_bindrule`)

```sql
-- 3.1 Rule cho SoLuongTon > 0
CREATE RULE R_SoLuongTon AS @ton > 0;
GO
EXEC sp_bindrule 'R_SoLuongTon', 'HANGHOA.SoLuongTon';
GO

![Hình 3.4: Violet chĩa súng trừng phạt gian thương đòi áp mã voucher giảm giá vượt trần 0.5 (RULE GiamGia BETWEEN 0 AND 0.5)](assets/media/csdl/valhein_violet/b03_04.jpg)
-- 3.2 Rule cho GiamGia từ 0 đến 0.5
CREATE RULE R_GiamGia AS @gg BETWEEN 0 AND 0.5;
GO
EXEC sp_bindrule 'R_GiamGia', 'HOADON.GiamGia';
GO
```

### 3.4 & 3.6 & 3.7. Ràng buộc DEFAULT (`CREATE DEFAULT` & `sp_bindefault`)

```sql
-- 3.4 Default SoLuong trong CTHOADON nhận 0
CREATE DEFAULT DF_SoLuong AS 0;
GO
EXEC sp_bindefault 'DF_SoLuong', 'CTHOADON.SoLuong';
GO

-- 3.6 Default TienBan trong HOADON nhận 0
CREATE DEFAULT DF_TienBan AS 0;
GO
EXEC sp_bindefault 'DF_TienBan', 'HOADON.TienBan';
GO

-- 3.7 Default NgayHD trong HOADON nhận ngày hiện tại
CREATE DEFAULT DF_NgayHD AS GETDATE();
GO
EXEC sp_bindefault 'DF_NgayHD', 'HOADON.NgayHD';
GO
```

---

## 4. Stored Procedure (Thủ Tục Lưu Trữ)

### 4.1. Tổng số mặt hàng được bán trên mỗi hóa đơn khi biết mã HD
```sql
CREATE PROCEDURE sp_TongMatHang_TheoMaHD
    @MaHD VARCHAR(10)
AS
BEGIN
    SELECT hd.MaHD, hd.NgayHD, COUNT(DISTINCT ct.MaHang) AS TongSoMatHang
    FROM HOADON hd
    JOIN CTHOADON ct ON hd.MaHD = ct.MaHD
    WHERE hd.MaHD = @MaHD
    GROUP BY hd.MaHD, hd.NgayHD;
END;
GO

EXEC sp_TongMatHang_TheoMaHD 'HD01';
```

### 4.2. Tổng số lượng hàng được bán trên mỗi hóa đơn khi biết mã HD
```sql
CREATE PROCEDURE sp_TongSoLuongHang_TheoMaHD
    @MaHD VARCHAR(10)
AS
BEGIN
    SELECT hd.MaHD, hd.NgayHD, SUM(ct.SoLuong) AS TongSoLuongHang
    FROM HOADON hd
    JOIN CTHOADON ct ON hd.MaHD = ct.MaHD
    WHERE hd.MaHD = @MaHD
    GROUP BY hd.MaHD, hd.NgayHD;
END;
GO
```

### 4.3 & 4.4. Tiền bán và Tiền thanh toán của hóa đơn khi biết mã HD
```sql
CREATE PROCEDURE sp_TienBan_ThanhToan_TheoMaHD
    @MaHD VARCHAR(10)
AS
BEGIN
    SELECT MaHD, NgayHD, TienBan, ThanhToan
    FROM HOADON
    WHERE MaHD = @MaHD;
END;
GO
```

### 4.5. Thông tin hóa đơn khi biết ngày hóa đơn
```sql
CREATE PROCEDURE sp_HoaDon_TheoNgay
    @NgayHD DATE
AS
BEGIN
    SELECT MaHD, NgayHD, TienBan, ThanhToan
    FROM HOADON
    WHERE NgayHD = @NgayHD;
END;
GO
```

### 4.6 & 4.7. Tổng tiền bán và Tổng tiền thanh toán trong ngày
```sql
CREATE PROCEDURE sp_DoanhThuNgay
    @NgayHD DATE
AS
BEGIN
    SELECT NgayHD, 
           SUM(TienBan) AS TongTienBan, 
           SUM(ThanhToan) AS TongThanhToan
    FROM HOADON
    WHERE NgayHD = @NgayHD
    GROUP BY NgayHD;
END;
GO
```

### 4.8. Cập nhật Tiền bán trong bảng HOADON

![Hình 3.5: Valhein thả thẻ bài vào cỗ máy tính tiền tự động in biên lai (Stored Procedure sp_CapNhatTienBan)](assets/media/csdl/valhein_violet/b03_05.jpg): `TienBan = Sum(SoLuong * Dongia)`
```sql
CREATE PROCEDURE sp_CapNhatTienBan
AS
BEGIN
    UPDATE hd
    SET hd.TienBan = ISNULL((
        SELECT SUM(ct.SoLuong * ct.Dongia)
        FROM CTHOADON ct
        WHERE ct.MaHD = hd.MaHD
    ), 0)
    FROM HOADON hd;
END;
GO

EXEC sp_CapNhatTienBan;
```

### 4.9. Cập nhật Tiền thanh toán: `ThanhToan = TienBan - (TienBan * GiamGia)`
```sql
CREATE PROCEDURE sp_CapNhatThanhToan
AS
BEGIN
    UPDATE HOADON
    SET ThanhToan = TienBan - (TienBan * ISNULL(GiamGia, 0));
END;
GO

EXEC sp_CapNhatThanhToan;
```

---

## 5. Hệ Thống 19 Trigger Phòng Thi EPU

![Hình 3.6: Violet cầm Khay Xanh inserted (vừa nhập) & Valhein cầm Khay Đỏ deleted (vừa bỏ ra) — Bản chất Trigger](assets/media/csdl/valhein_violet/b03_06.jpg)

### NHÓM 1: TRIGGER TÍNH TOÁN DỮ LIỆU TỰ ĐỘNG

#### 5.1 & 5.2. Cập nhật lại Tiền bán khi thêm hoặc xóa mặt hàng trong CTHOADON

![Hình 3.8: Valhein chuyển thuốc giữa 2 giỏ hàng, Violet chiếu laser cập nhật lại tổng tiền cả 2 giỏ (Bẫy đổi mã hóa đơn)](assets/media/csdl/valhein_violet/b03_08.jpg)
*Tư duy suy ra:* Khi thêm thì lấy mã đơn ở bảng `inserted`. Khi xóa thì lấy mã đơn ở bảng `deleted`.

```sql
CREATE TRIGGER TR_CTHD_CapNhatTienBan_Insert_Delete
ON CTHOADON
AFTER INSERT, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    ![Hình 3.10: Valhein ném phao cứu sinh số 0 vào hố đen NULL cứu hóa đơn khi xóa sạch món (Cứu rỗi bằng ISNULL(..., 0))](assets/media/csdl/valhein_violet/b03_10.jpg)
    -- Cập nhật cho các hóa đơn bị ảnh hưởng (cả khi thêm mới lẫn khi xóa)
    UPDATE hd
    SET hd.TienBan = ISNULL((
        SELECT SUM(ct.SoLuong * ct.Dongia)
        FROM CTHOADON ct
        WHERE ct.MaHD = hd.MaHD
    ), 0)
    FROM HOADON hd
    WHERE hd.MaHD IN (SELECT MaHD FROM inserted UNION SELECT MaHD FROM deleted);
END;
GO
```

#### 5.9. Cập nhật lại Tiền thanh toán khi sửa thông tin Giảm giá trong HOADON
```sql
CREATE TRIGGER TR_HOADON_Update_GiamGia
ON HOADON
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF UPDATE(GiamGia) OR UPDATE(TienBan)
    BEGIN
        UPDATE hd
        SET hd.ThanhToan = ins.TienBan - (ins.TienBan * ISNULL(ins.GiamGia, 0))
        FROM HOADON hd
        JOIN inserted ins ON hd.MaHD = ins.MaHD;
    END
END;
GO
```

#### 5.12 & 5.17. Cập nhật số lượng tồn

![Hình 3.7: Violet giao súng cho khách, cỗ máy kho tự động trừ số lượng tồn kho (Trigger trừ tồn kho AFTER INSERT)](assets/media/csdl/valhein_violet/b03_07.jpg): `SoLuongTon = SoLuongTon - SoLuong` khi thêm vào CTHOADON
```sql
CREATE TRIGGER TR_CTHD_TruTonKho_Insert
ON CTHOADON
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE hh
    SET hh.SoLuongTon = hh.SoLuongTon - ins.SoLuong
    FROM HANGHOA hh
    JOIN inserted ins ON hh.MaHang = ins.MaHang;
END;
GO
```

#### 5.13. Cập nhật số lượng tồn khi sửa số lượng bán trong CTHOADON
*Tư duy suy ra:* Số lượng tồn mới = `SoLuongTon_cu + SoLuong_cu - SoLuong_moi` = `SoLuongTon - (SoLuong_moi - SoLuong_cu)`.

```sql
CREATE TRIGGER TR_CTHD_Update_SoLuongTon
ON CTHOADON
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF UPDATE(SoLuong)
    BEGIN
        UPDATE hh
        SET hh.SoLuongTon = hh.SoLuongTon - (ins.SoLuong - del.SoLuong)
        FROM HANGHOA hh
        JOIN inserted ins ON hh.MaHang = ins.MaHang
        JOIN deleted del  ON ins.MaHD = del.MaHD AND ins.MaHang = del.MaHang;
    END
END;
GO
```

---

### NHÓM 2: TRIGGER KIỂM TRA HỢP LỆ VÀ ROLLBACK

#### 5.3 & 5.6. Kiểm tra Số lượng tồn trong HANGHOA phải > 0 khi thêm hoặc sửa
```sql
CREATE TRIGGER TR_HANGHOA_CheckSoLuongTon
ON HANGHOA
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted WHERE SoLuongTon <= 0)
    BEGIN
        RAISERROR (N'Lỗi: Số lượng hàng tồn trong kho phải lớn hơn 0!', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO
```

#### 5.4 & 5.5. Kiểm tra Số lượng bán trong CTHOADON phải > 0 khi thêm hoặc sửa
```sql
CREATE TRIGGER TR_CTHD_CheckSoLuong
ON CTHOADON
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted WHERE SoLuong <= 0)
    BEGIN
        RAISERROR (N'Lỗi: Số lượng mặt hàng bán phải lớn hơn 0!', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO
```

#### 5.7 & 5.8. Kiểm tra Đơn giá trong CTHOADON phải > 0 khi thêm hoặc sửa
```sql
CREATE TRIGGER TR_CTHD_CheckDonGia
ON CTHOADON
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted WHERE Dongia <= 0)
    BEGIN
        RAISERROR (N'Lỗi: Đơn giá bán phải lớn hơn 0!', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO
```

#### 5.10 & 5.11. Kiểm tra Ngày lập hóa đơn <= ngày hiện tại khi thêm hoặc sửa

![Hình 3.9: Violet thổi còi giơ khiên đỏ hủy giao dịch gian lận ghi ngày mai (Trigger ROLLBACK NgayHD > GETDATE())](assets/media/csdl/valhein_violet/b03_09.jpg)
```sql
CREATE TRIGGER TR_HOADON_CheckNgayHD
ON HOADON
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted WHERE NgayHD > CAST(GETDATE() AS DATE))
    BEGIN
        RAISERROR (N'Lỗi: Ngày lập hóa đơn không được lớn hơn ngày hiện tại!', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO
```

#### 5.14. Kiểm tra Số lượng tồn phải > 20 khi thêm vào bảng HANGHOA
```sql
CREATE TRIGGER TR_HANGHOA_CheckTonLonHon20
ON HANGHOA
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted WHERE SoLuongTon <= 20)
    BEGIN
        RAISERROR (N'Lỗi: Số lượng tồn khi nhập mặt hàng mới phải lớn hơn 20!', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO
```

#### 5.15 & 5.16. Kiểm tra Đơn giá > 10,000 khi thêm và > 20,000 khi sửa trong CTHOADON
```sql
-- Khi thêm: Đơn giá > 10,000
CREATE TRIGGER TR_CTHD_Insert_DonGia10k
ON CTHOADON
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted WHERE Dongia <= 10000)
    BEGIN
        RAISERROR (N'Lỗi: Đơn giá thêm mới phải lớn hơn 10,000 VNĐ!', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO

-- Khi sửa: Đơn giá > 20,000
CREATE TRIGGER TR_CTHD_Update_DonGia20k
ON CTHOADON
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF UPDATE(Dongia) AND EXISTS (SELECT 1 FROM inserted WHERE Dongia <= 20000)
    BEGIN
        RAISERROR (N'Lỗi: Đơn giá sau khi sửa phải lớn hơn 20,000 VNĐ!', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO
```

#### 5.18 & 5.19. Kiểm tra cột Giảm giá chỉ từ 0 đến 0.5 khi thêm hoặc sửa HOADON
```sql
CREATE TRIGGER TR_HOADON_CheckGiamGia
ON HOADON
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted WHERE GiamGia < 0 OR GiamGia > 0.5)
    BEGIN
        RAISERROR (N'Lỗi: Giá trị giảm giá chỉ được phép nằm trong khoảng 0 đến 0.5 (tối đa 50%)!', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO
```
