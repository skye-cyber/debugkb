import { useQuery } from "@tanstack/react-query";
import { tagsApi } from "../api";
import { qk } from "./queryKeys";
import { USE_MOCK } from "../api/mocks";
import { mockListTags } from "../api/mocks";

export function useTags() {
    const query = useQuery({
        queryKey: qk.tags.all,
        queryFn: USE_MOCK ? async () => mockListTags() : () => tagsApi.list(),
        staleTime: 5 * 60_000,
    });

    return {
        tags: query.data ?? [],
        isLoading: query.isLoading,
        error: query.error,
    };
}
