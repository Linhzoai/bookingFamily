import{ useState } from 'react';
import classNames from 'classnames';
import { Search, Plus, Filter } from 'lucide-react';
import styles from './style.module.scss';
import InputDiscountForm from './components/InputDisountForm/InputDiscountForm';
import TableDiscount from './components/TableDiscount/TableDiscount';

// Mock data
const mockDiscounts = [
  { id: 1, code: 'SUMMER2026', type: 'percentage', value: 15, minOrder: 0, startDate: '2026-06-01', endDate: '2026-08-31', usageLimit: 100, usedCount: 24, status: 'active' },
  { id: 2, code: 'WELCOME50K', type: 'fixed', value: 50000, minOrder: 150000, startDate: '2026-01-01', endDate: '2026-12-31', usageLimit: null, usedCount: 412, status: 'active' },
  { id: 3, code: 'FLASH10', type: 'percentage', value: 10, minOrder: 0, startDate: '2026-05-15', endDate: '2026-05-18', usageLimit: 50, usedCount: 50, status: 'inactive' },
];

const Discount = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Quản lý Mã giảm giá</h1>
          <p className={styles.subtitle}>Thiết lập và theo dõi các chiến dịch khuyến mãi của hệ thống</p>
        </div>
      </header>

      <div className={styles.content_grid}>
        {/* Left Side: Bảng dữ liệu */}
        <div className={styles.table_section}>
          <section className={styles.toolbar}>
            <div className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input type="text" placeholder="Tìm kiếm theo mã code..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className={styles.actions}>
              <button className={classNames(styles.btn, styles.btnSecondary)}>
                <Filter size={18} />
                Bộ lọc
              </button>
              <button className={classNames(styles.btn, styles.btnPrimary)} onClick={() => setIsOpen(!isOpen)}>
                <Plus size={18} />
                Thêm mã mới
              </button>
            </div>
          </section>
          <TableDiscount data={mockDiscounts} />
        </div>

        {/* Form thêm mã */}
        <InputDiscountForm isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  );
};

export default Discount;
