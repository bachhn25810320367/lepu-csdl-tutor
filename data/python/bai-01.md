# Bài 1: Môi trường, Biến, Nhập xuất và Toán tử cơ bản

## 1. Câu chuyện đời sống: Chiếc hộp dán nhãn và Cửa nhận hàng

Hãy tưởng tượng bạn đang dọn phòng học và chuẩn bị một chiếc hộp nhựa. Bạn lấy bút lông dán lên mặt ngoài chiếc hộp một mẩu giấy ghi chữ: **"so"**. 

Bất cứ khi nào bạn nhặt được một viên bi hoặc một con số, bạn thả nó vào trong hộp. Khi bạn nói: *"Cho tôi xem trong hộp `so` có gì"*, bạn chỉ việc mở nắp hộp đó ra.

![](assets/media/python/minh_bit/bai01_label_boxes.jpg)

Trong máy tính cũng y hệt như vậy:
- **Biến (Variable)**: Chính là chiếc hộp có dán nhãn tên (`so`, `tong`, `kq`). Máy tính không có trí nhớ tự nhiên như con người; nếu bạn tính toán xong mà không cất vào chiếc hộp nào, kết quả đó sẽ biến mất ngay lập tức khỏi bộ nhớ RAM.
- **Dấu bằng (`=`)**: Là hành động thả đồ vào hộp (gọi là phép gán). Khi viết `so = 10`, nghĩa là bạn thả giá trị `10` vào trong chiếc hộp có tên là `so`.
- **Hàm `input()`**: Là khe nhận đồ từ bàn phím. Người dùng gõ cái gì vào, máy nhận đúng cái đó.
- **Hàm `print()`**: Là khay trả kết quả ra màn hình cho bạn nhìn thấy.

---

## 2. Ví dụ nhỏ nhất (3–5 dòng code)

Dưới đây là chương trình nhỏ nhất nhận một số từ bàn phím, cộng thêm 10 đơn vị rồi in ra màn hình:

```python
# Nhap mot so nguyen tu ban phim va tinh tong voi 10
so = int(input())
tong = so + 10
print(tong)
```

Kết quả thực tế khi chạy chương trình:

```text
Dau vao:
5

Ket qua man hinh:
15
```

---

## 3. Đoán trước kết quả, rồi chạy thử

Quan sát đoạn code dưới đây và đoán xem kết quả in ra là gì:

```python
# Doan ket qua truoc khi chay
so = input()
kq = so + so
print(kq)
```

![](assets/media/python/minh_bit/trap_str_concat_55.jpg)

Nếu bạn gõ vào số `5` rồi ấn phím Enter, màn hình sẽ in ra `10` hay `55`?

<details>
<summary>👉 Bấm vào đây để xem đáp án và giải thích chi tiết</summary>

**Đáp án:** Màn hình sẽ in ra `55`, chứ không phải `10`.

**Giải thích vì sao:**
Hàm `input()` của Python có một đặc điểm sống còn: **Mọi thứ nó nhận từ bàn phím đều được coi là một chuỗi chữ cái (văn bản - string)**, kể cả khi bạn gõ chữ số `5`. 
Khi bạn lấy chuỗi `'5'` cộng với chuỗi `'5'`, Python sẽ hiểu dấu `+` là phép **dán dính hai đoạn chữ lại với nhau** (giống như ghép chữ `'A'` với `'B'` thành `'AB'`).

Muốn máy hiểu đó là con số để làm toán cộng ra `10`, bạn bắt buộc phải dùng hàm `int()` bọc bên ngoài:
```python
so = int(input()) # Ep chuoi van ban thanh so nguyen
```
</details>

---

## 4. Lỗi thường gặp: Thông báo lỗi nguyên văn và cách sửa

Trong phòng thi, khi màn hình bật lên dòng chữ đỏ báo lỗi, đừng hoảng loạn. Dưới đây là 3 lỗi phổ biến nhất ở Bài 1:

### Lỗi 1: `TypeError: can only concatenate str (not "int") to str`
- **Nguyên văn thông báo:**
```text
TypeError: can only concatenate str (not "int") to str
```
- **Bản chất lỗi:** Bạn đang lấy một chuỗi văn bản (từ `input()`) đem cộng với một con số nguyên (`+ 10`). Python không thể lấy chữ cộng với số được.
- **Cách sửa:** Chuyển kiểu dữ liệu sang số nguyên bằng `int()` trước khi tính toán:
```python
# Sai:
so = input()
tong = so + 10

# Dung:
so = int(input())
tong = so + 10
```

---

### Lỗi 2: `ValueError: invalid literal for int() with base 10`
- **Nguyên văn thông báo:**
```text
ValueError: invalid literal for int() with base 10: 'abc'
```
- **Bản chất lỗi:** Người dùng nhập chữ cái (`abc`) hoặc số thập phân (`5.5`) nhưng chương trình lại ép nó biến thành số nguyên `int()`. Máy không thể dịch chữ `abc` thành số nguyên được nên báo lỗi dừng chương trình.
- **Cách sửa:** Sử dụng khối phòng vệ `try - except` để bắt lỗi nhập liệu:
```python
try:
    so = int(input())
except ValueError:
    print("Loi: Ban phai nhap mot so nguyen hop le")
```

---

### Lỗi 3: `ZeroDivisionError: division by zero`

![](assets/media/python/minh_bit/err_zero_division.jpg)

- **Nguyên văn thông báo:**
```text
ZeroDivisionError: division by zero
```
- **Bản chất lỗi:** Bạn thực hiện phép chia cho số `0` (dùng `/`, `//` hoặc `%`). Trong toán học và máy tính, chia cho 0 là điều không xác định.
- **Cách sửa:** Bắt lỗi bằng `except ZeroDivisionError` hoặc kiểm tra điều kiện trước khi chia:
```python
try:
    kq = so // 0
except ZeroDivisionError:
    print("Loi: Khong the chia cho so 0")
```

---

## 5. Khuôn mẫu cho đề thi: Đoạn code "Copy – Hiểu – Sửa"

Trong các đề thi thực hành, các câu hỏi đầu tiên luôn yêu cầu: nhập số, tính toán chia hết, chia lấy dư hoặc lũy thừa.

Dưới đây là 4 toán tử cốt lõi trong đề thi Python:
- `//` : Chia lấy phần nguyên (Ví dụ: `17 // 5` được `3`).
- `%` : Chia lấy phần dư (Ví dụ: `17 % 5` được `2`). Dùng cực nhiều để kiểm tra chẵn lẻ (`so % 2 == 0`).
- `**` : Lũy thừa / mũ (Ví dụ: `so ** 2` là bình phương, `so ** 3` là lập phương).
- `/` : Chia số thực (kết quả luôn ra số có dấu phẩy thập phân, ví dụ: `10 / 2` ra `5.0`).

### Đoạn code khuôn mẫu an toàn:
```python
# Khuon mau nhap so an toan va thuc hien cac toan tu phong thi
try:
    so = int(input("Nhap so nguyen: "))
    
    # 1. Chia lay phan nguyen
    chia_nguyen = so // 3
    # 2. Chia lay phan du
    chia_du = so % 3
    # 3. Luy thua (binh phuong)
    luy_thua = so ** 2
    
    print("Chia lay nguyen cho 3:", chia_nguyen)
    print("Chia lay du cho 3:", chia_du)
    print("Binh phuong:", luy_thua)

except ValueError:
    print("Loi: Du lieu nhap vao khong hop le")
```

Kết quả mẫu khi nhập `17`:
```text
Nhap so nguyen: 17
Chia lay nguyen cho 3: 5
Chia lay du cho 3: 2
Binh phuong: 289
```

---

## 6. Bài tập 3 mức (Làm theo – Sửa lại – Tự viết)

### Mức 1: Làm theo (Gõ lại chính xác để quen tay)
**Đề bài:** Nhập vào một số nguyên `so` từ bàn phím. Tính lập phương của số đó (`so` mũ 3) lưu vào biến `kq`, sau đó in `kq` ra màn hình.

<details>
<summary>👉 Xem đáp án Mức 1</summary>

```python
# Muc 1: Tinh lap phuong cua mot so
try:
    so = int(input("Nhap vao so nguyen: "))
    kq = so ** 3
    print("Lap phuong cua so la:", kq)
except ValueError:
    print("Loi: Gia tri nhap vao khong phai so nguyen")
```

Kết quả mẫu khi nhập `4`:
```text
Nhap vao so nguyen: 4
Lap phuong cua so la: 64
```
</details>

---

### Mức 2: Sửa lại (Tìm và vá lỗi đoạn code hỏng)
**Đề bài:** Bạn học sinh viết đoạn code sau để tính trung bình cộng của 2 số nhưng chương trình liên tục in ra sai kết quả hoặc báo lỗi. Hãy chỉ ra lỗi và sửa lại cho đúng:

```python
# Doan code bi loi cua hoc sinh
so_1 = input("Nhap so thu nhat: ")
so_2 = input("Nhap so thu hai: ")
tong = so_1 + so_2
kq = tong / 2
print("Trung binh cong la:", kq)
```

<details>
<summary>👉 Xem đáp án Mức 2</summary>

**Các lỗi trong bài:**
1. Thiếu `int()` hoặc `float()` khi nhập `input()`, khiến `so_1 + so_2` thành phép nối chữ (ví dụ nhập `4` và `6` sẽ ra chuỗi `'46'`).
2. Chuỗi `'46'` không thể chia cho số `2` bằng toán tử `/`, dẫn đến lỗi `TypeError`.

**Đoạn code sửa đúng:**
```python
# Doan code da duoc sua hoan chinh
try:
    so_1 = float(input("Nhap so thu nhat: "))
    so_2 = float(input("Nhap so thu hai: "))
    tong = so_1 + so_2
    kq = tong / 2
    print("Trung binh cong la:", kq)
except ValueError:
    print("Loi: Du lieu nhap vao phai la chu so")
```

Kết quả mẫu khi nhập `4` và `6`:
```text
Nhap so thu nhat: 4
Nhap so thu hai: 6
Trung binh cong la: 5.0
```
</details>

---

### Mức 3: Tự viết (Thử thách sát đề thi)
**Đề bài:** Viết chương trình nhập vào 2 số nguyên gồm: số bị chia `so` và số chia `so_chia`.
- Tính và in ra tổng `tong` của 2 số.
- Tính và in ra thương nguyên `kq_nguyen` (chia lấy phần nguyên).
- Tính và in ra số dư `kq_du` (chia lấy phần dư).
- Bắt buộc xử lý lỗi an toàn: nếu người dùng nhập chữ hoặc nhập `so_chia = 0` thì phải in thông báo lỗi tương ứng, không để chương trình bị dừng đột ngột.

<details>
<summary>👉 Xem đáp án Mức 3</summary>

```python
# Muc 3: Xu ly tinh toan va phong ve loi toan dien
try:
    so = int(input("Nhap so bi chia: "))
    so_chia = int(input("Nhap so chia: "))
    
    tong = so + so_chia
    print("Tong hai so:", tong)
    
    kq_nguyen = so // so_chia
    kq_du = so % so_chia
    
    print("Thuong nguyen:", kq_nguyen)
    print("Phan du:", kq_du)

except ValueError:
    print("Loi: Du lieu nhap vao phai la so nguyen hop le")
except ZeroDivisionError:
    print("Loi: So chia khong the bang 0")
```

Kết quả mẫu trường hợp chạy bình thường:
```text
Nhap so bi chia: 19
Nhap so chia: 4
Tong hai so: 23
Thuong nguyen: 4
Phan du: 3
```

Kết quả mẫu trường hợp nhập chia cho 0:
```text
Nhap so bi chia: 19
Nhap so chia: 0
Tong hai so: 19
Loi: So chia khong the bang 0
```
</details>

---

## 7. Tóm tắt 5 dòng và 3 câu tự kiểm tra

### 5 dòng cốt lõi cần nhớ:
1. **Biến là hộp dán nhãn:** Tạo biến bằng cú pháp `ten_bien = gia_tri` để lưu trữ dữ liệu trong bộ nhớ.
2. **`input()` luôn là chuỗi chữ:** Muốn làm toán bắt buộc phải bọc `int(...)` hoặc `float(...)`.
3. **Bộ 3 toán tử phòng thi:** `//` lấy phần nguyên, `%` lấy phần dư, `**` tính lũy thừa.
4. **Phòng thủ trước lỗi:** Dùng `try - except` bắt `ValueError` (nhập sai kiểu) và `ZeroDivisionError` (chia cho 0).
5. **Đọc kỹ đề bài:** Đề bài yêu cầu "tính" thì lưu vào biến kết quả `kq`, khi đề yêu cầu "in/hiển thị ra màn hình" thì mới dùng `print()`.

### 3 câu tự kiểm tra trước khi sang Bài 2:
1. Phép tính `19 % 4` và `19 // 4` cho kết quả lần lượt là bao nhiêu?
2. Tại sao câu lệnh `so = input()` rồi `print(so * 3)` khi nhập `7` lại in ra `777` chứ không phải `21`?
3. Khi nào thì chương trình Python phát sinh lỗi `ZeroDivisionError`?
