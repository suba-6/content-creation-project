import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Zap, Plus, FolderOpen, LogOut, Video, BookOpen, TrendingUp } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", icon: Zap, label: "Home" },
    { name: "Generate", icon: Plus, label: "Banners" },
    { name: "VideoStudio", icon: Video, label: "Video" },
    { name: "BrochureDesign", icon: BookOpen, label: "Brochure" },
    { name: "SocialTrending", icon: TrendingUp, label: "Social" },
    { name: "History", icon: FolderOpen, label: "Library" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        :root {
          --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
        }
        body {
          font-family: var(--font-sans);
          -webkit-font-smoothing: antialiased;
        }
      `}</style>

      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to={createPageUrl("Dashboard")}
            className="flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-800 text-sm tracking-tight">
              ContentStudio
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPageName === item.name;
              return (
                <Link key={item.name} to={createPageUrl(item.name)}>
                  <button
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                      ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                      }
                    `}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                </Link>
              );
            })}
            <button
              onClick={() => base44.auth.logout()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>{children}</main>
    </div>
  );
}
