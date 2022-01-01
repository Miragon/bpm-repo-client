import { useMemo, useState } from "react";

export interface PaginationConfig {
    totalPages: number;
    currentPage: number;
    onPageChanged: (page: number) => void;
}

export const usePagination = <T>(items: T[] | undefined, pageSize: number): {
    pageItems: T[];
    paginationConfig: PaginationConfig
} => {
    const [currentPage, setCurrentPage] = useState(0);

    const pageItems = useMemo(() => {
        const startIndex = pageSize * currentPage;
        const endIndex = Math.min((items || []).length, startIndex + pageSize);
        return (items || []).slice(startIndex, endIndex);
    }, [pageSize, currentPage, items]);

    return {
        paginationConfig: {
            totalPages: Math.max(0, Math.ceil((items || []).length / pageSize)),
            currentPage: currentPage,
            onPageChanged: setCurrentPage
        },
        pageItems: pageItems
    };
};
