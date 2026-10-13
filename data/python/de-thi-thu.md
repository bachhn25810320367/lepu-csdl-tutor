# Bộ 4 Đề Thi Thử Python Thực Hành Chuẩn Phòng Thi (Có Thang Điểm & Test Cases)

Bộ đề thi thử được biên soạn bám sát 100% cấu trúc đề thi thực hành của Trường Đại Học Điện Lực (EPU):
- **Thời gian làm bài mỗi đề:** 90 phút.
- **Yêu cầu kỹ thuật:** Viết 1 file thư viện (`thuvien.py`) chứa các hàm và 1 file chương trình chính (`main.py`) gọi các hàm đó.

---

## ĐỀ THI THỬ SỐ 1: DANH SÁCH SỐ NGUYÊN TOÀN DIỆN

### Đề bài:
Viết chương trình Python gồm file `thuvien.py` chứa các hàm sau:
1. `chuyen_chuoi_thanh_list(s)`: Nhập vào một dãy số nguyên cách nhau bằng dấu phẩy, chuyển thành List số nguyên.
2. `tinh_tong_va_tbc(ds)`: Tính tổng và trung bình cộng các số trong danh sách.
3. `tim_vi_tri_am_dau_va_cuoi(ds)`: Tìm vị trí phần tử âm đầu tiên và âm cuối cùng (trả về `-1, -1` nếu không có).
4. `loc_so_chinh_phuong(ds)`: Đưa ra danh sách các số chính phương có trong danh sách.
5. `loc_so_nguyen_to(ds)`: Đưa ra danh sách các số nguyên tố có trong danh sách.
6. `sap_xep_tang_dan(ds)`: Sắp xếp danh sách theo thứ tự tăng dần (không sửa list gốc).
7. `chen_x_giu_tang_dan(ds, x)`: Nhập số $X$, chèn $X$ vào danh sách sao cho thứ tự tăng dần vẫn được bảo toàn.
8. `loai_bo_trung_nhau(ds)`: Loại bỏ các giá trị trùng lặp, giữ lại phần tử xuất hiện đầu tiên.
9. `dem_day_dan_dau_dai_nhat(ds)`: Đưa ra độ dài của chuỗi phần tử đan dấu dài nhất.
10. `xoa_phan_tu_thu_k(ds, k)`: Xóa phần tử thứ $k$ khỏi danh sách.

File `main.py`: Nhập dữ liệu, gọi lần lượt 10 hàm trên và in kết quả kèm nhãn rõ ràng.

### Thang điểm (10.0 điểm):
- Cấu trúc module 2 file: 1.0 đ
- Ý 1 (Nhập liệu an toàn): 1.0 đ
- Ý 2, 4, 5 (Toán học & Thống kê): 2.5 đ (mỗi ý ~0.8 đ)
- Ý 3, 9 (Vị trí & Dãy đan dấu): 2.0 đ (mỗi ý 1.0 đ)
- Ý 6, 7, 8, 10 (Sắp xếp, chèn, xóa, lọc trùng): 2.5 đ
- Giao diện `main.py` sạch đẹp, không crash khi nhập rỗng: 1.0 đ

### Bộ Test Case mẫu:
- **Input:** `12, -5, 16, -3, 25, 7, 25, -4`
- **Output:**
  - Tổng: 73 | TBC: 9.125
  - Vị trí âm đầu: 1 | Vị trí âm cuối: 7
  - Chính phương: `[16, 25, 25]`
  - Nguyên tố: `[7]`
  - Tăng dần: `[-5, -4, -3, 7, 12, 16, 25, 25]`
  - Đan dấu dài nhất: 4 (dãy `[12, -5, 16, -3]`)

---

## ĐỀ THI THỬ SỐ 2: XỬ LÝ CHUỖI KÝ TỰ & VĂN BẢN THỰC CHIẾN

### Đề bài:
Viết chương trình Python gồm file `thuvien.py` chứa các hàm sau:
1. `chuan_hoa_ho_ten(s)`: Loại bỏ khoảng trắng thừa hai đầu và giữa các từ, viết hoa chữ cái đầu mỗi từ.
2. `dem_so_tu(s)`: Đếm số lượng từ có trong câu.
3. `tim_tu_dai_nhat_va_ngan_nhat(s)`: Tìm từ dài nhất và từ ngắn nhất trong câu.
4. `kiem_tra_palindrome(s)`: Kiểm tra câu có phải là chuỗi đối xứng không (không tính dấu cách và hoa thường).
5. `dem_chu_cai_chu_so_dac_biet(s)`: Đếm số lượng chữ cái, chữ số và ký tự đặc biệt có trong chuỗi.
6. `trich_xuat_cac_so(s)`: Rút toàn bộ các chữ số trong chuỗi ra thành một List số nguyên.
7. `dao_nguoc_tung_tu(s)`: Giữ nguyên thứ tự các từ nhưng đảo ngược từng ký tự trong mỗi từ.
8. `thay_the_tu(s, tu_cu, tu_moi)`: Thay thế toàn bộ `tu_cu` bằng `tu_moi`.

File `main.py`: Nhập một câu văn bản từ bàn phím, gọi và in kết quả các hàm trên.

### Thang điểm (10.0 điểm):
- Cấu trúc module 2 file: 1.0 đ
- Ý 1, 2 (Chuẩn hóa & Đếm từ): 2.0 đ
- Ý 3, 4 (Từ min/max & Đối xứng): 2.5 đ
- Ý 5, 6 (Phân loại ký tự & Rút số): 2.0 đ
- Ý 7, 8 (Đảo từ & Thay thế): 1.5 đ
- Giao diện `main.py` hoàn chỉnh: 1.0 đ

### Bộ Test Case mẫu:
- **Input:** `"   hOC   lAp   tRinh   pYtHon   2026!   "`
- **Output:**
  - Chuẩn hóa: `"Hoc Lap Trinh Python 2026!"`
  - Số từ: 5 từ
  - Từ dài nhất: `"Python"` (6 ký tự)
  - Phân loại: 17 chữ cái, 4 chữ số, 1 ký tự đặc biệt (`!`)
  - Chữ số trích xuất: `[2, 0, 2, 6]`
  - Đảo từng từ: `"coH paL hnirT nohtyP !6202"`

---

## ĐỀ THI THỬ SỐ 3: QUẢN LÝ TỪ ĐIỂN & BẢNG ĐIỂM SINH VIÊN

### Đề bài:
Viết chương trình Python quản lý điểm sinh viên gồm file `thuvien.py`:
1. `nhap_danh_sach_sinh_vien()`: Nhập danh sách gồm $n$ sinh viên (mỗi sinh viên gồm tên và điểm thi $0 \le diem \le 10$) lưu vào List of Dicts: `[{"ten": ..., "diem": ...}]`.
2. `tinh_diem_trung_binh_lop(ds)`: Tính điểm trung bình của cả lớp.
3. `tim_thu_khoa(ds)`: Đưa ra thông tin sinh viên có điểm thi cao nhất.
4. `thong_ke_xep_loai(ds)`: Thống kê số lượng sinh viên theo từng loại: Giỏi ($\ge 8.0$), Khá ($6.5 \le diem < 8.0$), Trung bình ($5.0 \le diem < 6.5$), Yếu ($< 5.0$).
5. `tim_sinh_vien_theo_ten(ds, tu_khoa)`: Tìm tất cả sinh viên có tên chứa từ khóa (không phân biệt hoa thường).
6. `sap_xep_theo_diem_giam_dan(ds)`: Sắp xếp bảng điểm sinh viên có điểm từ cao xuống thấp (không dùng lambda).
7. `xoa_sinh_vien_theo_ten(ds, ten)`: Xóa sinh viên có tên chỉ định khỏi danh sách.

File `main.py`: Tạo menu thực hiện các chức năng trên.

### Thang điểm (10.0 điểm):
- Cấu trúc module 2 file: 1.0 đ
- Ý 1 (Nhập danh sách sinh viên an toàn): 1.5 đ
- Ý 2, 3 (Điểm TB & Thủ khoa): 2.0 đ
- Ý 4 (Thống kê 4 mức học lực): 2.0 đ
- Ý 5 (Tìm kiếm theo tên): 1.0 đ
- Ý 6 (Sắp xếp không dùng lambda): 1.5 đ
- Ý 7 (Xóa an toàn): 1.0 đ

---

## ĐỀ THI THỬ SỐ 4: QUẢN LÝ DANH BẠ ĐIỆN THOẠI & KHO SÁCH (TỪ ĐIỂN NÂNG CAO)

### Đề bài:
Viết chương trình Python quản lý danh bạ lưu dưới dạng Dictionary `danh_ba = {ten: so_dt}`:
1. `them_lien_he(danh_ba, ten, sdt)`: Thêm liên hệ mới, nếu số điện thoại không hợp lệ (không đủ 10 số hoặc chứa chữ cái) thì báo lỗi.
2. `tim_sdt_theo_ten(danh_ba, ten)`: Nhập tên, trả về số điện thoại tương ứng.
3. `tim_ten_theo_sdt(danh_ba, sdt)`: Nhập số điện thoại, tìm tên người sở hữu.
4. `xoa_lien_he(danh_ba, ten)`: Xóa người dùng có tên chỉ định khỏi danh bạ.
5. `hien_thi_danh_ba_sap_xep(danh_ba)`: Hiển thị danh bạ được sắp xếp theo tên từ A đến Z.
6. `thong_ke_tong_so_lien_he(danh_ba)`: Trả về tổng số liên hệ hiện có trong danh bạ.

File `main.py`: Gọi và thực thi các hàm trên với dữ liệu thực tế.

### Thang điểm (10.0 điểm):
- Cấu trúc module 2 file: 1.0 đ
- Ý 1 (Kiểm tra sdt hợp lệ & thêm): 2.0 đ
- Ý 2, 3 (Tra cứu 2 chiều tên <-> sdt): 2.5 đ
- Ý 4 (Xóa liên hệ an toàn): 1.5 đ
- Ý 5 (Sắp xếp hiển thị A-Z): 2.0 đ
- Ý 6 & hoàn thiện file `main.py`: 1.0 đ
