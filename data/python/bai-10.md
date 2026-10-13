# Bài 10: Bộ giá trị cố định (Tuple) và Kỹ thuật mở gói dữ liệu

## 1. Câu chuyện đời sống: Tấm thẻ Căn cước công dân và Hộp quà mở nắp

Ở các bài trước, ta đã làm việc rất nhiều với Danh sách (`list`). Hãy cùng so sánh nó với một người anh em sinh đôi mang tên **Tuple**:

![](assets/media/python/minh_bit/bai10_keychain_tuple.jpg)

1. **Danh sách (`list`) - Chiếc ba lô đi học:**
   Bạn có thể mở khóa ba lô để nhét thêm sách (`append`), vứt bớt bút cũ đi (`remove`), hoặc thay cuốn vở rách bằng cuốn vở mới (`ds[0] = ...`).
2. **Tuple - Tấm thẻ Căn cước công dân (CCCD) ép plastic cứng:**
   Khi in ra thẻ CCCD, các thông tin: `(Ho_ten, Ngay_sinh, So_dinh_danh)` được ép kín trong một lớp nhựa cứng trong suốt.
   - Bạn có thể **đọc** thông tin trên thẻ bất cứ lúc nào.
   - Nhưng bạn **tuyệt đối KHÔNG ĐƯỢC CẠY lớp nhựa ra để sửa số hay thêm chữ**. Dữ liệu một khi đã tạo ra trong Tuple là **bất biến (không thể sửa đổi)**.
3. **Mở gói dữ liệu (Unpacking):**
   Bạn nhận được một gói quà bên trong chứa sẵn 2 món đồ: một chiếc đồng hồ và một chiếc bút. Khi bạn bóc quà: `dong_ho, but = hop_qua`, hai món đồ lập tức được chia đều vào hai tay của bạn một cách gọn gàng!

---

## 2. Ví dụ nhỏ nhất (3–5 dòng code)

Kỹ thuật hoán đổi vị trí của 2 biến mà không cần dùng đến biến trung gian:

```python
# Hoan vi hai bien bang tuple
a = 5
b = 10
a, b = b, a # Trao doi gia tri cua a va b

![](assets/media/python/minh_bit/game_teleport_swap_tuple.jpg)
print("a =", a, "- b =", b)
```

Kết quả thực tế khi chạy:

```text
Ket qua man hinh:
a = 10 - b = 5
```

---

## 3. Đoán trước kết quả, rồi chạy thử

Quan sát kỹ hai dòng code dưới đây:

```python
# Doan ket qua truoc khi chay
x = (10)
y = (10,)
print(type(x))
print(type(y))
```

Kiểu dữ liệu của biến `x` và biến `y` có giống nhau không?

<details>
<summary>👉 Bấm vào đây để xem đáp án và giải thích chi tiết</summary>

**Đáp án:** Hoàn toàn **khác nhau**!
```text
<class 'int'>
<class 'tuple'>
```

**Giải thích vì sao:**
- `x = (10)`: Dấu ngoặc tròn `()` ở đây chỉ được Python coi là dấu ngoặc trong biểu thức toán học thông thường (như trong phép tính `(2 + 3) * 2`). Do đó `x` đơn thuần chỉ là một **số nguyên (`int`)**!
- `y = (10,)`: Nhờ có **dấu phẩy `,`**, Python mới nhận diện đây là một **Tuple chứa 1 phần tử**.

**Ghi nhớ:** Dấu phẩy `,` mới chính là thứ tạo nên một Tuple, không phải dấu ngoặc tròn!
</details>

---

## 4. Lỗi thường gặp: Thông báo lỗi nguyên văn và cách sửa

### Lỗi 1: `TypeError: 'tuple' object does not support item assignment`
- **Nguyên văn thông báo:**
```text
TypeError: 'tuple' object does not support item assignment
```
- **Bản chất lỗi:** Cố tình thay đổi giá trị của một phần tử trong Tuple (ví dụ: `t = (1, 2, 3); t[0] = 99`).
- **Cách sửa:** Nếu dữ liệu cần thường xuyên thêm, bớt hoặc sửa đổi, hãy dùng List (`ds = [1, 2, 3]`). Nếu bắt buộc phải sửa một Tuple, bạn phải đổi nó sang List bằng `list(t)`, sửa xong rồi đổi ngược lại bằng `tuple(ds)`.

---

### Lỗi 2: `ValueError: too many values to unpack (expected 2, got 3)`
- **Nguyên văn thông báo:**
```text
ValueError: too many values to unpack (expected 2, got 3)
```
- **Bản chất lỗi:** Một hàm trả về 3 giá trị `return a, b, c` nhưng ở chương trình chính bạn chỉ chuẩn bị 2 biến để hứng `x, y = ham()`.
- **Cách sửa:** Đếm chính xác số lượng giá trị được trả về để chuẩn bị đủ số lượng biến hứng tương ứng:
```python
x, y, z = ham()
```

---

## 5. Khuôn mẫu cho đề thi: Đoạn code "Copy – Hiểu – Sửa"

Ứng dụng lớn nhất của Tuple trong các bài thi Python chính là: **Hàm trả về nhiều kết quả cùng một lúc**. 

Khi bạn viết `return a, b, c`, Python thực chất đang đóng gói 3 giá trị đó vào một Tuple và gửi về cho chương trình chính.

### File `thuvien.py`:
```python
# thuvien.py - Ham tra ve nhieu ket qua thong ke

def thong_ke_day_so(ds):
    # Tra ve: tong, tbc, gia_tri_nho_nhat, gia_tri_lon_nhat
    if len(ds) == 0:
        return 0, 0.0, None, None
        
    tong = sum(ds)
    tbc = tong / len(ds)
    min_val = min(ds)
    max_val = max(ds)
    
    # Tra ve mot bo tuple 4 gia tri
    return tong, tbc, min_val, max_val


def hoan_vi_hai_vi_tri(ds_goc, i, j):
    # Trao doi vi tri hai phan tu trong list
    ds = list(ds_goc)
    if 0 <= i < len(ds) and 0 <= j < len(ds):
        ds[i], ds[j] = ds[j], ds[i] # Su dung ky thuat tuple de hoan vi
    return ds
```

### File `main.py`:
```python
# main.py
import thuvien

ds = [10, 25, 4, 18, 33]
print("Danh sach ban dau:", ds)

# 1. Mo goi 4 ket qua tu ham thong ke
tong, tbc, nho_nhat, lon_nhat = thuvien.thong_ke_day_so(ds)
print("Tong:", tong)
print("Trung binh cong:", tbc)
print("Nho nhat:", nho_nhat)
print("Lon nhat:", lon_nhat)

# 2. Hoan vi phan tu o vi tri 0 va vi tri 2
ds_moi = thuvien.hoan_vi_hai_vi_tri(ds, 0, 2)
print("Sau khi hoan vi vi tri 0 va 2:", ds_moi)
```

Kết quả mẫu khi chạy:
```text
Danh sach ban dau: [10, 25, 4, 18, 33]
Tong: 90
Trung binh cong: 18.0
Nho nhat: 4
Lon nhat: 33
Sau khi hoan vi vi tri 0 va 2: [4, 25, 10, 18, 33]
```

---

## 6. Bài tập 3 mức (Làm theo – Sửa lại – Tự viết)

### Mức 1: Làm theo (Gõ lại chính xác để quen tay)
**Đề bài:** Viết hàm `chia_co_du(a, b)` nhận vào 2 số nguyên `a` và `b`. Hàm trả về một bộ gồm 2 giá trị: thương nguyên (`a // b`) và phần dư (`a % b`). Nếu `b == 0`, trả về `(None, None)`. Viết chương trình chính gọi hàm với `a = 17, b = 5`.

<details>
<summary>👉 Xem đáp án Mức 1</summary>

```python
# Muc 1: Ham tra ve thuong va so du bang Tuple
def chia_co_du(a, b):
    if b == 0:
        return None, None
    thuong = a // b
    so_du = a % b
    return thuong, so_du

# Chuong trinh chinh:
a = 17
b = 5
thuong, du = chia_co_du(a, b)
print("Thuong nguyen la:", thuong)
print("Phan du la:", du)
```

Kết quả mẫu:
```text
Thuong nguyen la: 3
Phan du la: 2
```
</details>

---

### Mức 2: Sửa lại (Tìm và vá lỗi đoạn code hỏng)
**Đề bài:** Một bạn học sinh muốn cập nhật điểm thi cho học sinh trong tuple `thong_tin = ("Nguyen Van A", 7.5)` thành `8.5` nhưng bị báo lỗi `TypeError`. Hãy sửa lại đoạn code sao cho in ra được thông tin mới đúng:

```python
# Doan code loi:
thong_tin = ("Nguyen Van A", 7.5)
thong_tin[1] = 8.5
print(thong_tin)
```

<details>
<summary>👉 Xem đáp án Mức 2</summary>

**Nguyên nhân sai:**
Tuple không cho phép thay đổi giá trị trực tiếp bằng chỉ số `[1]`.

**Cách sửa:**
Chuyển sang List để cập nhật hoặc tạo một Tuple mới kết hợp thông tin cũ và điểm mới:
```python
# Doan code sua dung:
thong_tin = ("Nguyen Van A", 7.5)
ten, diem_cu = thong_tin # Mo goi tuple
diem_moi = 8.5
thong_tin_moi = (ten, diem_moi) # Dong goi thanh tuple moi
print("Thong tin sau khi sua:", thong_tin_moi)
```

Kết quả mẫu:
```text
Thong tin sau khi sua: ('Nguyen Van A', 8.5)
```
</details>

---

### Mức 3: Tự viết (Thuật toán Sắp xếp nổi bọt - Bubble Sort dùng hoán vị Tuple)

![](assets/media/python/minh_bit/algo_bubble_sort.jpg)
**Đề bài:** Viết hàm `sap_xep_noi_bot(ds_goc)` sắp xếp danh sách các số nguyên theo thứ tự tăng dần bằng thuật toán nổi bọt (so sánh 2 phần tử liền kề, nếu phần tử trước lớn hơn phần tử sau thì hoán vị bằng cú pháp `ds[j], ds[j+1] = ds[j+1], ds[j]`). Không dùng `sort()` hay `sorted()`.

<details>
<summary>👉 Xem đáp án Mức 3</summary>

```python
# Muc 3: Sap xep noi bot bang hoan vi Tuple
def sap_xep_noi_bot(ds_goc):
    ds = list(ds_goc)
    n = len(ds)
    for i in range(n):
        for j in range(0, n - i - 1):
            if ds[j] > ds[j + 1]:
                # Hoan vi hai phan tu lien ke bang tuple
                ds[j], ds[j + 1] = ds[j + 1], ds[j]
    return ds

# Chuong trinh chinh:
ds = [64, 34, 25, 12, 22, 11, 90]
kq = sap_xep_noi_bot(ds)
print("Danh sach goc:", ds)
print("Danh sach sau khi sap xep noi bot:", kq)
```

Kết quả mẫu:
```text
Danh sach goc: [64, 34, 25, 12, 22, 11, 90]
Danh sach sau khi sap xep noi bot: [11, 12, 22, 25, 34, 64, 90]
```
</details>

---

## 7. Tóm tắt 5 dòng và 3 câu tự kiểm tra

### 5 dòng cốt lõi cần nhớ:
1. **Tuple bất biến:** Được định nghĩa bằng dấu ngoặc đơn hoặc dấu phẩy, không thể thêm, bớt hoặc sửa phần tử.
2. **Ký hiệu 1 phần tử:** Bắt buộc phải có dấu phẩy: `t = (5,)` mới là Tuple; viết `t = (5)` là số nguyên.
3. **Mở gói (Unpacking):** Dùng `x, y = (10, 20)` để trích xuất nhanh các giá trị ra biến độc lập.
4. **Hoán vị thần tốc:** Đổi chỗ hai biến trong 1 dòng lệnh mà không cần biến phụ: `a, b = b, a`.
5. **Hàm trả về nhiều giá trị:** Khi viết `return x, y`, thực chất hàm đang trả về một Tuple gồm `(x, y)`.

### 3 câu tự kiểm tra trước khi sang Bài 11:
1. Tại sao nói Tuple an toàn hơn List khi lưu trữ các hằng số hoặc cấu hình hệ thống?
2. Câu lệnh `a, b = (1, 2, 3)` sẽ phát sinh thông báo lỗi gì khi chạy?
3. Cú pháp `ds[i], ds[j] = ds[j], ds[i]` hoạt động dựa trên cơ chế nào của Python?
