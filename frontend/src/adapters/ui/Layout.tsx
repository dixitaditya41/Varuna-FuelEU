import type { ReactNode } from "react";
import {
  Ship,
  Waves,
  Ban,
  Users,
  GitCompareArrows,
  LayoutDashboard,
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  onTabChange: (tab: string) => void;
  activeTab: string;
}

export function Layout({ children, onTabChange, activeTab }: LayoutProps) {
  const navItems = [
    { id: "routes", label: "Routes", icon: <Ship size={20} /> },
    { id: "compare", label: "Compare", icon: <GitCompareArrows size={20} /> },
    { id: "banking", label: "Banking", icon: <Ban size={20} /> },
    { id: "pooling", label: "Pooling", icon: <Users size={20} /> },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="h-20 flex items-center justify-center bg-gray-900">
          <Waves size={32} className="text-blue-400" />
          <h1 className="ml-3 text-2xl font-bold">FuelEU</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-4 py-2.5 rounded-lg transition-all
                ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
            >
              {item.icon}
              <span className="ml-4 text-md font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800 capitalize">
            {activeTab}
          </h2>
        </header>
        <main className="flex-1 px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
