import { useGetQuery } from '@/hooks/useQueryCustom';
import styles from './style.module.scss';
import { customerService } from '@/services/customerService';
import Loading from '@/components/LoadingCommon/Loading';
import formatDate from '@/utils/formatDate';
import { useState } from 'react';
import cls from 'classnames';
import { useEffect } from 'react';
export default function CustomerManagement() {
    const {
        container,
        header,
        title,
        subtitle,
        actions,
        export_btn,
        add_btn,
        stats_grid,
        stat_card,
        stat_card_wide,
        stat_label,
        stat_value,
        stat_trend_pos,
        stat_trend_info,
        stat_label_light,
        stat_value_large,
        stat_info_light,
        badge,
        filter_bar,
        search_box,
        select_box,
        date_box,
        table_card,
        table,
        text_center,
        text_right,
        mono_text,
        cust_info,
        cust_name,
        cust_date,
        contact_info,
        email,
        booking_count,
        amount_text,
        wide_content,
        action_cell,
        action_btns
    } = styles;
    const [page, setPage] = useState(1)
    let queryCustomer = `page=${page}`
    const [search, setSearch] = useState('');
    const [isSearch, setIsSearch] = useState('');
    if(isSearch){
        queryCustomer += `&name=${search}`
    }
    const { data: customers, isLoading } = useGetQuery('customer', customerService.getAllCustomers,queryCustomer);
    useEffect(()=>{
        const timer = setTimeout(()=>{
            setIsSearch(search)
        },1000)
        return ()=>clearTimeout(timer)
    },[search])
    const handlePageChange = (type: 'prev' | 'next') => {
        if (type === 'prev' && page > 1) {
            setPage(page - 1)
        }
        if (type === 'next' && page < customers?.totalPages) {
            setPage(page + 1)
        }
    }
    return (
        <div className={container}>
            <div className={header}>
                <div>
                    <h2 className={title}>Quản lý Khách hàng</h2>
                    <p className={subtitle}>Theo dõi và quản lý dữ liệu thành viên trong hệ thống.</p>
                </div>
                <div className={actions}>
                    <button className={export_btn}>
                        <span className="material-symbols-outlined">download</span>
                        Xuất báo cáo
                    </button>
                    <button className={add_btn}>
                        <span className="material-symbols-outlined">add</span>
                        Thêm Khách hàng
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className={stats_grid}>
                <div className={stat_card}>
                    <p className={stat_label}>Tổng khách hàng</p>
                    <h3 className={stat_value}>{customers?.totalRecords}</h3>
                    <div className={stat_trend_pos}>Chưa có dữ liệu</div>
                </div>
                <div className={stat_card}>
                    <p className={stat_label}>Thành viên VIP</p>
                    <h3 className={stat_value}>Chưa có dữ liệu</h3>
                    <div className={stat_trend_info}>Premium chiếm 0%</div>
                </div>
                <div className={stat_card_wide}>
                    <div className={wide_content}>
                        <p className={stat_label_light}>Doanh thu tích lũy</p>
                        <h3 className={stat_value_large}>Chưa có dữ liệu</h3>
                        <p className={stat_info_light}>Trung bình 0 / KH</p>
                    </div>
                    <div className={badge}>Đã tối ưu</div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className={filter_bar}>
                <div className={search_box}>
                    <span className="material-symbols-outlined">person_search</span>
                    <input type="text" placeholder="Tìm theo Tên hoặc Số điện thoại..." onChange={(e)=> setSearch(e.target.value)} value={search}/>
                </div>
                <div className={select_box}>
                    <label>Trạng thái:</label>
                    <select>
                        <option>Tất cả</option>
                    </select>
                </div>
                <div className={date_box}>
                    <span className="material-symbols-outlined">calendar_month</span>
                    <input type="date" />
                </div>
            </div>

            {/* Table */}
            <div className={table_card}>
                {isLoading && <Loading />}
                <table className={table}>
                    <thead>
                        <tr>
                            <th>Mã KH</th>
                            <th>Khách hàng</th>
                            <th>Liên hệ</th>
                            <th className={text_center}>Booking</th>
                            <th>Tổng chi tiêu</th>
                            <th className={text_right}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(customers?.data || []).map((cust) => (
                            <tr key={cust.id}>
                                <td className={mono_text}>{cust.id}</td>
                                <td>
                                    <div className={cust_info}>
                                        <img src={cust.avatar} alt={cust.name} />
                                        <div>
                                            <p className={cust_name}>{cust.name}</p>
                                            <p className={cust_date}>Tham gia: {formatDate(cust.createdAt)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className={contact_info}>
                                        <p>{cust.phone}</p>
                                        <p className={email}>{cust.email}</p>
                                    </div>
                                </td>
                                <td className={text_center}>
                                    <span className={booking_count}>{cust._count?.bookings}</span>
                                </td>
                                <td className={amount_text}>{cust?.totalSpent}</td>
                                <td className={action_cell}>
                                    <div className={action_btns}>
                                        <button className="material-symbols-outlined">visibility</button>
                                        <button className="material-symbols-outlined">notifications_active</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={styles.pagination}>
                    <p>
                        Showing {customers ? (customers.pageNumber - 1) * customers.pageSize + 1 : 0}-
                        {customers ? Math.min(customers.pageSize * customers.pageNumber, customers.totalRecords) : 0} of{' '}
                        {customers?.totalRecords || 0} customers
                    </p>
                    <div className={styles.page_btns}>
                        <button
                            className="material-symbols-outlined"
                            onClick={() => handlePageChange('prev')}
                            disabled={page === 1}
                        >
                            chevron_left
                        </button>
                        {Array.from({ length: customers?.totalPages || 0 }, (_, i) => (
                            <button
                                key={i}
                                className={cls(page === i + 1 && styles.active_page)}
                                onClick={() => setPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="material-symbols-outlined"
                            onClick={() => handlePageChange('next')}
                            disabled={page === customers?.totalPages}
                        >
                            chevron_right
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
