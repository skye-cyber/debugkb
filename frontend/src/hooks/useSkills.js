import { useQuery } from "@tanstack/react-query";
import { skillsApi } from "../api";
import { qk } from "./queryKeys";
import { USE_MOCK } from "../api/mocks";
import { mockGetSkill, mockListSkills, mockSkillIssues } from "../api/mocks";

export function useSkills() {
  const query = useQuery({
    queryKey: qk.skills.all,
    queryFn: USE_MOCK ? async () => mockListSkills(): () => skillsApi.list(),
    staleTime: 60_000,
  });
  return {
    skills: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useSkill(id) {
  const query = useQuery({
    queryKey: qk.skills.detail(id),
    queryFn: USE_MOCK ? async (id) => mockGetSkill.bind(null, id): () => skillsApi.get(id),
    enabled: Boolean(id),
  });
  return {
    skill: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useSkillIssues(id) {
  const query = useQuery({
    queryKey: qk.skills.issues(id),
    queryFn: USE_MOCK ? async () => mockSkillIssues.bind(null, id): () => skillsApi.listIssues(id),
    enabled: Boolean(id),
  });
  return {
    issues: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
