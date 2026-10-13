# Bài 12: Danh sách Từ điển (List of Dicts): Quản lý hồ sơ học sinh và Bảng điểm

## 1. Câu chuyện đời sống: Tập hồ sơ học bạ của lớp học

Hãy tưởng tượng **Minh** là lớp trưởng và cùng **Bit** quản lý một **tập hồ sơ học bạ** của cả lớp:

![Hình 12.1: Danh sách Từ điển — Chiếc cặp lớn là List [], bên trong chứa từng tờ hồ sơ học sinh {}](assets/media/python/minh_bit/bai12_student_dossier.jpg)

![Hình 12.2: Góc nhìn Game RPG — Sổ tay quái thú Dungeon Compendium chứa danh sách thẻ bài quái vật](assets/media/python/minh_bit/game_dungeon_compendium.jpg)

1. **Mỗi tờ học bạ (Một Dictionary):** 
   Mỗi bạn học sinh có một tờ giấy ghi đầy đủ thông tin: `{"ten": "Nguyen Van A", "diem": 8.5, "que": "Ha Noi"}`.
2. **Chiếc cặp tài liệu kẹp chung (Một List):**
   Cả lớp gồm 40 học sinh được kẹp lần lượt vào trong một chiếc cặp tài liệu lớn mang tên `ds_hoc_sinh = [hs_1, hs_2, ..., hs_40]`.
3. **Thao tác quản lý:**
   - Khi thầy giáo bảo: *"Cho thầy xem tên bạn đầu tiên"*, bạn rút tờ học bạ số 0 ra và đọc tên: `ds_hoc_sinh[0]["ten"]`.
   - Khi thầy bảo: *"Tìm bạn thủ khoa của lớp"*, bạn lật từng tờ học bạ, so sánh điểm và giữ lại tờ học bạ có điểm cao nhất.

Đây chính là mô hình quản lý dữ liệu phổ biến nhất trong mọi hệ thống phần mềm và đề thi thực tế!

---

## 2. Ví dụ nhỏ nhất (3–5 dòng code)

Tạo danh sách chứa 2 học sinh và in ra tên của từng bạn:

```python
# Danh sach chua cac tu dien hoc sinh
ds = [
    {"ten": "An", "diem": 8.0},
    {"ten": "Binh", "diem": 9.5}
]
for hs in ds:
    print(hs["ten"], "- Diem:", hs["diem"])
```

Kết quả thực tế khi chạy:

```text
Ket qua man hinh:
An - Diem: 8.0
Binh - Diem: 9.5
```

---

## 3. Đoán trước kết quả, rồi chạy thử

Quan sát kỹ đoạn code sau đây:

```python
# Doan ket qua truoc khi chay
ds = [
    {"ten": "Mai", "diem": 7.0},
    {"ten": "Lan", "diem": 8.5}
]
print(ds[1]["diem"])
```

Màn hình sẽ in ra `7.0` hay `8.5`?

<details>
<summary>👉 Bấm vào đây để xem đáp án và giải thích chi tiết</summary>

**Đáp án:** Màn hình in ra `8.5`!

**Giải thích cơ chế truy cập 2 tầng:**
1. Tầng 1: `ds[1]` lấy ra phần tử ở vị trí số `1` của danh sách (toa tàu thứ hai), đó chính là tờ học bạ của bạn Lan: `{"ten": "Lan", "diem": 8.5}`.
2. Tầng 2: `["diem"]` tiếp tục mở tờ học bạ đó ra và lấy đúng giá trị của khóa `"diem"`, tức là `8.5`.

Nếu bạn viết `ds["diem"]`, Python sẽ báo lỗi sập chương trình ngay lập tức vì danh sách ngoài cùng chỉ hiểu các chỉ số số nguyên `0, 1, 2` chứ không hiểu chữ `"diem"`.
</details>

---

## 4. Lỗi thường gặp: Thông báo lỗi nguyên văn và cách sửa

### Lỗi 1: `TypeError: list indices must be integers or slices, not str`
- **Nguyên văn thông báo:**
```text
TypeError: list indices must be integers or slices, not str
```
- **Bản chất lỗi:** Bạn quên mất bên ngoài là một List nên viết nhầm cú pháp `ds["ten"]`. Danh sách chỉ nhận chỉ số số nguyên (`0, 1, 2`), chỉ có từ điển bên trong mới nhận chuỗi khóa (`"ten"`).
- **Cách sửa:** Luôn truy cập qua 2 tầng: `ds[vi_tri]["ten"]` hoặc dùng vòng lặp `for hs in ds: print(hs["ten"])`.

---

### Lỗi 2: `TypeError: '<' not supported between instances of 'dict' and 'dict'` khi sắp xếp
- **Nguyên văn thông báo:**
```text
TypeError: '<' not supported between instances of 'dict' and 'dict'
```
- **Bản chất lỗi:** Bạn gọi trực tiếp lệnh `sorted(ds)` hoặc `ds.sort()`. Python không thể tự biết bạn muốn so sánh học sinh dựa trên Tên hay dựa trên Điểm số!
- **Cách sửa:** Viết một hàm phụ đơn giản để chỉ rõ tiêu chí so sánh (ví dụ so sánh theo điểm):
```python
# Ham phu lay diem lam tieu chi so sanh
def lay_diem(hs):
    return hs["diem"]

ds_sap_xep = sorted(ds, key=lay_diem, reverse=True)
```

---

## 5. Khuôn mẫu cho đề thi: Đoạn code "Copy – Hiểu – Sửa"

Dưới đây là một hệ thống quản lý danh sách học sinh hoàn chỉnh gồm 4 hàm nghiệp vụ cốt lõi:

### File `thuvien.py`:
```python
# thuvien.py - Quan ly danh sach hoc sinh bang List of Dictionaries

def tim_thu_khoa(ds_hs):
    # Tim hoc sinh co diem thi cao nhat
    if len(ds_hs) == 0:
        return None
    thu_khoa = ds_hs[0]
    for hs in ds_hs:
        if hs.get("diem", 0) > thu_khoa.get("diem", 0):
            thu_khoa = hs
    return thu_khoa


def loc_hoc_sinh_gioi(ds_hs, diem_chuan=8.0):
    # Loc ra danh sach hoc sinh co diem >= diem_chuan
    kq = []
    for hs in ds_hs:
        if hs.get("diem", 0) >= diem_chuan:
            kq.append(hs)
    return kq


def tim_hoc_sinh_theo_ten(ds_hs, tu_khoa):
    # Tim tat ca hoc sinh co ten chua tu_khoa (khong phan biet hoa thuong)
    kq = []
    tu_khoa_chuan = tu_khoa.strip().lower()
    for hs in ds_hs:
        ten = hs.get("ten", "").lower()
        if tu_khoa_chuan in ten:
            kq.append(hs)
    return kq


# Ham phu de chi ro tieu chi sap xep theo diem
def lay_diem_hs(hs):
    return hs.get("diem", 0)

![Hình 12.4: Ứng dụng Shopee — Bảng xếp hạng Flash Sale tự động sắp xếp theo giá rẻ nhất](assets/media/python/minh_bit/app_shopee_flash_sale_sort.jpg)

def sap_xep_theo_diem_giam_dan(ds_hs):
    # Sap xep danh sach hoc sinh co diem tu cao xuong thap
    kq = sorted(ds_hs, key=lay_diem_hs, reverse=True)
    return kq
```

### File `main.py`:
```python
# main.py
import thuvien

# Du lieu mau danh sach lop
ds_lop = [
    {"ten": "Nguyen Van An", "diem": 7.5},
    {"ten": "Tran Thi Binh", "diem": 9.2},
    {"ten": "Le Van Cuong", "diem": 8.0},
    {"ten": "Pham Thi Dung", "diem": 6.8}
]

print("=== DANH SACH LOP BAN DAU ===")
for hs in ds_lop:
    print("-", hs["ten"], ":", hs["diem"], "diem")

# 1. Tim thu khoa
tk = thuvien.tim_thu_khoa(ds_lop)
print("\nThu khoa cua lop la:", tk["ten"], "voi", tk["diem"], "diem")

# 2. Loc hoc sinh gioi (>= 8.0)
ds_gioi = thuvien.loc_hoc_sinh_gioi(ds_lop, 8.0)
print("\nDanh sach hoc sinh gioi:")
for hs in ds_gioi:
    print("-", hs["ten"], ":", hs["diem"])

# 3. Sap xep theo thu hang diem so
ds_bxh = thuvien.sap_xep_theo_diem_giam_dan(ds_lop)
print("\nBang xep hang diem tu cao xuong thap:")
for i in range(len(ds_bxh)):
    hs = ds_bxh[i]
    print(i + 1, ".", hs["ten"], "-", hs["diem"], "diem")
```

Kết quả mẫu khi chạy:
```text
=== DANH SACH LOP BAN DAU ===
- Nguyen Van An : 7.5 diem
- Tran Thi Binh : 9.2 diem
- Le Van Cuong : 8.0 diem
- Pham Thi Dung : 6.8 diem

Thu khoa cua lop la: Tran Thi Binh voi 9.2 diem

Danh sach hoc sinh gioi:
- Tran Thi Binh : 9.2
- Le Van Cuong : 8.0

Bang xep hang diem tu cao xuong thap:
1 . Tran Thi Binh - 9.2 diem
2 . Le Van Cuong - 8.0 diem
3 . Nguyen Van An - 7.5 diem
4 . Pham Thi Dung - 6.8 diem
```

---

## 6. Bài tập 3 mức (Làm theo – Sửa lại – Tự viết)

### Mức 1: Làm theo (Gõ lại chính xác để quen tay)

![Hình 12.3: Ứng dụng Shopee — Xe đẩy giỏ hàng siêu thị thông minh chứa từng món hàng kèm giá](assets/media/python/minh_bit/app_shopee_cart_list_dicts.jpg)

**Đề bài:** Cho sẵn danh sách sản phẩm giỏ hàng gồm tên và giá:
```python
ds_sp = [
    {"ten": "But bi", "gia": 5000},
    {"ten": "Vo ghi", "gia": 12000},
    {"ten": "Thuoc ke", "gia": 8000}
]
```
Hãy viết chương trình tính tổng số tiền của tất cả các sản phẩm có trong danh sách và in ra màn hình.

<details>
<summary>👉 Xem đáp án Mức 1</summary>

```python
# Muc 1: Tinh tong gia tien trong danh sach tu dien
ds_sp = [
    {"ten": "But bi", "gia": 5000},
    {"ten": "Vo ghi", "gia": 12000},
    {"ten": "Thuoc ke", "gia": 8000}
]

tong_tien = 0
for sp in ds_sp:
    tong_tien = tong_tien + sp["gia"]

print("Tong gia tien tat ca san pham la:", tong_tien, "VND")
```

Kết quả mẫu:
```text
Tong gia tien tat ca san pham la: 25000 VND
```
</details>

---

### Mức 2: Sửa lại (Tìm và vá lỗi đoạn code hỏng)
**Đề bài:** Một bạn học sinh viết hàm thêm một học sinh mới vào danh sách lớp, nhưng khi người dùng nhập điểm bằng chuỗi ký tự (như `"8.5"`) thì chương trình lưu sai kiểu dữ liệu dẫn đến các phép tính toán phía sau bị lỗi. Hãy sửa lại cho đúng:

```python
# Doan code loi:
def them_hoc_sinh(ds_hs, ten, diem_nhap):
    hs_moi = {"ten": ten, "diem": diem_nhap}
    ds_hs.append(hs_moi)
    return ds_hs
```

<details>
<summary>👉 Xem đáp án Mức 2</summary>

**Nguyên nhân sai:**
Tham số `diem_nhap` nhận từ bàn phím là một chuỗi (`str`). Nếu không ép kiểu sang số thực `float()`, sau này khi so sánh hoặc tính trung bình cộng sẽ bị văng lỗi `TypeError`.

**Đoạn code sửa đúng:**
```python
# Doan code sua dung co phong thu try-except:
def them_hoc_sinh(ds_hs, ten, diem_nhap):
    try:
        diem_so = float(diem_nhap)
    except ValueError:
        print("Loi: Diem khong hop le, dat mac dinh la 0.0")
        diem_so = 0.0
        
    hs_moi = {
        "ten": ten.strip(),
        "diem": diem_so
    }
    ds_hs.append(hs_moi)
    return ds_hs

ds = []
them_hoc_sinh(ds, "Hoang Bach", "9.5")
print("Danh sach sau khi them:", ds)
```

Kết quả mẫu:
```text
Danh sach sau khi them: [{'ten': 'Hoang Bach', 'diem': 9.5}]
```
</details>

---

### Mức 3: Tự viết (Thử thách sát đề thi)
**Đề bài:** Viết hàm `tinh_diem_trung_binh_lop(ds_hs)` nhận vào danh sách học sinh.
- Hàm tính và trả về điểm trung bình của cả lớp. Nếu danh sách rỗng, trả về 0.0.
- Đếm xem trong lớp có bao nhiêu bạn có điểm **cao hơn hoặc bằng** điểm trung bình của cả lớp.
- Viết chương trình chính kiểm tra hàm trên.

<details>
<summary>👉 Xem đáp án Mức 3</summary>

```python
# Muc 3: Thong ke diem trung binh va so luong tren trung binh
def thong_ke_diem_lop(ds_hs):
    if len(ds_hs) == 0:
        return 0.0, 0
        
    tong_diem = 0
    for hs in ds_hs:
        tong_diem = tong_diem + hs.get("diem", 0)
        
    diem_tb = tong_diem / len(ds_hs)
    
    # Dem so hoc sinh dat diem >= diem trung binh
    dem_tren_tb = 0
    for hs in ds_hs:
        if hs.get("diem", 0) >= diem_tb:
            dem_tren_tb = dem_tren_tb + 1
            
    return diem_tb, dem_tren_tb

# Chuong trinh chinh:
ds_lop = [
    {"ten": "An", "diem": 6.0},
    {"ten": "Binh", "diem": 8.0},
    {"ten": "Cuong", "diem": 9.0},
    {"ten": "Dung", "diem": 5.0}
]

tb, so_luong = thong_ke_diem_lop(ds_lop)
print("Diem trung binh ca lop:", tb)
print("So hoc sinh dat tu trung binh tro len:", so_luong)
```

Kết quả mẫu:
```text
Diem trung binh ca lop: 7.0
So hoc sinh dat tu trung binh tro len: 2
```
*(Điểm trung bình là 7.0, có 2 bạn Binh (8.0) và Cuong (9.0) đạt trên trung bình)*
</details>

---

## 7. Tóm tắt 5 dòng và 3 câu tự kiểm tra

### 5 dòng cốt lõi cần nhớ:
1. **Cấu trúc thực tế:** List chứa các Dictionary là mô hình chuẩn mực để quản lý danh sách hồ sơ học sinh, hàng hóa.
2. **Truy cập 2 tầng:** Tầng 1 lấy đối tượng qua chỉ số `ds[i]`, tầng 2 lấy trường thông tin qua khóa `["ten"]`.
3. **Phòng thủ dữ liệu thiếu:** Luôn dùng `hs.get("diem", 0)` thay vì `hs["diem"]` để không bị sập chương trình nếu hồ sơ thiếu thông tin.
4. **Sắp xếp không cần lambda:** Viết một hàm phụ nhỏ `def lay_diem(hs): return hs["diem"]` rồi truyền vào `key=lay_diem`.
5. **Duyệt qua từng hồ sơ:** Dùng vòng lặp `for hs in ds_hs:` để xử lý từng bạn học sinh một cách tự nhiên.

### 3 câu tự kiểm tra trước khi sang Bài 13:
1. Vì sao câu lệnh `ds["ten"]` lại bị báo lỗi `TypeError` khi `ds` là một List chứa các Dictionary?
2. Trong hàm `sorted(ds_hs, key=lay_diem_hs)`, tham số `key` có vai trò gì?
3. Khi duyệt tìm thủ khoa, ta nên khởi tạo biến `thu_khoa` ban đầu bằng giá trị nào?
