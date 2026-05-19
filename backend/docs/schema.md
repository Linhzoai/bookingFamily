    // dbdiagram.io Schema - Đồng bộ với Prisma Schema
    // Công cụ: https://dbdiagram.io/d

    // ============================================
    // USERS
    // ============================================
    Table users {
    id                  String      [pk, default: `uuid()`]
    role                String      [not null]
    name                String      [not null]
    email               String      [unique, not null]
    phone               String      [not null]
    hash_password       String      [not null]
    address             String
    gender              String
    area_id             Int         [ref: > service_areas.area_id]
    status              String      [default: "active"]
    avatar_url          String
    created_at          DateTime    [default: `now()`]
    updated_at          DateTime    [default: `now()`]
    }

    // ============================================
    // SERVICE AREAS (Khu vực phục vụ)
    // ============================================
    Table service_areas {
    area_id     Int           [pk, increment]
    name        String        [not null]
    parent_id   Int
    is_active   Boolean       [default: true]
    path        String
    created_at  DateTime      [default: `now()`]
    }

    // ============================================
    // SERVICE CATEGORIES (Loại dịch vụ)
    // ============================================
    Table service_categories {
    category_id   Int       [pk, increment]
    name          String    [unique, not null]
    description   String    [not null]
    icon_url      String
    is_active     Boolean   [default: true]
    created_at    DateTime  [default: `now()`]
    updated_at    DateTime  [default: `now()`]
    }

    // ============================================
    // SERVICES (Dịch vụ)
    // ============================================
    Table services {
    service_id   Int               [pk, increment]
    name         String            [not null]
    description String             [not null]
    price       Decimal(12, 2)     [not null]
    duration    Int                [not null]
    image_url   String
    active      Boolean            [default: true]
    category_id Int                [not null, ref: > service_categories.category_id]
    created_at  DateTime           [default: `now()`]
    updated_at  DateTime           [default: `now()`]
    }

    // ============================================
    // DISCOUNT CODES (Mã giảm giá)
    // ============================================
    Table discount_codes {
    code_id             String      [pk, default: `uuid()`]
    code                String      [unique, not null]
    description         String      [not null]
    discount_type       String      [not null]
    discount_value      Decimal(12, 2) [not null]
    min_booking_amount  Decimal(12, 2) [not null]
    max_discount_amount Decimal(12, 2)
    start_date          DateTime    [not null]
    end_date            DateTime    [not null]
    usage_limit         Int         [not null]
    used_count          Int         [default: 0]
    is_active           Boolean     [default: true]
    created_at          DateTime    [default: `now()`]
    }

    // ============================================
    // BOOKINGS (Đơn đặt lịch)
    // ============================================
    Table bookings {
    booking_id         String        [pk, default: `uuid()`]
    customer_id        String        [not null, ref: > users.id]
    address            String        [not null]
    area_id            Int           [not null, ref: > service_areas.area_id]
    scheduled_time     DateTime      [not null]
    discount_code_id   String        [ref: > discount_codes.code_id]
    status             String        [not null]
    note               String
    total_amount       Decimal(12, 2) [not null]
    actual_start_time  DateTime
    cancel_reason      String
    actual_end_time    DateTime
    payment_status     String        [default: "PENDING"]
    created_at         DateTime      [default: `now()`]
    updated_at         DateTime      [default: `now()`]
    }

    // ============================================
    // BOOKING DETAILS (Chi tiết đơn hàng)
    // ============================================
    Table booking_details {
    booking_detail_id Int       [pk, increment]
    booking_id        String    [not null, ref: > bookings.booking_id]
    service_id        Int       [not null, ref: > services.service_id]
    quantity          Int       [default: 1]
    unit_price        Decimal(12, 2) [not null]
    notes             String    [not null]
    created_at        DateTime  [default: `now()`]
    updated_at        DateTime  [default: `now()`]
    }

    // ============================================
    // STAFF ASSIGNMENTS (Phân công nhân viên)
    // ============================================
    Table staff_assignments {
    assign_id    Int       [pk, increment]
    booking_id   String    [not null, ref: > bookings.booking_id]
    staff_id     String    [not null, ref: > users.id]
    assigned_at  DateTime  [not null]
    status       String    [not null]
    }

    // ============================================
    // PAYMENTS (Thanh toán)
    // ============================================
    Table payments {
    payment_id       Int       [pk, increment]
    booking_id       String    [not null, ref: > bookings.booking_id]
    amount           Decimal(12, 2) [not null]
    method           String    [not null]
    status           String    [not null]
    transaction_id   String
    paid_at          DateTime
    gateway_response Json
    vnpay_tnx_ref    String    [default: ""]
    created_at       DateTime  [default: `now()`]
    updated_at       DateTime  [default: `now()`]
    }

    // ============================================
    // NOTIFICATIONS (Thông báo)
    // ============================================
    Table notifications {
    notification_id Int       [pk, increment]
    user_id         String    [not null, ref: > users.id]
    message         String    [not null]
    type            String    [not null]
    is_read         Boolean   [default: false]
    created_at      DateTime  [default: `now()`]
    }

    // ============================================
    // AUDIT LOGS (Nhật ký hệ thống)
    // ============================================
    Table audit_logs {
    log_id     Int       [pk, increment]
    user_id    String    [ref: > users.id]
    entity     String    [not null]
    entity_id  Int       [not null]
    action     String    [not null]
    timestamp  DateTime  [default: `now()`]
    details    String
    }

    // ============================================
    // SESSIONS (Phiên đăng nhập)
    // ============================================
    Table sessions {
    session_id Int       [pk, increment]
    user_id    String    [not null, ref: > users.id]
    token      String    [unique, not null]
    expires_at DateTime  [not null]
    created_at DateTime  [default: `now()`]
    updated_at DateTime  [default: `now()`]
    }

    // ============================================
    // STAFF PROFILES (Hồ sơ nhân viên)
    // ============================================
    Table staff_profiles {
    profile_id             Int       [pk, increment]
    staff_id               String    [unique, not null, ref: > users.id]
    id_card_number         String    [unique, not null]
    skills                 String    [not null]
    experience             String
    review                 String
    hire_date              DateTime  [not null]
    status                 String    [not null]
    current_availability  String    [default: "available"]
    }

    // ============================================
    // CONTRACTS (Hợp đồng)
    // ============================================
    Table contracts {
    contract_id     Int         [pk, increment]
    contract_number String      [unique, not null]
    staff_id        String      [not null, ref: > users.id]
    contract_type   String      [not null]
    sign_date       DateTime    [not null]
    start_date      DateTime    [not null]
    end_date        DateTime
    base_salary     Decimal(12, 2) [not null]
    commission_rate Decimal(5, 2)
    status          String      [not null]
    file_url        String
    created_at      DateTime    [default: `now()`]
    updated_at      DateTime    [default: `now()`]
    }

    // ============================================
    // LEAVE REQUESTS (Đơn xin nghỉ)
    // ============================================
    Table leave_requests {
    leave_id     Int       [pk, increment]
    staff_id     String    [not null, ref: > users.id]
    start_time   DateTime  [not null]
    end_time     DateTime  [not null]
    reason       String    [not null]
    status       String    [not null]
    approved_by  String    [ref: > users.id]
    created_at   DateTime  [default: `now()`]
    }

    // ============================================
    // REVIEWS (Đánh giá)
    // ============================================
    Table reviews {
    review_id    Int       [pk, increment]
    booking_id   String    [unique, not null, ref: > bookings.booking_id]
    customer_id  String    [not null, ref: > users.id]
    staff_id     String    [not null, ref: > users.id]
    type         String    [not null]
    rating       Int       [not null]
    comment      String
    created_at   DateTime  [default: `now()`]
    }

    // ============================================
    // ISSUE REPORTS (Báo cáo sự cố)
    // ============================================
    Table issue_reports {
    report_id     Int       [pk, increment]
    booking_id    String    [ref: > bookings.booking_id]
    reported_by   String    [not null, ref: > users.id]
    issue_type    String    [not null]
    description   String    [not null]
    status        String    [not null]
    resolution    String
    created_at    DateTime  [default: `now()`]
    }

    // ============================================
    // TASK PROGRESS (Tiến độ công việc)
    // ============================================
    Table task_progress {
    progress_id        Int       [pk, increment]
    booking_id         String    [not null, ref: > bookings.booking_id]
    staff_id           String    [not null, ref: > users.id]
    step_name          String    [not null]
    evidence_image_url String
    note               String
    recorded_at        DateTime  [not null]
    updated_at         DateTime  [default: `now()`]
    }

    // ============================================
    // STAFF SERVICE AREAS (Khu vực phục vụ của nhân viên)
    // ============================================
    Table staff_service_areas {
    staff_id      String      [pk, not null, ref: > users.id]
    area_id       Int         [pk, not null, ref: > service_areas.area_id]
    primary_area  Boolean     [default: false]
    }

    // ============================================
    // TRAINING COURSES (Khóa đào tạo)
    // ============================================
    Table training_courses {
    course_id       Int       [pk, increment]
    course_name     String    [not null]
    description     String    [not null]
    trainer_name    String    [not null]
    duration_hours  Int       [not null]
    status          String    [not null]
    created_at      DateTime  [default: `now()`]
    }

    // ============================================
    // STAFF TRAINING (Đào tạo nhân viên)
    // ============================================
    Table staff_training {
    training_record_id Int       [pk, increment]
    staff_id           String    [not null, ref: > users.id]
    course_id          Int       [not null, ref: > training_courses.course_id]
    enrollment_date    DateTime  [not null]
    completion_date    DateTime
    result_score       Decimal(5, 2)
    status             String    [not null]
    certificate_url    String
    notes              String
    }

    // ============================================
    // REWARDS & DISCIPLINE (Khen thưởng - Kỷ luật)
    // ============================================
    Table rewards_discipline {
    rd_id           Int       [pk, increment]
    staff_id        String    [not null, ref: > users.id]
    category        String    [not null]
    type_name      String    [not null]
    reason         String    [not null]
    amount         Decimal(12, 2) [default: 0.00]
    decision_date  DateTime  [not null]
    effective_date DateTime  [not null]
    approved_by    String    [ref: > users.id]
    file_url        String
    created_at     DateTime  [default: `now()`]
    updated_at     DateTime  [default: `now()`]
    }

    // ============================================
    // WORK SHIFTS (Ca làm việc)
    // ============================================
    Table work_shifts {
    shift_id    Int       [pk, increment]
    shift_name  String    [not null]
    start_time  DateTime  [not null]
    end_time    DateTime  [not null]
    is_active   Boolean   [default: true]
    }

    // ============================================
    // STAFF SCHEDULES (Lịch làm việc)
    // ============================================
    Table staff_schedules {
    schedule_id  Int       [pk, increment]
    staff_id     String    [not null, ref: > users.id]
    shift_id     Int       [not null, ref: > work_shifts.shift_id]
    day_of_week  Int       [not null]
    work_date    DateTime
    status       String    [not null]
    created_at   DateTime  [default: `now()`]
    }

