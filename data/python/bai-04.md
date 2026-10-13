# Bài 4: Hàm (def), Thư viện (module) và Cấu trúc chương trình chính

## 1. Câu chuyện đời sống: Chiếc máy xay sinh tố và Hộp đồ nghề

Hãy tưởng tượng trong phòng thực hành của **Minh** và **Bit** có một chiếc **máy xay sinh tố** ma thuật:

1. **Tham số đầu vào (Arguments):** Bạn mở nắp, bỏ vào 2 quả cam và một ít đá (đây là dữ liệu bạn đưa vào cho máy xử lý).
2. **Thân hàm (Logic xử lý):** Bạn nhấn nút, dao xay quay tròn nhuyễn mịn bên trong thân máy.
3. **Giá trị trả về (`return`):** Máy xay xong rót ra cho bạn một ly nước cam thơm ngon trao tận tay bạn.
   - Bạn có thể cầm ly nước cam đó uống ngay.
   - Bạn có thể cất nó vào tủ lạnh.
   - Hoặc bạn có thể đổ nó vào một nồi thạch rau câu để nấu món mới (dùng kết quả này để tính toán việc khác).

![Hình 4.1: Máy xay sinh tố — Nhận tham số nguyên liệu đầu vào và thân hàm bắt đầu xay nhuyễn](assets/media/python/minh_bit/bai04_blender.jpg)

![Hình 4.2: So sánh cốt lõi — Return trao sản phẩm tận tay vs Print chỉ giơ lên ngắm rồi cất đi](assets/media/python/minh_bit/trap_return_vs_print.jpg)

![Hình 4.3: Bit rót ly nước sinh tố bàn giao tận tay Minh (return) để Minh sử dụng cho các việc tiếp theo](assets/media/python/minh_bit/bai04_bit_handing_glass.jpg)

### Phân biệt sống còn giữa `return` và `print`:
Rất nhiều học sinh trượt thực hành chỉ vì nhầm lẫn giữa hai lệnh này:
- **Lệnh `return`:** Giống như người thợ làm xong đồ vật và **bàn giao sản phẩm vào tay bạn**. Chương trình chính nhận được sản phẩm để lưu vào biến, cộng trừ nhân chia tiếp.
- **Lệnh `print()`:** Giống như người thợ làm xong đồ vật thì chỉ **giơ lên trước mặt bạn cho bạn ngắm 1 giây rồi cất đi**. Tay bạn không cầm được đồ vật đó, và máy tính cũng không thể lấy kết quả đó để làm bất kỳ phép toán nào tiếp theo!

### Ẩn dụ về Thư viện (Module) và Chương trình chính:
- **File thư viện (`thuvien.py`):** Giống như một **chiếc hộp đồ nghề**. Trong hộp chứa sẵn kìm, cờ-lê, tua-vít (chính là các hàm `def`). Hộp đồ nghề này chỉ nằm yên chờ đợi, không tự động làm việc khi chưa có ai gọi.
- **Chương trình chính (`main.py`):** Giống như **bàn làm việc của người thợ**. Khi cần kìm hay cờ-lê, người thợ mở hộp lấy ra dùng (`import thuvien`).

---

## 2. Ví dụ nhỏ nhất (3–5 dòng code)

Dưới đây là một hàm nhỏ nhận vào một số và trả về bình phương của nó:

```python
# Dinh nghia ham tinh binh phuong
def tinh_binh_phuong(so):
    kq = so ** 2
    return kq

# Chuong trinh chinh goi ham va in ket qua
print(tinh_binh_phuong(6))
```

Kết quả thực tế khi chạy chương trình:

```text
Ket qua man hinh:
36
```

---

## 3. Đoán trước kết quả, rồi chạy thử

Quan sát kỹ đoạn code dưới đây và suy đoán kết quả:

```python
# Doan ket qua truoc khi chay
def cong_muoi(so):
    print(so + 10)

kq = cong_muoi(5)
print("Gia tri cua kq la:", kq)
```

Màn hình sẽ in ra `Gia tri cua kq la: 15` hay in ra `Gia tri cua kq la: None`?

<details>
<summary>👉 Bấm vào đây để xem đáp án và giải thích chi tiết</summary>

**Đáp án:** Màn hình sẽ in ra 2 dòng sau:
```text
15
Gia tri cua kq la: None
```

**Giải thích vì sao xuất hiện chữ `None`:**
- Khi bạn gọi `cong_muoi(5)`, bên trong hàm chạy lệnh `print(so + 10)` nên số `15` được in ra màn hình trước tiên.
- Tuy nhiên, trong thân hàm **hoàn toàn không có câu lệnh `return`**!
- Trong Python, nếu một hàm kết thúc mà không gặp lệnh `return`, hàm đó sẽ tự động trả về giá trị rỗng đặc biệt mang tên là `None`.
- Do đó, biến `kq` nhận giá trị `None`. Khi bạn in `print("Gia tri cua kq la:", kq)`, chữ `None` xuất hiện. Nếu bạn cố tình lấy `kq + 5`, chương trình sẽ lập tức sập vì lỗi `TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'`.
</details>

---

## 4. Lỗi thường gặp: Thông báo lỗi nguyên văn và cách sửa

### Lỗi 1: `TypeError: tinh_tong() missing 1 required positional argument`
- **Nguyên văn thông báo:**
```text
TypeError: tinh_tong() missing 1 required positional argument: 'b'
```
- **Bản chất lỗi:** Hàm khai báo cần 2 nguyên liệu đầu vào `def tinh_tong(a, b):`, nhưng khi gọi ở chương trình chính bạn lại chỉ truyền vào 1 số `tinh_tong(5)`.
- **Cách sửa:** Kiểm tra lại định nghĩa hàm và truyền đủ số lượng tham số:
```python
# Sai:
kq = tinh_tong(5)

# Dung:
kq = tinh_tong(5, 10)
```

---

### Lỗi 2: `UnboundLocalError: cannot access local variable where it is not associated with a value`
- **Nguyên văn thông báo:**
```text
UnboundLocalError: cannot access local variable 'so' where it is not associated with a value
```
- **Bản chất lỗi:** Nhầm lẫn giữa biến bên ngoài hàm (biến toàn cục) và biến bên trong hàm (biến cục bộ). Bên trong hàm bạn sử dụng một biến mà chưa hề khai báo hoặc gán giá trị cho nó trong hàm đó.
- **Cách sửa:** Mọi dữ liệu mà hàm cần sử dụng, hãy truyền thông qua tham số của hàm:
```python
# Sai (ham tu tien lay bien ben ngoai ma khong truyen qua tham so):
def tinh():
    return so * 2

# Dung (truyen ro rang qua tham so dau vao):
def tinh(so):
    return so * 2
```

---

### Lỗi 3: `ModuleNotFoundError: No module named 'thuvien'`
- **Nguyên văn thông báo:**
```text
ModuleNotFoundError: No module named 'thuvien'
```
- **Bản chất lỗi:** 
  1. File `main.py` và file `thuvien.py` không được lưu chung trong cùng một thư mục.
  2. Hoặc bạn đặt tên file sai chính tả (ví dụ đặt tên file là `thu_vien.py` nhưng lại viết lệnh `import thuvien`).
- **Cách sửa:** Lưu cả 2 file `.py` vào cùng một thư mục bài làm trên máy thi và kiểm tra đúng tên file.

---

## 5. Khuôn mẫu cho đề thi: Đoạn code "Copy – Hiểu – Sửa"

### QUY ƯỚC QUAN TRỌNG VỀ ĐỀ THI TRÊN MÁY:
Mọi đề thi thực hành luôn có cấu trúc:
> *"Viết chương trình Python yêu cầu mỗi ý từ 1 đến N viết 1 hàm lưu trữ dưới dạng thư viện. Sau đó viết chương trình chính sử dụng các hàm trên."*

Để đạt điểm tuyệt đối từ giám thị và máy chấm, bạn phải tuân thủ nghiêm ngặt **Quy ước Return vs Print**:
1. **Khi đề bài dùng các từ:** *"Tính...", "Tìm...", "Đếm...", "Kiểm tra..."* -> **Bắt buộc dùng `return`** để trả giá trị về. Tuyệt đối không `print()` trong hàm.
2. **Khi đề bài dùng từ:** *"In ra...", "Hiển thị...", "Đưa ra màn hình..."* -> Lúc này bạn **được phép dùng lệnh `print()`** trực tiếp ngay bên trong thân hàm.

---

### Cấu trúc bài thi chuẩn gồm 2 file:

![Hình 4.4: Minh bước vào phòng hộp đồ nghề thuvien.py để lấy dụng cụ sang bàn làm việc main.py](assets/media/python/minh_bit/bai04_toolbox_room.jpg)

#### File 1: `thuvien.py` (Lưu trữ toàn bộ các hàm)
```python
# thuvien.py - Thu vien chua cac ham theo yeu cau cua de thi

def kiem_tra_so_chan(so):
    # Tra ve True neu so chan, nguoc lai tra ve False
    if so % 2 == 0:
        return True
    else:
        return False

def tinh_tong_day_so(n):
    # Tinh tong cac so tu 1 den n
    if n <= 0:
        return 0
    tong = 0
    for i in range(1, n + 1):
        tong = tong + i
    return tong

def hien_thi_uoc_so(so):
    # Y de ghi 'hien thi / dua ra' nen duoc phep in trong ham
    if so <= 0:
        print("Khong co uoc so duong")
        return
    print("Cac uoc so la:", end=" ")
    for i in range(1, so + 1):
        if so % i == 0:
            print(i, end=" ")
    print() # Xuong dong
```

#### File 2: `main.py` (Chương trình chính gọi thư viện)
```python
# main.py - Chuong trinh chinh nhap xuat va su dung ham tu thuvien.py
import thuvien

try:
    so = int(input("Nhap mot so nguyen: "))
    
    # 1. Su dung ham kiem tra chan le
    if thuvien.kiem_tra_so_chan(so):
        print(so, "la so chan")
    else:
        print(so, "la so le")
        
    # 2. Su dung ham tinh tong
    tong = thuvien.tinh_tong_day_so(so)
    print("Tong cac so tu 1 den", so, "la:", tong)
    
    # 3. Su dung ham hien thi uoc so
    thuvien.hien_thi_uoc_so(so)

except ValueError:
    print("Loi: Du lieu nhap vao phai la mot so nguyen hop le")
```

Kết quả mẫu khi chạy file `main.py` và nhập `6`:
```text
Nhap mot so nguyen: 6
6 la so chan
Tong cac so tu 1 den 6 la: 21
Cac uoc so la: 1 2 3 6 
```

---

## 6. Bài tập 3 mức (Làm theo – Sửa lại – Tự viết)

### Mức 1: Làm theo (Gõ lại chính xác để quen tay)
**Đề bài:** Viết hàm `tinh_chu_vi_hinh_chu_nhat(dai, rong)` trả về chu vi hình chữ nhật bằng `return`. Viết chương trình chính gọi hàm với chiều dài là 8 và chiều rộng là 5, in kết quả ra màn hình.

<details>
<summary>👉 Xem đáp án Mức 1</summary>

```python
# Muc 1: Dinh nghia va su dung ham tinh chu vi
def tinh_chu_vi_hinh_chu_nhat(dai, rong):
    # Kiem tra kich thuoc hop le
    if dai <= 0 or rong <= 0:
        return 0
    kq = (dai + rong) * 2
    return kq

# Chuong trinh chinh:
dai = 8
rong = 5
chu_vi = tinh_chu_vi_hinh_chu_nhat(dai, rong)
print("Chu vi hinh chu nhat la:", chu_vi)
```

Kết quả mẫu:
```text
Chu vi hinh chu nhat la: 26
```
</details>

---

### Mức 2: Sửa lại (Tìm và vá lỗi đoạn code hỏng)
**Đề bài:** Một bạn học sinh viết hàm tính tổng 2 số và chương trình chính như sau, nhưng khi chạy thì máy in ra `Ket qua la: None` và không tính được phép chia phía sau. Hãy sửa lại cho đúng:

```python
# Doan code loi:
def tinh_tong(a, b):
    print("Tong la:", a + b)

kq = tinh_tong(10, 20)
trung_binh = kq / 2
print("Trung binh la:", trung_binh)
```

<details>
<summary>👉 Xem đáp án Mức 2</summary>

**Nguyên nhân sai:**
Hàm `tinh_tong` dùng `print` thay vì `return`. Khi gán `kq = tinh_tong(10, 20)`, biến `kq` bị gán giá trị `None`. Phép tính `kq / 2` tương đương `None / 2` gây lỗi crash chương trình `TypeError`.

**Đoạn code sửa đúng:**
```python
# Doan code da duoc sua dung:
def tinh_tong(a, b):
    kq = a + b
    return kq

# Chuong trinh chinh:
kq = tinh_tong(10, 20)
trung_binh = kq / 2
print("Tong la:", kq)
print("Trung binh la:", trung_binh)
```

Kết quả mẫu:
```text
Tong la: 30
Trung binh la: 15.0
```
</details>

---

### Mức 3: Tự viết (Chuẩn hóa cấu trúc 2 file của đề thi)
**Đề bài:** Viết bài thi gồm đúng 2 file theo yêu cầu:
1. File `thuvien.py` gồm 2 hàm:
   - `kiem_tra_nguyen_to(so)`: Trả về `True` nếu `so` là số nguyên tố, ngược lại trả về `False`.
   - `tinh_tong_uoc(so)`: Trả về tổng tất cả các ước số nguyên dương của `so`. Nếu `so <= 0` trả về 0.
2. File `main.py`: Nhập vào số nguyên dương `so` (bắt lỗi nhập sai bằng `try - except`). Sử dụng các hàm từ `thuvien.py` để in ra:
   - Thông báo số đó có phải số nguyên tố không.
   - Tổng các ước của số đó là bao nhiêu.

<details>
<summary>👉 Xem đáp án Mức 3</summary>

#### Nội dung file `thuvien.py`:
```python
# thuvien.py
def kiem_tra_nguyen_to(so):
    if so < 2:
        return False
    gioi_han = int(so ** 0.5) + 1
    for i in range(2, gioi_han):
        if so % i == 0:
            return False
    return True

def tinh_tong_uoc(so):
    if so <= 0:
        return 0
    tong = 0
    for i in range(1, so + 1):
        if so % i == 0:
            tong = tong + i
    return tong
```

#### Nội dung file `main.py`:
```python
# main.py
import thuvien

try:
    so = int(input("Nhap vao so nguyen: "))
    
    # 1. Kiem tra nguyen to
    if thuvien.kiem_tra_nguyen_to(so):
        print(so, "la so nguyen to")
    else:
        print(so, "khong phai la so nguyen to")
        
    # 2. Tinh tong cac uoc
    tong = thuvien.tinh_tong_uoc(so)
    print("Tong tat ca cac uoc so la:", tong)

except ValueError:
    print("Loi: Du lieu nhap vao phai la so nguyen hop le")
```

Kết quả mẫu khi chạy `main.py` với số `12`:
```text
Nhap vao so nguyen: 12
12 khong phai la so nguyen to
Tong tat ca cac uoc so la: 28
```
</details>

---

## 7. Tóm tắt 5 dòng và 3 câu tự kiểm tra

### 5 dòng cốt lõi cần nhớ:
1. **Định nghĩa hàm:** Dùng từ khóa `def ten_ham(tham_so):` và luôn có dấu hai chấm `:` kèm thụt lề 4 dấu cách.
2. **Quy tắc vàng:** Đề bảo "tính, tìm, đếm" thì dùng `return`; đề bảo "in, hiển thị" mới dùng `print` trong hàm.
3. **Không có return = None:** Nếu hàm không return giá trị nào, Python tự gán kết quả là `None`.
4. **Tách 2 file chuẩn đề thi:** Viết toàn bộ hàm trong `thuvien.py`, ở `main.py` chỉ cần `import thuvien` rồi gọi `thuvien.ten_ham()`.
5. **Cùng thư mục:** File `thuvien.py` và file `main.py` bắt buộc phải nằm chung thư mục trên máy thi mới import được.

### 3 câu tự kiểm tra trước khi sang Bài 5:
1. Điểm khác biệt lớn nhất giữa `return` và `print` khi viết hàm là gì?
2. Tại sao ta không nên viết lệnh `input()` hay `print()` nằm tự do bên ngoài các hàm trong file `thuvien.py`?
3. Nếu hàm khai báo `def tinh(a, b):` nhưng chương trình chính gọi `tinh(1, 2, 3)` thì Python sẽ báo lỗi gì?
