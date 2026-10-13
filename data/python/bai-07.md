# Bài 7: Danh sách (List) Phần 3: Thêm, Xóa, Sắp xếp và Bảo toàn danh sách gốc

## 1. Câu chuyện đời sống: Hàng xếp mua trà sữa và Bản photo sổ lớp

Hãy tưởng tượng bạn đang quản lý một hàng người xếp hàng mua trà sữa:

1. **Thêm vào cuối (`append`):** Một bạn mới đến ngoan ngoãn xếp vào vị trí cuối cùng của hàng (`ds.append(ten)`).
2. **Chen vào giữa (`insert`):** Bạn nhỏ được ưu tiên chen vào đúng vị trí số 2 trong hàng (`ds.insert(2, ten)`). Các bạn phía sau tự động lùi lại 1 bước.
3. **Bỏ về hoặc bị đuổi (`pop` và `remove`):**
   - Bạn đứng ở vị trí thứ `k` có việc bận nên rời hàng (`ds.pop(k)`).
   - Bạn có tên là "Nam" bị mời ra khỏi hàng (`ds.remove("Nam")`).
4. **Sắp xếp theo chiều cao (`sort`):** Cả hàng tự di chuyển để người thấp đứng trước, người cao đứng sau.

![](assets/media/python/minh_bit/bai07_lineup_by_height.jpg)

### Bài học sống còn: Photo sổ lớp (Bảo toàn danh sách gốc)
Trong đề thi, hãy đọc thật kỹ từng chữ:
- Khi đề nói: *"Sắp xếp danh sách..."* hoặc *"Xóa phần tử thứ k trong danh sách..."* -> Bạn được phép thay đổi trực tiếp danh sách ban đầu.
- Khi đề nói: *"Đưa ra danh sách các số lẻ..."* hoặc *"Đưa ra danh sách sau khi loại bỏ trùng..."* -> **Tuyệt đối không được làm mất dữ liệu của danh sách gốc!** Bạn phải "photo" ra một danh sách mới (`kq = list(ds)` hoặc tạo `kq = []`) để thao tác trên bản photo đó.

---

## 2. Ví dụ nhỏ nhất (3–5 dòng code)

Dưới đây là thao tác thêm và xóa phần tử trong danh sách:

```python
# Them vao cuoi va xoa phan tu theo vi tri
ds = [10, 20, 30]
ds.append(40)      # Them 40 vao cuoi
ds.pop(1)          # Xoa phan tu o vi tri 1 (so 20)
print(ds)
```

Kết quả thực tế khi chạy:

```text
Ket qua man hinh:
[10, 30, 40]
```

---

## 3. Đoán trước kết quả, rồi chạy thử

Quan sát kỹ đoạn code sau và suy đoán kết quả:

```python
# Doan ket qua truoc khi chay
ds = [5, 2, 9, 1]
kq = ds.sort()
print("Gia tri cua kq:", kq)
print("Gia tri cua ds:", ds)
```

Biến `kq` sẽ nhận giá trị danh sách đã sắp xếp `[1, 2, 5, 9]` hay nhận giá trị gì khác?

<details>
<summary>👉 Bấm vào đây để xem đáp án và giải thích chi tiết</summary>

**Đáp án:** Màn hình sẽ in ra:
```text
Gia tri cua kq: None
Gia tri cua ds: [1, 2, 5, 9]
```

**Bẫy phòng thi kinh điển:**
- Phương thức `ds.sort()` sắp xếp **trực tiếp tại chỗ** trên danh sách `ds` và **không trả về giá trị gì cả (trả về `None`)**. Do đó khi bạn gán `kq = ds.sort()`, biến `kq` sẽ bị gán là `None`!
- Muốn tạo ra một danh sách mới đã sắp xếp mà không làm hỏng biến hứng, bạn phải dùng hàm:
```python
kq = sorted(ds) # Ham sorted tra ve danh sach moi toanh da sap xep
```
</details>

---

## 4. Lỗi thường gặp: Thông báo lỗi nguyên văn và cách sửa

### Lỗi 1: `ValueError: list.remove(x): x not in list`
- **Nguyên văn thông báo:**
```text
ValueError: list.remove(x): x not in list
```
- **Bản chất lỗi:** Bạn gọi lệnh `ds.remove(x)` để xóa giá trị `x`, nhưng giá trị đó hoàn toàn không có trong danh sách.
- **Cách sửa:** Luôn kiểm tra `if x in ds:` trước khi xóa, hoặc dùng `try - except ValueError`:
```python
if x in ds:
    ds.remove(x)
```

---

### Lỗi 2: Xóa sót phần tử do vừa duyệt `for` vừa `remove()`
- **Biểu hiện:** Bạn muốn xóa toàn bộ các số âm trong danh sách `ds = [1, -2, -3, 4]`. Bạn viết:
```python
for x in ds:
    if x < 0:
        ds.remove(x)
```
Kết quả ra `[1, -3, 4]` (số `-3` vẫn còn sót lại không bị xóa!).
- **Bản chất lỗi:** Khi xóa một phần tử, các phần tử phía sau bị dồn lên trước một nấc làm lệch chỉ số duyệt của vòng lặp `for`.
- **Cách sửa:** Không xóa trên list gốc mà lọc sang một list mới:
```python
kq = []
for x in ds:
    if x >= 0:
        kq.append(x)
```

---

### Lỗi 3: `IndexError: pop index out of range`
- **Nguyên văn thông báo:**
```text
IndexError: pop index out of range
```
- **Bản chất lỗi:** Xóa phần tử thứ `k` bằng `ds.pop(k)` nhưng vị trí `k` không hợp lệ (`k < 0` hoặc `k >= len(ds)`).
- **Cách sửa:** Kiểm tra `0 <= k < len(ds)` trước khi gọi `pop`.

---

## 5. Khuôn mẫu cho đề thi: Đoạn code "Copy – Hiểu – Sửa"

Dưới đây là 5 hàm then chốt thuộc **Đề 1 (các ý 8, 9, 10, 14, 15, 16, 17, 19) và Đề 2**:

### File `thuvien.py`:
```python
# thuvien.py - Cac ham bien doi, them, xoa va sap xep List

def loai_bo_trung_nhau(ds):
    # Y 8 - De 1: Loai bo cac gia tri trung nhau (giu thu tu xuat hien dau tien)
    kq = []
    for x in ds:
        if x not in kq:
            kq.append(x)
    return kq


def dem_so_bi_lap_lai(ds):
    # Y 16 - De 1: Trong danh sach co bao nhieu so bi lap lai
    dem = 0
    da_xet = []
    for x in ds:
        if x not in da_xet:
            if ds.count(x) > 1:
                dem = dem + 1
            da_xet.append(x)
    return dem


def sap_xep_danh_sach(ds, giam_dan=False):
    # Y 9, 14 - De 1: Sap xep tang dan hoac giam dan khong lam sua list goc
    kq = sorted(ds, reverse=giam_dan)
    return kq


def chen_x_giu_tang_dan(ds_goc, x):
    # Y 10 - De 1: Chen x vao danh sach sao cho day so van tang dan
    # Buoc 1: Dam bao danh sach da duoc sap xep
    ds = sorted(ds_goc)
    # Buoc 2: Tim vi tri thich hop de chen
    vi_tri = len(ds)
    for i in range(len(ds)):
        if x <= ds[i]:
            vi_tri = i
            break
    ds.insert(vi_tri, x)
    return ds


def them_neu_chua_co(ds_goc, x):
    # Y 19 - De 1: Kiem tra x co chua, neu chua thi them vao
    ds = list(ds_goc)
    if x not in ds:
        ds.append(x)
    return ds


def xoa_phan_tu_thu_k(ds_goc, k):
    # Y 15 - De 1: Xoa phan tu thu k trong danh sach (k tinh tu 0)
    ds = list(ds_goc)
    if 0 <= k < len(ds):
        ds.pop(k)
    return ds
```

### File `main.py`:
```python
# main.py
import thuvien

ds = [15, 3, 8, 3, 12, 15, 1]
print("Danh sach goc:", ds)

# 1. Loai bo trung nhau
khong_trung = thuvien.loai_bo_trung_nhau(ds)
print("Danh sach sau khi loai trung:", khong_trung)

# 2. Dem so bi lap
so_lap = thuvien.dem_so_bi_lap_lai(ds)
print("So luong phan tu bi lap lai:", so_lap)

# 3. Sap xep tang dan & giam dan
tang = thuvien.sap_xep_danh_sach(ds, giam_dan=False)
giam = thuvien.sap_xep_danh_sach(ds, giam_dan=True)
print("Tang dan:", tang)
print("Giam dan:", giam)

# 4. Chen x sao cho van tang dan
ds_sau_chen = thuvien.chen_x_giu_tang_dan(tang, 10)
print("Day tang dan sau khi chen 10:", ds_sau_chen)
```

Kết quả mẫu khi chạy:
```text
Danh sach goc: [15, 3, 8, 3, 12, 15, 1]
Danh sach sau khi loai trung: [15, 3, 8, 12, 1]
So luong phan tu bi lap lai: 2
Tang dan: [1, 3, 3, 8, 12, 15, 15]
Giam dan: [15, 15, 12, 8, 3, 3, 1]
Day tang dan sau khi chen 10: [1, 3, 3, 8, 10, 12, 15, 15]
```

---

## 6. Bài tập 3 mức (Làm theo – Sửa lại – Tự viết)

### Mức 1: Làm theo (Gõ lại chính xác để quen tay)
**Đề bài:** Viết hàm `dao_nguoc_danh_sach(ds)` nhận vào một danh sách và trả về một danh sách mới có thứ tự các phần tử bị đảo ngược (không dùng `ds.reverse()`). Thử nghiệm với `ds = [1, 2, 3, 4, 5]`.

<details>
<summary>👉 Xem đáp án Mức 1</summary>

```python
# Muc 1: Dao nguoc danh sach
def dao_nguoc_danh_sach(ds):
    kq = ds[::-1] # Cat lat voi buoc nhay -1
    return kq

# Chuong trinh chinh:
ds = [1, 2, 3, 4, 5]
kq = dao_nguoc_danh_sach(ds)
print("Danh sach ban dau:", ds)
print("Danh sach dao nguoc:", kq)
```

Kết quả mẫu:
```text
Danh sach ban dau: [1, 2, 3, 4, 5]
Danh sach dao nguoc: [5, 4, 3, 2, 1]
```
</details>

---

### Mức 2: Sửa lại (Tìm và vá lỗi đoạn code hỏng)
**Đề bài:** Đề thi yêu cầu thay thế toàn bộ các số âm trong danh sách thành số 0 (Đề 2 ý 11). Một bạn học sinh viết hàm như sau nhưng danh sách sau khi gọi hàm không hề bị thay đổi. Hãy sửa lại cho đúng:

```python
# Doan code loi:
def thay_the_am_thanh_khong(ds):
    for x in ds:
        if x < 0:
            x = 0
    return ds
```

<details>
<summary>👉 Xem đáp án Mức 2</summary>

**Nguyên nhân sai:**
Khi duyệt `for x in ds:`, biến `x` chỉ là một biến tạm sao chép giá trị của phần tử. Gán `x = 0` chỉ làm thay đổi biến `x`, hoàn toàn không tác động gì đến giá trị nằm trong toa tàu `ds[i]`.

**Cách sửa chuẩn:** Duyệt theo chỉ số `range(len(ds))` để gán trực tiếp vào `ds[i]`:

```python
# Doan code sua dung:
def thay_the_am_thanh_khong(ds_goc):
    ds = list(ds_goc) # Tao ban sao de khong lam hong list goc neu can
    for i in range(len(ds)):
        if ds[i] < 0:
            ds[i] = 0
    return ds

ds = [10, -5, 20, -8, 30]
kq = thay_the_am_thanh_khong(ds)
print("Ket qua sau khi thay the:", kq)
```

Kết quả mẫu:
```text
Ket qua sau khi thay the: [10, 0, 20, 0, 30]
```
</details>

---

### Mức 3: Tự viết (Ý khó của Đề 1: Dãy đan dấu dài nhất)
**Đề bài:** Hai số liên tiếp được gọi là "đan dấu" nếu tích của chúng nhỏ hơn 0 (một số âm và một số dương, ví dụ `[-3, 4]` hoặc `[5, -2]`, số 0 không đan dấu).
Viết hàm `tim_day_dan_dau_dai_nhat(ds)` trả về độ dài (số lượng phần tử) của chuỗi con đan dấu liên tiếp dài nhất trong danh sách.

<details>
<summary>👉 Xem đáp án Mức 3</summary>

```python
# Muc 3: Thuat toan dem chuoi dan dau dai nhat
def tim_day_dan_dau_dai_nhat(ds):
    if len(ds) == 0:
        return 0
    if len(ds) == 1:
        return 1
        
    do_dai_max = 1
    do_dai_hien_tai = 1
    
    for i in range(len(ds) - 1):
        # Kiem tra hai phan tu lien ke trai dau
        if ds[i] * ds[i + 1] < 0:
            do_dai_hien_tai = do_dai_hien_tai + 1
            if do_dai_hien_tai > do_dai_max:
                do_dai_max = do_dai_hien_tai
        else:
            do_dai_hien_tai = 1
            
    return do_dai_max

# Chuong trinh chinh:
ds = [1, -2, 3, -4, 5, 6, -7, 8]
kq = tim_day_dan_dau_dai_nhat(ds)
print("Do dai day dan dau dai nhat la:", kq)
```

Kết quả mẫu:
```text
Do dai day dan dau dai nhat la: 5
```
*(Dãy đan dấu dài nhất là `[1, -2, 3, -4, 5]` gồm 5 phần tử)*
</details>

---

## 7. Tóm tắt 5 dòng và 3 câu tự kiểm tra

### 5 dòng cốt lõi cần nhớ:
1. **Thêm và chèn:** `ds.append(x)` thêm vào cuối danh sách; `ds.insert(i, x)` chèn vào vị trí chỉ định `i`.
2. **Xóa an toàn:** `ds.pop(i)` xóa theo chỉ số `i`; `ds.remove(x)` xóa theo giá trị (phải kiểm tra `if x in ds:`).
3. **Phân biệt sắp xếp:** `ds.sort()` làm thay đổi list gốc và trả về `None`; `sorted(ds)` tạo list mới giữ nguyên list gốc.
4. **Loại trùng lặp:** Dùng danh sách mới `kq = []` và duyệt `if x not in kq: kq.append(x)` để giữ đúng thứ tự.
5. **Gán giá trị vào List:** Muốn thay đổi phần tử trong list, bắt buộc phải gán qua chỉ số `ds[i] = gia_tri_moi`.

### 3 câu tự kiểm tra trước khi sang Bài 8:
1. Nếu viết `kq = ds.sort()`, biến `kq` sẽ có giá trị là gì?
2. Tại sao không nên vừa dùng vòng lặp `for x in ds:` vừa gọi lệnh `ds.remove(x)` trên cùng danh sách đó?
3. Cách chép một danh sách `ds` sang danh sách mới độc lập để không ảnh hưởng đến bản gốc là gì?
