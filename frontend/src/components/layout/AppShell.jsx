import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
