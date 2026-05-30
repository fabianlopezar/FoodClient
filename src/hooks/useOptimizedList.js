import { useMemo, useState } from "react";
import { getPaginationSlice, getPageNumbers } from "../helpers/pagination";

/**
 * Hook para paginar listas grandes sin recalcular en cada render.
 * Reduce el uso de memoria al renderizar solo la página visible.
 */
export function useOptimizedList(items, itemsPerPage = 9) {
  const [currentPage, setCurrentPage] = useState(1);

  const currentItems = useMemo(
    () => getPaginationSlice(items, currentPage, itemsPerPage),
    [items, currentPage, itemsPerPage]
  );

  const pageNumbers = useMemo(
    () => getPageNumbers(items.length, itemsPerPage),
    [items.length, itemsPerPage]
  );

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, page));
  };

  const resetPage = () => setCurrentPage(1);

  return {
    currentPage,
    currentItems,
    pageNumbers,
    goToPage,
    resetPage,
    setCurrentPage,
  };
}
