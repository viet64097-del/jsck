# MoneyCare - Quản lý chi tiêu cá nhân

Đây là sản phẩm mẫu đáp ứng yêu cầu bài tập HTML/CSS/JavaScript cơ bản.

## Cách chạy

Cách nhanh: mở file `index.html` bằng trình duyệt.

Cách demo bằng web server cục bộ:

```bash
node server.js
```

Sau đó mở `http://127.0.0.1:5500`.

## File cần nộp

- `index.html`: giao diện ứng dụng.
- `styles.css`: thiết kế giao diện.
- `app.js`: logic JavaScript.
- `report.html`: báo cáo 10-20 trang khi in ra PDF, là file riêng.
- `slides.html`: slide thuyết trình, là file riêng.
- `server.js`: web server nhỏ để demo trên localhost.

## Điểm đáp ứng yêu cầu

- Tương tác DOM: thêm, xóa, render danh sách, cập nhật thống kê.
- Tối thiểu 05 hàm tự định nghĩa: có hơn 10 hàm trong `app.js`.
- If/Else: kiểm tra dữ liệu, ngân sách, đọc Local Storage.
- Vòng lặp: tính tổng, hiển thị danh sách, vẽ biểu đồ.
- Nâng cao: Local Storage và responsive UI.

## Gợi ý demo 7-10 phút

1. Giới thiệu đề tài MoneyCare.
2. Bấm "Nạp dữ liệu mẫu".
3. Thêm giao dịch thu nhập hoặc chi tiêu mới.
4. Tìm kiếm và lọc giao dịch.
5. Nhập ngân sách để xem cảnh báo.
6. Tải lại trang để chứng minh dữ liệu được lưu.
7. Mở `app.js` và chỉ ra DOM, hàm, if/else, vòng lặp.
