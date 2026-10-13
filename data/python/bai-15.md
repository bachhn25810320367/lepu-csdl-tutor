---
title: "Bài 15: Thi thử toàn diện — Đề tổng hợp chuẩn phòng thi & Barem chấm điểm"
day: 15
tags: [python, thi-thu, tong-hop, barem-diem, test-case, thuvien, main]
---

# Bài 15: Thi thử toàn diện — Đề tổng hợp chuẩn phòng thi & Barem chấm điểm

## 1. Quy chế phòng thi & Hướng dẫn làm bài trên máy

- **Thời gian làm bài:** 90 phút (bấm giờ nghiêm túc).
- **Quy định nộp bài:**
  - Tạo một thư mục bài thi đặt tên theo định dạng: `HoTen_MaSV` (Ví dụ: `HoangNgocBach_25810320367`).
  - Trong thư mục bài thi bắt buộc chỉ gồm đúng 2 file:
    1. `thuvien.py`: Chứa các hàm nghiệp vụ theo yêu cầu từ Ý 1 đến Ý 14.
    2. `main.py`: Chương trình chính nhập xuất dữ liệu và gọi các hàm từ `thuvien.py`.
- **Nguyên tắc chấm điểm:**
  - Code bị lỗi cú pháp (`SyntaxError`) hoặc `ModuleNotFoundError` không chạy được: **0.0 điểm toàn bài**.
  - Hàm viết đúng logic nhưng thiếu xử lý trường hợp biên (danh sách rỗng, chia cho 0, số âm): trừ 50% số điểm của ý đó.

---

## 2. Barem chấm điểm chi tiết (Thang điểm 10.0)

| STT | Nội dung yêu cầu | Điểm tối đa |
| :---: | :--- | :---: |
| **0** | **Cấu trúc Module:** Tổ chức đúng 2 file `thuvien.py` và `main.py`, gọi qua `import` mượt mà | **1.0 đ** |
| **1** | **Ý 1:** Nhập chuỗi số ngăn cách bởi dấu phẩy, chuyển thành List số nguyên an toàn | **0.5 đ** |
| **2** | **Ý 2:** Tính tổng và trung bình cộng (xử lý chia cho 0 khi list rỗng) | **0.5 đ** |
| **3** | **Ý 3:** Tìm phần tử âm lớn nhất và vị trí đầu tiên của nó trong danh sách | **0.5 đ** |
| **4** | **Ý 4:** Đưa ra danh sách các số chính phương (bảo toàn list gốc) | **0.5 đ** |
| **5** | **Ý 5:** Đếm số lượng số nguyên tố có trong danh sách | **0.5 đ** |
| **6** | **Ý 6:** Sắp xếp danh sách theo thứ tự giảm dần | **0.5 đ** |
| **7** | **Ý 7:** Chèn số nguyên $X$ vào danh sách sao cho thứ tự giảm dần vẫn được bảo toàn | **0.5 đ** |
| **8** | **Ý 8:** Đưa ra danh sách sau khi đã loại bỏ các phần tử trùng lặp | **0.5 đ** |
| **9** | **Ý 9:** Tìm phần tử có số lần xuất hiện nhiều nhất và số lần xuất hiện của nó | **0.5 đ** |
| **10** | **Ý 10:** Đếm số lượng phần tử đan dấu dài nhất trong danh sách | **1.0 đ** |
| **11** | **Ý 11:** Nhập họ tên thí sinh dạng chuỗi thô, chuẩn hóa họ tên (viết hoa chữ cái đầu) | **0.5 đ** |
| **12** | **Ý 12:** Đếm số lượng từ và tìm từ dài nhất trong họ tên vừa chuẩn hóa | **0.5 đ** |
| **13** | **Ý 13:** Kiểm tra xem chuỗi họ tên (bỏ dấu cách) có phải là chuỗi đối xứng (Palindrome) không | **0.5 đ** |
| **14** | **Ý 14:** Đóng gói thông tin thành Dictionary gồm `{"ten": ..., "so_luong_so": ..., "max_val": ...}` | **0.5 đ** |
| **15** | **Ý 15:** Hoàn thiện file `main.py` gọi toàn bộ 14 hàm trên và in ra giao diện rõ ràng | **1.0 đ** |

---

## 3. Lời giải mẫu chuẩn phòng thi

### File `thuvien.py`:
```python
# thuvien.py - Thu vien tong hop De thi thu tot nghiep 15 ngay

# === PHAN 1: XU LY DANH SACH SO NGUYEN ===

def y1_chuyen_chuoi_thanh_list(s):
    # Y 1: Parse chuoi thanh list int
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


def y2_tinh_tong_va_tbc(ds):
    # Y 2: Tong va TBC
    if len(ds) == 0:
        return 0, 0.0
    tong = sum(ds)
    return tong, tong / len(ds)


def y3_tim_am_lon_nhat(ds):
    # Y 3: Phan tu am lon nhat (gan 0 nhat) va vi tri dau tien
    cac_so_am = [x for x in ds if x < 0]
    if len(cac_so_am) == 0:
        return None, -1
    max_am = max(cac_so_am)
    vi_tri = ds.index(max_am)
    return max_am, vi_tri


def la_chinh_phuong(x):
    if x < 0:
        return False
    can = int(x ** 0.5)
    return can * can == x

def y4_loc_so_chinh_phuong(ds):
    # Y 4: Danh sach so chinh phuong
    kq = []
    for x in ds:
        if la_chinh_phuong(x):
            kq.append(x)
    return kq


def la_nguyen_to(x):
    if x < 2:
        return False
    for i in range(2, int(x ** 0.5) + 1):
        if x % i == 0:
            return False
    return True

def y5_dem_so_nguyen_to(ds):
    # Y 5: Dem so luong so nguyen to
    dem = 0
    for x in ds:
        if la_nguyen_to(x):
            dem = dem + 1
    return dem


def y6_sap_xep_giam_dan(ds):
    # Y 6: Sap xep giam dan
    return sorted(ds, reverse=True)


def y7_chen_x_van_giam_dan(ds_goc, x):
    # Y 7: Chen x sao cho day van giam dan
    ds = sorted(ds_goc, reverse=True)
    vt = len(ds)
    for i in range(len(ds)):
        if x >= ds[i]:
            vt = i
            break
    ds.insert(vt, x)
    return ds


def y8_loai_bo_trung_lap(ds):
    # Y 8: Loai trung giu thu tu
    kq = []
    for x in ds:
        if x not in kq:
            kq.append(x)
    return kq


def y9_tim_phan_tu_xuat_hien_nhieu_nhat(ds):
    # Y 9: Phan tu xuat hien nhieu nhat
    if len(ds) == 0:
        return None, 0
    tan_suat = {}
    for x in ds:
        tan_suat[x] = tan_suat.get(x, 0) + 1
    
    pt_max = ds[0]
    so_lan_max = 0
    for pt, sl in tan_suat.items():
        if sl > so_lan_max:
            so_lan_max = sl
            pt_max = pt
    return pt_max, so_lan_max


def y10_phan_tu_dan_dau_dai_nhat(ds):
    # Y 10: Day dan dau dai nhat
    if len(ds) == 0:
        return 0
    if len(ds) == 1:
        return 1
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


# === PHAN 2: XU LY CHUOI & TU DIEN ===

def y11_chuan_hoa_ho_ten(s):
    # Y 11: Chuan hoa ho ten
    if s is None or s.strip() == "":
        return ""
    cac_tu = s.strip().split()
    tu_chuan = [tu.capitalize() for tu in cac_tu]
    return " ".join(tu_chuan)


def y12_tim_tu_dai_nhat(s):
    # Y 12: Dem so tu va tim tu dai nhat
    cac_tu = s.strip().split()
    if len(cac_tu) == 0:
        return 0, ""
    tu_max = cac_tu[0]
    for tu in cac_tu:
        if len(tu) > len(tu_max):
            tu_max = tu
    return len(cac_tu), tu_max


def y13_kiem_tra_palindrome(s):
    # Y 13: Kiem tra chuoi doi xung
    if s is None or s.strip() == "":
        return True
    s_sach = "".join(s.lower().split())
    return s_sach == s_sach[::-1]


def y14_dong_goi_thong_tin(ho_ten, ds):
    # Y 14: Dong goi Dictionary
    return {
        "ten": ho_ten,
        "so_luong_so": len(ds),
        "max_val": max(ds) if len(ds) > 0 else None,
        "min_val": min(ds) if len(ds) > 0 else None
    }
```

---

### File `main.py`:
```python
# main.py - Y 15: Chuong trinh chinh chay thuc te
import thuvien

print("==========================================")
print("   CHUONG TRINH THI THU PYTHON TOAN DIEN  ")
print("==========================================")

# Nhap lieu chuoi so
chuoi_so = input("Nhap day so nguyen (cach nhau bang dau phay): ")
ds = thuvien.y1_chuyen_chuoi_thanh_list(chuoi_so)
print("[Y 1] Danh sach so nguyen:", ds)

if len(ds) > 0:
    # Y 2
    tong, tbc = thuvien.y2_tinh_tong_va_tbc(ds)
    print(f"[Y 2] Tong: {tong} | TBC: {round(tbc, 2)}")

    # Y 3
    am_max, vt_am = thuvien.y3_tim_am_lon_nhat(ds)
    print(f"[Y 3] So am lon nhat la: {am_max} o vi tri dau tien: {vt_am}")

    # Y 4
    print("[Y 4] Cac so chinh phuong:", thuvien.y4_loc_so_chinh_phuong(ds))

    # Y 5
    print("[Y 5] So luong so nguyen to:", thuvien.y5_dem_so_nguyen_to(ds))

    # Y 6
    ds_giam = thuvien.y6_sap_xep_giam_dan(ds)
    print("[Y 6] Day so giam dan:", ds_giam)

    # Y 7
    print("[Y 7] Chen so 10 van giam dan:", thuvien.y7_chen_x_van_giam_dan(ds_giam, 10))

    # Y 8
    print("[Y 8] Sau khi loai trung lap:", thuvien.y8_loai_bo_trung_lap(ds))

    # Y 9
    pt_nhieu, sl_max = thuvien.y9_tim_phan_tu_xuat_hien_nhieu_nhat(ds)
    print(f"[Y 9] Phan tu xuat hien nhieu nhat: {pt_nhieu} ({sl_max} lan)")

    # Y 10
    print("[Y 10] Do dai chuoi dan dau dai nhat:", thuvien.y10_phan_tu_dan_dau_dai_nhat(ds))

# Nhap lieu chuoi ho ten
ten_nhap = input("\nNhap ho ten can kiem tra: ")
ten_chuan = thuvien.y11_chuan_hoa_ho_ten(ten_nhap)
print("[Y 11] Ho ten sau chuan hoa:", repr(ten_chuan))

so_tu, tu_max = thuvien.y12_tim_tu_dai_nhat(ten_chuan)
print(f"[Y 12] So luong tu: {so_tu} | Tu dai nhat: '{tu_max}'")

la_dx = thuvien.y13_kiem_tra_palindrome(ten_chuan)
print(f"[Y 13] Ho ten co doi xung (Palindrome) khong: {la_dx}")

# Y 14
ho_so = thuvien.y14_dong_goi_thong_tin(ten_chuan, ds)
print("[Y 14] Ho so thi sinh dong goi:", ho_so)
```

---

## 4. Bộ Test Cases chính thức & Kết quả mẫu

### Test Case 1: Dãy số tổng hợp & Họ tên bình thường
- **Input chuỗi số:** `15, -8, 25, 0, 16, 7, -8, 49`
- **Input họ tên:** `   hoang   ngoc   bAcH  `

```text
[Y 1] Danh sach so nguyen: [15, -8, 25, 0, 16, 7, -8, 49]
[Y 2] Tong: 96 | TBC: 12.0
[Y 3] So am lon nhat la: -8 o vi tri dau tien: 1
[Y 4] Cac so chinh phuong: [25, 0, 16, 49]
[Y 5] So luong so nguyen to: 1
[Y 6] Day so giam dan: [49, 25, 16, 15, 7, 0, -8, -8]
[Y 7] Chen so 10 van giam dan: [49, 25, 16, 15, 10, 7, 0, -8, -8]
[Y 8] Sau khi loai trung lap: [15, -8, 25, 0, 16, 7, 49]
[Y 9] Phan tu xuat hien nhieu nhat: -8 (2 lan)
[Y 10] Do dai chuoi dan dau dai nhat: 3

[Y 11] Ho ten sau chuan hoa: 'Hoang Ngoc Bach'
[Y 12] So luong tu: 3 | Tu dai nhat: 'Hoang'
[Y 13] Ho ten co doi xung (Palindrome) khong: False
[Y 14] Ho so thi sinh dong goi: {'ten': 'Hoang Ngoc Bach', 'so_luong_so': 8, 'max_val': 49, 'min_val': -8}
```

---

## 5. Quy trình 5 bước kiểm tra trước khi nộp bài

1. **Kiểm tra tên thư mục và tên file:** Đúng `thuvien.py` và `main.py` nằm chung trong thư mục cá nhân.
2. **Kiểm tra chạy độc lập:** Mở Terminal, gõ `python main.py` chạy thử xem có văng lỗi đỏ nào không.
3. **Thử nghiệm Test case rỗng:** Chạy lại `main.py`, ấn Enter ngay (danh sách rỗng). Nếu chương trình vẫn chạy êm, in thông báo rõ ràng mà không bị sập -> Bạn đã nắm chắc điểm 10 trong tay!
4. **Đóng toàn bộ cửa sổ soạn thảo code** trước khi giám thị gọi nộp bài để đảm bảo file đã được lưu (Ctrl + S).
5. **Ghi lại đường dẫn thư mục bài nộp** vào giấy thi hoặc phần mềm giám sát phòng thi.
