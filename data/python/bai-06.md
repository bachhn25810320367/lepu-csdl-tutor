# Bài 6: Danh sách (List) Phần 2: Thống kê, Tìm kiếm và Lọc phần tử

## 1. Câu chuyện đời sống: Rổ cam của người đi chợ

Hãy tưởng tượng **Minh** và chú robot **Bit** đang phân loại và thống kê một rổ cam với nhiều kích thước khác nhau (đây là danh sách `ds`):

1. **Tính tổng và trung bình:** Bạn đem cả rổ lên cân để biết tổng cân nặng (`tong`), rồi chia cho số quả trong rổ (`len(ds)`) để biết cân nặng trung bình. Nhưng hãy cẩn thận: nếu rổ không có quả cam nào (rổ rỗng), việc lấy cân nặng chia cho 0 quả sẽ làm hỏng cân (lỗi `ZeroDivisionError`)!
2. **Tìm quả to nhất và vị trí:** Bạn duyệt mắt từ quả đầu tiên đến quả cuối cùng. Quả to nhất nằm ở đâu? Nếu có 2 quả to nhất bằng nhau, đề thi hỏi **vị trí đầu tiên** hay **vị trí cuối cùng**? Bạn phải nhớ kỹ vị trí của nó trên kệ.
3. **Lọc cam (Không làm dập nát rổ gốc):** Bạn lấy một chiếc rổ mới toanh (`kq = []`), chỉ nhặt những quả cam chín vàng bỏ vào rổ mới. Chiếc rổ ban đầu vẫn giữ nguyên vẹn không suy suyển.

![Hình 6.1: Robot Bit nhặt cam chín sang chiếc rổ mới (kq = []) mà không làm dập nát rổ cam ban đầu](assets/media/python/minh_bit/bai06_fruit_basket_sort.jpg)

---

## 2. Ví dụ nhỏ nhất (3–5 dòng code)

Dưới đây là đoạn code tính tổng và trung bình cộng của một danh sách (an toàn trước list rỗng):

```python
# Tinh tong va trung binh cong an toan
ds = [10, 20, 30, 40]
tong = sum(ds)
tbc = tong / len(ds) if len(ds) > 0 else 0
print("Tong:", tong, "- TBC:", tbc)
```

Kết quả thực tế khi chạy:

```text
Ket qua man hinh:
Tong: 100 - TBC: 25.0
```

---

## 3. Đoán trước kết quả, rồi chạy thử

Quan sát kỹ đoạn code sau đây:

```python
# Doan ket qua truoc khi chay
ds = [15, 8, 20, 9, 20]
# Tim vi tri phan tu lon nhat
max_val = max(ds)
vi_tri = ds.index(max_val)
print("Gia tri lon nhat la:", max_val)
print("Vi tri tim thay:", vi_tri)
```

Giá trị `20` xuất hiện ở cả vị trí `2` và vị trí `4`. Hàm `ds.index(max_val)` sẽ trả về số `2` hay số `4`?

<details>
<summary>👉 Bấm vào đây để xem đáp án và giải thích chi tiết</summary>

**Đáp án:** Màn hình sẽ in ra:
```text
Gia tri lon nhat la: 20
Vi tri tim thay: 2
```

**Giải thích vì sao:**
Hàm có sẵn `ds.index(x)` của Python **luôn luôn chỉ trả về vị trí xuất hiện ĐẦU TIÊN** của phần tử `x` tính từ đầu danh sách.

**Bẫy đề thi cực lớn:** Trong Đề 1 ý 7 có câu hỏi: *"Tìm phần tử lớn nhất và vị trí của phần tử lớn nhất CUỐI CÙNG"*. 
Nếu bạn chỉ dùng `ds.index(max(ds))` thì bạn sẽ bị trừ trọn điểm câu đó vì nó chỉ ra vị trí đầu tiên! Để tìm vị trí cuối cùng, ta phải duyệt vòng lặp hoặc duyệt từ cuối danh sách lên.
</details>

---

## 4. Lỗi thường gặp: Thông báo lỗi nguyên văn và cách sửa

### Lỗi 1: `ZeroDivisionError: division by zero` khi tính trung bình cộng
- **Nguyên văn thông báo:**
```text
ZeroDivisionError: division by zero
```
- **Bản chất lỗi:** Người dùng nhập danh sách rỗng `ds = []`, lúc này `len(ds) == 0`. Lấy `tong / len(ds)` sẽ sập chương trình.
- **Cách sửa:** Luôn kiểm tra `if len(ds) == 0:` trước khi chia:
```python
if len(ds) == 0:
    return 0, 0 # Tra ve tong va tbc la 0
```

---

### Lỗi 2: `ValueError: max() arg is an empty sequence`
- **Nguyên văn thông báo:**
```text
ValueError: max() arg is an empty sequence
```
- **Bản chất lỗi:** Gọi hàm `max([])` hoặc `min([])` trên một danh sách không có phần tử nào.
- **Cách sửa:** Kiểm tra `if len(ds) == 0: return None` trước khi gọi `max()` hoặc `min()`.

---

### Lỗi 3: Trả về vị trí không tồn tại gây hiểu nhầm
- **Bản chất:** Đề yêu cầu: *"Tìm vị trí phần tử âm đầu tiên"*. Nếu trong danh sách toàn số dương thì trả về gì?
- **Cách xử lý chuẩn phòng thi:** Nếu không tìm thấy, ta quy ước trả về `-1` và thông báo `"Khong tim thay"`.

---

## 5. Khuôn mẫu cho đề thi: Đoạn code "Copy – Hiểu – Sửa"

Dưới đây là bộ các hàm thống kê và tìm kiếm cốt lõi của **Đề 1 (các ý 2, 3, 5, 6, 7, 11, 13)** được viết chuẩn hóa thành thư viện:

### File `thuvien.py`:
```python
# thuvien.py - Cac ham thong ke, tim kiem va loc tren List

def tinh_tong_va_tbc(ds):
    # Y 2 - De 1: Tinh tong va trung binh cong
    if len(ds) == 0:
        return 0, 0.0
    tong = 0
    for x in ds:
        tong = tong + x
    tbc = tong / len(ds)
    return tong, tbc


def tim_vi_tri_am_dau_va_cuoi(ds):
    # Y 3 - De 1: Tim vi tri am dau tien va cuoi cung
    vi_tri_dau = -1
    vi_tri_cuoi = -1
    for i in range(len(ds)):
        if ds[i] < 0:
            if vi_tri_dau == -1:
                vi_tri_dau = i
            vi_tri_cuoi = i
    return vi_tri_dau, vi_tri_cuoi


def tim_max_va_vi_tri_cuoi(ds):
    # Y 7 - De 1: Tim phan tu lon nhat va vi tri cuoi cung cua no
    if len(ds) == 0:
        return None, -1
    max_val = ds[0]
    vi_tri_cuoi = 0
    for i in range(len(ds)):
        if ds[i] >= max_val: # Dung dau >= de cap nhat vi tri moi nhat ve sau
            max_val = ds[i]
            vi_tri_cuoi = i
    return max_val, vi_tri_cuoi


def loc_cac_so_chan(ds):
    # Y 5 - De 1: Dua ra danh sach cac so chan (khong sua list goc)
    kq = []
    for x in ds:
        if x % 2 == 0:
            kq.append(x)
    return kq


def loc_so_chinh_phuong(ds):
    # Y 11, 13 - De 1: Dua ra va dem cac so chinh phuong
    # So chinh phuong la so >= 0 co can bac 2 la so nguyen
    kq = []
    for x in ds:
        if x >= 0:
            can = int(x ** 0.5)
            if can * can == x:
                kq.append(x)
    return kq
```

### File `main.py`:
```python
# main.py - Chuong trinh chinh
import thuvien

ds = [12, -5, 8, -3, 25, 16, 25]
print("Danh sach goc:", ds)

# 1. Tong va TBC
tong, tbc = thuvien.tinh_tong_va_tbc(ds)
print("Tong:", tong, "- TBC:", tbc)

# 2. Vi tri am dau va cuoi
dau, cuoi = thuvien.tim_vi_tri_am_dau_va_cuoi(ds)
print("Vi tri am dau tien:", dau, "- Vi tri am cuoi cung:", cuoi)

# 3. Max va vi tri cuoi cung
max_val, vt_max = thuvien.tim_max_va_vi_tri_cuoi(ds)
print("Gia tri lon nhat:", max_val, "o vi tri cuoi cung la:", vt_max)

# 4. So chinh phuong
cp = thuvien.loc_so_chinh_phuong(ds)
print("Cac so chinh phuong:", cp, "- So luong:", len(cp))
```

Kết quả mẫu khi chạy:
```text
Danh sach goc: [12, -5, 8, -3, 25, 16, 25]
Tong: 78 - TBC: 11.142857142857142
Vi tri am dau tien: 1 - Vi tri am cuoi cung: 3
Gia tri lon nhat: 25 o vi tri cuoi cung la: 6
Cac so chinh phuong: [25, 16, 25] - So luong: 3
```

---

## 6. Bài tập 3 mức (Làm theo – Sửa lại – Tự viết)

### Mức 1: Làm theo (Gõ lại chính xác để quen tay)
**Đề bài:** Viết hàm `dem_so_duong(ds)` nhận vào một danh sách số nguyên, đếm xem có bao nhiêu số lớn hơn 0 và trả về kết quả bằng `return`. Viết chương trình chính thử nghiệm với `ds = [-2, 5, 0, 7, -9, 11]`.

<details>
<summary>👉 Xem đáp án Mức 1</summary>

```python
# Muc 1: Dem so luong phan tu duong
def dem_so_duong(ds):
    dem = 0
    for x in ds:
        if x > 0:
            dem = dem + 1
    return dem

# Chuong trinh chinh:
ds = [-2, 5, 0, 7, -9, 11]
so_luong = dem_so_duong(ds)
print("So luong so duong la:", so_luong)
```

Kết quả mẫu:
```text
So luong so duong la: 3
```
</details>

---

### Mức 2: Sửa lại (Tìm và vá lỗi đoạn code hỏng)
**Đề bài:** Một bạn học sinh viết hàm tìm phần tử nhỏ nhất và vị trí của nó như sau, nhưng khi chạy với danh sách toàn số âm như `ds = [-10, -5, -20]` thì chương trình lại in ra `Gia tri nho nhat la: 0`. Hãy sửa lại cho đúng:

```python
# Doan code loi cua hoc sinh:
def tim_min(ds):
    min_val = 0
    vt = 0
    for i in range(len(ds)):
        if ds[i] < min_val:
            min_val = ds[i]
            vt = i
    return min_val, vt
```

<details>
<summary>👉 Xem đáp án Mức 2</summary>

**Nguyên nhân sai:**
Học sinh gán giá trị khởi tạo `min_val = 0`. Nếu danh sách toàn các số dương (ví dụ `[10, 20, 30]`), không có số nào nhỏ hơn 0 nên kết quả trả về sai là 0. Ngược lại, nếu so sánh với số âm nhưng danh sách toàn số lớn hơn 0 thì cũng sai.

**Quy tắc bất di bất dịch khi tìm Min/Max:** 
Luôn khởi tạo `min_val` bằng **chính phần tử đầu tiên của danh sách** (`min_val = ds[0]`):

```python
# Doan code da sua dung:
def tim_min(ds):
    if len(ds) == 0:
        return None, -1
    min_val = ds[0]
    vt = 0
    for i in range(len(ds)):
        if ds[i] < min_val:
            min_val = ds[i]
            vt = i
    return min_val, vt

ds = [-10, -5, -20]
gt, vi_tri = tim_min(ds)
print("Gia tri nho nhat:", gt, "o vi tri:", vi_tri)
```

Kết quả mẫu:
```text
Gia tri nho nhat: -20 o vi tri: 2
```
</details>

---

### Mức 3: Tự viết (Ý khó của Đề 1: Chuỗi số dương liên tiếp nhiều nhất)
**Đề bài:** Viết hàm `dem_so_duong_lien_tiep_max(ds)` trả về số lượng các số dương liên tiếp nhiều nhất trong danh sách. 
*(Ví dụ: Với `ds = [1, 2, -3, 4, 5, 6, -1, 7]`, dãy `[1, 2]` dài 2, dãy `[4, 5, 6]` dài 3, dãy `[7]` dài 1 -> Kết quả trả về là `3`).*

<details>
<summary>👉 Xem đáp án Mức 3</summary>

```python
# Muc 3: Thuat toan dem chuoi phan tu duong lien tiep dai nhat
def dem_so_duong_lien_tiep_max(ds):
    if len(ds) == 0:
        return 0
    dem_hien_tai = 0
    dem_max = 0
    
    for x in ds:
        if x > 0:
            dem_hien_tai = dem_hien_tai + 1
            if dem_hien_tai > dem_max:
                dem_max = dem_hien_tai
        else:
            # Gap so khong duong thi reset bo dem ve 0
            dem_hien_tai = 0
            
    return dem_max

# Chuong trinh chinh:
ds = [1, 2, -3, 4, 5, 6, -1, 7]
kq = dem_so_duong_lien_tiep_max(ds)
print("So luong so duong lien tiep nhieu nhat la:", kq)
```

Kết quả mẫu:
```text
So luong so duong lien tiep nhieu nhat la: 3
```
</details>

---

## 7. Tóm tắt 5 dòng và 3 câu tự kiểm tra

### 5 dòng cốt lõi cần nhớ:
1. **Khởi tạo Min/Max:** Luôn gán `min_val = ds[0]` và `max_val = ds[0]`, không được gán bằng số 0 tùy tiện.
2. **Vị trí cuối cùng:** Dùng dấu `>=` khi duyệt để cập nhật vị trí mới nhất, thay vì dùng `ds.index()` vốn chỉ lấy vị trí đầu tiên.
3. **Phòng thủ chia cho 0:** Luôn kiểm tra `len(ds) == 0` trước khi tính trung bình cộng.
4. **Lọc không sửa gốc:** Tạo danh sách mới `kq = []` rồi dùng `kq.append(x)` để giữ nguyên danh sách ban đầu.
5. **Số chính phương:** Kiểm tra bằng `x >= 0` và `int(x**0.5)**2 == x`.

### 3 câu tự kiểm tra trước khi sang Bài 7:
1. Nếu `ds = [5, 5, 5]`, thuật ngữ "vị trí đầu tiên" và "vị trí cuối cùng" của phần tử lớn nhất mang giá trị lần lượt là mấy?
2. Tại sao câu lệnh `tbc = sum(ds) / len(ds)` có thể làm dừng chương trình đột ngột?
3. Khi duyệt đếm chuỗi liên tiếp thỏa mãn điều kiện, khi nào ta phải đặt lại biến `dem_hien_tai = 0`?
