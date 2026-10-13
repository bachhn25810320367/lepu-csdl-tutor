# Bài 11: Từ điển (Dictionary): Cặp Khóa - Giá trị và Đếm tần suất xuất hiện

## 1. Câu chuyện đời sống: Danh bạ điện thoại và Quyển từ điển Anh - Việt

Hãy tưởng tượng bạn đang mở ứng dụng **Danh bạ điện thoại** trên máy bay:

![](assets/media/python/minh_bit/bai11_contact_book_dict.jpg)

1. **Khóa (Key) - Cái tên bạn cần tìm:** 
   Trong danh bạ có hàng nghìn số điện thoại, bạn không thể nhớ số của mẹ bạn nằm ở vị trí thứ `15` hay thứ `300` như cách đánh chỉ số của List. Thay vào đó, bạn chỉ cần gõ đúng cái tên: `"Me"`.
2. **Giá trị (Value) - Dữ liệu đi kèm:** 
   Ngay khi bạn gọi `"Me"`, điện thoại sẽ hiện ra dãy số: `"0912345678"`.
3. **Cặp Khóa - Giá trị (`Key: Value`):**
   Trong Python, cấu trúc dữ liệu lưu trữ theo cặp nhãn tên và giá trị như thế này được gọi là **Dictionary (Từ điển)**. Bạn tra cứu thông qua một cái tên (Key) chứ không phụ thuộc vào vị trí số `0, 1, 2`.

---

## 2. Ví dụ nhỏ nhất (3–5 dòng code)

![](assets/media/python/minh_bit/app_shopee_coupon_dict.jpg)

Tạo một từ điển kho mã giảm giá hoặc bảng tra cứu và tìm kiếm theo Key:

```python
# Tao tu dien va tra cuu diem
bang_diem = {"toan": 8.5, "tin": 9.5, "van": 7.0}
mon = "tin"
print("Diem mon", mon, "la:", bang_diem[mon])
```

Kết quả thực tế khi chạy:

```text
Ket qua man hinh:
Diem mon tin la: 9.5
```

---

## 3. Đoán trước kết quả, rồi chạy thử

Quan sát kỹ đoạn code dưới đây:

```python
# Doan ket qua truoc khi chay
thong_tin = {"ten": "Bach", "lop": "12A1"}
print(thong_tin.get("diem", "Chua co diem"))
print(thong_tin["diem"])
```

Hai dòng lệnh `print` trên sẽ in ra kết quả như thế nào?

<details>
<summary>👉 Bấm vào đây để xem đáp án và giải thích chi tiết</summary>

**Đáp án:** 
- Dòng 1 in ra: `Chua co diem`
- Dòng 2 lập tức làm chương trình sụp đổ với lỗi đỏ rực: `KeyError: 'diem'`!

**Giải thích cơ chế an toàn với `get()`:**
- Khóa `"diem"` hoàn toàn chưa có trong từ điển `thong_tin`.
- Khi dùng cú pháp ngoặc vuông `thong_tin["diem"]`, Python tìm không thấy nhãn tên này và lập tức ném ra lỗi `KeyError`.
- Khi dùng phương thức `.get(khoa, gia_tri_mac_dinh)`, nếu không tìm thấy khóa, Python sẽ trả về giá trị mặc định dự phòng mà **không hề gây lỗi**.

**Kinh nghiệm phòng thi:** Luôn ưu tiên dùng `.get()` hoặc kiểm tra `if khoa in tu_dien:` trước khi truy cập!
</details>

---

## 4. Lỗi thường gặp: Thông báo lỗi nguyên văn và cách sửa

### Lỗi 1: `KeyError: 'khoa_khong_ton_tai'`

![](assets/media/python/minh_bit/err_key_error.jpg)
- **Nguyên văn thông báo:**
```text
KeyError: 'diem'
```
- **Bản chất lỗi:** Truy cập trực tiếp vào một Khóa (Key) không tồn tại bằng cú pháp `d[key]`.
- **Cách sửa:**
```python
# Cach 1: Kiem tra khoa truoc khi truy cap
if "diem" in thong_tin:
    print(thong_tin["diem"])
else:
    print("Khong tim thay")

# Cach 2: Dung phuong thuc get() co gia tri mac dinh
print(thong_tin.get("diem", 0))
```

---

### Lỗi 2: Trùng lặp Khóa (Key) làm mất dữ liệu
- **Bản chất:** Trong một từ điển, **các Khóa (Key) bắt buộc phải là duy nhất**. Nếu bạn cố tình khai báo hai khóa giống nhau:
```python
d = {"a": 1, "a": 5}
```
Lúc này giá trị sau (`5`) sẽ ghi đè và xóa sổ hoàn toàn giá trị trước (`1`).

---

## 5. Khuôn mẫu cho đề thi: Đoạn code "Copy – Hiểu – Sửa"

![](assets/media/python/minh_bit/game_rpg_stats_dict.jpg)

Trong đề thi thực hành, ứng dụng mạnh nhất của Dictionary là: **Đếm tần suất xuất hiện của các phần tử** (mỗi phần tử xuất hiện bao nhiêu lần, phần tử nào xuất hiện nhiều nhất).

### File `thuvien.py`:
```python
# thuvien.py - Cac ham su dung Tu dien de dem tan suat

def dem_tan_suat_xuat_hien(ds):
    # Dem so lan xuat hien cua tung phan tu trong danh sach
    tan_suat = {}
    for x in ds:
        # Neu x da co trong tu dien thi tang them 1, neu chua thi lay 0 + 1
        tan_suat[x] = tan_suat.get(x, 0) + 1
    return tan_suat


def tim_phan_tu_xuat_hien_nhieu_nhat(ds):
    # Tim phan tu co so lan xuat hien cao nhat
    if len(ds) == 0:
        return None, 0
        
    tan_suat = dem_tan_suat_xuat_hien(ds)
    
    pt_max = ds[0]
    so_lan_max = 0
    
    # Duyet qua cac cap (khoa, gia_tri) trong tu dien
    for pt, so_lan in tan_suat.items():
        if so_lan > so_lan_max:
            so_lan_max = so_lan
            pt_max = pt
            
    return pt_max, so_lan_max
```

### File `main.py`:
```python
# main.py
import thuvien

ds = [3, 5, 3, 2, 8, 3, 5, 9, 5, 5]
print("Danh sach cac so:", ds)

# 1. Thong ke tan suat
tan_suat = thuvien.dem_tan_suat_xuat_hien(ds)
print("Bang dem so lan xuat hien:")
for so, so_lan in tan_suat.items():
    print("So", so, "xuat hien:", so_lan, "lan")

# 2. Tim phan tu xuat hien nhieu nhat
pt, so_lan = thuvien.tim_phan_tu_xuat_hien_nhieu_nhat(ds)
print("Phan tu xuat hien nhieu nhat la so", pt, "voi", so_lan, "lan")
```

Kết quả mẫu khi chạy:
```text
Danh sach cac so: [3, 5, 3, 2, 8, 3, 5, 9, 5, 5]
Bang dem so lan xuat hien:
So 3 xuat hien: 3 lan
So 5 xuat hien: 4 lan
So 2 xuat hien: 1 lan
So 8 xuat hien: 1 lan
So 9 xuat hien: 1 lan
Phan tu xuat hien nhieu nhat la so 5 voi 4 lan
```

---

## 6. Bài tập 3 mức (Làm theo – Sửa lại – Tự viết)

### Mức 1: Làm theo (Gõ lại chính xác để quen tay)
**Đề bài:** Nhập vào một chuỗi văn bản `s`. Hãy đếm xem mỗi ký tự chữ cái trong chuỗi xuất hiện bao nhiêu lần (bỏ qua dấu cách). In bảng kết quả ra màn hình.

<details>
<summary>👉 Xem đáp án Mức 1</summary>

```python
# Muc 1: Dem tan suat ky tu trong chuoi
s = input("Nhap chuoi van ban: ")
dem_kt = {}

for kt in s:
    if kt != " ":
        dem_kt[kt] = dem_kt.get(kt, 0) + 1

print("Ket qua dem ky tu:")
for kt, so_lan in dem_kt.items():
    print("Ky tu '" + kt + "' xuat hien:", so_lan, "lan")
```

Kết quả mẫu khi nhập `"lap trinh"`:
```text
Nhap chuoi van ban: lap trinh
Ket qua dem ky tu:
Ky tu 'l' xuat hien: 1 lan
Ky tu 'a' xuat hien: 1 lan
Ky tu 'p' xuat hien: 1 lan
Ky tu 't' xuat hien: 1 lan
Ky tu 'r' xuat hien: 1 lan
Ky tu 'i' xuat hien: 1 lan
Ky tu 'n' xuat hien: 1 lan
Ky tu 'h' xuat hien: 1 lan
```
</details>

---

### Mức 2: Sửa lại (Tìm và vá lỗi đoạn code hỏng)
**Đề bài:** Một bạn học sinh viết hàm tra cứu thông tin giá tiền của một món hàng từ danh sách thực đơn, nhưng nếu khách hỏi món không có trong thực đơn thì chương trình bị văng lỗi `KeyError`. Hãy sửa lại cho đúng:

```python
# Doan code loi:
thuc_don = {"tra sua": 25000, "ca phe": 20000, "nuoc cam": 30000}
mon_hoi = input("Nhap mon muon goi: ")
gia = thuc_don[mon_hoi]
print("Gia tien la:", gia)
```

<details>
<summary>👉 Xem đáp án Mức 2</summary>

**Nguyên nhân sai:**
Nếu khách nhập `"tra dao"` (không có trong thực đơn), lệnh `thuc_don[mon_hoi]` sẽ lập tức ném lỗi `KeyError`.

**Đoạn code sửa đúng:**
```python
# Doan code sua dung:
thuc_don = {"tra sua": 25000, "ca phe": 20000, "nuoc cam": 30000}
mon_hoi = input("Nhap mon muon goi: ").strip().lower()

if mon_hoi in thuc_don:
    print("Gia tien la:", thuc_don[mon_hoi], "VND")
else:
    print("Xin loi, quan khong co mon nay trong thuc don")
```

Kết quả mẫu khi nhập `"tra dao"`:
```text
Nhap mon muon goi: tra dao
Xin loi, quan khong co mon nay trong thuc don
```
</details>

---

### Mức 3: Tự viết (Đếm số từ phân biệt trong đoạn văn)
**Đề bài:** Viết hàm `dem_tan_suat_tu(s)` nhận vào một đoạn văn bản `s`. 
- Hàm tách đoạn văn thành các từ (chuyển hết về chữ thường để không phân biệt hoa thường).
- Trả về một từ điển lưu số lần xuất hiện của từng từ.
- Viết chương trình chính in ra từ nào xuất hiện nhiều nhất trong đoạn văn đó.

<details>
<summary>👉 Xem đáp án Mức 3</summary>

```python
# Muc 3: Thong ke tu xuat hien nhieu nhat trong doan van
def dem_tan_suat_tu(s):
    if s is None or s.strip() == "":
        return {}
    cac_tu = s.strip().lower().split()
    tan_suat = {}
    for tu in cac_tu:
        tan_suat[tu] = tan_suat.get(tu, 0) + 1
    return tan_suat

# Chuong trinh chinh:
doan_van = "Hoc lap trinh hoc nua hoc mai lap trinh cuc ky vui"
kq = dem_tan_suat_tu(doan_van)

tu_nhieu_nhat = ""
so_lan_max = 0
for tu, so_lan in kq.items():
    if so_lan > so_lan_max:
        so_lan_max = so_lan
        tu_nhieu_nhat = tu

print("Bang tan suat cac tu:", kq)
print("Tu xuat hien nhieu nhat la tu '" + tu_nhieu_nhat + "' voi", so_lan_max, "lan")
```

Kết quả mẫu:
```text
Bang tan suat cac tu: {'hoc': 3, 'lap': 2, 'trinh': 2, 'nua': 1, 'mai': 1, 'cuc': 1, 'ky': 1, 'vui': 1}
Tu xuat hien nhieu nhat la tu 'hoc' voi 3 lan
```
</details>

---

## 7. Tóm tắt 5 dòng và 3 câu tự kiểm tra

### 5 dòng cốt lõi cần nhớ:
1. **Khóa và Giá trị:** Cấu trúc `{key: value}`, tra cứu bằng nhãn tên cực nhanh mà không cần duyệt chỉ số.
2. **Khóa là duy nhất:** Các Key không được trùng nhau; nếu gán trùng thì giá trị mới sẽ ghi đè giá trị cũ.
3. **Phòng chống `KeyError`:** Luôn dùng `d.get(key, mac_dinh)` hoặc kiểm tra `if key in d:`.
4. **Công thức đếm thần thánh:** `d[x] = d.get(x, 0) + 1` giúp đếm tần suất xuất hiện trong đúng 1 dòng code.
5. **Duyệt qua từ điển:** Dùng `for k, v in d.items():` để lấy cả khóa `k` và giá trị `v` cùng lúc.

### 3 câu tự kiểm tra trước khi sang Bài 12:
1. Tại sao hàm `d.get("diem", 0)` lại an toàn hơn câu lệnh `d["diem"]`?
2. Trong một từ điển, kiểu dữ liệu nào KHÔNG được phép làm Khóa (Key)? (Gợi ý: List có làm key được không?).
3. Cú pháp để lấy ra toàn bộ danh sách các Khóa của từ điển là gì?
