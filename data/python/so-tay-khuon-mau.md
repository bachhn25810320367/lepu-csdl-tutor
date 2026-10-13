---
title: "Sổ tay Khuôn mẫu 25 Hàm Cốt lõi cho Kỳ thi Thực hành Python"
tags: [python, so-tay, cheatsheet, snippets, ham-chuan, phong-thi]
---

# Sổ tay Khuôn mẫu 25 Hàm Cốt lõi cho Kỳ thi Thực hành Python

Tập hợp đầy đủ các khuôn mẫu hàm được chuẩn hóa theo đúng format đề thi máy EPU:
- Mọi hàm đều nhận tham số đầu vào và trả về giá trị qua `return` (trừ hàm hiển thị).
- Đều có cơ chế phòng thủ danh sách rỗng, chia cho 0 và ngoại lệ `try-except`.
- Bảo toàn danh sách gốc khi đề ghi "đưa ra", "lọc", "tìm kiếm".

---

## NHÓM A: Nhập xuất & Ép kiểu an toàn (Ý 1 của mọi đề)

### Hàm A1: Chuyển chuỗi ngăn cách bởi dấu phẩy thành List số nguyên
```python
def chuyen_chuoi_thanh_list(s):
    # Nhap chuoi "1, 2, 3" -> [1, 2, 3]
    ds = []
    if s is None or s.strip() == "":
        return ds
    for pt in s.split(","):
        pt = pt.strip()
        if pt != "":
            try:
                ds.append(int(pt))
            except ValueError:
                pass
    return ds
```

### Hàm A2: Nhập số nguyên liên tục bằng vòng lặp đến khi dừng
```python
def nhap_day_so_while_true():
    # Nhap tung so cho toi khi go 'q' hoac Enter
    ds = []
    while True:
        s = input("Nhap so (hoac go 'q' de dung): ")
        if s.strip().lower() == 'q' or s.strip() == '':
            break
        try:
            ds.append(int(s.strip()))
        except ValueError:
            print("Gia tri khong hop le, vui long nhap lai!")
    return ds
```

---

## NHÓM B: Số học & Kiểm tra tính chất số (Các ý kiểm tra / lọc)

### Hàm B1: Kiểm tra số nguyên tố
```python
def la_nguyen_to(x):
    if x < 2:
        return False
    for i in range(2, int(x ** 0.5) + 1):
        if x % i == 0:
            return False
    return True
```

### Hàm B2: Kiểm tra số chính phương
```python
def la_chinh_phuong(x):
    if x < 0:
        return False
    can = int(x ** 0.5)
    return can * can == x
```

### Hàm B3: Kiểm tra số hoàn hảo
```python
def la_so_hoan_hao(x):
    if x <= 1:
        return False
    tong_uoc = 1
    for i in range(2, int(x ** 0.5) + 1):
        if x % i == 0:
            tong_uoc = tong_uoc + i
            if i * i != x:
                tong_uoc = tong_uoc + (x // i)
    return tong_uoc == x
```

### Hàm B4: Tính tổng các ước số
```python
def tinh_tong_uoc(x):
    if x <= 0:
        return 0
    tong = 0
    for i in range(1, x + 1):
        if x % i == 0:
            tong = tong + i
    return tong
```

---

## NHÓM C: Thống kê, Tìm kiếm & Vị trí trên Danh sách

### Hàm C1: Tính tổng và trung bình cộng (Phòng thủ chia cho 0)
```python
def tinh_tong_va_tbc(ds):
    if len(ds) == 0:
        return 0, 0.0
    tong = sum(ds)
    return tong, tong / len(ds)
```

### Hàm C2: Tìm phần tử lớn nhất và vị trí cuối cùng
```python
def tim_max_va_vi_tri_cuoi(ds):
    if len(ds) == 0:
        return None, -1
    max_val = ds[0]
    vt_cuoi = 0
    for i in range(len(ds)):
        if ds[i] >= max_val: # >= de bat vi tri cuoi cung
            max_val = ds[i]
            vt_cuoi = i
    return max_val, vt_cuoi
```

### Hàm C3: Tìm phần tử âm đầu tiên và âm cuối cùng
```python
def tim_vi_tri_am_dau_va_cuoi(ds):
    vt_dau = -1
    vt_cuoi = -1
    for i in range(len(ds)):
        if ds[i] < 0:
            if vt_dau == -1:
                vt_dau = i
            vt_cuoi = i
    return vt_dau, vt_cuoi
```

### Hàm C4: Đếm số lượng số dương liên tiếp nhiều nhất
```python
def dem_so_duong_lien_tiep_max(ds):
    dem_ht = 0
    dem_max = 0
    for x in ds:
        if x > 0:
            dem_ht = dem_ht + 1
            if dem_ht > dem_max:
                dem_max = dem_ht
        else:
            dem_ht = 0
    return dem_max
```

### Hàm C5: Độ dài dãy đan dấu liên tiếp dài nhất
```python
def tim_day_dan_dau_dai_nhat(ds):
    if len(ds) == 0: return 0
    if len(ds) == 1: return 1
    dem_ht = 1
    dem_max = 1
    for i in range(len(ds) - 1):
        if ds[i] * ds[i + 1] < 0:
            dem_ht = dem_ht + 1
            if dem_ht > dem_max:
                dem_max = dem_ht
        else:
            dem_ht = 1
    return dem_max
```

### Hàm C6: Tìm số chia hết cho 5 cuối cùng trong danh sách
```python
def tim_so_chia_het_cho_5_cuoi_cung(ds):
    for i in range(len(ds) - 1, -1, -1):
        if ds[i] % 5 == 0:
            return ds[i]
    return None
```

### Hàm C7: Tìm tất cả vị trí xuất hiện của giá trị X
```python
def tim_tat_ca_vi_tri_x(ds, x):
    kq = []
    for i in range(len(ds)):
        if ds[i] == x:
            kq.append(i)
    return kq
```

---

## NHÓM D: Biến đổi, Lọc & Sắp xếp (Bảo toàn List gốc)

### Hàm D1: Loại bỏ các phần tử trùng nhau (Giữ nguyên thứ tự)
```python
def loai_bo_trung_nhau(ds):
    kq = []
    for x in ds:
        if x not in kq:
            kq.append(x)
    return kq
```

### Hàm D2: Đếm số lượng giá trị bị lặp lại
```python
def dem_so_bi_lap_lai(ds):
    dem = 0
    da_xet = []
    for x in ds:
        if x not in da_xet:
            if ds.count(x) > 1:
                dem = dem + 1
            da_xet.append(x)
    return dem
```

### Hàm D3: Sắp xếp danh sách không sửa bản gốc
```python
def sap_xep_danh_sach(ds, giam_dan=False):
    return sorted(ds, reverse=giam_dan)
```

### Hàm D4: Chèn X vào danh sách sao cho dãy vẫn tăng dần
```python
def chen_x_giu_tang_dan(ds_goc, x):
    ds = sorted(ds_goc)
    vt = len(ds)
    for i in range(len(ds)):
        if x <= ds[i]:
            vt = i
            break
    ds.insert(vt, x)
    return ds
```

### Hàm D5: Thêm X vào danh sách nếu X chưa tồn tại
```python
def them_neu_chua_co(ds_goc, x):
    ds = list(ds_goc)
    if x not in ds:
        ds.append(x)
    return ds
```

### Hàm D6: Xóa phần tử thứ k trong danh sách
```python
def xoa_phan_tu_thu_k(ds_goc, k):
    ds = list(ds_goc)
    if 0 <= k < len(ds):
        ds.pop(k)
    return ds
```

### Hàm D7: Xóa toàn bộ số âm khỏi danh sách
```python
def xoa_toan_bo_so_am(ds):
    kq = []
    for x in ds:
        if x >= 0:
            kq.append(x)
    return kq
```

### Hàm D8: Thay thế toàn bộ số âm thành số 0
```python
def thay_the_am_thanh_khong(ds_goc):
    ds = list(ds_goc)
    for i in range(len(ds)):
        if ds[i] < 0:
            ds[i] = 0
    return ds
```

---

## NHÓM E: Xử lý Chuỗi văn bản & Từ điển

### Hàm E1: Chuẩn hóa họ tên người
```python
def chuan_hoa_ho_ten(s):
    if s is None or s.strip() == "":
        return ""
    cac_tu = s.strip().split()
    tu_chuan = [tu.capitalize() for tu in cac_tu]
    return " ".join(tu_chuan)
```

### Hàm E2: Kiểm tra chuỗi đối xứng (Palindrome)
```python
def kiem_tra_doi_xung(s):
    if s is None or s.strip() == "":
        return True
    s_sach = "".join(s.lower().split())
    return s_sach == s_sach[::-1]
```

### Hàm E3: Đếm tần suất xuất hiện và tìm phần tử xuất hiện nhiều nhất
```python
def tim_pt_xuat_hien_nhieu_nhat(ds):
    if len(ds) == 0:
        return None, 0
    tan_suat = {}
    for x in ds:
        tan_suat[x] = tan_suat.get(x, 0) + 1
    pt_max = ds[0]
    sl_max = 0
    for pt, sl in tan_suat.items():
        if sl > sl_max:
            sl_max = sl
            pt_max = pt
    return pt_max, sl_max
```

### Hàm E4: Sắp xếp danh sách hồ sơ học sinh theo điểm giảm dần
```python
def lay_diem(hs):
    return hs.get("diem", 0)

def sap_xep_hoc_sinh_theo_diem(ds_hs):
    return sorted(ds_hs, key=lay_diem, reverse=True)
```
