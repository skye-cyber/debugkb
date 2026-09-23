import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { importApi } from "../api";
import { qk } from "./queryKeys";
import { mockImportPreview } from "../api/mocks";

export function useImportPreview() {
    return useMutation({
        mutationFn: (payload) => importApi.preview(payload),
    });
}

export function useImportConfirm() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload) =>
            USE_MOCK ? mockImportPreview(payload) : (payload) => importApi.confirm(payload),
        onSuccess: (created) => {
            qc.invalidateQueries({ queryKey: qk.issues.all });
            qc.invalidateQueries({ queryKey: qk.stats.summary });
            return created;
        },
    });
}
