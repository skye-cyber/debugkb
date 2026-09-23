import { useQuery } from "@tanstack/react-query";
import { issuesApi } from "../api";
import { qk } from "./queryKeys";
import { USE_MOCK } from "../api/mocks";
import { mockGetIssue } from "../api/mocks";

export function useIssue(id) {
    const query = useQuery({
        queryKey: qk.issues.detail(id),
        queryFn:   USE_MOCK ? async () => mockGetIssue(filters): () => issuesApi.get(id),
        enabled: Boolean(id),
        staleTime: 30_000,
    });

    return {
        issue: query.data,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
}
