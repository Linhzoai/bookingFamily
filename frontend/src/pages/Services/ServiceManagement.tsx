import styles from './style.module.scss';
import CategoryCard from './components/CategoryCard';
import { useDeleteQuery, useGetQuery } from '@/hooks/useQueryCustom';
import { serviceService } from '@/services/serviceService';
import { categoriesService } from '@/services/categoriesService';
import { formatOption } from '@/utils/formatOption';
import SelectSearch from '@/components/SelectSearch/SelectSearch';
import { useEffect, useState } from 'react';
import InputCommon from '@/components/InputCommon/InputCommon';
import cls from 'clsx';
import Loading from '@/components/LoadingCommon/Loading';
import { useSideBarStore } from '@/stores/useSidebarStore';

export default function ServiceManagement() {
    const [categoryId, setCategoryId] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>('');
    const [inputValue, setInputValue] = useState<string>('');
    const {toggleType} = useSideBarStore();
    let queryServer = `page=${page}`;
    if(categoryId) {
        queryServer += `&categoryId=${categoryId}`;
    }
    if(search) {
        queryServer += `&name=${search}`;
    }
    const { data: services, isLoading: isLoadingServices } = useGetQuery(
        'services',
        serviceService.getAllServices,
        queryServer
    );
    const { data: categories, isLoading: isLoadingCategories } = useGetQuery(
        'categories',
        categoriesService.getAllCategories,
        'limit=999'
    );
    const {mutate: deleteService, isPending: isPendingDeleteService} = useDeleteQuery('services', serviceService.deleteService);
    useEffect(()=>{
        const timer = setTimeout(()=>{
            setSearch(inputValue);
            setPage(1); 
        }, 500);
        return () => clearTimeout(timer);
    }, [inputValue])

    
    const handlePageChange = (type: string) => {
        if(type === 'next') {
            if(page < (services?.totalPages || 1)) {
                setPage(page + 1);
            }
        } else {
            if(page > 1) {
                setPage(page - 1);
            }
        }
    }
    const handleOpenCreateForm = () =>{
        toggleType('create_service');
    }
    const handleDeleteService = (id: string) =>{
        deleteService(id);
    }
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Quản lý Dịch vụ</h2>
                    <p className={styles.subtitle}>Thiết lập và điều chỉnh danh mục dịch vụ cung cấp.</p>
                </div>
                <button className={styles.add_btn} onClick={handleOpenCreateForm}>
                    <span className="material-symbols-outlined">add</span>
                    Thêm dịch vụ mới
                </button>
            </div>

            <div className={styles.categories_grid}>
                {(categories?.data.slice(0, 4) || []).map((category) => (
                    <CategoryCard
                        key={category.id}
                        title={category.name}
                        count={category._count.services}
                        icon="cleaning_services"
                    />
                ))}
            </div>

            <div className={styles.table_card}>
                <div className={styles.table_header}>
                    <h3>Danh sách dịch vụ</h3>
                    <div className={styles.search_box}>
                        <InputCommon 
                            placeholder="Tìm kiếm dịch vụ..." 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                    <SelectSearch
                        options={formatOption(categories?.data || [])}
                        placeholder="Chọn danh mục"
                        value={categoryId}
                        onChange={(e) =>{
                            setCategoryId(Number(e.target.value));
                            setPage(1);
                        }}
                    />
                </div>
                <table className={styles.table}>
                    {(isLoadingServices || isLoadingCategories || isPendingDeleteService) && <Loading />}
                    <thead>
                        <tr>    
                            <th>Dịch vụ</th>
                            <th>Mô tả</th>
                            <th>Giá cơ bản</th>
                            <th>Thời lượng TB</th>
                            <th>Trạng thái</th>
                            <th className={styles.text_right}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services?.data.map((sv) => (
                            <tr key={sv.id}>
                                <td>
                                    <div className={styles.service_info}>
                                        <img src={sv.imageUrl} alt={sv.name} />
                                        <div>
                                            <p className={styles.service_name}>{sv.name}</p>
                                            <p className={styles.service_cat}>{sv.category.name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <p className={styles.service_description}>{sv.description}</p>
                                </td>
                                <td className={styles.price_text}>{Number(sv.price).toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}</td>
                                <td className={styles.time_text}>{sv.duration} phút</td>
                                <td>
                                    {sv.active === true ? (
                                        <span className={styles.status_active}>
                                            <span className="material-symbols-outlined">check_circle</span>
                                            Đang hoạt động
                                        </span>
                                    ) : (
                                        <span className={styles.status_inactive}>
                                            <span className="material-symbols-outlined">pause_circle</span>
                                            Tạm ngưng
                                        </span>
                                    )}
                                </td>
                                <td className={styles.action_btns}>
                                    <button className="material-symbols-outlined" onClick={()=> toggleType('update_service', null, sv)}>edit</button>
                                    <button className="material-symbols-outlined" onClick={()=> handleDeleteService(sv.id)}>delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                    <div className={styles.pagination}>
                    <p>
                        Showing {services ? (services.pageNumber - 1) * services.pageSize + 1 : 0}-{services ? Math.min(services.pageSize * services.pageNumber, services.totalRecords) : 0} of{' '}
                        {services?.totalRecords || 0} services
                    </p>
                    <div className={styles.page_btns}>
                        <button className="material-symbols-outlined" onClick={() => handlePageChange('prev')} disabled={page === 1}>chevron_left</button>
                        {Array.from({ length: services?.totalPages || 0 }, (_, i) => (
                            <button key={i} className={cls(page === i + 1 && styles.active_page)} onClick={() => setPage(i + 1)}>{i + 1}</button>
                        ))}
                        <button className="material-symbols-outlined" onClick={() => handlePageChange('next')} disabled={page === services?.totalPages}>chevron_right</button>
                    </div>
                    </div>
            </div>
        </div>
    );
}
