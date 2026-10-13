# Bài 9: Chuỗi ký tự (String) Phần 2: Các bài toán thực chiến phòng thi

## 1. Câu chuyện đời sống: Tấm gương soi và Người biên tập bản thảo

Trong đời sống và trong đề thi Tin học, bạn sẽ gặp hai bài toán xử lý văn bản cực kỳ thú vị:

![](assets/media/python/N9-SOI-GUONG-PALINDROME.svg)

1. **Tấm gương soi (Chuỗi đối xứng - Palindrome):**
   Hãy nhìn dòng chữ `"radar"` hoặc `"madam"`. Khi bạn đọc từ trái qua phải hay đọc ngược từ phải qua trái, nó đều giống hệt nhau như soi gương. Nhưng nếu bạn viết `"Radar"` (chữ R đầu viết hoa) mà không đổi sang chữ thường trước khi soi gương, máy tính sẽ bảo là sai ngay!
2. **Người biên tập bản thảo (Chuẩn hóa văn bản):**
   Một người gõ bàn phím gửi cho bạn một cái tên cẩu thả: `"   hoang   ngoc   bAcH  "`. 
   Nhiệm vụ của người biên tập là: Cắt bỏ mọi dấu cách vô duyên, gọt từng từ cho ngay ngắn, và viết hoa đúng chữ cái đầu tiên của mỗi từ để biến thành: `"Hoang Ngoc Bach"`.

---

## 2. Ví dụ nhỏ nhất (3–5 dòng code)

Kiểm tra một chuỗi có phải là chuỗi đối xứng (Palindrome) hay không:

```python
# Kiem tra chuoi doi xung
s = "radar"
la_doi_xung = (s == s[::-1])
print("Co doi xung khong:", la_doi_xung)
```

Kết quả thực tế khi chạy:

```text
Ket qua man hinh:
Co doi xung khong: True
```

---

## 3. Đoán trước kết quả, rồi chạy thử

Quan sát kỹ đoạn code sau đây:

```python
# Doan ket qua truoc khi chay
s = "Madam"
kq = (s == s[::-1])
print(kq)
```

Khi chạy chương trình, kết quả in ra là `True` hay `False`?

<details>
<summary>👉 Bấm vào đây để xem đáp án và giải thích chi tiết</summary>

**Đáp án:** Kết quả in ra là `False`!

**Giải thích vì sao:**
- Chuỗi `s` là `"Madam"`.
- Chuỗi đảo ngược `s[::-1]` là `"madaM"` (chữ `M` hoa nằm ở cuối, chữ `m` thường ở đầu).
- Trong máy tính, chữ hoa và chữ thường có mã nhị phân hoàn toàn khác nhau (`'M' != 'm'`), nên phép so sánh trả về `False`.

**Bí quyết phòng thi:** Trước khi kiểm tra đối xứng, bắt buộc phải đưa toàn bộ chuỗi về chữ thường bằng `.lower()` và loại bỏ khoảng trắng!
```python
s_chuan = s.lower()
kq = (s_chuan == s_chuan[::-1])
```
</details>

---

## 4. Lỗi thường gặp: Thông báo lỗi nguyên văn và cách sửa

### Lỗi 1: `IndexError: list index out of range` khi chuẩn hóa chuỗi rỗng
- **Nguyên văn thông báo:**
```text
IndexError: list index out of range
```
- **Bản chất lỗi:** Người dùng chỉ ấn Enter hoặc gõ toàn dấu cách `"    "`. Khi gọi `cac_tu = s.split()`, danh sách thu được là `[]` (rỗng). Nếu bạn vội vàng truy cập `cac_tu[0]` để tìm từ đầu tiên thì sẽ bị văng lỗi này.
- **Cách sửa:** Luôn kiểm tra `if len(cac_tu) == 0: return ""` trước khi xử lý.

---

### Lỗi 2: Sai sót khi đếm số lượng từ bằng đếm khoảng trắng
- **Biểu hiện:** Bạn đếm số từ bằng công thức `so_tu = s.count(" ") + 1`. Nếu người dùng gõ 3 dấu cách liên tiếp giữa 2 từ, công thức này sẽ đếm sai hoàn toàn.
- **Cách sửa:** Luôn dùng `len(s.split())`. Phương thức `split()` không tham số tự động gộp mọi khoảng trắng thừa liên tiếp thành 1 dấu phân cách duy nhất.

---

## 5. Khuôn mẫu cho đề thi: Đoạn code "Copy – Hiểu – Sửa"

Dưới đây là bộ các hàm xử lý văn bản thực chiến thường gặp trong đề thi:

### File `thuvien.py`:
```python
# thuvien.py - Cac ham xu ly van ban chuyen sau

def kiem_tra_doi_xung(s):
    # Kiem tra chuoi doi xung khong phan biet hoa thuong va bo dau cach
    if s is None or len(s) == 0:
        return True
    cac_ky_tu = "".join(s.lower().split())
    return cac_ky_tu == cac_ky_tu[::-1]


def chuan_hoa_ho_ten(s):
    # Viet hoa chu cai dau moi tu, cac chu con lai viet thuong
    if s is None or s.strip() == "":
        return ""
    cac_tu = s.strip().split()
    tu_chuan = []
    for tu in cac_tu:
        # capitalize() tu dong viet hoa chu dau va viet thuong chu sau
        tu_chuan.append(tu.capitalize())
    return " ".join(tu_chuan)


def tim_tu_dai_nhat(s):
    # Tim tu co do dai lon nhat trong cau
    cac_tu = s.strip().split()
    if len(cac_tu) == 0:
        return ""
    tu_max = cac_tu[0]
    for tu in cac_tu:
        if len(tu) > len(tu_max):
            tu_max = tu
    return tu_max


def trich_xuat_cac_chu_so(s):
    # Rut toan bo cac ky tu chu so trong chuoi thanh list so nguyen
    kq = []
    for kt in s:
        if kt.isdigit():
            kq.append(int(kt))
    return kq


def dem_nguyen_am_va_phu_am(s):
    # Dem so nguyen am (u, e, o, a, i) va phu am tieng Anh co ban
    nguyen_am = "ueoai"
    dem_na = 0
    dem_pa = 0
    for kt in s.lower():
        if kt.isalpha(): # Kiem tra la chu cai
            if kt in nguyen_am:
                dem_na = dem_na + 1
            else:
                dem_pa = dem_pa + 1
    return dem_na, dem_pa
```

### File `main.py`:
```python
# main.py
import thuvien

# 1. Kiem tra doi xung
cau_test = "Madam"
if thuvien.kiem_tra_doi_xung(cau_test):
    print("'" + cau_test + "' la chuoi doi xung")
else:
    print("'" + cau_test + "' khong doi xung")

# 2. Chuan hoa ho ten
ten_xau = "   hoang   ngoc   bAcH  "
ten_dep = thuvien.chuan_hoa_ho_ten(ten_xau)
print("Ho ten sau chuan hoa:", repr(ten_dep))

# 3. Tim tu dai nhat
cau = "Hoc lap trinh Python cuc ky tuyet voi"
tu_max = thuvien.tim_tu_dai_nhat(cau)
print("Tu dai nhat la:", tu_max, "(Do dai:", len(tu_max), ")")

# 4. Trich xuat so
ma_lop = "EPU-2026-K18"
ds_so = thuvien.trich_xuat_cac_chu_so(ma_lop)
print("Cac chu so trich xuat:", ds_so)
```

Kết quả mẫu khi chạy:
```text
'Madam' la chuoi doi xung
Ho ten sau chuan hoa: 'Hoang Ngoc Bach'
Tu dai nhat la: Python (Do dai: 6 )
Cac chu so trich xuat: [2, 0, 2, 6, 1, 8]
```

---

## 6. Bài tập 3 mức (Làm theo – Sửa lại – Tự viết)

### Mức 1: Làm theo (Gõ lại chính xác để quen tay)
**Đề bài:** Nhập vào một chuỗi `s`. Đếm xem có bao nhiêu ký tự là chữ số (`isdigit()`) và bao nhiêu ký tự là chữ cái (`isalpha()`).

<details>
<summary>👉 Xem đáp án Mức 1</summary>

```python
# Muc 1: Dem chu cai va chu so
s = input("Nhap chuoi: ")
dem_chu = 0
dem_so = 0

for kt in s:
    if kt.isalpha():
        dem_chu = dem_chu + 1
    elif kt.isdigit():
        dem_so = dem_so + 1

print("So luong chu cai:", dem_chu)
print("So luong chu so:", dem_so)
```

Kết quả mẫu khi nhập `Python3.11-2026`:
```text
Nhap chuoi: Python3.11-2026
So luong chu cai: 6
So luong chu so: 7
```
</details>

---

### Mức 2: Sửa lại (Tìm và vá lỗi đoạn code hỏng)
**Đề bài:** Một bạn học sinh viết hàm đếm số từ trong câu như sau:
```python
# Doan code loi:
def dem_so_tu(s):
    return len(s.split(" "))
```
Khi chạy với câu `s = "Hoc   Python"`, hàm trả về kết quả là `4` từ thay vì `2` từ. Hãy giải thích và sửa lại cho đúng.

<details>
<summary>👉 Xem đáp án Mức 2</summary>

**Nguyên nhân sai:**
Khi truyền tham số dấu cách `" "` vào hàm `s.split(" ")`, Python sẽ cắt chính xác theo từng ký tự cách đơn lẻ. Nếu có 3 dấu cách liên tiếp, nó sẽ sinh ra 2 chuỗi rỗng `""` nằm giữa, làm số lượng phần tử tăng ảo.

**Cách sửa:**
Gọi `.split()` **không truyền tham số nào**. Python sẽ tự động gom nhóm mọi khoảng trắng (dấu cách, tab, xuống dòng) lại làm một:
```python
# Doan code sua dung:
def dem_so_tu(s):
    if s is None or s.strip() == "":
        return 0
    return len(s.split())

s = "Hoc   Python"
print("So tu dung la:", dem_so_tu(s))
```

Kết quả mẫu:
```text
So tu dung la: 2
```
</details>

---

### Mức 3: Tự viết (Thử thách sát đề thi)
**Đề bài:** Viết hàm `dao_nguoc_tung_tu(s)` nhận vào một câu văn. Hàm trả về câu văn mới trong đó **thứ tự các từ vẫn giữ nguyên**, nhưng **các ký tự trong từng từ đều bị đảo ngược**.
*(Ví dụ: `"Xin chao ban"` sẽ biến thành `"niX oahc nab"`).*

<details>
<summary>👉 Xem đáp án Mức 3</summary>

```python
# Muc 3: Dao nguoc cac ky tu trong tung tu
def dao_nguoc_tung_tu(s):
    if s is None or s.strip() == "":
        return ""
    cac_tu = s.strip().split()
    tu_dao = []
    for tu in cac_tu:
        tu_dao.append(tu[::-1])
    return " ".join(tu_dao)

# Chuong trinh chinh:
cau = "Xin chao ban"
kq = dao_nguoc_tung_tu(cau)
print("Cau goc:", cau)
print("Cau sau khi dao tung tu:", kq)
```

Kết quả mẫu:
```text
Cau goc: Xin chao ban
Cau sau khi dao tung tu: niX oahc nab
```
</details>

---

## 7. Tóm tắt 5 dòng và 3 câu tự kiểm tra

### 5 dòng cốt lõi cần nhớ:
1. **Kiểm tra đối xứng:** Đưa về chữ thường `.lower()`, gộp không dấu cách, rồi so sánh `s == s[::-1]`.
2. **Chuẩn hóa chữ hoa chữ thường:** Dùng `tu.capitalize()` để chữ cái đầu viết hoa, các chữ sau tự động thành chữ thường.
3. **Đếm từ chuẩn xác:** Luôn dùng `len(s.split())` không truyền tham số để loại trừ dấu cách thừa.
4. **Hàm nhận diện ký tự:** `kt.isdigit()` kiểm tra chữ số, `kt.isalpha()` kiểm tra chữ cái.
5. **Đo độ dài từ:** Duyệt qua từng từ trong `s.split()` và so sánh `len(tu)` để tìm từ dài nhất/ngắn nhất.

### 3 câu tự kiểm tra trước khi sang Bài 10:
1. Từ `"Level"` có phải là chuỗi đối xứng không nếu bạn không dùng hàm `.lower()` trước khi so sánh?
2. Sự khác nhau giữa `s.capitalize()` và `s.title()` là gì?
3. Làm thế nào để lọc ra tất cả các chữ số trong một chuỗi ký tự mà không làm sập chương trình nếu gặp chữ cái?
