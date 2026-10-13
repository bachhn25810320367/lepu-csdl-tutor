# Ngân hàng Đề thi Python Thực hành EPU (Đã làm sạch & Chuẩn hóa Đề 1 – 28)

Tài liệu này chuẩn hóa toàn bộ ngân hàng đề thi thực hành Lập trình Python (Trường Đại Học Điện Lực), sửa các lỗi in ấn trùng lặp, giải nghĩa rõ ràng các câu hỏi mơ hồ và cung cấp hướng dẫn giải chuẩn format 2 file (`thuvien.py` và `main.py`).

---

## 1. Bảng tổng hợp các lỗi in ấn & Quy tắc làm sạch đề

| Đề thi | Vị trí lỗi trong đề gốc | Hiện tượng | Hướng xử lý & Chuẩn hóa |
| :--- | :--- | :--- | :--- |
| **Đề 3** | Ý 24 và Ý 25 | Cả 2 ý đều ghi: *"Viết chương trình sử dụng các hàm trên"* | Gộp thành duy nhất 1 ý chương trình chính (`main.py`). Đề gồm 23 hàm thư viện. |
| **Đề 3** | Ý 5 và Ý 16 | Cả 2 ý đều yêu cầu: *"Đưa ra ký tự xuất hiện ít lần nhất..."* | Giữ Ý 5, Ý 16 bỏ qua hoặc thay bằng *"Ký tự xuất hiện duy nhất 1 lần"*. |
| **Đề 3** | Ý 15 và Ý 19 | Ý 15: *"Tìm số lượng từ..."* trùng Ý 19: *"Đếm số từ..."* | Gộp làm 1 hàm `dem_so_tu(s)`. |
| **Đề 4** | Ý 3 và Ý 19 | Ý 3: *"Từ có nhiều ký tự nhất"* trùng Ý 19: *"Tìm từ dài nhất"* | Dùng chung hàm `tim_tu_dai_nhat(s)`. |
| **Đề 4** | Ý 6 và Ý 20 | Cả 2 ý đều ghi: *"Xóa từ đầu tiên khỏi xâu"* | Dùng chung hàm `xoa_tu_dau_tien(s)`. |
| **Đề 8** | Xuất hiện 2 lần | Hai đề cùng mang tên "ĐỀ 8" nhưng nội dung khác nhau | Đánh số thành **Đề 8A** (Myclass, điểm 10, 9, 8, Huệ Chi) và **Đề 8B** (Phân loại Giỏi/Khá/TB/Yếu, điểm cao nhất). |
| **Đề 11** | Ý 3 và Ý 6 | Cả 2 ý đều ghi: *"Đưa ra các số lẻ nhỏ nhất có trong danh sách"* | Dùng 1 hàm `tim_so_le_nho_nhat(ds)`. |
| **Đề 19** | Tiêu đề ghi "ĐỀ 49" | Nằm kẹp giữa Đề 18 và Đề 20 nhưng bị gõ nhầm thành "ĐỀ 49" | Đính chính chuẩn xác là **Đề 19** (Danh bạ, xóa người tên Hoa). |
| **Đề 27** | Ý 2 và Ý 5 | Cả 2 ý đều ghi: *"Chuẩn hóa họ tên vừa nhập..."* | Dùng 1 hàm `chuan_hoa_ho_ten(s)`. |

---

## 2. Giải nghĩa chuẩn xác các câu hỏi mơ hồ trong phòng thi

Khi gặp các câu hỏi dùng từ ngữ chưa chặt chẽ trong đề, đây là cách hiểu chuẩn mực bám sát barem chấm điểm của giảng viên:

### 1. "Số lượng các số dương liên tiếp nhiều nhất" (Đề 1 ý 4, Đề 2 ý 14)
- **Cách hiểu chuẩn:** Là độ dài lớn nhất của một đoạn con gồm toàn các số nguyên dương (`x > 0`) đứng liền kề nhau.
- **Trường hợp biên:** Nếu danh sách toàn số âm hoặc số 0, kết quả trả về `0`.
- **Code:**
```python
def max_duong_lien_tiep(ds):
    dem_ht, dem_max = 0, 0
    for x in ds:
        if x > 0:
            dem_ht += 1
            if dem_ht > dem_max: dem_max = dem_ht
        else: dem_ht = 0
    return dem_max
```

### 2. "Số lượng phần tử đan dấu dài nhất" (Đề 1 ý 12)
- **Cách hiểu chuẩn:** Hai phần tử cạnh nhau được gọi là đan dấu nếu trái dấu nhau: `ds[i] * ds[i+1] < 0`. Số 0 không âm cũng không dương nên không tạo đan dấu.
- **Trường hợp biên:** Nếu dãy rỗng trả về `0`; nếu dãy có 1 phần tử trả về `1`.

### 3. "Xâu con dài nhất chứa tất cả các ký tự trong xâu" (Đề 4 ý 11)
- **Cách hiểu chuẩn:** 
  - Nếu hiểu theo nghĩa toán học: Chuỗi con ngắn nhất/dài nhất chứa đủ bộ ký tự phân biệt.
  - Tuy nhiên, trong đề thi thực hành cơ bản: Đề ngụ ý chuỗi con dài nhất không bị lặp ký tự (hoặc chính là toàn bộ chuỗi). 
  - *Ghi chú:* Hãy hỏi lại giám thị coi thi để xác nhận đề muốn tìm "xâu con dài nhất không trùng ký tự" (Longest substring without repeating characters).

### 4. "Xóa khỏi danh sách số ở vị trí thứ 3" (Đề 12 ý 10)
- **Điểm cần lưu ý:** Ngôn ngữ tự nhiên "thứ 3" thường là phần tử thứ 3 đếm từ 1 (tức index `2`), nhưng lập trình viên thường hiểu là index `3`.
- **Cách xử lý an toàn:** Quy ước rõ trong ghi chú hoặc hàm: mặc định xóa phần tử thứ 3 theo đời sống (`ds.pop(2)`), nếu giáo viên quy ước theo index máy tính thì dùng `ds.pop(3)`.

---

## 3. Bản đồ phân nhóm 28 Đề thi theo Chủ đề

### Nhóm 1: Danh sách số nguyên (Chiếm 45% ngân hàng đề)
- **Gồm các đề:** Đề 1, Đề 2, Đề 6, Đề 11, Đề 12, Đề 14, Đề 15, Đề 17.
- **Các hàm dùng chung:**
  - `chuyen_chuoi_thanh_list()` / `nhap_while_true()`
  - `tinh_tong_va_tbc()`
  - `loc_so_chan()`, `loc_so_le()`, `loc_so_chinh_phuong()`, `loc_so_nguyen_to()`
  - `tim_max_va_vi_tri_cuoi()`, `tim_vi_tri_am()`
  - `loai_bo_trung_nhau()`, `sap_xep_tang_dan()`, `sap_xep_giam_dan()`

### Nhóm 2: Xử lý Chuỗi văn bản (Chiếm 30% ngân hàng đề)
- **Gồm các đề:** Đề 3, Đề 4, Đề 7, Đề 13, Đề 22, Đề 23, Đề 27, Đề 28.
- **Các hàm dùng chung:**
  - `chuan_hoa_ho_ten()`, `dem_so_tu()`, `tim_tu_dai_nhat()`
  - `kiem_tra_doi_xung()`
  - `dem_chu_hoa_chu_thuong()`, `xoa_ky_tu_dac_biet()`, `trich_xuat_so()`

### Nhóm 3: Từ điển & Quản lý danh sách đối tượng (Chiếm 25% ngân hàng đề)
- **Gồm các đề:** Đề 5 (Tuple), Đề 8A, Đề 8B, Đề 9, Đề 10, Đề 16, Đề 18, Đề 19, Đề 20, Đề 21, Đề 24, Đề 25, Đề 26.
- **Các hàm dùng chung:**
  - `nhap_danh_ba()`, `nhap_bang_diem()`
  - `tim_thu_khoa()`, `tbc_diem()`
  - `phan_loai_hoc_luc(diem)`
  - `xoa_theo_ten(ds, ten)`
