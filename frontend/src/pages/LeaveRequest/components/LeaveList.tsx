import styles from './LeaveList.module.scss';
import StatusBadge from '@/components/StatusBadge/StatusBadge';
import type { LeaveRequest } from '@/types/leaveRequest';

interface LeaveListProps {
    data: LeaveRequest[];
    onUpdateStatus: (id: number, status: 'approved' | 'rejected') => void;
}

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
};

const getStatusText = (status: string) => {
    if (status === 'pending') return 'Chờ duyệt';
    if (status === 'approved') return 'Đã duyệt';
    if (status === 'rejected') return 'Từ chối';
    return status;
};

export default function LeaveList({ data, onUpdateStatus }: LeaveListProps) {
    return (
        <div className={styles.listContainer}>
            <div className={styles.listHeader}>
                <div className={styles.colEmployee}>Nhân viên</div>
                <div className={styles.colDuration}>Thời gian</div>
                <div className={styles.colReason}>Lý do</div>
                <div className={styles.colStatus}>Trạng thái</div>
                <div className={styles.colActions}>Thao tác</div>
            </div>
            
            <div className={styles.listBody}>
                {data.map((item, index) => (
                    <div key={item.id} className={`${styles.listItem} ${index % 2 !== 0 ? styles.oddRow : ''}`}>
                        <div className={styles.colEmployee}>
                            <div className={styles.employeeInfo}>
                                <div className={styles.avatar}>
                                    <img src={item.staff?.avatarUrl || 'https://via.placeholder.com/40'} alt="avatar" />
                                </div>
                                <div className={styles.details}>
                                    <span className={styles.name}>{item.staff?.name || 'Unknown'}</span>
                                    <span className={styles.empId}>{item.staffId}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className={styles.colDuration}>
                            <span className={styles.date}>{formatDate(item.startTime)} - {formatDate(item.endTime)}</span>
                        </div>
                        
                        <div className={styles.colReason}>
                            <p className={styles.reasonText}>{item.reason}</p>
                        </div>
                        
                        <div className={styles.colStatus}>
                            <StatusBadge 
                                status={item.status} 
                                text={getStatusText(item.status)} 
                            />
                        </div>                        
                        <div className={styles.colActions}>
                            {item.status === 'pending' ? (
                                <>
                                    <button 
                                        className={`${styles.ghostBtn} ${styles.approveBtn}`}
                                        onClick={() => onUpdateStatus(item.id, 'approved')}
                                    >Duyệt</button>
                                    <button 
                                        className={`${styles.ghostBtn} ${styles.rejectBtn}`}
                                        onClick={() => onUpdateStatus(item.id, 'rejected')}
                                    >Từ chối</button>
                                </>
                            ) : (
                                <button className={`${styles.ghostBtn} ${styles.viewBtn}`}>Chi tiết</button>
                            )}
                        </div>
                    </div>
                ))}
                
                {data.length === 0 && (
                    <div className={styles.emptyState}>Không có dữ liệu đơn xin nghỉ phép.</div>
                )}
            </div>
        </div>
    );
}
