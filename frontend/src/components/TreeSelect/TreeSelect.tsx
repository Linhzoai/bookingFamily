import React, { useState, useRef, useEffect } from 'react';
import styles from './style.module.scss';
import { ChevronRight, ChevronDown, X } from 'lucide-react';
import clsx from 'clsx';

interface TreeDataItem {
  id: number;
  name: string;
  children?: TreeDataItem[];
}

interface TreeSelectProps {
  data: TreeDataItem[];
  value?: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

const TreeSelect: React.FC<TreeSelectProps> = ({
  data,
  value,
  onChange,
  placeholder = 'Chọn khu vực...',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  // Tìm tên của node đang được chọn
  const findNodeName = (nodes: TreeDataItem[], targetId: number): string | null => {
    for (const node of nodes) {
      if (node.id === targetId) return node.name;
      if (node.children) {
        const found = findNodeName(node.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedLabel = value ? findNodeName(data, value) : null;

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleExpand = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

  const handleSelect = (id: number) => {
    onChange(id);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const renderTree = (nodes: TreeDataItem[]) => {
    return (
      <ul className={styles.treeList}>
        {nodes.map((node) => {
          const hasChildren = node.children && node.children.length > 0;
          const isExpanded = expandedNodes.has(node.id);
          const isSelected = value === node.id;

          return (
            <li key={node.id} className={styles.treeNode}>
              <div 
                className={clsx(styles.nodeContent, isSelected && styles.isSelected)}
                onClick={() => handleSelect(node.id)}
              >
                {hasChildren ? (
                  <span 
                    className={clsx(styles.toggleIcon, isExpanded && styles.expanded)}
                    onClick={(e) => toggleExpand(node.id, e)}
                  >
                    <ChevronRight size={16} />
                  </span>
                ) : (
                  <span style={{ width: 20 }} /> // Spacer
                )}
                <span className={styles.label}>{node.name}</span>
              </div>
              
              {hasChildren && isExpanded && (
                <div className={styles.childrenContainer}>
                  {renderTree(node.children)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className={clsx(styles.treeSelectContainer, disabled && styles.disabled)} ref={containerRef}>
      <div 
        className={clsx(styles.selectDisplay, isOpen && styles.isOpen)} 
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {selectedLabel ? (
          <span className={styles.selectedValue}>{selectedLabel}</span>
        ) : (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {value && (
            <X 
              size={14} 
              className={styles.clearIcon} 
              onClick={handleClear}
            />
          )}
          <ChevronDown 
            size={18} 
            className={clsx(styles.arrowIcon, isOpen && styles.up)} 
          />
        </div>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {data.length > 0 ? (
            renderTree(data)
          ) : (
            <div className={styles.noData}>Không có dữ liệu</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TreeSelect;
