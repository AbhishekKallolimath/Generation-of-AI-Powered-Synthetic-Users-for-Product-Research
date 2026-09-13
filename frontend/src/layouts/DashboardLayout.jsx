import { Link, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  ClipboardList,
  MessageSquare,
  Lightbulb,
  FileText,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Projects", path: "/projects", icon: FolderKanban },
  { name: "Personas", path: "/personas", icon: Users },
  { name: "Surveys", path: "/surveys", icon: ClipboardList },
  { name: "Interviews", path: "/interviews", icon: MessageSquare },
  { name: "Insights", path: "/insights", icon: Lightbulb },
  { name: "Reports", path: "/reports", icon: FileText },
];

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">FinWise</h1>
          <p className="text-sm text-gray-500 mt-1">
            Synthetic User Research
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            AI-powered product research
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Research Workspace
            </h2>
          </div>
        </header>

        <section className="p-8">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default DashboardLayout;