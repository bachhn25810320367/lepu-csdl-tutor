# Bài 8: Chuỗi ký tự (String) Phần 1: Chỉ số, Cắt lát và Các phương thức xử lý văn bản cốt lõi

## 1. Câu chuyện đời sống: Chuỗi hạt cườm khắc chữ và Kéo cắt băng dính

Hãy tưởng tượng bạn đang cầm trên tay một **chuỗi hạt cườm** được xâu sẵn trên một sợi cước kim loại:

![](assets/media/python/N8-CHUOI-HAT-CUOM-STRING.svg)

1. **Mỗi hạt là một ký tự:** Ký tự đầu tiên ở vị trí số `0`, ký tự cuối cùng ở vị trí `-1`. Bạn có thể dùng thước đo xem chuỗi dài bao nhiêu hạt bằng `len(s)`.
2. **ĐẶC ĐIỂM SỐNG CÒN — Chuỗi không thể bị đập vỡ để sửa:**
   Chuỗi hạt cườm này đã được đúc đặc bằng thủy tinh. Bạn **KHÔNG THỂ gỡ một hạt ra để nhét hạt khác vào** (lệnh gán `s[0] = 'A'` sẽ lập tức làm vỡ tan và báo lỗi sập chương trình!).
3. **Cách duy nhất để sửa chữ:** Bạn phải xâu một chuỗi hạt mới toanh. Mọi thao tác như viết hoa, cắt tỉa khoảng trắng hay thay thế chữ đều sẽ **tạo ra một chuỗi mới**, trong khi chuỗi ban đầu vẫn nằm nguyên vẹn.

---

## 2. Ví dụ nhỏ nhất (3–5 dòng code)

Dọn dẹp khoảng trắng thừa và chuyển toàn bộ văn bản về chữ in hoa:

```python
# Don sach khoang trang va chuyen thanh chu in hoa
s = "   xin chao cac ban   "
s_sach = s.strip()
s_hoa = s_sach.upper()
print(s_hoa)
```

Kết quả thực tế khi chạy:

```text
Ket qua man hinh:
XIN CHAO CAC BAN
```

---

## 3. Đoán trước kết quả, rồi chạy thử

Quan sát kỹ đoạn code sau đây:

```python
# Doan ket qua truoc khi chay
s = "python"
s.replace("p", "P")
print(s)
```

Khi chạy chương trình, màn hình sẽ in ra `"Python"` (chữ P viết hoa) hay vẫn in ra `"python"` (chữ p viết thường)?

<details>
<summary>👉 Bấm vào đây để xem đáp án và giải thích chi tiết</summary>

**Đáp án:** Màn hình vẫn in ra `"python"` chữ thường!

**Giải thích vì sao:**
Như ẩn dụ chuỗi hạt cườm ở trên: **Chuỗi trong Python là bất biến (không thể sửa đổi tại chỗ)**.
Phương thức `s.replace("p", "P")` tính toán và tạo ra một chuỗi mới mang giá trị `"Python"`. Nhưng vì bạn **quên hứng lấy kết quả đó vào một biến**, nên chuỗi mới lập tức bị bỏ đi và biến `s` ban đầu vẫn giữ nguyên giá trị cũ!

**Cách viết đúng:** Phải gán lại vào biến:
```python
s = s.replace("p", "P")
```
</details>

---

## 4. Lỗi thường gặp: Thông báo lỗi nguyên văn và cách sửa

### Lỗi 1: `TypeError: 'str' object does not support item assignment`
- **Nguyên văn thông báo:**
```text
TypeError: 'str' object does not support item assignment
```
- **Bản chất lỗi:** Cố tình thay thế một ký tự trong chuỗi bằng chỉ số (ví dụ: `s[0] = 'H'`). Trong List bạn làm được điều này (`ds[0] = 10`), nhưng với Chuỗi (`str`) thì bị cấm tuyệt đối.
- **Cách sửa:** Ghép chuỗi mới bằng cắt lát hoặc dùng hàm `replace()`:
```python
# Sai:
s[0] = 'H'

# Dung (ghep ky tu moi voi phan con lai):
s = 'H' + s[1:]
```

---

### Lỗi 2: `ValueError: substring not found` khi tìm kiếm chữ
- **Nguyên văn thông báo:**
```text
ValueError: substring not found
```
- **Bản chất lỗi:** Bạn dùng phương thức `s.index("tu_khoa")` để tìm vị trí, nhưng từ khóa đó không có trong chuỗi.
- **Cách sửa:** Luôn dùng phương thức `s.find("tu_khoa")`. Nếu tìm thấy, `find()` trả về vị trí xuất hiện đầu tiên; nếu không tìm thấy, `find()` trả về `-1` an toàn mà không làm sập chương trình.

---

### Lỗi 3: Quên gán lại biến khi gọi phương thức chuỗi
- **Bản chất:** Viết `s.strip()`, `s.lower()`, `s.replace()` mà không gán lại `s = ...`.
- **Cách sửa:** Luôn nhớ công thức: `s = s.ten_phuong_thuc(...)`.

---

## 5. Khuôn mẫu cho đề thi: Đoạn code "Copy – Hiểu – Sửa"

Bảng phương thức xử lý chuỗi "bảo bối" trong phòng thi:
- `.strip()` : Cắt bỏ khoảng trắng thừa ở cả hai đầu chuỗi.
- `.lower()` : Đổi toàn bộ thành chữ thường (`"Ha Noi"` -> `"ha noi"`).
- `.upper()` : Đổi toàn bộ thành chữ hoa (`"ha noi"` -> `"HA NOI"`).
- `.count(sub)` : Đếm số lần xuất hiện của chuỗi con `sub`.
- `.find(sub)` : Tìm vị trí đầu tiên của `sub`, không có trả về `-1`.
- `.replace(cu, moi)` : Thay thế tất cả từ cũ bằng từ mới.
- `.split()` : Cắt chuỗi thành danh sách các từ.
- `"-".join(ds)` : Nối danh sách các từ lại thành chuỗi, ngăn cách bởi ký tự `"-"`.

### File `thuvien.py`:
```python
# thuvien.py - Cac ham xu ly chuoi co ban

def chuan_hoa_khoang_trang(s):
    # Cat khoang trang thua o hai dau va giua cac tu
    cac_tu = s.split() # Tu dong tach theo moi khoang trang thua
    s_sach = " ".join(cac_tu)
    return s_sach


def dem_ky_tu_trong_chuoi(s, ky_tu):
    # Dem so lan xuat hien cua mot ky tu (khong phan biet hoa thuong)
    s_thuong = s.lower()
    kt_thuong = ky_tu.lower()
    return s_thuong.count(kt_thuong)


def tim_va_thay_the(s, tu_cu, tu_moi):
    # Thay the tat ca tu_cu bang tu_moi trong chuoi
    kq = s.replace(tu_cu, tu_moi)
    return kq
```

### File `main.py`:
```python
# main.py
import thuvien

s = "   Truong   Dai   Hoc   Dien   Luc   "
print("Chuoi goc:", repr(s))

# 1. Chuan hoa khoang trang
s_sach = thuvien.chuan_hoa_khoang_trang(s)
print("Sau khi lam sach:", repr(s_sach))

# 2. Dem so lan xuat hien ky tu 'h'
dem = thuvien.dem_ky_tu_trong_chuoi(s_sach, "h")
print("So luong chu 'h' (ca hoa va thuong):", dem)

# 3. Thay the tu
s_moi = thuvien.tim_va_thay_the(s_sach, "Dien Luc", "EPU")
print("Chuoi sau khi thay the:", s_moi)
```

Kết quả mẫu khi chạy:
```text
Chuoi goc: '   Truong   Dai   Hoc   Dien   Luc   '
Sau khi lam sach: 'Truong Dai Hoc Dien Luc'
So luong chu 'h' (ca hoa va thuong): 2
Chuoi sau khi thay the: Truong Dai Hoc EPU
```

---

## 6. Bài tập 3 mức (Làm theo – Sửa lại – Tự viết)

### Mức 1: Làm theo (Gõ lại chính xác để quen tay)
**Đề bài:** Viết chương trình nhập vào một câu văn `s`. Hãy in ra:
1. Độ dài của câu văn (tính cả dấu cách).
2. Toàn bộ câu văn viết bằng chữ in hoa.
3. Số lượng từ có trong câu văn (gợi ý: dùng `s.split()`).

<details>
<summary>👉 Xem đáp án Mức 1</summary>

```python
# Muc 1: Thao tac chuoi co ban
s = input("Nhap cau van: ")
s_sach = s.strip()

print("Do dai cua cau:", len(s_sach))
print("Viet in hoa:", s_sach.upper())

cac_tu = s_sach.split()
print("So luong tu:", len(cac_tu))
```

Kết quả mẫu:
```text
Nhap cau van: Hoc lap trinh Python rat vui
Do dai cua cau: 28
Viet in hoa: HOC LAP TRINH PYTHON RAT VUI
So luong tu: 6
```
</details>

---

### Mức 2: Sửa lại (Tìm và vá lỗi đoạn code hỏng)
**Đề bài:** Một bạn học sinh viết hàm thay đổi chữ cái đầu tiên của câu thành chữ hoa nhưng bị văng lỗi `TypeError`. Hãy sửa lại cho đúng:

```python
# Doan code loi:
def viet_hoa_chu_dau(s):
    if len(s) > 0:
        s[0] = s[0].upper()
    return s
```

<details>
<summary>👉 Xem đáp án Mức 2</summary>

**Nguyên nhân sai:**
Chuỗi là đối tượng bất biến, không thể gán trực tiếp `s[0] = ...`.

**Đoạn code sửa đúng:**
Cắt ký tự đầu viết hoa, rồi nối với phần đuôi còn lại từ vị trí 1:
```python
# Doan code sua dung:
def viet_hoa_chu_dau(s):
    if len(s) == 0:
        return ""
    kq = s[0].upper() + s[1:]
    return kq

s = "python la ngon ngu tuyet voi"
print(viet_hoa_chu_dau(s))
```

Kết quả mẫu:
```text
Python la ngon ngu tuyet voi
```
</details>

---

### Mức 3: Tự viết (Thử thách sát đề thi)
**Đề bài:** Viết hàm `che_mat_khau(s)` nhận vào một chuỗi mật khẩu `s`.
- Nếu độ dài chuỗi nhỏ hơn hoặc bằng 3: trả về chuỗi toàn dấu sao `*` có cùng độ dài.
- Nếu độ dài lớn hơn 3: chỉ giữ lại ký tự đầu tiên và ký tự cuối cùng, toàn bộ các ký tự ở giữa bị thay bằng dấu `*`.
*(Ví dụ: `"epu2026"` có 7 ký tự -> kết quả là `"e*****6"`).*

<details>
<summary>👉 Xem đáp án Mức 3</summary>

```python
# Muc 3: Che mat khau bang ky tu sao
def che_mat_khau(s):
    if s is None or len(s) == 0:
        return ""
    dai = len(s)
    if dai <= 3:
        return "*" * dai
    
    so_sao = dai - 2
    kq = s[0] + ("*" * so_sao) + s[-1]
    return kq

# Chuong trinh chinh:
mk = "epu2026"
print("Mat khau goc:", mk)
print("Mat khau che:", che_mat_khau(mk))
```

Kết quả mẫu:
```text
Mat khau goc: epu2026
Mat khau che: e*****6
```
</details>

---

## 7. Tóm tắt 5 dòng và 3 câu tự kiểm tra

### 5 dòng cốt lõi cần nhớ:
1. **Chuỗi bất biến:** Không thể sửa ký tự bằng `s[i] = 'x'`; mọi thao tác đều phải tạo chuỗi mới và gán lại `s = ...`.
2. **Cắt tỉa khoảng trắng:** `s.strip()` dọn sạch hai đầu; `s.split()` gom từ và tự dọn mọi khoảng trắng thừa ở giữa.
3. **Tìm kiếm an toàn:** Luôn dùng `s.find()` thay vì `s.index()` để tránh bị văng lỗi khi từ khóa không tồn tại.
4. **Thay thế toàn bộ:** `s.replace(cu, moi)` thay thế tất cả mọi từ cũ thành từ mới trong toàn bộ chuỗi.
5. **Nối danh sách thành chuỗi:** Dùng `"ky_tu_noi".join(danh_sach_chuoi)`.

### 3 câu tự kiểm tra trước khi sang Bài 9:
1. Điều gì xảy ra khi bạn chạy câu lệnh `s = "abc"; s[1] = "x"`?
2. Hàm `s.find("python")` sẽ trả về giá trị gì nếu trong chuỗi `s` không có chữ `"python"`?
3. Sự khác nhau giữa `s.split(",")` và `s.split()` (không truyền tham số) là gì?
