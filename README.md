# Deadline Buddy 0.5

Web app quản lý task/deadline, có giao diện dark/light/pastel, Pomodoro, Mood Tracker và Habit Tracker. Dữ liệu được lưu cục bộ trong trình duyệt.

## Chạy trên Windows
1. Mở thư mục repo `DeadlineBuddy` (thư mục có `run.bat`).
2. Nhấp đúp `run.bat`.
3. Mở `http://localhost:8000` nếu trình duyệt không tự mở.
4. Giữ cửa sổ terminal chạy trong lúc dùng app. `run.bat` chạy `sync_server.py`, vừa mở trang vừa đồng bộ trong mạng nhà.

Cần cài Python 3 để chạy server local. Không cần cài thư viện Python nào.

## Tính năng
- Tạo, sửa, xóa, hoàn thành task; deadline, mức ưu tiên, ghi chú, tiến độ.
- Màn hình Hôm nay, Sắp đến hạn, Tất cả task, Đã hoàn thành, lịch tháng.
- Nhắc task và tổng hợp task buổi sáng/tối (trình duyệt phải mở).
- Chọn giao diện: tối, sáng, pastel hồng, xanh dương, mint, tím lavender, cam đào.
- Pomodoro: học 50 phút/nghỉ 10, học 40/nghỉ 10, học 30/nghỉ 10, học 20/nghỉ 10, học 10/nghỉ dài 60 phút; có bắt đầu/tạm dừng, đặt lại, bỏ qua và tự chuyển phiên.
- Mood Tracker: ghi cảm xúc và ghi chú mỗi ngày, xem lịch sử gần đây.
- Habit Tracker: tạo thói quen, chọn icon/màu, đánh dấu hoàn thành từng ngày, xem streak và 7 ngày gần nhất.
- Xưởng: điểm lấy từ phút Pomodoro trong ngày và task ưu tiên cao đã xong hôm nay. Chốt ngày để mở rương, rồi lắp linh kiện vào góc setup.
- Xuất/nhập bản sao lưu JSON, gồm task, Pomodoro, mood, habit và Xưởng.
- Đồng bộ trong mạng nhà qua `sync_server.py`: máy tính và điện thoại cùng Wi-Fi dùng chung task, Pomodoro và Xưởng.

## Giới hạn
- Đồng bộ chỉ trong mạng nhà, qua `sync_server.py`. Không có tài khoản đám mây.
- Nhắc giờ chỉ chạy khi app đang mở. Đóng hẳn app thì không còn kiểm tra giờ nhắc, và thông báo nền không được đảm bảo.
- Lựa chọn giao diện, mood và habits lưu trong localStorage của cùng origin/trình duyệt.


## Visual refresh · Editorial study journal
- Typography-led layout with larger headings and more readable task text.
- Reduced rounded-card repetition; stronger dividers, warm paper background and cobalt accent.
- Theme variants restyled consistently for dark and pastel palettes.
- Existing task, calendar, Pomodoro, mood and habit functionality retained.


## Cập nhật trạng thái task
- Trong mỗi task có menu **Trạng thái** để chuyển giữa **Chưa làm**, **Đang làm** và **Đã làm**.
- Chọn **Đã làm** sẽ đặt tiến độ 100% và dừng nhắc task; chọn **Chưa làm** sẽ đặt tiến độ về 0%; chọn **Đang làm** sẽ giữ tiến độ hiện có hoặc đặt tối thiểu 1%.
