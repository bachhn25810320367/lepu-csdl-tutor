# Bài 5: Danh sách (List) Phần 1: Khởi tạo, Nhập dãy số, Chỉ số Index và Cắt lát Slice

## 1. Câu chuyện đời sống: Đoàn tàu hỏa nhiều toa chở hàng

Ở Bài 1, ta đã biết một **biến** giống như một chiếc hộp chỉ chứa được duy nhất 1 món đồ. Nhưng nếu đề thi yêu cầu bạn quản lý điểm của cả 40 học sinh, hay một dãy gồm 100 số nguyên thì sao? Nếu tạo 100 chiếc hộp (`so_1`, `so_2`, ..., `so_100`) thì code sẽ dài vô tận và không thể xử lý nổi!

Lúc này, Python mang đến cho bạn một **Danh sách (List)** — giống như một **đoàn tàu hỏa có nhiều toa nối tiếp nhau**:

![](assets/media/python/N5-DOAN-TAU-HOA-LIST.svg)

1. **Các toa tàu (Phần tử):** Cả đoàn tàu mang chung một cái tên là `ds`. Mỗi toa tàu chứa một con số hoặc một mẩu dữ liệu.
2. **Số hiệu toa tàu (Chỉ số Index):** 
   - Điểm đặc biệt của máy tính: Toa đầu tiên luôn được đánh số là **`0`** (chứ không phải 1). Toa thứ hai là `1`, toa thứ ba là `2`...
   - Toa tàu chạy lùi (Chỉ số âm): Toa cuối cùng ở đuôi tàu được đánh số là **`-1`**, toa sát cuối là **`-2`**.
3. **Cắt đoạn toa tàu (Cắt lát - Slicing):** Bạn có thể dùng một chiếc cưa để cắt lấy một đoạn từ toa thứ 1 đến trước toa thứ 4 bằng cú pháp `ds[1:4]`.

---

## 2. Ví dụ nhỏ nhất (3–5 dòng code)

Chuyển một chuỗi các số cách nhau bởi dấu phẩy thành một danh sách số nguyên (đây chính là **Ý số 1 của Đề thi số 1**):

```python
# Chuyen chuoi nhap vao thanh danh sach so nguyen
s = "10, 20, 30, 40"
ds = []
for x in s.split(","):
    ds.append(int(x.strip()))
print(ds)
```

Kết quả thực tế khi chạy:

```text
Ket qua man hinh:
[10, 20, 30, 40]
```

---

## 3. Đoán trước kết quả, rồi chạy thử

Quan sát kỹ đoạn code sau và suy đoán kết quả:

```python
# Doan ket qua truoc khi chay
ds = [12, 25, 37, 49, 50]
print(ds[1:4])
print(ds[-1])
```

Màn hình sẽ in ra những giá trị nào?

<details>
<summary>👉 Bấm vào đây để xem đáp án và giải thích chi tiết</summary>

**Đáp án:** Màn hình sẽ in ra:
```text
[25, 37, 49]
50
```

**Giải thích cơ chế cắt lát `ds[a:b]`:**
- Vị trí `0` là số `12`.
- Vị trí `1` là số `25`.
- Cắt lát `ds[1:4]` lấy từ vị trí `1` đến trước vị trí `4` (tức là lấy vị trí 1, 2, 3), tương ứng với `[25, 37, 49]`. Con số ở vị trí 4 (là `50`) **không được lấy**.
- `ds[-1]` lấy chính xác phần tử cuối cùng của danh sách, đó là số `50`.
</details>

---

## 4. Lỗi thường gặp: Thông báo lỗi nguyên văn và cách sửa

### Lỗi 1: `IndexError: list index out of range` (Vượt quá số toa tàu)
- **Nguyên văn thông báo:**
```text
IndexError: list index out of range
```
- **Bản chất lỗi:** Danh sách chỉ có 3 phần tử (vị trí `0`, `1`, `2`) nhưng bạn lại cố truy cập vào `ds[3]` hoặc `ds[10]`.
- **Cách sửa:** Luôn nhớ phần tử cuối cùng có chỉ số là `len(ds) - 1`, hoặc an toàn nhất là dùng `ds[-1]`. Phải kiểm tra danh sách có rỗng không (`len(ds) == 0`) trước khi truy cập index.

---

### Lỗi 2: `ValueError: invalid literal for int() with base 10: ''` khi tách chuỗi
- **Nguyên văn thông báo:**
```text
ValueError: invalid literal for int() with base 10: ''
```
- **Bản chất lỗi:** Người dùng nhập thừa dấu phẩy ở cuối chuỗi, ví dụ: `"1, 2, 3,"`. Khi dùng `split(",")`, phần tử cuối cùng là chuỗi rỗng `""`. Hàm `int("")` không thể đổi chuỗi rỗng thành số nên báo lỗi.
- **Cách sửa:** Kiểm tra phần tử sau khi cắt lát có rỗng hay không trước khi đổi sang `int`:
```python
# Cach sua an toan tuyet doi:
ds = []
for x in s.split(","):
    x = x.strip()
    if x != "":
        ds.append(int(x))
```

---

## 5. Khuôn mẫu cho đề thi: Đoạn code "Copy – Hiểu – Sửa"

Đây là **khuôn mẫu chuẩn hóa cho Ý 1 của Đề 1 trong ngân hàng đề thi**:
*"Nhập vào một dãy số nguyên cách nhau bằng dấu phẩy, chuyển đổi chúng thành một danh sách các số nguyên."*

### File `thuvien.py`:
```python
# thuvien.py - Ham chuyen chuoi thanh danh sach so nguyen an toan
def chuyen_chuoi_thanh_list(s):
    # Tra ve danh sach so nguyen, bo qua khoang trang va loi
    ds = []
    if s is None or s.strip() == "":
        return ds
        
    cac_phan_tu = s.split(",")
    for pt in cac_phan_tu:
        pt = pt.strip()
        if pt != "":
            try:
                so = int(pt)
                ds.append(so)
            except ValueError:
                # Bo qua ky tu khong phai so hop le
                pass
    return ds
```

### File `main.py`:
```python
# main.py
import thuvien

s = input("Nhap day so nguyen cach nhau bang dau phay: ")
ds = thuvien.chuyen_chuoi_thanh_list(s)
print("Danh sach cac so nguyen da nhap la:", ds)
print("So luong phan tu trong danh sach:", len(ds))
```

Kết quả mẫu khi chạy:
```text
Nhap day so nguyen cach nhau bang dau phay: 15, -4, 8, 0, 23
Danh sach cac so nguyen da nhap la: [15, -4, 8, 0, 23]
So luong phan tu trong danh sach: 5
```

---

## 6. Bài tập 3 mức (Làm theo – Sửa lại – Tự viết)

### Mức 1: Làm theo (Gõ lại chính xác để quen tay)
**Đề bài:** Cho sẵn danh sách `ds = [10, 20, 30, 40, 50, 60]`. Hãy viết chương trình in ra:
1. Phần tử đầu tiên của danh sách.
2. Phần tử cuối cùng của danh sách.
3. Danh sách con gồm 3 phần tử ở giữa `[30, 40, 50]`.

<details>
<summary>👉 Xem đáp án Mức 1</summary>

```python
# Muc 1: Thao tac chi so va cat lat co ban
ds = [10, 20, 30, 40, 50, 60]

print("Phan tu dau tien:", ds[0])
print("Phan tu cuoi cung:", ds[-1])
print("Ba phan tu o giua:", ds[2:5])
```

Kết quả mẫu:
```text
Phan tu dau tien: 10
Phan tu cuoi cung: 60
Ba phan tu o giua: [30, 40, 50]
```
</details>

---

### Mức 2: Sửa lại (Tìm và vá lỗi đoạn code hỏng)
**Đề bài:** Học sinh viết đoạn code sau để in ra từng phần tử kèm theo vị trí của nó, nhưng chương trình bị báo lỗi `IndexError`. Hãy sửa lại cho đúng:

```python
# Doan code loi:
ds = [5, 10, 15, 20]
for i in range(1, len(ds) + 1):
    print("Vi tri", i, "co gia tri la:", ds[i])
```

<details>
<summary>👉 Xem đáp án Mức 2</summary>

**Nguyên nhân sai:**
1. Trong Python chỉ số bắt đầu từ `0`, không phải `1`. Khi duyệt `range(1, len(ds) + 1)`, vòng lặp sẽ chạy đến `i = 4`, trong khi phần tử cuối cùng của danh sách 4 phần tử chỉ có chỉ số là `3`. Do đó bị văng lỗi `IndexError: list index out of range`.
2. Bị bỏ sót phần tử đầu tiên tại `ds[0]`.

**Đoạn code sửa đúng:**
```python
# Doan code da sua dung:
ds = [5, 10, 15, 20]
for i in range(len(ds)):
    print("Vi tri", i, "co gia tri la:", ds[i])
```

Kết quả mẫu:
```text
Vi tri 0 co gia tri la: 5
Vi tri 1 co gia tri la: 10
Vi tri 2 co gia tri la: 15
Vi tri 3 co gia tri la: 20
```
</details>

---

### Mức 3: Tự viết (Thử thách sát đề thi)
**Đề bài:** Viết hàm `lay_nua_dau(ds)` nhận vào một danh sách `ds`. 
- Hàm trả về một danh sách mới chứa nửa đầu các phần tử của `ds`. (Ví dụ: danh sách có 5 phần tử thì lấy 2 phần tử đầu, danh sách có 6 phần tử thì lấy 3 phần tử đầu).
- Nếu danh sách rỗng, trả về danh sách rỗng `[]`.
- Viết chương trình chính để kiểm tra hàm với danh sách `ds = [2, 4, 6, 8, 10]`.

<details>
<summary>👉 Xem đáp án Mức 3</summary>

```python
# Muc 3: Ham cat lay nua dau cua danh sach
def lay_nua_dau(ds):
    if len(ds) == 0:
        return []
    vi_tri_giua = len(ds) // 2
    kq = ds[:vi_tri_giua]
    return kq

# Chuong trinh chinh:
ds = [2, 4, 6, 8, 10]
nua_dau = lay_nua_dau(ds)
print("Danh sach goc:", ds)
print("Nua dau cua danh sach:", nua_dau)
```

Kết quả mẫu:
```text
Danh sach goc: [2, 4, 6, 8, 10]
Nua dau cua danh sach: [2, 4]
```
</details>

---

## 7. Tóm tắt 5 dòng và 3 câu tự kiểm tra

### 5 dòng cốt lõi cần nhớ:
1. **Toa tàu bắt đầu từ 0:** Phần tử đầu tiên luôn là `ds[0]`, phần tử cuối cùng luôn là `ds[-1]`.
2. **Số lượng phần tử:** Dùng `len(ds)` để biết danh sách có bao nhiêu phần tử; danh sách rỗng có `len(ds) == 0`.
3. **Cắt lát `ds[a:b]`:** Lấy từ vị trí `a` đến trước vị trí `b` (tức `b - 1`), không làm biến đổi danh sách gốc.
4. **Nhập chuỗi thành list:** Dùng `s.split(",")` để cắt chuỗi thành từng mảnh, rồi dùng `strip()` và `int()` đưa vào list.
5. **Cảnh giác `IndexError`:** Tuyệt đối không truy cập `ds[i]` khi chưa chắc chắn `0 <= i < len(ds)`.

### 3 câu tự kiểm tra trước khi sang Bài 6:
1. Nếu `ds = [10, 20, 30]`, câu lệnh `print(ds[3])` sẽ xảy ra chuyện gì?
2. Câu lệnh `ds[ : 3]` và `ds[3 : ]` có ý nghĩa cắt lát như thế nào?
3. Tại sao trong hàm chuyển chuỗi thành list ta nên dùng `try - except ValueError`?
