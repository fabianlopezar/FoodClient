/** Utilidades de paginación para listas grandes (optimización de memoria). */

export function getPaginationSlice(items, currentPage, itemsPerPage) {
  const safePage = Math.max(1, currentPage);
  const indexOfLastItem = safePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  return items.slice(indexOfFirstItem, indexOfLastItem);
}

export function getTotalPages(totalItems, itemsPerPage) {
  if (itemsPerPage <= 0) return 0;
  return Math.ceil(totalItems / itemsPerPage);
}

export function getPageNumbers(totalItems, itemsPerPage) {
  const total = getTotalPages(totalItems, itemsPerPage);
  return Array.from({ length: total }, (_, i) => i + 1);
}
