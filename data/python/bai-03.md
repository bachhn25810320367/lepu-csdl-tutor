# Bài 3: Vòng lặp (for, while, range, break và continue)

## 1. Câu chuyện đời sống: Chạy bộ quanh sân vận động

Hãy tưởng tượng bạn đang tập thể dục trên đường chạy quanh sân vận động:

1. **Vòng lặp `for` (Biết trước số vòng chạy):**
   Huấn luyện viên bảo bạn: *"Hãy chạy đúng 5 vòng quanh sân rồi nghỉ"*.
   Bạn biết đích xác mình sẽ lặp lại hành động chạy đúng 5 lần: vòng 1, vòng 2, vòng 3, vòng 4, vòng 5. Chạy xong vòng thứ 5, bạn tự động dừng lại.
2. **Vòng lặp `while` (Chưa biết trước số vòng, chỉ biết điều kiện dừng):**
   Huấn luyện viên bảo: *"Hãy tiếp tục chạy CHỪNG NÀO bạn chưa thấy kiệt sức"*.
   Sau mỗi vòng chạy, bạn tự hỏi bản thân: *"Còn sức không?"*. Nếu còn (`True`), bạn chạy tiếp vòng nữa. Cứ như vậy, cho đến khi bạn thấy hết sức (`False`), bạn mới dừng lại.
3. **Lệnh `break` (Dừng khẩn cấp):**
   Bạn đang chạy dở vòng thứ 2 thì bỗng nhiên trời nổi dông bão sấm sét cực lớn. Bạn quyết định **bỏ cuộc ngay lập tức và rời khỏi sân**, không chạy thêm vòng nào nữa.
4. **Lệnh `continue` (Bỏ qua lượt hiện tại):**
   Đang chạy ở vòng thứ 3, bạn thấy phía trước có một vũng bùn bẩn. Bạn nhảy tránh qua vũng bùn đó (bỏ qua đoạn đường xấu của vòng này) rồi **tiếp tục chạy sang vòng thứ 4 bình thường**.

![](assets/media/python/minh_bit/bai03_conveyor_belt.jpg)

---

## 2. Ví dụ nhỏ nhất (3–5 dòng code)

Dưới đây là chương trình tính tổng các số từ 1 đến 5 bằng vòng lặp `for`:

```python
# Tinh tong cac so tu 1 den 5
tong = 0
for so in range(1, 6):
    tong = tong + so
print(tong)
```

Kết quả thực tế khi chạy chương trình:

```text
Ket qua man hinh:
15
```

---

## 3. Đoán trước kết quả, rồi chạy thử

Quan sát kỹ đoạn code dưới đây và suy đoán kết quả:

```python
# Doan ket qua truoc khi chay
for so in range(1, 5):
    print(so)
```

Màn hình sẽ in ra các số từ `1` đến `5`, hay chỉ in từ `1` đến `4`?

<details>
<summary>👉 Bấm vào đây để xem đáp án và giải thích chi tiết</summary>

**Đáp án:** Màn hình chỉ in ra 4 số:
```text
1
2
3
4
```
Hoàn toàn **không có số 5**!

**Giải thích cơ chế hàm `range(bat_dau, ket_thuc)`:**
Trong Python, hàm `range(a, b)` sinh ra dãy số bắt đầu từ `a` và **kết thúc ngay trước `b`** (tức là dừng ở `b - 1`).
- `range(1, 5)` chỉ chạy qua các số: `1, 2, 3, 4`.
- `range(0, 5)` chạy qua: `0, 1, 2, 3, 4` (đủ 5 lần).
- `range(1, 10, 2)`: Số thứ ba là bước nhảy (step), sinh ra các số lẻ: `1, 3, 5, 7, 9`.

**Ghi nhớ phòng thi:** Muốn vòng lặp chạy đến số `n`, bạn bắt buộc phải viết là `range(1, n + 1)`.
</details>

---

## 4. Lỗi thường gặp: Thông báo lỗi nguyên văn và cách sửa

### Lỗi 1: Treo đơ chương trình (Vòng lặp vô tận - Infinite Loop với `while`)
- **Biểu hiện:** Bấm chạy chương trình nhưng con trỏ nhấp nháy mãi không dừng, máy nóng lên, không in ra kết quả. Khi bạn bấm tổ hợp phím `Ctrl + C` để ngắt cưỡng bức, màn hình báo:
```text
KeyboardInterrupt
```
- **Bản chất lỗi:** Điều kiện của vòng lặp `while` luôn luôn đúng (`True`), vì bạn **quên cập nhật biến điều kiện** bên trong thân vòng lặp.
- **Cách sửa:**
```python
# Sai (so mai mai bang 1, vong lap chay vo tan):
so = 1
while so <= 5:
    print(so)

# Dung (tang so len sau moi vong lap):
so = 1
while so <= 5:
    print(so)
    so = so + 1 # Dieu kien se den luc bang 6 va dung lai
```

---

### Lỗi 2: `TypeError: 'float' object cannot be interpreted as an integer`
- **Nguyên văn thông báo:**
```text
TypeError: 'float' object cannot be interpreted as an integer
```
- **Bản chất lỗi:** Hàm `range()` bắt buộc tất cả các tham số phải là số nguyên (`int`). Nếu bạn dùng phép chia thông thường `/` (kết quả ra số thực `float`), Python sẽ lập tức báo lỗi này.
- **Cách sửa:** Dùng phép chia lấy phần nguyên `//` hoặc ép kiểu `int()`:
```python
# Sai:
n = 10
for so in range(1, n / 2):

# Dung:
n = 10
for so in range(1, n // 2 + 1):
```

---

### Lỗi 3: `NameError: name 'tong' is not defined`
- **Nguyên văn thông báo:**
```text
NameError: name 'tong' is not defined
```
- **Bản chất lỗi:** Bạn thực hiện phép tích lũy `tong = tong + so` nhưng chưa hề tạo biến `tong` với giá trị ban đầu là `0` trước khi bước vào vòng lặp.
- **Cách sửa:** Luôn nhớ tạo biến tích lũy trước vòng lặp:
  - Nếu tính tổng: khởi tạo `tong = 0`.
  - Nếu đếm số lượng: khởi tạo `dem = 0`.
  - Nếu tính tích: khởi tạo `tich = 1`.

---

## 5. Khuôn mẫu cho đề thi: Đoạn code "Copy – Hiểu – Sửa"

Trong ngân hàng 26 đề thi Python, vòng lặp được dùng để giải quyết 3 dạng bài kinh điển:

### Khuôn mẫu 1: Tích lũy (Tính tổng, đếm số lượng)
```python
# Khuon mau tinh tong va dem cac so chan tu 1 den n
try:
    so = int(input("Nhap n: "))
    tong = 0
    dem = 0
    
    for i in range(1, so + 1):
        if i % 2 == 0:
            tong = tong + i
            dem = dem + 1
            
    print("So luong so chan:", dem)
    print("Tong cac so chan:", tong)

except ValueError:
    print("Loi: Du lieu nhap vao phai la so nguyen")
```

Kết quả mẫu khi nhập `10`:
```text
Nhap n: 10
So luong so chan: 5
Tong cac so chan: 30
```

---

### Khuôn mẫu 2: Thuật toán kiểm tra số nguyên tố (Xuất hiện liên tục trong đề thi)
Một số nguyên dương `so >= 2` được gọi là số nguyên tố nếu nó chỉ có đúng 2 ước là 1 và chính nó.

```python
# Khuon mau kiem tra so nguyen to chuan phong thi
try:
    so = int(input("Nhap so can kiem tra: "))
    
    if so < 2:
        la_nguyen_to = False
    else:
        la_nguyen_to = True
        # Kiem tra xem co chia het cho so nao tu 2 den can bac hai cua so khong
        gioi_han = int(so ** 0.5) + 1
        for i in range(2, gioi_han):
            if so % i == 0:
                la_nguyen_to = False
                break # Tim thay uoc la dung ngay, tiet kiem thoi gian
                
    if la_nguyen_to:
        print(so, "la so nguyen to")
    else:
        print(so, "khong phai la so nguyen to")

except ValueError:
    print("Loi: Du lieu nhap vao phai la so nguyen")
```

Kết quả mẫu khi kiểm tra số `17` và `15`:
```text
Nhap so can kiem tra: 17
17 la so nguyen to
```
```text
Nhap so can kiem tra: 15
15 khong phai la so nguyen to
```

---

### Khuôn mẫu 3: Nhập dữ liệu liên tục cho đến khi muốn dừng (Dạng đề số 2)
```python
# Khuon mau vong lap while True de nhap lieu lien tuc
tong = 0
dem = 0

while True:
    nhap = input("Nhap mot so nguyen (hoac go 'q' de dung): ")
    if nhap == 'q' or nhap == 'Q':
        break # Nguoi dung muon dung thi thoat khoi vong lap
    try:
        so = int(nhap)
        tong = tong + so
        dem = dem + 1
    except ValueError:
        print("Loi: Gia tri khong hop le, vui long nhap lai")

print("Da nhap xong", dem, "so. Tong la:", tong)
```

---

## 6. Bài tập 3 mức (Làm theo – Sửa lại – Tự viết)

### Mức 1: Làm theo (Gõ lại chính xác để quen tay)
**Đề bài:** Nhập vào một số nguyên dương `so`. Dùng vòng lặp `for` để tính giai thừa của số đó: `1 * 2 * 3 * ... * so`. In kết quả ra màn hình. (Quy ước: nếu `so = 0` thì giai thừa bằng 1).

<details>
<summary>👉 Xem đáp án Mức 1</summary>

```python
# Muc 1: Tinh giai thua cua mot so
try:
    so = int(input("Nhap so nguyen duong: "))
    if so < 0:
        print("Loi: Khong ton tai giai thua cua so am")
    else:
        kq = 1
        for i in range(1, so + 1):
            kq = kq * i
        print("Giai thua la:", kq)
except ValueError:
    print("Loi: Du lieu nhap vao phai la so nguyen")
```

Kết quả mẫu khi nhập `5`:
```text
Nhap so nguyen duong: 5
Giai thua la: 120
```
</details>

---

### Mức 2: Sửa lại (Tìm và vá lỗi đoạn code hỏng)
**Đề bài:** Bạn học sinh viết đoạn code sau để đếm xem số nguyên dương `so` có bao nhiêu ước số, nhưng chương trình bị báo lỗi `ZeroDivisionError`. Hãy tìm lỗi và sửa lại:

```python
# Doan code loi cua hoc sinh:
so = int(input("Nhap so: "))
dem = 0
for i in range(so + 1):
    if so % i == 0:
        dem = dem + 1
print("So uoc la:", dem)
```

<details>
<summary>👉 Xem đáp án Mức 2</summary>

**Nguyên nhân sai:**
Câu lệnh `range(so + 1)` mặc định bắt đầu chạy từ số `0`! Khi vòng lặp chạy bước đầu tiên, `i = 0`, phép toán `so % i` tương đương với chia lấy dư cho 0, lập tức gây lỗi sập chương trình `ZeroDivisionError: integer division or modulo by zero`.

**Đoạn code sửa đúng:**
Ước số phải bắt đầu tìm từ số `1`:
```python
# Doan code da sua dung:
try:
    so = int(input("Nhap so: "))
    if so <= 0:
        print("Loi: Vui long nhap so nguyen duong")
    else:
        dem = 0
        for i in range(1, so + 1):
            if so % i == 0:
                dem = dem + 1
        print("So uoc la:", dem)
except ValueError:
    print("Loi: Du lieu nhap vao phai la so nguyen")
```

Kết quả mẫu khi nhập `12`:
```text
Nhap so: 12
So uoc la: 6
```
*(12 có 6 ước là: 1, 2, 3, 4, 6, 12)*
</details>

---

### Mức 3: Tự viết (Thử thách sát đề thi)
**Đề bài:** Viết chương trình nhập vào một số nguyên dương `so`. Hãy:
1. Đưa ra danh sách các ước số của `so`.
2. Tính tổng của tất cả các ước số đó (lưu vào biến `tong`).
3. Nếu tổng các ước số (không tính chính nó) bằng chính số đó, in thông báo `"Day la so hoan hao"` (Ví dụ số 6 có các ước nhỏ hơn nó là 1, 2, 3 và $1 + 2 + 3 = 6$).
Chương trình phải bắt lỗi nhập số không hợp lệ bằng `try - except`.

<details>
<summary>👉 Xem đáp án Mức 3</summary>

```python
# Muc 3: Liet ke uoc so va kiem tra so hoan hao
try:
    so = int(input("Nhap so nguyen duong: "))
    if so <= 0:
        print("Loi: Vui long nhap so nguyen duong lon hon 0")
    else:
        tong_uoc_nho = 0
        print("Cac uoc so la:")
        for i in range(1, so + 1):
            if so % i == 0:
                print(i, end=" ")
                if i < so:
                    tong_uoc_nho = tong_uoc_nho + i
        print() # Xuong dong
        
        # Kiem tra so hoan hao
        if tong_uoc_nho == so:
            print("Day la so hoan hao")
        else:
            print("Khong phai la so hoan hao")

except ValueError:
    print("Loi: Ban phai nhap mot so nguyen hop le")
```

Kết quả mẫu khi nhập `6`:
```text
Nhap so nguyen duong: 6
Cac uoc so la:
1 2 3 6 
Day la so hoan hao
```

Kết quả mẫu khi nhập `8`:
```text
Nhap so nguyen duong: 8
Cac uoc so la:
1 2 4 8 
Khong phai la so hoan hao
```
</details>

---

## 7. Tóm tắt 5 dòng và 3 câu tự kiểm tra

### 5 dòng cốt lõi cần nhớ:
1. **Chọn đúng vòng lặp:** Biết trước số lần lặp thì dùng `for`, chưa biết trước số lần (chỉ biết điều kiện dừng) thì dùng `while`.
2. **Quy tắc hàm `range`:** `range(1, n + 1)` mới chạy đến `n`; bỏ số đầu thì mặc định chạy từ 0 (`range(n)` chạy từ `0` đến `n - 1`).
3. **Luôn dọn sạch trước khi đếm/cộng:** Đặt `tong = 0` hoặc `dem = 0` ngay trước khi bước vào vòng lặp.
4. **Tránh bẫy vô tận:** Trong `while`, bắt buộc phải có câu lệnh làm thay đổi biến điều kiện (ví dụ: `i = i + 1`).
5. **Cặp đôi điều khiển:** `break` đập vỡ vòng lặp thoát ra ngay lập tức; `continue` bỏ qua lượt lặp hiện tại để nhảy sang lượt kế tiếp.

### 3 câu tự kiểm tra trước khi sang Bài 4:
1. Vòng lặp `for i in range(2, 10, 3):` sẽ duyệt qua các giá trị cụ thể nào?
2. Điều gì sẽ xảy ra nếu bạn chạy đoạn code: `while True: print("Chay mai")`?
3. Tại sao trong thuật toán kiểm tra số nguyên tố, khi gặp một số `i` mà `so % i == 0`, ta nên gọi lệnh `break` ngay?
