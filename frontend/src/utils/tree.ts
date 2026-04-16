/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Chuyển đổi một danh sách phẳng (flat) thành cấu trúc cây (tree) dựa trên parentId.
 * @param list - Danh sách mảng phẳng các item có id và parentId.
 * @returns - Mảng đại diện cho cấu trúc cây.
 */
export const listToTree = <T extends { id: number; parentId: number | null }>(
  list: T[]
): (T & { children?: T[] })[] => {
  const map: { [key: number]: any } = {};
  const roots: any[] = [];

  // Khởi tạo map và mảng con rỗng cho mỗi item
  list.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });

  list.forEach((item) => {
    const node = map[item.id];
    if (item.parentId && map[item.parentId]) {
      // Nếu có cha, đẩy vào mảng con của cha
      map[item.parentId].children.push(node);
    } else {
      // Nếu không có cha hoặc cha không có trong list, coi như root
      roots.push(node);
    }
  });

  return roots;
};

