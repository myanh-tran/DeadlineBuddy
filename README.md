# Deadline Buddy 0.5

Web app quản lý task/deadline, có giao diện dark/light/pastel, Pomodoro, Mood Tracker và Habit Tracker. Dữ liệu được lưu cục bộ trong trình duyệt.

## Chạy trên Windows
1. Giải nén ZIP.
2. Mở thư mục `deadline-buddy`.
3. Nhấp đúp `run.bat`.
4. Mở `http://localhost:8000` nếu trình duyệt không tự mở.
5. Giữ cửa sổ terminal chạy trong lúc dùng app.

Cần cài Python 3 để chạy server local. Không cần cài thư viện Python nào.

## Tính năng
- Tạo, sửa, xóa, hoàn thành task; deadline, mức ưu tiên, ghi chú, tiến độ.
- Màn hình Hôm nay, Sắp đến hạn, Tất cả task, Đã hoàn thành, lịch tháng.
- Nhắc task và tổng hợp task buổi sáng/tối (trình duyệt phải mở).
- Chọn giao diện: tối, sáng, pastel hồng, xanh dương, mint, tím lavender, cam đào.
- Pomodoro: học 50 phút/nghỉ 10, học 40/nghỉ 10, học 30/nghỉ 10, học 20/nghỉ 10, học 10/nghỉ dài 60 phút; có bắt đầu/tạm dừng, đặt lại, bỏ qua và tự chuyển phiên.
- Mood Tracker: ghi cảm xúc và ghi chú mỗi ngày, xem lịch sử gần đây.
- Habit Tracker: tạo thói quen, chọn icon/màu, đánh dấu hoàn thành từng ngày, xem streak và 7 ngày gần nhất.
- Xuất/nhập bản sao lưu task JSON. Mood/habit lưu local trong trình duyệt.

## Giới hạn
- Dữ liệu hiện lưu trong trình duyệt trên thiết bị này, chưa có cloud sync.
- Nhắc giờ chỉ được kiểm tra khi app đang mở; thông báo nền khi đóng hẳn trình duyệt không được đảm bảo.
- Lựa chọn giao diện, mood và habits lưu trong localStorage của cùng origin/trình duyệt.


## Visual refresh · Editorial study journal
- Typography-led layout with larger headings and more readable task text.
- Reduced rounded-card repetition; stronger dividers, warm paper background and cobalt accent.
- Theme variants restyled consistently for dark and pastel palettes.
- Existing task, calendar, Pomodoro, mood and habit functionality retained.


## Cập nhật trạng thái task
- Trong mỗi task có menu **Trạng thái** để chuyển giữa **Chưa làm**, **Đang làm** và **Đã làm**.
- Chọn **Đã làm** sẽ đặt tiến độ 100% và dừng nhắc task; chọn **Chưa làm** sẽ đặt tiến độ về 0%; chọn **Đang làm** sẽ giữ tiến độ hiện có hoặc đặt tối thiểu 1%.
