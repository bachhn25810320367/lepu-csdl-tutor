---
title: "Bài 14: Luyện đề bấm giờ 2 — Đề thi thực hành số 2 (Vòng lặp nhập dữ liệu & Thao tác mảng số)"
day: 14
tags: [python, luyen-de, de-2, bam-gio, while-true, tbc-dieu-kien, xoa-phan-tu]
---

# Bài 14: Luyện đề bấm giờ 2 — Đề thi thực hành số 2 (Vòng lặp nhập dữ liệu & Thao tác mảng số)

## 1. Đề bài gốc và Làm sạch các điểm mơ hồ

> **ĐỀ BÀI (Đề số 2 - Ngân hàng đề thi EPU):**  
> Viết chương trình Python yêu cầu mỗi ý từ 1 đến 15 viết 1 hàm lưu trữ dưới dạng thư viện (`thuvien.py`).  
> Ý 16: Viết chương trình chính (`main.py`) sử dụng các hàm trên.

### Chuẩn hóa các ý trong đề thi:
- **Ý 1: "Nhập vào một dãy số nguyên cho tới khi không muốn nhập nữa. In dãy vừa nhập ra màn hình":**
  - *Kỹ thuật:* Dùng vòng lặp `while True`. Nhập từng số, nếu người dùng gõ ký tự dừng (như chữ `'q'` hoặc để trống rồi Enter) thì `break`.
- **Ý 2 & 8: "Xóa toàn bộ các phần tử âm / Xóa tất cả các số dương":**
  - *Bảo toàn dữ liệu:* Tạo và trả về một danh sách mới đã lọc bỏ các số âm/dương, không làm mất dữ liệu của danh sách gốc để các ý sau còn dùng.
- **Ý 4: "Nhập 1 số X, tìm các vị trí xuất hiện X trong danh sách":**
  - *Lưu ý:* X có thể xuất hiện nhiều lần (ví dụ ở vị trí 1 và 4), nên hàm phải trả về một danh sách các vị trí `[1, 4]`, không chỉ trả về 1 vị trí.
- **Ý 7 & 10: "Trung bình cộng các số chia hết cho 3 / Trung bình cộng các số âm":**
  - *Bẫy chia cho 0:* Nếu trong dãy không có số nào chia hết cho 3 (hoặc không có số âm), mẫu số sẽ bằng 0. Bắt buộc phải xử lý trường hợp này, trả về `0.0`.
- **Ý 9: "Đưa ra số chia hết cho 5 cuối cùng trong danh sách":**
  - *Kỹ thuật:* Duyệt ngược từ cuối danh sách về đầu (`reversed(ds)`). Nếu gặp số đầu tiên chia hết cho 5 thì `return` ngay; nếu duyệt hết mà không có thì trả về `None`.

---

## 2. Chiến thuật phân bổ thời gian bấm giờ (Tổng thời gian: 60 phút)

| Giai đoạn | Thời gian | Nhiệm vụ cụ thể |
| :--- | :--- | :--- |
| **Giai đoạn 1** | Phút 0 – 10 (10 phút) | Viết hàm nhập liên tục `while True` và cấu trúc khung chương trình. |
| **Giai đoạn 2** | Phút 10 – 40 (30 phút) | Hoàn thành 12 hàm xử lý mảng trong `thuvien.py`. |
| **Giai đoạn 3** | Phút 40 – 55 (15 phút) | Hoàn thiện file `main.py`, gọi và in đẹp mắt từng ý. |
| **Giai đoạn 4** | Phút 55 – 60 (5 phút) | Test case kiểm tra dãy không có số âm, dãy toàn số chẵn. |

---

## 3. Thang điểm chi tiết (Thang điểm 10.0)

- **Cấu trúc 2 file `thuvien.py` và `main.py` (1.0 điểm)**
- **Ý 1 – Nhập liên tục bằng `while True` (1.0 điểm)**
- **Ý 2, 6, 8 – Các thao tác xóa (âm, dương, xóa hết) (1.5 điểm)**
- **Ý 3, 4 – Đếm số lần & Tìm tất cả vị trí của X (1.5 điểm)**
- **Ý 5 – Đếm số phần tử khác nhau (1.0 điểm)**
- **Ý 7, 10 – TBC có điều kiện (chia hết cho 3, số âm) (1.5 điểm)**
- **Ý 9 – Số chia hết cho 5 cuối cùng (1.0 điểm)**
- **Ý 11 – Thay thế số âm thành 0 (1.0 điểm)**
- **Ý 12 – Xóa giá trị trùng lặp (0.5 điểm)**

---

## 4. Lời giải mẫu hoàn chỉnh

### File `thuvien.py`:
```python
# thuvien.py - Thu vien giai toan De so 2

def y1_nhap_day_so_lien_tuc():
    # Y 1: Nhap day so nguyen cho toi khi muon dung (go 'q')
    ds = []
    print("Nhap tung so nguyen (go 'q' hoac Enter de ket thuc):")
    while True:
        s = input(">> ")
        if s.strip().lower() == 'q' or s.strip() == '':
            break
        try:
            so = int(s.strip())
            ds.append(so)
        except ValueError:
            print("Gia tri khong hop le, vui long nhap lai!")
    return ds


def y2_xoa_cac_so_am(ds):
    # Y 2: Xoa toan bo cac phan tu am (giu lai cac so >= 0)
    kq = []
    for x in ds:
        if x >= 0:
            kq.append(x)
    return kq


def y3_dem_so_lan_xuat_hien_x(ds, x):
    # Y 3: Dem so lan xuat hien cua X trong danh sach
    return ds.count(x)


def y4_tim_tat_ca_vi_tri_x(ds, x):
    # Y 4: Tim tat ca vi tri xuat hien cua X trong danh sach
    cac_vi_tri = []
    for i in range(len(ds)):
        if ds[i] == x:
            cac_vi_tri.append(i)
    return cac_vi_tri


def y5_dem_so_phan_tu_khac_nhau(ds):
    # Y 5: Dem so phan tu khac nhau trong danh sach
    da_xuat_hien = []
    for x in ds:
        if x not in da_xuat_hien:
            da_xuat_hien.append(x)
    return len(da_xuat_hien)


def y6_xoa_toan_bo_danh_sach(ds):
    # Y 6: Xoa toan bo phan tu (tra ve danh sach rong)
    return []


def y7_tbc_cac_so_chia_het_cho_3(ds):
    # Y 7: Trung binh cong cac so chia het cho 3
    tong = 0
    dem = 0
    for x in ds:
        if x % 3 == 0:
            tong = tong + x
            dem = dem + 1
    if dem == 0:
        return 0.0
    return tong / dem


def y8_xoa_tat_ca_so_duong(ds):
    # Y 8: Xoa tat ca so duong (giu lai so <= 0)
    kq = []
    for x in ds:
        if x <= 0:
            kq.append(x)
    return kq


def y9_so_chia_het_cho_5_cuoi_cung(ds):
    # Y 9: So chia het cho 5 cuoi cung trong danh sach
    for i in range(len(ds) - 1, -1, -1):
        if ds[i] % 5 == 0:
            return ds[i]
    return None


def y10_tbc_cac_so_am(ds):
    # Y 10: Trung binh cong cac so am
    tong = 0
    dem = 0
    for x in ds:
        if x < 0:
            tong = tong + x
            dem = dem + 1
    if dem == 0:
        return 0.0
    return tong / dem


def y11_thay_the_am_thanh_khong(ds_goc):
    # Y 11: Thay the tat ca cac so am thanh so 0
    ds = list(ds_goc)
    for i in range(len(ds)):
        if ds[i] < 0:
            ds[i] = 0
    return ds


def y12_xoa_gia_tri_trung_lap(ds):
    # Y 12: Xoa cac gia tri trung lap (giu lai phan tu dau)
    kq = []
    for x in ds:
        if x not in kq:
            kq.append(x)
    return kq
```

---

### File `main.py`:
```python
# main.py - Y 16: Chuong trinh chinh
import thuvien

# Y 1: Nhap lieu
ds = thuvien.y1_nhap_day_so_lien_tuc()
print("\n[Y 1] Danh sach vua nhap:", ds)

if len(ds) == 0:
    print("Danh sach rong!")
else:
    # Y 2
    print("[Y 2] Sau khi xoa so am:", thuvien.y2_xoa_cac_so_am(ds))

    # Y 3 & 4
    x = -6
    print(f"[Y 3] So lan xuat hien cua so {x}:", thuvien.y3_dem_so_lan_xuat_hien_x(ds, x))
    print(f"[Y 4] Cac vi tri xuat hien cua {x}:", thuvien.y4_tim_tat_ca_vi_tri_x(ds, x))

    # Y 5
    print("[Y 5] So luong phan tu khac nhau:", thuvien.y5_dem_so_phan_tu_khac_nhau(ds))

    # Y 7
    print("[Y 7] TBC cac so chia het cho 3:", round(thuvien.y7_tbc_cac_so_chia_het_cho_3(ds), 2))

    # Y 8
    print("[Y 8] Sau khi xoa tat ca so duong:", thuvien.y8_xoa_tat_ca_so_duong(ds))

    # Y 9
    so_5 = thuvien.y9_so_chia_het_cho_5_cuoi_cung(ds)
    print("[Y 9] So chia het cho 5 cuoi cung:", so_5)

    # Y 10
    print("[Y 10] TBC cac so am:", round(thuvien.y10_tbc_cac_so_am(ds), 2))

    # Y 11
    print("[Y 11] Danh sach sau khi thay so am thanh 0:", thuvien.y11_thay_the_am_thanh_khong(ds))

    # Y 12
    print("[Y 12] Danh sach sau khi xoa trung lap:", thuvien.y12_xoa_gia_tri_trung_lap(ds))

    # Y 6
    print("[Y 6] Xoa toan bo danh sach:", thuvien.y6_xoa_toan_bo_danh_sach(ds))
```

---

## 5. Kết quả chạy mẫu thực tế

Dữ liệu nhập vào: `12`, `-6`, `15`, `-6`, `20`, `9`, `-3`, `25`, `q`.

```text
[Y 1] Danh sach vua nhap: [12, -6, 15, -6, 20, 9, -3, 25]
[Y 2] Sau khi xoa so am: [12, 15, 20, 9, 25]
[Y 3] So lan xuat hien cua so -6: 2
[Y 4] Cac vi tri xuat hien cua -6: [1, 3]
[Y 5] So luong phan tu khac nhau: 7
[Y 7] TBC cac so chia het cho 3: 3.5
[Y 8] Sau khi xoa tat ca so duong: [-6, -6, -3]
[Y 9] So chia het cho 5 cuoi cung: 25
[Y 10] TBC cac so am: -5.0
[Y 11] Danh sach sau khi thay so am thanh 0: [12, 0, 15, 0, 20, 9, 0, 25]
[Y 12] Danh sach sau khi xoa trung lap: [12, -6, 15, 20, 9, -3, 25]
[Y 6] Xoa toan bo danh sach: []
```

---

## 6. Các bẫy điểm cần đặc biệt chú ý

1. **Bẫy chia hết cho 3 với số âm:** Trong toán học và Python, các số âm như `-6`, `-3` vẫn chia hết cho 3 (vì `-6 % 3 == 0`). Đừng tự ý bỏ qua số âm khi tính điều kiện chia hết!
2. **Bẫy thứ tự chạy của Ý 6 (Xóa toàn bộ danh sách):** Nếu bạn gọi hàm `y6_xoa_toan_bo_danh_sach(ds)` ngay từ đầu, danh sách sẽ thành rỗng và toàn bộ các ý `Y 7, Y 8, Y 9...` bên dưới sẽ nhận một danh sách rỗng! Hãy để `Ý 6` chạy cuối cùng hoặc thao tác trên bản sao.
3. **Bẫy tìm kiếm ngược (Ý 9):** Dùng vòng lặp `for i in range(len(ds) - 1, -1, -1)` để quét từ đuôi mảng về đầu mảng, đảm bảo tìm thấy đúng số cuối cùng ngay lập tức mà không cần quét 2 lần.
