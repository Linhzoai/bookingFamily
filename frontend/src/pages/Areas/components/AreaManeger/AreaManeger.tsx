import styles from './style.module.scss';
import formatDate from '@/utils/formatDate';
import { useDeleteQuery, useGetQuery } from '@/hooks/useQueryCustom';
import { AreaService } from '@/services/areaService';
import type { Area } from '@/types/booking';
import { useDebounce } from '@/hooks/useDebounce';
import { useState } from 'react';
import Loading from '@/components/LoadingCommon/Loading';
interface AreaManagerProps {
    handleOpenForm: (type: string) => void;
    handleAddAreaDate: (data: Area) => void;
}
export default function AreaManager({ handleOpenForm, handleAddAreaDate }: AreaManagerProps) {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 1000);
    const queryStr = `parentId=0&page=${page}${debouncedSearch ? `&name=${debouncedSearch}` : ''}`;
    const {mutate: deleteArea, isPending: deletePending} = useDeleteQuery('areas',AreaService.deleteArea, 'Khu vực');
    const { data, isLoading } = useGetQuery('areas', AreaService.getAllAreas, queryStr);
    const areas = data?.data;
    const {
        container,
        section_header,
        add_btn,
        section_title,
        section_subtitle,
        table_wrapper,
        table_head,
        table_body,
        row,
        area_id,
        area_name,
        text_center,
        status_badge,
        dot,
        date_text,
        actions,
        text_right,
        table_footer,
        wrapper_pagination,
        active,
        header_action,
        search_input
    } = styles;
    const handleDeleteArea = (id: number) =>{
        deleteArea(id);
    }
    return (
        <div className={container}>
            
            <div className={section_header}>
                <div>
                    <h3 className={section_title}>Quản lý khu vực</h3>
                    <p className={section_subtitle}>Danh sách khu vực trong hệ thống</p>
                </div>
                <div className={header_action}>
                    <div className={search_input}>
                        <span className="material-symbols-outlined">search</span>
                        <input type="text" placeholder="Tìm kiếm" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <button className={add_btn} onClick={() => handleOpenForm('create')}>
                        <span className="material-symbols-outlined">add</span>
                        Thêm khu vực mới
                    </button>
                    
                </div>
            </div>

            <div className={table_wrapper}>
                
                <div className={table_head}>
                    <span>Mã Khu vực</span>
                    <span>Tên Khu vực</span>
                    <span className={text_center}>Nhân sự</span>
                    <span>Trạng thái</span>
                    <span>Ngày tạo</span>
                    <span className={text_right}>Thao tác</span>
                </div>
                <div className={table_body}>
                    {(isLoading || deletePending) && <Loading />}
                    {(areas ?? []).map((area) => (
                        <div key={area.id} className={row}>
                            <span className={area_id}>{area.id}</span>
                            <span className={area_name}>{area.name}</span>
                            <span className={text_center}>Chưa cập nhật</span>
                            <div>
                                <span className={`${status_badge} ${styles[area.isActive ? 'active' : 'inactive']}`}>
                                    <span className={dot}></span>
                                    {area.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                                </span>
                            </div>
                            <span className={date_text}>{formatDate(area.createdAt)}</span>
                            <div className={actions}>
                                <button className="material-symbols-outlined" onClick={() => handleAddAreaDate(area)}>
                                    edit
                                </button>
                                <button className="material-symbols-outlined delete" onClick={() => handleDeleteArea(area.id)} >delete</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={table_footer}>
                    <div className={wrapper_pagination}>
                        <button
                            onClick={() => {
                                if (page > 1) setPage(page - 1);
                            }}
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        {page > 4 && (
                            <>
                                <button onClick={() => setPage(1)}>1</button>
                                <button>...</button>
                            </>
                        )}
                        {Array.from({ length: 5 }, (_, i) => {
                            const pageNum = page - 2 + i;
                            if (pageNum <= 0 || pageNum > data?.totalPages) return null;
                            return (
                                <button
                                    key={i}
                                    onClick={() => setPage(pageNum)}
                                    className={pageNum === page ? active : ''}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        {page < data?.totalPages - 4 && (
                            <>
                                <button>...</button>
                                <button onClick={() => setPage(data.totalPages)}>{data.totalPages}</button>
                            </>
                        )}
                        <button
                            onClick={() => {
                                if (page < data?.totalPages) setPage(page + 1);
                            }}
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
