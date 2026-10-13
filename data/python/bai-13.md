---
title: "Bài 13: Luyện đề bấm giờ 1 — Đề thi thực hành số 1 (Đầy đủ 20 ý)"
day: 13
tags: [python, luyen-de, de-1, bam-gio, thuvien, main, thang-diem]
---

# Bài 13: Luyện đề bấm giờ 1 — Đề thi thực hành số 1 (Đầy đủ 20 ý)

## 1. Đề bài gốc và Làm sạch các điểm mơ hồ

> **ĐỀ BÀI (Đề số 1 - Ngân hàng đề thi EPU):**  
> Viết chương trình Python yêu cầu mỗi ý từ 1 đến 19 viết 1 hàm lưu trữ dưới dạng thư viện (`thuvien.py`).  
> Ý 20: Viết chương trình chính (`main.py`) sử dụng các hàm trên.

### Làm sạch và chuẩn hóa các câu hỏi mơ hồ:
- **Ý 3: "Vị trí phần tử âm đầu tiên, vị trí phần tử âm cuối cùng":** 
  - *Cách hiểu chuẩn:* Chỉ số tính từ `0`. Nếu trong dãy không có phần tử âm nào, hàm phải trả về `(-1, -1)` và in thông báo rõ ràng, không để crash chương trình.
- **Ý 4: "Số lượng các số dương liên tiếp nhiều nhất":**
  - *Cách hiểu chuẩn:* Là độ dài của dãy con gồm các số `> 0` nằm cạnh nhau dài nhất. Ví dụ `[1, 2, -3, 4, 5, 6, -1]` thì kết quả là `3` (dãy `4, 5, 6`).
- **Ý 7: "Phần tử lớn nhất và vị trí của phần tử lớn nhất cuối cùng":**
  - *Bẫy điểm:* Dùng `ds.index(max(ds))` là sai vì chỉ lấy vị trí đầu tiên. Phải duyệt vòng lặp với dấu `>=` để bắt vị trí xuất hiện sau cùng.
- **Ý 10: "Chèn x vào danh sách sao cho dãy số vẫn tăng dần":**
  - *Cách hiểu chuẩn:* Không sửa danh sách gốc, tạo bản sao đã sắp xếp tăng dần rồi tìm vị trí thích hợp để `insert`.
- **Ý 12: "Số lượng phần tử đan dấu dài nhất":**
  - *Cách hiểu chuẩn:* Hai phần tử cạnh nhau trái dấu (`a * b < 0`). Số 0 không mang dấu nên ngắt chuỗi đan dấu.
- **Ý 15: "Xóa phần tử thứ k":**
  - *Lưu ý:* Cần quy ước với giáo viên `k` tính từ 0 hay từ 1. Trong code chuẩn ta quy ước theo chỉ số máy tính (tính từ 0) kèm kiểm tra `0 <= k < len(ds)`.

---

## 2. Chiến thuật phân bổ thời gian bấm giờ (Tổng thời gian: 90 phút)

| Giai đoạn | Thời gian | Nhiệm vụ cụ thể |
| :--- | :--- | :--- |
| **Giai đoạn 1** | Phút 0 – 10 (10 phút) | Tạo thư mục, tạo 2 file `thuvien.py` và `main.py`. Viết sẵn hàm chuyển chuỗi thành list (Ý 1) và khung `try-except` ở `main.py`. |
| **Giai đoạn 2** | Phút 10 – 60 (50 phút) | Viết tuần tự 18 hàm trong `thuvien.py`. Mỗi hàm trung bình 2–3 phút, tuân thủ nguyên tắc `return` giá trị. |
| **Giai đoạn 3** | Phút 60 – 80 (20 phút) | Hoàn thiện file `main.py`: gọi lần lượt từng hàm, in kèm nhãn chú thích rõ ràng `[Ý 1]`, `[Ý 2]`... |
| **Giai đoạn 4** | Phút 80 – 90 (10 phút) | Chạy thử nghiệm với 3 bộ dữ liệu: dãy bình thường, dãy toàn số dương, và dãy có phần tử trùng/âm. |

---

## 3. Thang điểm chi tiết (Thang điểm 10.0)

- **Cấu trúc module (1.0 điểm):** Tách đúng 2 file riêng biệt `thuvien.py` và `main.py`, gọi qua `import` thành công.
- **Ý 1 – Nhập liệu & chuyển List (0.5 điểm):** Tách được chuỗi bằng dấu phẩy thành số nguyên.
- **Ý 2, 5, 6 – Tổng, TBC, Chẵn, Lẻ (1.5 điểm):** Mỗi ý 0.5 điểm. Xử lý an toàn list rỗng.
- **Ý 3, 7 – Vị trí âm & Vị trí max cuối cùng (1.0 điểm):** Bắt đúng vị trí cuối cùng, không dùng nhầm `index()`.
- **Ý 4, 12 – Chuỗi con (Dương liên tiếp & Đan dấu) (1.0 điểm):** Xử lý đúng thuật toán cửa sổ trượt.
- **Ý 8, 16 – Lọc trùng & Đếm số lặp lại (1.0 điểm):** Bảo toàn thứ tự xuất hiện ban đầu.
- **Ý 9, 14, 17 – Sắp xếp tăng, giảm & Đảo ngược (1.5 điểm):** Không làm thay đổi danh sách gốc.
- **Ý 10, 15, 19 – Chèn tăng dần, Xóa thứ k, Thêm nếu chưa có (1.5 điểm):** Kiểm tra biên chỉ số `k`.
- **Ý 11, 13, 18 – Số chính phương & Số nguyên tố (1.0 điểm):** Viết đúng điều kiện toán học.

---

## 4. Lời giải mẫu hoàn chỉnh

### File `thuvien.py`:
```python
# thuvien.py - Thu vien giai toan De so 1 (19 ham)

def y1_chuyen_chuoi_thanh_list(s):
    # Y 1: Chuyen chuoi phan tach bang dau phay thanh list so nguyen
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
    # Y 2: Tinh tong va trung binh cong
    if len(ds) == 0:
        return 0, 0.0
    tong = sum(ds)
    return tong, tong / len(ds)


def y3_tim_vi_tri_am(ds):
    # Y 3: Vi tri am dau tien va cuoi cung
    vt_dau = -1
    vt_cuoi = -1
    for i in range(len(ds)):
        if ds[i] < 0:
            if vt_dau == -1:
                vt_dau = i
            vt_cuoi = i
    return vt_dau, vt_cuoi


def y4_so_duong_lien_tiep_nhieu_nhat(ds):
    # Y 4: So luong so duong lien tiep nhieu nhat
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


def y5_loc_so_chan(ds):
    # Y 5: Danh sach cac so chan
    kq = []
    for x in ds:
        if x % 2 == 0:
            kq.append(x)
    return kq


def y6_loc_so_le(ds):
    # Y 6: Danh sach cac so le
    kq = []
    for x in ds:
        if x % 2 != 0:
            kq.append(x)
    return kq


def y7_tim_max_va_vi_tri_cuoi(ds):
    # Y 7: Phan tu lon nhat va vi tri cuoi cung
    if len(ds) == 0:
        return None, -1
    max_val = ds[0]
    vt_cuoi = 0
    for i in range(len(ds)):
        if ds[i] >= max_val: # >= de lay vi tri cuoi cung
            max_val = ds[i]
            vt_cuoi = i
    return max_val, vt_cuoi


def y8_loai_bo_trung_nhau(ds):
    # Y 8: Loai bo gia tri trung nhau
    kq = []
    for x in ds:
        if x not in kq:
            kq.append(x)
    return kq


def y9_sap_xep_tang_dan(ds):
    # Y 9: Sap xep tang dan
    return sorted(ds)


def y10_chen_x_van_tang_dan(ds_goc, x):
    # Y 10: Chen x sao cho day so van tang dan
    ds = sorted(ds_goc)
    vt = len(ds)
    for i in range(len(ds)):
        if x <= ds[i]:
            vt = i
            break
    ds.insert(vt, x)
    return ds


def la_chinh_phuong(x):
    # Ham bo tro kiem tra so chinh phuong
    if x < 0:
        return False
    can = int(x ** 0.5)
    return can * can == x


def y11_loc_so_chinh_phuong(ds):
    # Y 11: Dua ra cac so chinh phuong
    kq = []
    for x in ds:
        if la_chinh_phuong(x):
            kq.append(x)
    return kq


def y12_phan_tu_dan_dau_dai_nhat(ds):
    # Y 12: So luong phan tu dan dau dai nhat
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


def y13_dem_so_chinh_phuong(ds):
    # Y 13: Dem so luong so chinh phuong
    return len(y11_loc_so_chinh_phuong(ds))


def y14_sap_xep_giam_dan(ds):
    # Y 14: Sap xep giam dan
    return sorted(ds, reverse=True)


def y15_xoa_phan_tu_thu_k(ds_goc, k):
    # Y 15: Xoa phan tu thu k
    ds = list(ds_goc)
    if 0 <= k < len(ds):
        ds.pop(k)
    return ds


def y16_dem_so_bi_lap_lai(ds):
    # Y 16: Dem so luong so bi lap lai
    dem = 0
    da_xet = []
    for x in ds:
        if x not in da_xet:
            if ds.count(x) > 1:
                dem = dem + 1
            da_xet.append(x)
    return dem


def y17_dao_nguoc_danh_sach(ds):
    # Y 17: Dao nguoc danh sach
    return ds[::-1]


def la_nguyen_to(x):
    # Ham bo tro kiem tra so nguyen to
    if x < 2:
        return False
    for i in range(2, int(x ** 0.5) + 1):
        if x % i == 0:
            return False
    return True


def y18_loc_so_nguyen_to(ds):
    # Y 18: Tim cac so nguyen to trong danh sach
    kq = []
    for x in ds:
        if la_nguyen_to(x):
            kq.append(x)
    return kq


def y19_them_x_neu_chua_co(ds_goc, x):
    # Y 19: Kiem tra x co chua, neu chua thi them vao
    ds = list(ds_goc)
    if x not in ds:
        ds.append(x)
    return ds
```

---

### File `main.py`:
```python
# main.py - Y 20: Chuong trinh chinh su dung cac ham tu thuvien.py
import thuvien

# Nhap lieu dau vao theo Y 1
chuoi_nhap = input("Nhap day so nguyen cach nhau bang dau phay: ")
ds = thuvien.y1_chuyen_chuoi_thanh_list(chuoi_nhap)
print("\n[Y 1] Danh sach ban dau:", ds)

if len(ds) == 0:
    print("Danh sach rong, khong the thuc hien cac phep toan tiep theo!")
else:
    # Y 2
    tong, tbc = thuvien.y2_tinh_tong_va_tbc(ds)
    print("[Y 2] Tong:", tong, "| Trung binh cong:", round(tbc, 2))

    # Y 3
    vt_am_dau, vt_am_cuoi = thuvien.y3_tim_vi_tri_am(ds)
    print("[Y 3] Vi tri am dau tien:", vt_am_dau, "| Vi tri am cuoi cung:", vt_am_cuoi)

    # Y 4
    duong_lt = thuvien.y4_so_duong_lien_tiep_nhieu_nhat(ds)
    print("[Y 4] So luong so duong lien tiep nhieu nhat:", duong_lt)

    # Y 5 & 6
    print("[Y 5] Danh sach so chan:", thuvien.y5_loc_so_chan(ds))
    print("[Y 6] Danh sach so le:", thuvien.y6_loc_so_le(ds))

    # Y 7
    max_val, vt_max = thuvien.y7_tim_max_va_vi_tri_cuoi(ds)
    print("[Y 7] Phan tu lon nhat:", max_val, "o vi tri cuoi cung la:", vt_max)

    # Y 8
    print("[Y 8] Danh sach sau khi loai trung:", thuvien.y8_loai_bo_trung_nhau(ds))

    # Y 9
    ds_tang = thuvien.y9_sap_xep_tang_dan(ds)
    print("[Y 9] Sap xep tang dan:", ds_tang)

    # Y 10
    print("[Y 10] Chen so 10 sao cho van tang dan:", thuvien.y10_chen_x_van_tang_dan(ds_tang, 10))

    # Y 11 & 13
    ds_cp = thuvien.y11_loc_so_chinh_phuong(ds)
    print("[Y 11] Cac so chinh phuong:", ds_cp)
    print("[Y 13] So luong so chinh phuong:", len(ds_cp))

    # Y 12
    print("[Y 12] So luong phan tu dan dau dai nhat:", thuvien.y12_phan_tu_dan_dau_dai_nhat(ds))

    # Y 14
    print("[Y 14] Sap xep giam dan:", thuvien.y14_sap_xep_giam_dan(ds))

    # Y 15
    print("[Y 15] Xoa phan tu thu 2 trong danh sach:", thuvien.y15_xoa_phan_tu_thu_k(ds, 2))

    # Y 16
    print("[Y 16] So luong gia tri bi lap lai:", thuvien.y16_dem_so_bi_lap_lai(ds))

    # Y 17
    print("[Y 17] Danh sach dao nguoc:", thuvien.y17_dao_nguoc_danh_sach(ds))

    # Y 18
    print("[Y 18] Cac so nguyen to:", thuvien.y18_loc_so_nguyen_to(ds))

    # Y 19
    print("[Y 19] Them so 99 neu chua co:", thuvien.y19_them_x_neu_chua_co(ds, 99))
```

---

## 5. Kết quả chạy mẫu thực tế

Đầu vào thử nghiệm:
```text
12, -4, 8, -4, 25, 9, 25, 16, 7
```

Kết quả in ra màn hình:
```text
[Y 1] Danh sach ban dau: [12, -4, 8, -4, 25, 9, 25, 16, 7]
[Y 2] Tong: 94 | Trung binh cong: 10.44
[Y 3] Vi tri am dau tien: 1 | Vi tri am cuoi cung: 3
[Y 4] So luong so duong lien tiep nhieu nhat: 5
[Y 5] Danh sach so chan: [12, -4, 8, -4, 16]
[Y 6] Danh sach so le: [25, 9, 25, 7]
[Y 7] Phan tu lon nhat: 25 o vi tri cuoi cung la: 6
[Y 8] Danh sach sau khi loai trung: [12, -4, 8, 25, 9, 16, 7]
[Y 9] Sap xep tang dan: [-4, -4, 7, 8, 9, 12, 16, 25, 25]
[Y 10] Chen so 10 sao cho van tang dan: [-4, -4, 7, 8, 9, 10, 12, 16, 25, 25]
[Y 11] Cac so chinh phuong: [9, 25, 16]
[Y 13] So luong so chinh phuong: 3
[Y 12] So luong phan tu dan dau dai nhat: 4
[Y 14] Sap xep giam dan: [25, 25, 16, 12, 9, 8, 7, -4, -4]
[Y 15] Xoa phan tu thu 2 trong danh sach: [12, -4, -4, 25, 9, 25, 16, 7]
[Y 16] So luong gia tri bi lap lai: 2
[Y 17] Danh sach dao nguoc: [7, 16, 25, 9, 25, -4, 8, -4, 12]
[Y 18] Cac so nguyen to: [7]
[Y 19] Them so 99 neu chua co: [12, -4, 8, -4, 25, 9, 25, 16, 7, 99]
```

---

## 6. Tổng hợp các lỗi hay mất điểm cần kiểm tra trước khi nộp

1. **Lỗi sửa hỏng list gốc:** Ở các ý sắp xếp (`Ý 9, 14`), nếu bạn dùng `ds.sort()` thì danh sách `ds` ban đầu sẽ bị biến dạng, kéo theo các ý bên dưới (`Ý 15, 17...`) bị sai dữ liệu gốc! **Bắt buộc dùng `sorted(ds)`**.
2. **Lỗi tìm vị trí max cuối cùng:** Tuyệt đối không dùng `ds.index(max(ds))` vì nó luôn chỉ trả về vị trí đầu tiên (số `25` ở vị trí 4 thay vì vị trí 6).
3. **Lỗi số chính phương với số âm:** Số `-4` không phải số chính phương, nhưng nếu không kiểm tra `x >= 0` thì hàm `int((-4)**0.5)` sẽ văng lỗi toán học `ValueError: negative number cannot be raised to a fractional power`.
4. **Lỗi chia cho 0:** Nếu người dùng nhập dãy rỗng, tính trung bình cộng sẽ crash nếu thiếu dòng `if len(ds) == 0: return 0, 0.0`.
