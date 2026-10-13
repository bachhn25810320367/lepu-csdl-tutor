# Phiếu Tự Kiểm Tra 12 Bước Trước Khi Nộp Bài Thi Thực Hành Python

Trước khi bấm "Nộp bài" hoặc báo giám thị thu bài, hãy dành đúng **5 phút cuối cùng** tích đủ 12 mục trong phiếu này. Đây là 12 điểm quyết định bài thi của bạn được **10 điểm tuyệt đối hay rơi vào bẫy 0 điểm**!

---

![](assets/media/python/minh_bit/bai15_submit_checklist.jpg)

## BẢNG CHECKLIST 12 BƯỚC

### Nhóm 1: Cấu trúc File & Đặt tên (Tránh 0 điểm do không tìm thấy file)
- [ ] **1. Đúng tên file quy định:** Đã tách đúng 2 file riêng biệt: `thuvien.py` và `main.py` (hoặc đúng tên file mà đề bài/giám thị yêu cầu). Không đặt tên file có dấu cách hay tiếng Việt có dấu.
- [ ] **2. Cùng một thư mục:** Cả hai file `.py` phải nằm chung trong thư mục bài làm cá nhân của bạn (thường đặt tên theo `HoTen_MaSV`).
- [ ] **3. Lệnh import không lỗi:** Mở đầu file `main.py` có dòng `import thuvien`. Khi chạy thử ở cửa sổ dòng lệnh (Terminal/CMD) không bị báo lỗi `ModuleNotFoundError`.

### Nhóm 2: Nguyên tắc viết hàm (Tránh bị trừ điểm cấu trúc)
- [ ] **4. Quy tắc Return vs Print:** 
  - Các ý yêu cầu *"tính / đếm / tìm / kiểm tra"* đã dùng đúng lệnh `return` giá trị về hay chưa?
  - Chỉ những ý đề ghi *"in ra / hiển thị / đưa ra màn hình"* mới dùng lệnh `print()` trong hàm.
- [ ] **5. Thư viện sạch:** Trong file `thuvien.py` **không có bất kỳ câu lệnh `input()` hay `print()` tự do nào** nằm ngoài các hàm `def`.
- [ ] **6. Bảo toàn danh sách gốc:** Các hàm sắp xếp, loại trùng, lọc chẵn lẻ có vô tình làm biến dạng danh sách gốc ban đầu không? (Đảm bảo đã dùng `sorted(ds)` hoặc tạo bản sao `kq = list(ds)`).

### Nhóm 3: Test cases biên & Phòng chống sập chương trình
- [ ] **7. Test case Danh sách rỗng (`[]`):** Chạy thử `main.py`, ấn Enter ngay lập tức (không nhập số nào). Chương trình có bị văng lỗi `ZeroDivisionError` (khi tính TBC) hay `IndexError` không?
- [ ] **8. Test case Số âm:** Các hàm kiểm tra số chính phương (`int(x**0.5)`) có bị lỗi số âm không? Các số âm chia hết cho 3 (`-6`, `-3`) có được tính không?
- [ ] **9. Test case Vị trí cuối cùng:** Ý tìm phần tử lớn nhất/nhỏ nhất và vị trí cuối cùng đã dùng dấu `>=` (hoặc `<=`) chưa? (Tuyệt đối không dùng `ds.index()` vì nó chỉ ra vị trí đầu tiên).
- [ ] **10. Bắt lỗi nhập dữ liệu sai (`try - except`):** Nhập thử chữ cái hoặc ký tự linh tinh xem chương trình có bắt lỗi êm đẹp không.

### Nhóm 4: Hoàn tất kỹ thuật
- [ ] **11. Đã Lưu file (Ctrl + S):** Đảm bảo trên tiêu đề file trong VS Code / PyCharm / IDLE **không còn dấu chấm tròn màu trắng** (dấu hiệu file chưa được lưu).
- [ ] **12. Đóng file và xác nhận nộp:** Chạy thử lại `python main.py` lần cuối cùng từ Terminal, kiểm tra kết quả in ra sáng sủa, sạch sẽ, có nhãn từng ý `[Ý 1]`, `[Ý 2]`... trước khi bàn giao máy.

---

> **LỜI KHUYÊN TỪ GIÁM THỊ:**  
> *"Thà làm ít hơn 1 ý nhưng tất cả các ý đã làm đều chạy mượt và không bao giờ crash, còn hơn làm đủ 20 ý mà chương trình văng lỗi đỏ ngay từ câu số 2!"*
