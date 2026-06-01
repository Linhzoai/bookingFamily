const renderStatus = (status:string) => {
    switch (status) {
        case 'pending':
            return 'Chờ xử lý'
        case 'approved':
            return 'Đã duyệt'
        case 'rejected':
            return 'Đã từ chối'
        case 'pending assignment':
            return 'Chờ phân công'
        case 'assigned':
            return 'Đang làm việc'
        case 'completed':
            return 'Đã hoàn thành'
        case 'cancelled':
            return 'Đã huỷ'
        case 'accepted':
            return 'Đã nhận việc'
        case 'active':
            return 'Đang hoạt động'
        case 'inactive':
            return 'Không hoạt động'
        case 'arrived':
            return 'Đã đến'
        case 'no_staff_available':
            return "Chờ phân công"
        default:
            return 'Không xác định'
    }
}
export default renderStatus