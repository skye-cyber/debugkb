import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { importApi } from "../api";
import { qk } from "./queryKeys";
import { mockImportConfirm, mockImportPreview } from "../api/mocks";
import { USE_MOCK } from "../api/mocks";


export function useImportPreview() {
    return useMutation({
        mutationFn: USE_MOCK
            ? mockImportPreview
            : importApi.preview,
    });
}

export function useImportConfirm() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload) =>
        USE_MOCK ? mockImportConfirm(payload) : importApi.confirm(payload),
        onSuccess: (created) => {
            qc.invalidateQueries({ queryKey: qk.issues.all });
            qc.invalidateQueries({ queryKey: qk.stats.summary });
            return created;
        },
    });
}
