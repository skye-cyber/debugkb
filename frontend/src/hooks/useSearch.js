import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { searchApi } from "../api";
import { qk } from "./queryKeys";
import { mockSearch } from "../api/mocks";
import { USE_MOCK } from "../api/mocks";

export function useSearch({ filters = {}, sort, enabled = true } = {}) {
    const params = {
        q: filters.q,
        severity: filters.severity,
        status: filters.status,
        tags: filters.tags,
        ordering: sort,
    }
    const query = useQuery({
        queryKey: qk.search.query({ ...filters, sort }),
        queryFn: USE_MOCK ? async () => mockSearch(params) : () =>
            searchApi.query(params),
        enabled: enabled && Boolean(filters.q || (filters.severity?.length || filters.status?.length || filters.tags?.length)),
        placeholderData: keepPreviousData,
    });

    return {
        results: query.data?.results ?? [],
        total: query.data?.count ?? 0,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error,
    };
}
