## 13. Đề 4 — Lập trình CSDL: ràng buộc, stored procedure, trigger, backup

Ba đề trước (đề 1, 2, 3) chỉ hỏi **truy vấn**. Đề 4 hỏi **lập trình CSDL**:
tạo ràng buộc, viết stored procedure, viết trigger, sao lưu CSDL.

Đây là dạng đề mới. Nếu kỳ sau vẫn giữ 3 đề cũ thì phần này không cần thiết — nhưng
nếu đề có stored procedure và trigger như đề 4 này thì bỏ qua là mất trọn điểm.

Mọi kết quả trong mục này đã chạy thật, xem `/home/bachhoang/sql_kiem_chung/run_de4.py`.

### 13.1. Đề bài và lược đồ

CSDL `QuanLyBanHang`, 3 bảng:

```sql
CREATE TABLE HANGHOA (
    MaHang      CHAR(10)     PRIMARY KEY,
    TenHang     NVARCHAR(100) NOT NULL,
    DonViTinh   NVARCHAR(20),
    SoLuongTon  INT          NOT NULL DEFAULT 0
);

CREATE TABLE HOADON (
    MaHD        CHAR(10)     PRIMARY KEY,
    NgayHD      DATE,
    TienBan     DECIMAL(15,2),
    GiamGia     DECIMAL(15,2),
    ThanhToan   DECIMAL(15,2)
);

CREATE TABLE CTHOADON (
    MaHD        CHAR(10)     NOT NULL,
    MaHang      CHAR(10)     NOT NULL,
    SoLuong     INT,
    Dongia      DECIMAL(15,2),
    CONSTRAINT PK_CTHD PRIMARY KEY (MaHD, MaHang),
    CONSTRAINT FK_CTHD_HD FOREIGN KEY (MaHD)  REFERENCES HOADON(MaHD),
    CONSTRAINT FK_CTHD_HH FOREIGN KEY (MaHang) REFERENCES HANGHOA(MaHang)
);
```

Đọc lược đồ như lời:

- `HANGHOA` — danh mục hàng, mỗi hàng một mã, có số lượng tồn trong kho
- `HOADON` — thông tin chung của một đơn: ngày, tổng tiền, giảm giá, số tiền còn phải trả
- `CTHOADON` — **mỗi dòng là một mặt hàng trong một đơn**

`CTHOADON` là bảng cầu nối N-N giữa `HOADON` và `HANGHOA`, y hệt bảng `KETQUA` ở mục 6.4.
Vì một đơn có nhiều mặt hàng, và một mặt hàng có thể nằm trong nhiều đơn.

Vì sao `CTHOADON` phải dùng khóa chính gộp `(MaHD, MaHang)`:

- `MaHD` lặp: một đơn có nhiều dòng chi tiết
- `MaHang` lặp: một mặt hàng được bán trong nhiều đơn
- `(MaHD, MaHang)`: mỗi cặp chỉ xuất hiện một lần

Đã kiểm tra trên dữ liệu mẫu — không có cặp nào trùng:

```sql
SELECT MaHD, MaHang, COUNT(*) AS so_lan
FROM CTHOADON GROUP BY MaHD, MaHang HAVING COUNT(*) > 1;
-- → 0 dòng
```

**Điểm cần chú ý trong lược đồ này:** `HOADON` lưu cả `TienBan` và `ThanhToan`, và cột
`TienBan` là dữ liệu **tính được** — nó bằng `SUM(SoLuong * Dongia)` của các dòng trong
`CTHOADON`. Lưu giá trị tính được vào bảng cha là việc **không chuẩn**, nhưng đề bài
cố ý yêu cầu, và câu 5 buộc phải giữ nó luôn đúng. Đó chính là lý do đề hỏi trigger.

### 13.2. Câu 2 — lọc đơn giản

> Hiển thị thông tin cho mặt hàng có số lượng tồn lớn hơn 20 đơn vị tính.

```sql
SELECT MaHang, TenHang, SoLuongTon
FROM HANGHOA
WHERE SoLuongTon > 20
ORDER BY SoLuongTon DESC;
```

Chạy thật:

| MaHang | TenHang | SoLuongTon |
|---|---|---|
| H06 | USB 128G | 200 |
| H04 | Tai nghe | 120 |
| H01 | Bàn phím cơ | 50 |
| H02 | Chuột không dây | 30 |
| H05 | Ổ cứng SSD 1TB | 22 |

Đây chính là dạng 1 (lọc một bảng) ở mục 4. `> 20` chứ không phải `>= 20` — đề ghi
"lớn hơn 20".

### 13.3. Câu 3 — bổ sung ràng buộc CHECK

> Tạo bổ sung ràng buộc Rule cho cột số lượng tồn của bảng hàng hoá nhận giá trị lớn hơn 0.

```sql
ALTER TABLE HANGHOA
ADD CONSTRAINT CK_HANGHOA_TON CHECK (SoLuongTon > 0);
```

Ba điều phải biết về `ALTER TABLE ... ADD CONSTRAINT`:

- Ràng buộc `CHECK` được thêm **sau** khi bảng đã có dữ liệu cũng được, nhưng SQL Server
  **kiểm tra dữ liệu đang có** trước khi thêm. Nếu trong bảng đã có dòng vi phạm thì
  lệnh báo lỗi và ràng buộc không được tạo.
- Muốn kiểm tra dữ liệu sẵn có mà không đụng tới bảng:
  ```sql
  SELECT MaHang, SoLuongTon FROM HANGHOA WHERE SoLuongTon <= 0;
  ```
- `CHECK` không tự sinh chỉ mục. Muốn `CHECK (SoLuongTon > 0)` và truy vấn nhanh thì
  dùng `INDEX`, nhưng đề không yêu cầu.

Sau khi thêm, thử nhập vi phạm sẽ bị chặn:

```sql
INSERT INTO HANGHOA (MaHang, TenHang, SoLuongTon) VALUES ('H99', N'Thử', -1);
-- Msg 547: The INSERT statement conflicted with the CHECK constraint "CK_HANGHOA_TON".
```

### 13.4. Câu 4 — stored procedure

> Tạo thủ tục hiển thị thông tin của một mặt hàng khi biết mã hàng.

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

Chạy thật:

| MaHang | TenHang | SoLuongTon |
|---|---|---|
| H05 | Ổ cứng SSD 1TB | 22 |

Bốn điểm về stored procedure trong SQL Server:

**1. `GO` không phải SQL.** Trong SSMS, `CREATE PROCEDURE` phải là câu lệnh đầu tiên
của một lô. Không có `GO` ở giữa thì SQL Server báo:
`Msg 102: Incorrect syntax near 'GO'`. Chạy file .sql thì bắt buộc có `GO`.

**2. Tham số viết `@TenBien`, không viết kiểu trước.** `WHERE MaHang = CHAR(10)` là sai —
sai cả kiểu dữ liệu lẫn ý nghĩa.

**3. Procedure không `SELECT *` ra mặc định.** `SELECT *` trong stored procedure khiến
kết quả phụ thuộc vào thứ tự cột trong bảng. Đề thi muốn "mã hàng, tên hàng, số lượng tồn"
thì liệt kê đúng 3 cột đó.

**4. `CREATE PROCEDURE` không nằm trong `CREATE TABLE`.** Câu 1 tạo CSDL và bảng, câu 4
tạo procedure — hai việc tách biệt, điểm số riêng.

### 13.5. Câu 5 — trigger cập nhật tổng tiền (câu khó nhất)

> Tạo trigger cập nhật lại tiền bán của mỗi hoá đơn khi chỉnh sửa thông tin mặt hàng
> được lưu trong bảng CTHOADON. Biết công thức tính tiền bán trên mỗi hoá đơn là:
> `TienBan = Sum(SoLuong * Dongia)`

```sql
CREATE TRIGGER TR_CTHD_TinhLaiTienBan
ON CTHOADON
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Xoá: sau khi xoá, inserted rỗng, chỉ còn deleted
    IF NOT EXISTS (SELECT 1 FROM inserted) AND EXISTS (SELECT 1 FROM deleted)
    BEGIN
        UPDATE h
        SET h.TienBan = ISNULL((
                SELECT SUM(ct.SoLuong * ct.Dongia)
                FROM CTHOADON ct
                WHERE ct.MaHD = h.MaHD), 0)
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
                FROM CTHOADON ct
                WHERE ct.MaHD = h.MaHD), 0)
        FROM HOADON h
        WHERE h.MaHD IN (SELECT MaHD FROM inserted);
        RETURN;
    END

    -- 3. Sửa: có cả hai. MaHD có thể bị đổi, nên phải tính lại cả hoá đơn cũ lẫn hoá đơn mới
    UPDATE h
    SET h.TienBan = ISNULL((
            SELECT SUM(ct.SoLuong * ct.Dongia)
            FROM CTHOADON ct
            WHERE ct.MaHD = h.MaHD), 0)
    FROM HOADON h
    WHERE h.MaHD IN (SELECT MaHD FROM inserted)
       OR h.MaHD IN (SELECT MaHD FROM deleted);
END
GO
```

#### Vì sao phải chia 3 nhánh

Đây là điểm học được quan trọng nhất của cả đề. Một trigger `AFTER INSERT, UPDATE, DELETE`
nhìn vào hai bảng tạm: `inserted` (dòng sau thay đổi) và `deleted` (dòng trước thay đổi).

| Thao tác | `inserted` | `deleted` | Phải tính lại cho |
|---|---|---|---|
| `INSERT` | có dòng | rỗng | `MaHD` trong `inserted` |
| `DELETE` | rỗng | có dòng | `MaHD` trong `deleted` |
| `UPDATE` | có dòng | có dòng | **cả hai** |

**Bẫy chết người: viết một khối `UPDATE` chung cho cả 3 trường hợp.** Khi xoá dòng,
`inserted` rỗng nên `WHERE MaHD IN (SELECT MaHD FROM inserted)` không khớp dòng nào —
tổng tiền hoá đơn đó **không bao giờ được cập nhật**, và nó vẫn giữ số tiền cũ.

**Bẫy thứ hai, ít ai để ý: sửa `MaHD` của một dòng chi tiết.** Dòng đó chuyển từ hoá đơn
`HD001` sang `HD002`. Nếu chỉ tính lại theo `inserted`, hoá đơn `HD001` mất một dòng
chi tiết nhưng tổng tiền của nó không được sửa. Vì vậy nhánh `UPDATE` phải tính cả
`inserted` lẫn `deleted`.

#### Đã chạy thật, kết quả từng bước

Sau khi tạo trigger và nạp dữ liệu:

| MaHD | TienBan | GiamGia | ThanhToan |
|---|---|---|---|
| HD001 | 3450000.00 | 0.00 | NULL |
| HD002 | 4500000.00 | 50000.00 | NULL |
| HD003 | 2670000.00 | 0.00 | NULL |
| HD004 | 1900000.00 | 20000.00 | NULL |
| HD005 | 3950000.00 | 0.00 | NULL |

Kiểm tra tay: `HD001` = 2 × 1.500.000 + 1 × 450.000 = 3.450.000. Đúng.

**Sửa số lượng:** `UPDATE CTHOADON SET SoLuong = 5 WHERE MaHD='HD001' AND MaHang='H01'`

| thời điểm | TienBan |
|---|---|
| trước | 3450000.00 |
| sau | 7950000.00 |

Kiểm tra: 5 × 1.500.000 + 450.000 = 7.950.000. Đúng.

**Xoá dòng chi tiết:** `DELETE FROM CTHOADON WHERE MaHD='HD001' AND MaHang='H01'`

| thời điểm | TienBan |
|---|---|
| trước | 7950000.00 |
| sau | 450000.00 |

Còn lại đúng một dòng `H02`: 1 × 450.000 = 450.000. Đúng.

#### `ISNULL` hay `COALESCE` — và vì sao phải bọc

Khi xoá hết dòng chi tiết của một hoá đơn, `SUM(SoLuong * Dongia)` trả về `NULL`
(hàm tổng hợp trên tập rỗng trả `NULL`, không phải 0). Không bọc thì `HOADON.TienBan`
bị ghi đè bằng `NULL`, và mọi câu `WHERE TienBan > 0` sau đó sẽ bỏ sót hoá đơn đó.

`ISNULL(x, 0)` và `COALESCE(x, 0)` cho cùng kết quả ở đây. `COALESCE` là cách viết
chuẩn SQL, dùng được cả 2 tham số trở lên; `ISNULL` chỉ 2 và là hàm riêng của SQL Server.
Đề thi dùng SQL Server nên cả hai đều được.

#### Một lựa chọn thiết kế khác, cũng đúng

Nếu giảng viên chấp nhận việc bỏ cột `TienBan` khỏi `HOADON` và tính mỗi khi cần, thì
không cần trigger, và không có nguy cơ dữ liệu sai. Câu hỏi tính tổng tiền sẽ thành:

```sql
SELECT hd.MaHD, SUM(ct.SoLuong * ct.Dongia) AS TienBan
FROM HOADON hd JOIN CTHOADON ct ON ct.MaHD = hd.MaHD
GROUP BY hd.MaHD;
```

Đây là lựa chọn đúng về mặt thiết kế CSDL. Nhưng **đề đã yêu cầu tạo trigger và cột
`TienBan` đã có trong lược đồ**, nên khi làm bài phải theo đề. Biết cả hai cách để
trả lời khi giảng viên hỏi thêm là đủ.

### 13.6. Câu 6 — sao lưu CSDL

> Backup cơ sở dữ liệu sang ổ đĩa khác.

Trên SSMS: chuột phải vào database `QuanLyBanHang` → **Tasks** → **Back Up…**

- **Source**: `Database`
- **Backup type**: `Full`
- **Destination**: `Disk`, chọn đường dẫn ổ đĩa khác
- **Backup set**: để mặc định

Ba chỗ dễ sai:

1. **Đường dẫn phải nằm trên máy chạy SQL Server**, không phải máy đang mở SSMS.
   Nếu SQL Server chạy ở máy khác qua mạng, chọn `\\tenserver\share` chứ không phải
   `D:\backup` trên máy bạn.
2. **Đuôi file phải là `.bak`.** SQL Server tự thêm nếu thiếu.
3. **Phải có quyền `sysadmin`** hoặc quyền ghi vào thư mục đích.

Kiểm tra bản sao lưu đã đủ:

```sql
RESTORE FILELISTONLY FROM DISK = 'D:\backup\QuanLyBanHang.bak';
```

Sao lưu khác với sao chép file: file `.mdf` khi copy tay sẽ sai vì nó đang được
SQL Server giữ khoá. Chỉ `BACKUP DATABASE` mới tạo được bản sao lưu đúng.

### 13.7. Bảng so sánh: đề 1–3 với đề 4

| Đề | Hỏi gì | Kỹ năng |
|---|---|---|
| Đề 1, 2 | Truy vấn 5 dạng | `SELECT`, `JOIN`, `GROUP BY`, `HAVING`, `NOT EXISTS` |
| Đề 3 | Truy vấn trên bài thư viện | như trên, kèm `SUM` và `COUNT` |
| **Đề 4** | Lập trình CSDL | `ALTER TABLE ... CHECK`, `CREATE PROCEDURE`, `CREATE TRIGGER`, `BACKUP` |

Hai kỹ năng mới phải học thêm: **stored procedure** và **trigger**. Trigger thì có
bẫy (ba nhánh `inserted`/`deleted`), procedure thì có hai bẫy cú pháp (`GO`, `@ThamSo`).

### 13.8. Sáu điểm dễ mất trong đề này

1. `GO` thiếu sau `CREATE PROCEDURE` và `CREATE TRIGGER` → SQL Server báo lỗi cú pháp.
2. Trigger viết một khối chung cho `INSERT/UPDATE/DELETE` → xoá dòng không cập nhật tổng tiền.
3. Sửa `MaHD` của dòng chi tiết → hoá đơn cũ giữ tổng tiền cũ.
4. Không bọc `ISNULL(..., 0)` → xoá hết dòng thì `TienBan` thành `NULL`.
5. `> 20` viết thành `>= 20` → lấy thừa hàng có đúng 20.
6. Tham số procedure viết `WHERE MaHang = CHAR(10)` thay vì `@MaHang`.

---