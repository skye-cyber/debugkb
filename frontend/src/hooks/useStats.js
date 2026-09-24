import { useQuery } from "@tanstack/react-query";
import { statsApi } from "../api";
import { qk } from "./queryKeys";
import { USE_MOCK } from "../api/mocks";
import { mockStatsSummary } from "../api/mocks";

export function useStats() {
  // console.log("---s", mockStatsSummary())
  const query = useQuery({
    queryKey: qk.stats.summary,
    queryFn: USE_MOCK ? async () => mockStatsSummary(): () => statsApi.summary(),
    staleTime: 30_000,
  });
  return {
    stats: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
