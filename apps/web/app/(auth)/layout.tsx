import "../(marketing)/marketing.css";
import { BackgroundSimulation } from "../../components/BackgroundSimulation";
import { CustomCursor } from "../../components/CustomCursor";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="marketing-body" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <CustomCursor />
      <BackgroundSimulation />
      <div style={{ position: "relative", zIndex: 10, width: "100%" }}>
        {children}
      </div>
    </div>
  );
}
