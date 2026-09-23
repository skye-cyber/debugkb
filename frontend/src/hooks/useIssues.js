import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { issuesApi } from "../api";
import { qk } from "./queryKeys";
import { USE_MOCK } from "../api/mocks";
import { mockListIssues } from "../api/mocks";

export function useIssues({ page = 1, pageSize = 20, filters = {}, sort }) {
    const query = useQuery({
        queryKey: USE_MOCK ? async () => mockListIssues(filters): qk.issues.list({ page, pageSize, ...filters, sort }),
        queryFn: () =>
            issuesApi.list({
                page,
                page_size: pageSize,
                q: filters.q,
                severity: filters.severity,
                status: filters.status,
                tags: filters.tags,
                ordering: sort,
            }),
        placeholderData: keepPreviousData,
        staleTime: 30_000,
    });

    return {
        results: query.data?.results ?? [],
        total: query.data?.count ?? 0,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error,
        refetch: query.refetch,
    };
}
