import { Sidebar } from "../../components/sidebar";
import { CustomCursor } from "../../components/CustomCursor";
import { InteractiveMesh } from "../../components/InteractiveMesh";
import "../(marketing)/marketing.css";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout" style={{ position: "relative", overflow: "hidden" }}>
      <CustomCursor />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: 0.15, pointerEvents: "none" }}>
        <InteractiveMesh />
      </div>
      <Sidebar />
      <main className="main-content" style={{ position: "relative", zIndex: 1 }}>{children}</main>
    </div>
  );
}
