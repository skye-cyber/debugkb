import { Routes, Route } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import Dashboard from "./pages/Dashboard";
import IssuesListPage from "./pages/IssuesListPage";
import SearchPage from "./pages/SearchPage";
import StatsPage from "./pages/StatsPage";
import SkillsPage from "./pages/SkillsPage";
import TagsPage from "./pages/TagsPage";
import ImportPage from "./pages/ImportPage";
import IssueFormPage from "./pages/IssueFormPage";
import IssueDetailPage from "./pages/IssueDetailPage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/issues" element={<IssuesListPage />} />
        <Route path="/issues/new" element={<IssueFormPage />} />
        <Route path="/issues/:id" element={<IssueDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/import" element={<ImportPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/tags" element={<TagsPage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </AppShell>
  );
}
