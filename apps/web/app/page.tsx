import { ServiceStatus } from "../components/service-status";

const services = [
  { name: "api", url: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000" },
  { name: "auth", url: process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? "http://localhost:8001" },
  { name: "workspace", url: process.env.NEXT_PUBLIC_WORKSPACE_BASE_URL ?? "http://localhost:8002" },
  { name: "project", url: process.env.NEXT_PUBLIC_PROJECT_BASE_URL ?? "http://localhost:8003" }
];

export default function HomePage() {
  return (
    <main className="container">
      <h1>Aetheris Studio · V1 Web Scaffold</h1>
      <p>Next.js frontend + Python FastAPI services scaffold for M1.</p>
      <section>
        <h2>Service health</h2>
        <div className="grid">
          {services.map((svc) => (
            <ServiceStatus key={svc.name} name={svc.name} url={svc.url} />
          ))}
        </div>
      </section>
    </main>
  );
}
