"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FolderKanban, Database, Workflow, Cpu,
  FlaskConical, Box, Rocket, Activity, Users, CreditCard, Settings,
} from "lucide-react";

const NAV = [
  { section: "Platform" },
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/datasets", label: "Datasets", icon: Database },
  { href: "/preprocessing", label: "Preprocessing", icon: Workflow },
  { section: "Intelligence" },
  { href: "/training", label: "Training Jobs", icon: Cpu, badge: "3" },
  { href: "/experiments", label: "Experiments", icon: FlaskConical },
  { href: "/models", label: "Models", icon: Box },
  { href: "/deployments", label: "Deployments", icon: Rocket },
  { section: "Operations" },
  { href: "/monitoring", label: "Monitoring", icon: Activity },
  { href: "/team", label: "Team", icon: Users },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">A</div>
        <div>
          <h1>Aetheris AI</h1>
          <span>Intelligence OS</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {NAV.map((item, i) =>
          "section" in item ? (
            <div key={i} className="nav-section-title">{item.section}</div>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${path === item.href ? "active" : ""}`}
            >
              <item.icon />
              {item.label}
              {"badge" in item && item.badge && <span className="nav-badge">{item.badge}</span>}
            </Link>
          )
        )}
      </nav>
      <div className="sidebar-footer">
        <div className="pulse-dot" />
        <span>All systems operational</span>
      </div>
    </aside>
  );
}
