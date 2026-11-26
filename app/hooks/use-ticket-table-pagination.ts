import * as React from 'react';

/**
 * Shared client pagination hook that resets to page 1 whenever the serialized filter key changes.
 */
export function useTicketTablePagination<T>(items: T[], filterKey: string, pageSize = 10) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [prevFilterKey, setPrevFilterKey] = React.useState(filterKey);

  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setCurrentPage(1);
  }

  const totalPages = Math.ceil(items.length / pageSize);
  const paginatedItems = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    pageSize,
  };
}
