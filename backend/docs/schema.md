// Định nghĩa các bảng theo tài liệu thiết kế hệ thống

Table Users {
user_id int [pk, increment, note: "ID người dùng (kiểu khách, nhân viên, admin)"]
role varchar [note: "Vai trò: customer/staff/admin"]
name varchar [note: "Họ tên"]
email varchar [unique, note: "Email đăng nhập"]
phone varchar [note: "Số điện thoại"]
password_hash varchar [note: "Mật khẩu (đã mã hóa)"]
address varchar [null, note: "Địa chỉ liên lạc hoặc địa chỉ tạm (tùy chọn)"]
area_id int [ref: > ServiceAreas.area_id, note: "Khu vực cư trú của khách"]
status varchar [default: "active", note: "Trạng thái tài khoản: active, locked"]
avatar_url varchar [null, note:"Ảnh đại diện"]
created_at datetime [note: "Thời điểm tạo hồ sơ"]
updated_at datetime [note: "Thời điểm sửa hồ sơ"]
}

Table Services {
service_id int [pk, note: "ID dịch vụ"]
name varchar [note: "Tên dịch vụ"]
description text [note: "Mô tả chi tiết dịch vụ"]
price decimal [note: "Giá cơ bản (nhân viên có thể thêm phụ cấp)"]
duration int [note: "Thời lượng (phút) mặc định"]
category varchar [note: "Loại dịch vụ (ví dụ: Vệ sinh, Sửa chữa)"]
image_url varchar [null, note: "Ảnh đại diện của dịch vụ"]
active boolean [note: "Dịch vụ có khả dụng hay không"]
}

Table Bookings {
booking_id int [pk, note: "Mã đơn đặt lịch"]
customer_id int [note: "ID khách hàng tạo đơn"]
service_id int [note: "ID dịch vụ được đặt"]
address varchar [note: "Địa chỉ thực hiện dịch vụ"]
area_id int [ref: > ServiceAreas.area_id, note: "Khu vực diễn ra dịch vụ"]
scheduled_time datetime [note: "Thời gian dự kiến dịch vụ diễn ra"]
discount_code_id int [null, note: "Mã giảm giá áp dụng cho đơn hàng"]
status varchar [note: "Trạng thái: pending, accepted, in_progress, completed, cancelled"]
note text [null, note: "Ghi chú thêm của khách"]
total_amount decimal [note: "Tổng tiền phải thanh toán (có thể bao gồm phí phụ)"]
actual_start_time datetime [null, note: "Thời điểm thực tế bắt đầu"]
cancel_reason text [null, note: "Lý do hủy đơn"]
actual_end_time datetime [null, note: "Thời điểm thực tế kết thúc"]
created_at datetime [note: "Thời điểm tạo đơn"]
updated_at datetime [note: "Thời điểm sửa đơn"]
}
Ref: Bookings.discount_code_id > DiscountCodes.code_id

Table StaffAssignments {
assign_id int [pk, note: "Mã điều phối"]
booking_id int [note: "Đơn đặt lịch liên quan"]
staff_id int [note: "Nhân viên được giao"]
assigned_at datetime [note: "Thời gian phân công"]
status varchar [note: "Trạng thái giao việc: assigned, accepted, rejected, completed"]
}

Table Payments {
payment_id int [pk, note: "Mã thanh toán"]
booking_id int [note: "Đơn đặt lịch tương ứng"]
amount decimal [note: "Số tiền thanh toán"]
method varchar [note: "Phương thức: card, paypal, zaloPay, ..."]
status varchar [note: "Trạng thái: paid, refunded, failed"]
transaction_id varchar [note: "Mã giao dịch bên nhà cung cấp (nếu có)"]
paid_at datetime [null, note: "Thời điểm giao dịch thành công"]
}

Table Notifications {
notification_id int [pk, note: "Mã thông báo"]
user_id int [note: "Người nhận"]
message text [note: "Nội dung thông báo"]
type varchar [note: "Loại thông báo (email, SMS, in-app)"]
is_read boolean [note: "Đã xem chưa"]
created_at datetime [note: "Thời gian gửi thông báo"]
}

Table AuditLogs {
log_id int [pk, note: "Mã log (ghi lại sự kiện)"]
user_id int [null, note: "Người dùng thao tác (nếu có)"]
entity varchar [note: "Bảng dữ liệu bị thay đổi (ví dụ Users, Bookings)"]
entity_id int [note: "ID bản ghi bị thay đổi"]
action varchar [note: "Hành động (create, update, delete, login, logout, ...)"]
timestamp datetime [note: "Thời gian thực hiện hành động"]
details text [null, note: "Thông tin chi tiết (nội dung thay đổi)"]
}

// Thiết lập các mối quan hệ (Foreign Keys)
Ref: Bookings.customer_id > Users.user_id
Ref: Bookings.service_id > Services.service_id
Ref: StaffAssignments.booking_id > Bookings.booking_id
Ref: StaffAssignments.staff_id > Users.user_id
Ref: Payments.booking_id > Bookings.booking_id
Ref: Notifications.user_id > Users.user_id
Ref: AuditLogs.user_id > Users.user_id

// --- CÁC BẢNG BỔ SUNG: NHÂN SỰ, BÁO CÁO & ĐÁNH GIÁ ---

Table StaffProfiles {
profile_id int [pk, increment, note: "Mã hồ sơ nhân viên"]
staff_id int [unique, note: "Liên kết 1-1 với bảng Users"]
id_card_number varchar [unique, note: "Số CMND/CCCD hoặc Passport"]
skills text [note: "Kỹ năng chuyên môn (ví dụ: Điện lạnh, Giúp việc)"]
hire_date date [note: "Ngày gia nhập"]
status varchar [note: "Trạng thái hồ sơ: active, on_leave, terminated"]
current_availability varchar [default: "available", note: "Trạng thái sẵn sàng: available, busy, offline"]
}

Table Contracts {
contract_id int [pk, increment, note: "Mã định danh hợp đồng"]
contract_number varchar [unique, note: "Số hiệu hợp đồng (ví dụ: HĐLĐ-2026-001)"]
staff_id int [note: "Nhân viên tham gia ký kết"]
contract_type varchar [note: "Phân loại: thử việc, chính thức, thời vụ"]

sign_date date [note: "Ngày thực hiện ký kết"]
start_date date [note: "Ngày bắt đầu hiệu lực"]
end_date date [null, note: "Ngày kết thúc hiệu lực (nếu có)"]

base_salary decimal [note: "Mức lương cơ sở"]
commission_rate decimal [note: "Tỷ lệ hoa hồng trên mỗi đơn hàng (%)"]

status varchar [note: "Trạng thái: hiệu lực, hết hạn, thanh lý"]
file_url varchar [null, note: "Đường dẫn tệp tin bản quét hợp đồng"]

created_at datetime
updated_at datetime
}

// Thiết lập mối quan hệ
Ref: Contracts.staff_id > Users.user_id

Table LeaveRequests {
leave_id int [pk, increment, note: "Mã đơn xin nghỉ"]
staff_id int [note: "Nhân viên xin nghỉ"]
start_time datetime [note: "Bắt đầu nghỉ từ ngày giờ nào"]
end_time datetime [note: "Nghỉ đến ngày giờ nào"]
reason text [note: "Lý do xin nghỉ"]
status varchar [note: "Trạng thái duyệt: pending, approved, rejected"]
approved_by int [null, note: "ID của Admin đã duyệt đơn"]
created_at datetime [note: "Ngày tạo đơn"]
}

Table Reviews {
review_id int [pk, increment, note: "Mã đánh giá"]
booking_id int [unique, note: "Đánh giá thuộc về đơn dịch vụ nào (1 đơn - 1 đánh giá)"]
customer_id int [note: "Khách hàng thực hiện đánh giá"]
staff_id int [note: "Nhân viên nhận đánh giá"]
type varchar [note: "Đánh giá nv/khách hàng"]
rating int [note: "Điểm số 1-5 sao"]
comment text [null, note: "Nhận xét chi tiết của khách hàng"]
created_at datetime [note: "Thời điểm đánh giá"]
}

Table IssueReports {
report_id int [pk, increment, note: "Mã báo cáo sự cố/khiếu nại"]
booking_id int [null, note: "Đơn dịch vụ xảy ra sự cố (nếu có)"]
reported_by int [note: "Người báo cáo (có thể là Khách hàng hoặc Nhân viên)"]
issue_type varchar [note: "Phân loại: hỏng hóc tài sản, đi trễ, sai dịch vụ..."]
description text [note: "Mô tả chi tiết sự việc"]
status varchar [note: "Trạng thái xử lý: open, in_progress, resolved"]
resolution text [null, note: "Cách Admin đã giải quyết (hoàn tiền, đền bù...)"]
created_at datetime [note: "Thời điểm báo cáo"]
}

// Thiết lập các mối quan hệ (Foreign Keys) bổ sung
Ref: StaffProfiles.staff_id - Users.user_id // Quan hệ 1-1
Ref: LeaveRequests.staff_id > Users.user_id
Ref: LeaveRequests.approved_by > Users.user_id
Ref: Reviews.booking_id - Bookings.booking_id // Quan hệ 1-1
Ref: Reviews.customer_id > Users.user_id
Ref: Reviews.staff_id > Users.user_id
Ref: IssueReports.booking_id > Bookings.booking_id
Ref: IssueReports.reported_by > Users.user_id

// --- BẢNG QUẢN LÝ TIẾN ĐỘ CÔNG VIỆC ---

Table TaskProgress {
progress_id int [pk, increment, note: "Mã nhật ký tiến độ"]
booking_id int [note: "Thuộc về đơn đặt lịch nào"]
staff_id int [note: "Nhân viên thực hiện cập nhật"]
step_name varchar [note: "Tên bước tiến độ: ví dụ 'Đang đến', 'Đã đến nơi', 'Đang thực hiện', 'Tạm dừng', 'Hoàn thành'"]
evidence_image_url varchar [null, note: "Ảnh minh chứng check-in/out"]
note text [null, note: "Ghi chú kèm theo: ví dụ 'Tắc đường đến muộn 5p', 'Thiếu dụng cụ...'"]
recorded_at datetime [note: "Thời gian ghi nhận mốc tiến độ"]
}

// Thiết lập khóa ngoại
Ref: TaskProgress.booking_id > Bookings.booking_id
Ref: TaskProgress.staff_id > Users.user_id

Table ServiceAreas {
area_id int [pk, increment, note: "Mã khu vực"]
name varchar [note: "Tên khu vực (ví dụ: Quận 1, Quận Bình Thạnh)"]
parent_id int [null, note: "Dùng nếu muốn phân cấp: Tỉnh/Thành -> Quận/Huyện"]
is_active boolean [default: true, note: "Khu vực này hiện có đang phục vụ không"]
created_at datetime
}
Table StaffServiceAreas {
staff_id int [ref: > Users.user_id]
area_id int [ref: > ServiceAreas.area_id]
primary_area boolean [note: "Khu vực hoạt động chính của nhân viên"]
}
Table DiscountCodes {
code_id int [pk, increment, note: "Mã định danh khuyến mãi"]
code varchar [unique, note: "Mã giảm giá (ví dụ: GIUPVIEC2026)"]
description text [note: "Nội dung chương trình ưu đãi"]
discount_type varchar [note: "Hình thức giảm: percentage (phần trăm) hoặc fixed_amount (số tiền cố định)"]
discount_value decimal [note: "Giá trị giảm ($10\%$ hoặc $50.000$ VNĐ)"]
min_booking_amount decimal [note: "Giá trị đơn hàng tối thiểu để áp dụng"]
max_discount_amount decimal [null, note: "Số tiền giảm tối đa (áp dụng cho hình thức phần trăm)"]
start_date datetime [note: "Thời điểm bắt đầu có hiệu lực"]
end_date datetime [note: "Thời điểm hết hạn"]
usage_limit int [note: "Tổng lượt sử dụng tối đa của mã"]
used_count int [default: 0, note: "Số lượt đã sử dụng thực tế"]
is_active boolean [default: true, note: "Trạng thái khả dụng của mã"]
created_at datetime
}
// 1. Danh mục các khóa đào tạo
Table TrainingCourses {
course_id int [pk, increment, note: "Mã định danh khóa học"]
course_name varchar [note: "Tên chương trình đào tạo (ví dụ: Kỹ năng vệ sinh công nghiệp)"]
description text [note: "Nội dung chi tiết khóa đào tạo"]
trainer_name varchar [note: "Tên người hướng dẫn hoặc đơn vị đào tạo"]
duration_hours int [note: "Tổng thời lượng đào tạo (giờ)"]
status varchar [note: "Trạng thái khóa học: upcoming, ongoing, completed"]
created_at datetime
}

// 2. Theo dõi kết quả đào tạo của từng nhân viên
Table StaffTraining {
training_record_id int [pk, increment, note: "Mã bản ghi đào tạo"]
staff_id int [note: "Nhân viên tham gia đào tạo"]
course_id int [note: "Khóa học tương ứng"]

enrollment_date date [note: "Ngày đăng ký tham gia"]
completion_date date [null, note: "Ngày hoàn thành khóa học"]

result_score decimal [null, note: "Điểm số hoặc kết quả đánh giá"]
status varchar [note: "Trạng thái cá nhân: enrolled, in_progress, completed, failed"]
certificate_url varchar [null, note: "Đường dẫn ảnh/file chứng chỉ hoàn thành"]

notes text [null, note: "Nhận xét từ người hướng dẫn"]
}

// Thiết lập mối quan hệ
Ref: StaffTraining.staff_id > Users.user_id
Ref: StaffTraining.course_id > TrainingCourses.course_id
Table RewardsDiscipline {
rd_id int [pk, increment, note: "Mã định danh khen thưởng/kỷ luật"]
staff_id int [note: "Nhân viên nhận quyết định"]
category varchar [note: "Phân loại: reward (khen thưởng) hoặc discipline (kỷ luật)"]

type_name varchar [note: "Tên hình thức: ví dụ 'Thưởng hiệu suất', 'Phạt đi trễ', 'Cảnh cáo'"]
reason text [note: "Lý do cụ thể của quyết định"]
amount decimal [default: 0, note: "Số tiền thưởng hoặc phạt (nếu có)"]

decision_date date [note: "Ngày ban hành quyết định"]
effective_date date [note: "Ngày bắt đầu có hiệu lực"]

approved_by int [null, note: "ID của Quản trị viên phê duyệt"]
file_url varchar [null, note: "Đường dẫn tệp tin văn bản quyết định (PDF/Ảnh)"]

created_at datetime
updated_at datetime
}

// Thiết lập mối quan hệ
Ref: RewardsDiscipline.staff_id > Users.user_id
Ref: RewardsDiscipline.approved_by > Users.user_id
// 1. Danh mục các ca làm việc cố định của hệ thống
Table WorkShifts {
shift_id int [pk, increment, note: "Mã định danh ca làm việc"]
shift_name varchar [note: "Tên ca (ví dụ: Ca sáng, Ca chiều, Toàn thời gian)"]
start_time time [note: "Giờ bắt đầu ca"]
end_time time [note: "Giờ kết thúc ca"]
is_active boolean [default: true, note: "Trạng thái hoạt động của ca"]
}

// 2. Lịch đăng ký làm việc của nhân viên
Table StaffSchedules {
schedule_id int [pk, increment, note: "Mã bản ghi lịch làm việc"]
staff_id int [note: "Nhân viên đăng ký"]
shift_id int [note: "Ca làm việc tương ứng"]
day_of_week int [note: "Thứ trong tuần (1-7) cho lịch cố định"]
work_date date [null, note: "Ngày cụ thể (nếu là lịch làm việc không cố định)"]

status varchar [note: "Trạng thái: active (đang áp dụng), inactive (tạm ngưng)"]
created_at datetime
}

// Thiết lập mối quan hệ
Ref: StaffSchedules.staff_id > Users.user_id
Ref: StaffSchedules.shift_id > WorkShifts.shift_id
