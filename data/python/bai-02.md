# Bài 2: Cấu trúc rẽ nhánh điều kiện (if - elif - else)

## 1. Câu chuyện đời sống: Ngã ba đường và Người gác cổng soát vé

Hãy tưởng tượng bạn học sinh **Minh** và chú robot **Bit** đang đi đến một ngã ba đường để vào khu vui chơi. Đứng gác trước các ngả rẽ là bác bảo vệ soát vé:

1. Bác nhìn vào tấm vé trên tay bạn và hỏi: *"Vé của bạn có phải là vé VIP không?"*
   - Nếu **ĐÚNG (True)**: Bác chỉ bạn rẽ sang lối đi VIP trải thảm đỏ. Bạn đi vào luôn và bỏ qua tất cả các lối đi khác.
2. Nếu **SAI (False)**, bác tiếp tục hỏi: *"Vậy bạn có vé TIÊU CHUẨN không?"*
   - Nếu **ĐÚNG**: Bạn rẽ vào lối đi tiêu chuẩn.
3. Nếu vẫn **SAI** (bạn không có cả vé VIP lẫn vé tiêu chuẩn): Bác sẽ chỉ bạn sang lối đi cuối cùng dành cho khách vãng lai mua vé tại cổng.

![Hình 2.1: Minh đứng trước ngã ba đường lựa chọn hướng đi thỏa mãn điều kiện](assets/media/python/minh_bit/bai02_road_junction.jpg)

![Hình 2.2: Bác bảo vệ soát vé kiểm tra từng điều kiện — Chỉ cho phép đi vào lối đầu tiên hợp lệ](assets/media/python/minh_bit/bai02_security_guard.jpg)

Trong lập trình, cấu trúc rẽ nhánh hoạt động chính xác như vậy:
- `if` (Nếu): Lối rẽ đầu tiên được kiểm tra.
- `elif` (Nếu không thì xét tiếp... - viết tắt của *else if*): Các lối rẽ phụ tiếp theo.
- `else` (Trường hợp còn lại): Lối đi mặc định khi tất cả các điều kiện bên trên đều sai.
- **Quy tắc sống còn của máy tính:** Máy chỉ đi vào **MỘT lối duy nhất** đầu tiên mà nó thấy điều kiện đúng, sau đó lập tức nhảy ra khỏi toàn bộ cấu trúc để đi tiếp, không bao giờ quay lại rẽ lối khác.

---

## 2. Ví dụ nhỏ nhất (3–5 dòng code)

Dưới đây là chương trình kiểm tra một số nguyên là số dương, số âm hay bằng không:

```python
# Kiem tra mot so la duong, am hay bang khong
so = int(input())
if so > 0:
    print("So duong")
elif so < 0:
    print("So am")
else:
    print("Bang khong")
```

Kết quả thực tế khi chạy thử:

```text
Dau vao:
-7

Ket qua man hinh:
So am
```

---

## 3. Đoán trước kết quả, rồi chạy thử

Quan sát kỹ đoạn code dưới đây và thử suy đoán kết quả:

```python
# Doan ket qua truoc khi chay
diem = 8
if diem >= 5:
    print("Dat")
if diem >= 8:
    print("Gioi")
```

Khi chạy chương trình, màn hình sẽ chỉ in ra chữ `"Gioi"` hay in ra cả hai dòng `"Dat"` và `"Gioi"`?

<details>
<summary>👉 Bấm vào đây để xem đáp án và giải thích chi tiết</summary>

**Đáp án:** Màn hình sẽ in ra **cả 2 dòng**:
```text
Dat
Gioi
```

**Giải thích vì sao:**
Ở đoạn code trên, người viết dùng **hai câu lệnh `if` độc lập**, chứ KHÔNG dùng chuỗi liên hoàn `if - elif`.
- Khi máy gặp câu lệnh `if diem >= 5:` đầu tiên, vì `8 >= 5` là đúng, máy in ra `"Dat"`.
- Đi hết lệnh `if` thứ nhất, máy coi như xong việc và chuyển sang đọc tiếp lệnh `if diem >= 8:` thứ hai độc lập. Vì `8 >= 8` vẫn đúng, máy lại in tiếp `"Gioi"`.

**Bài học đắt giá trong phòng thi:** 
Nếu các trường hợp loại trừ lẫn nhau (ví dụ: một học sinh không thể vừa Trung bình vừa Giỏi cùng lúc), bạn bắt buộc phải dùng cặp `if - elif - else` chứ không được dùng nhiều `if` rời rạc!
</details>

---

## 4. Lỗi thường gặp: Thông báo lỗi nguyên văn và cách sửa

### Lỗi 1: `SyntaxError: invalid syntax` do nhầm dấu `=` và `==`
- **Nguyên văn thông báo:**
```text
SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?
```
- **Bản chất lỗi:** 
  - Một dấu bằng `=` là **phép gán** (nhét giá trị vào hộp: `so = 10`).
  - Hai dấu bằng `==` mới là **phép so sánh bằng** (hỏi xem có bằng nhau không: `if so == 10:`).
- **Cách sửa:**
```python
# Sai:
if so = 0:

# Dung:
if so == 0:
```

---

### Lỗi 2: `IndentationError: expected an indented block after 'if' statement`
- **Nguyên văn thông báo:**
```text
IndentationError: expected an indented block after 'if' statement on line 2
```
- **Bản chất lỗi:** Python dùng khoảng cách đầu dòng (thụt lề - thường là 4 dấu cách hoặc 1 phím Tab) để biết lệnh nào nằm BÊN TRONG điều kiện `if`. Nếu bạn viết ngang hàng với `if`, Python sẽ không hiểu lệnh đó thuộc về ai.
- **Cách sửa:**
```python
# Sai (khong thut le):
if so > 0:
print("So duong")

# Dung (thut le vao 4 dau cach):
if so > 0:
    print("So duong")
```

---

### Lỗi 3: `SyntaxError: expected ':'`
- **Nguyên văn thông báo:**
```text
SyntaxError: expected ':'
```
- **Bản chất lỗi:** Quên dấu hai chấm `:` ở cuối mỗi dòng `if`, `elif`, hoặc `else`.
- **Cách sửa:** Luôn nhớ quy tắc: Cứ sau `if <dieu_kien>`, `elif <dieu_kien>` hoặc `else` là phải có dấu hai chấm `:`.

---

## 5. Khuôn mẫu cho đề thi: Đoạn code "Copy – Hiểu – Sửa"

![Hình 2.3: Góc nhìn Game RPG — Minh đối đầu Quái vật Đá, chọn chiêu thức theo cây kỹ năng if - elif - else](assets/media/python/minh_bit/game_stone_monster_skill_tree.jpg)

![Hình 2.4: Ứng dụng Shopee — Bậc thang voucher giảm giá theo giá trị đơn hàng](assets/media/python/minh_bit/app_shopee_voucher_conditions.jpg)

Trong ngân hàng đề thi thực hành và các ứng dụng như Shopee, cấu trúc rẽ nhánh xuất hiện ở hầu hết các bài toán tính bậc thang voucher và phân loại:
- Kiểm tra số chẵn hay lẻ: dùng `so % 2 == 0`.
- Kiểm tra số chia hết cho 3, cho 5: dùng toán tử logic `and`.
- Phân loại giá trị (điểm số, số âm / dương / số chính phương).

Dưới đây là bảng 6 phép so sánh và 2 toán tử logic cốt lõi bạn sẽ dùng suốt kỳ thi:

- `==` : So sánh bằng nhau (`so == 0`)
- `!=` : So sánh khác nhau (`so != 0`)
- `>` , `<` : Lớn hơn, nhỏ hơn
- `>=` , `<=` : Lớn hơn hoặc bằng, nhỏ hơn hoặc bằng
- `and` : VÀ (cả hai điều kiện đều phải đúng mới được rẽ vào)
- `or` : HOẶC (chỉ cần một trong hai điều kiện đúng là được rẽ vào)

### Đoạn code khuôn mẫu an toàn:
```python
# Khuon mau kiem tra tinh chat cua mot so (chan/le va chia het)
try:
    so = int(input("Nhap mot so nguyen: "))
    
    # 1. Kiem tra chan le bang phep chia lay du cho 2
    if so % 2 == 0:
        print("Day la so chan")
    else:
        print("Day la so le")
        
    # 2. Kiem tra dong thoi nhieu dieu kien bang 'and'
    if so % 3 == 0 and so % 5 == 0:
        print("So nay chia het cho ca 3 va 5")
    elif so % 3 == 0:
        print("So nay chi chia het cho 3")
    elif so % 5 == 0:
        print("So nay chi chia het cho 5")
    else:
        print("Khong chia het cho 3 va 5")

except ValueError:
    print("Loi: Du lieu nhap vao phai la mot so nguyen")
```

Kết quả mẫu khi nhập `15`:
```text
Nhap mot so nguyen: 15
Day la so le
So nay chia het cho ca 3 va 5
```

---

## 6. Bài tập 3 mức (Làm theo – Sửa lại – Tự viết)

### Mức 1: Làm theo (Gõ lại chính xác để quen tay)
**Đề bài:** Nhập vào một số điểm thi `diem` (số thực). Nếu `diem >= 5.0` thì in `"Dat"`, ngược lại in `"Khong dat"`. Bắt lỗi nếu nhập sai định dạng số.

<details>
<summary>👉 Xem đáp án Mức 1</summary>

```python
# Muc 1: Kiem tra dat hay khong dat
try:
    diem = float(input("Nhap diem thi: "))
    if diem >= 5.0:
        print("Dat")
    else:
        print("Khong dat")
except ValueError:
    print("Loi: Diem nhap vao phai la chu so")
```

Kết quả mẫu khi nhập `6.5`:
```text
Nhap diem thi: 6.5
Dat
```
</details>

---

### Mức 2: Sửa lại (Tìm và vá lỗi đoạn code hỏng)
**Đề bài:** Bạn học sinh viết đoạn code xếp loại học lực theo điểm số nhưng khi nhập `diem = 9.0` thì máy lại in ra `"Trung binh"`. Hãy tìm nguyên nhân và sửa lại cho đúng:

```python
# Doan code loi cua hoc sinh:
diem = float(input("Nhap diem: "))
if diem >= 5.0:
    print("Trung binh")
elif diem >= 6.5:
    print("Kha")
elif diem >= 8.0:
    print("Gioi")
else:
    print("Yeu")
```

<details>
<summary>👉 Xem đáp án Mức 2</summary>

**Nguyên nhân sai:**
Thứ tự điều kiện bị ngược! Khi `diem = 9.0`, máy kiểm tra dòng đầu tiên `diem >= 5.0`. Vì `9.0 >= 5.0` là đúng, máy lập tức in `"Trung binh"` và kết thúc luôn cấu trúc `if - elif`, không bao giờ đọc đến dòng `diem >= 8.0` nữa!

**Quy tắc sửa:** 
Với các bài toán phân thang điểm, phải **xét từ mốc cao nhất xuống mốc thấp nhất** (hoặc ngược lại):

```python
# Doan code da sua dung thu tu:
try:
    diem = float(input("Nhap diem: "))
    if diem >= 8.0:
        print("Gioi")
    elif diem >= 6.5:
        print("Kha")
    elif diem >= 5.0:
        print("Trung binh")
    else:
        print("Yeu")
except ValueError:
    print("Loi: Du lieu nhap vao khong hop le")
```

Kết quả mẫu khi nhập `9.0`:
```text
Nhap diem: 9.0
Gioi
```
</details>

---

### Mức 3: Tự viết (Thử thách sát đề thi)
**Đề bài:** Viết chương trình nhập vào một số nguyên `so`. Hãy kiểm tra và đưa ra thông báo chính xác theo 4 trường hợp sau:
1. Nếu số vừa là số chẵn vừa là số dương: in `"So chan duong"`.
2. Nếu số là số chẵn nhưng là số âm: in `"So chan am"`.
3. Nếu số là số lẻ: in `"So le"`.
4. Nếu số bằng 0: in `"So khong"`.

Chương trình phải xử lý dữ liệu nhập sai bằng `try - except`.

<details>
<summary>👉 Xem đáp án Mức 3</summary>

```python
# Muc 3: Phan loai so chan le ket hop am duong
try:
    so = int(input("Nhap mot so nguyen: "))
    
    if so == 0:
        print("So khong")
    elif so % 2 == 0 and so > 0:
        print("So chan duong")
    elif so % 2 == 0 and so < 0:
        print("So chan am")
    else:
        print("So le")

except ValueError:
    print("Loi: Ban phai nhap mot so nguyen hop le")
```

Kết quả mẫu khi nhập `12`:
```text
Nhap mot so nguyen: 12
So chan duong
```

Kết quả mẫu khi nhập `-8`:
```text
Nhap mot so nguyen: -8
So chan am
```
</details>

---

## 7. Tóm tắt 5 dòng và 3 câu tự kiểm tra

### 5 dòng cốt lõi cần nhớ:
1. **Lối rẽ duy nhất:** Máy chỉ thực hiện nhánh đầu tiên có điều kiện đúng, sau đó nhảy ra ngoài toàn bộ chuỗi `if - elif - else`.
2. **Dấu gán và so sánh:** Gán giá trị dùng `=`, kiểm tra bằng nhau bắt buộc dùng hai dấu `==`.
3. **Thụt lề là sinh mệnh:** Khối lệnh bên trong `if`, `elif`, `else` bắt buộc phải thụt vào 4 dấu cách.
4. **Kết hợp điều kiện:** Dùng `and` khi cần tất cả cùng đúng, dùng `or` khi chỉ cần ít nhất một điều kiện đúng.
5. **Thứ tự xét bậc thang:** Khi phân loại khoảng (như điểm số), phải xét từ mốc cao nhất xuống thấp nhất để tránh bị nuốt điều kiện.

### 3 câu tự kiểm tra trước khi sang Bài 3:
1. Đoạn code sau in ra gì:
   ```python
   so = 10
   if so % 2 == 0 or so > 100:
       print("Chon")
   ```
2. Phép so sánh `5 != 5` trả về `True` hay `False`?
3. Nếu quên dấu hai chấm `:` ở cuối dòng `elif so < 0`, Python sẽ thông báo lỗi gì?
