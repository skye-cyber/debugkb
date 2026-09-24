import { useMutation, useQueryClient } from "@tanstack/react-query";
import { issuesApi } from "../api";
import { qk } from "./queryKeys";
import {
    mockCreateIssue, mockUpdateIssue, mockDeleteIssue,
} from "../api/mocks";
import { USE_MOCK } from "../api/mocks";

export function useCreateIssue() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: USE_MOCK ? (data) => mockCreateIssue(data) : (data) => issuesApi.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: qk.issues.all });
            qc.invalidateQueries({ queryKey: qk.stats.summary });
        },
    });
}

export function useUpdateIssue(id) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: USE_MOCK ? (data) => mockUpdateIssue(id, data) : (data) => issuesApi.update(id, data),
        onSuccess: (updated) => {
            qc.setQueryData(qk.issues.detail(id), updated);
            qc.invalidateQueries({ queryKey: qk.issues.all });
        },
    });
}

export function useDeleteIssue() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: USE_MOCK ? (id) => mockDeleteIssue(id) : (id) => issuesApi.remove(id),
        onSuccess: (_data, id) => {
            qc.removeQueries({ queryKey: qk.issues.detail(id) });
            qc.invalidateQueries({ queryKey: qk.issues.all });
            qc.invalidateQueries({ queryKey: qk.stats.summary });
        },
    });
}
