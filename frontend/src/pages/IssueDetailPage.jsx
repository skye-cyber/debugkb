import { useParams, useNavigate } from "react-router-dom";
import { useIssue } from "../hooks/useIssue";
import IssueHeader from "../components/issues/IssueHeader";
import EnvironmentTable from "../components/issues/EnvironmentTable";
import InvestigationTimeline from "../components/issues/InvestigationTimeline";
import ResolutionBlock from "../components/issues/ResolutionBlock";
import LessonsList from "../components/issues/LessonsList";
import SourcesList from "../components/issues/SourcesList";
import RelatedIssuesList from "../components/issues/RelatedIssuesList";
import IssueDetailSkeleton from "../components/issues/IssueDetailSkeleton";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { useDeleteIssue } from "../hooks/useIssueMutations";
import { AlertCircle } from "lucide-react";

export default function IssueDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { issue, isLoading, error } = useIssue(id);


    const deleteMutation = useDeleteIssue();

    const handleDelete = () => {
        if (confirm("Delete this issue? This cannot be undone.")) {
            deleteMutation.mutate(issue.id, {
                onSuccess: () => navigate("/issues"),
                onError: (err) => alert(err.message),
            });
        }
    };

    if (isLoading) return <IssueDetailSkeleton />;

    if (error || !issue) {
        return (
            <EmptyState
                icon={AlertCircle}
                title="Issue not found"
                description={`No issue with ID "${id}" exists.`}
                action={
                    <Button variant="outline" onClick={() => navigate("/issues")}>
                        Back to issues
                    </Button>
                }
            />
        );
    }


    return (
        <>
            <IssueHeader issue={issue} onDelete={handleDelete} />

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main column */}
                <div className="lg:col-span-2 space-y-6">
                    <InvestigationTimeline steps={issue.investigation_steps} />
                    <ResolutionBlock resolution={issue.resolution} />
                    <LessonsList lessons={issue.lessons} />
                </div>

                {/* Side column */}
                <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
                    <EnvironmentTable environment={issue.environment} />
                    <SourcesList sources={issue.sources} />
                    <RelatedIssuesList issues={issue.related_issues} />
                </aside>
            </div>
        </>
    );
}
