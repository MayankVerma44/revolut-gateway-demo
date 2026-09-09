import { Link, useLocation } from "react-router-dom";
import { useCart } from "../cart";
import { useConfig } from "../config";
import { useDemo } from "../demo";

type LayoutMode = "dashboard" | "demo" | "minimal";

function resolveMode(pathname: string, demoActive: boolean, explicit?: LayoutMode): LayoutMode {
  if (explicit) return explicit;
  if (pathname === "/") return "dashboard";
  if (demoActive && !pathname.startsWith("/order/")) return "demo";
  return "minimal";
}

export function Layout({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode?: LayoutMode;
}) {
  const cart = useCart();
  const config = useConfig();
  const demo = useDemo();
  const { pathname } = useLocation();
  const layoutMode = resolveMode(pathname, demo.isActive, mode);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="app-header">
        <div className="page-container py-4 md:py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              to="/"
              className="brand-mark shrink-0"
              onClick={(e) => {
                if (demo.isActive) {
                  e.preventDefault();
                  demo.clear();
                }
              }}
            >
              <span className="brand-icon" aria-hidden="true">R</span>
              <span className="brand-text">
                <span className="brand-title">Revolut Demo</span>
                {layoutMode === "dashboard" && (
                  <span className="brand-tagline">Compare checkout solutions</span>
                )}
              </span>
            </Link>

            {layoutMode === "demo" && demo.isActive && (
              <div className="demo-chip hidden sm:flex">
                <span className="text-ink-soft">{demo.solutionName}</span>
                <span className="text-ink-soft/50">·</span>
                <span className="text-teal">{demo.demoLabel}</span>
              </div>
            )}
          </div>

          <nav className="flex items-center gap-2 shrink-0">
            {layoutMode === "demo" && (
              <>
                <Link to="/product" className="nav-link hidden md:inline-flex">Store</Link>
                <Link to="/cart" className="nav-link">
                  Cart{cart.quantity > 0 ? ` (${cart.quantity})` : ""}
                </Link>
                <button type="button" className="btn-ghost text-sm" onClick={demo.clear}>
                  ← Dashboard
                </button>
              </>
            )}
            {layoutMode === "minimal" && pathname.startsWith("/order/") && (
              <button type="button" className="btn-ghost text-sm" onClick={demo.clear}>
                ← Dashboard
              </button>
            )}
          </nav>
        </div>

        {layoutMode === "demo" && demo.isActive && (
          <div className="demo-chip-mobile sm:hidden page-container pb-3">
            <span className="text-ink-soft">{demo.solutionName}</span>
            <span className="text-teal">{demo.demoLabel}</span>
          </div>
        )}
      </header>

      {layoutMode === "demo" && (
        <div className="env-banner">
          <span className="status-dot" />
          {config.demoMode
            ? "Demonstration store — DEMO mode"
            : `Demonstration store — ${config.revolutMode.toUpperCase()} sandbox`}
        </div>
      )}

      <main className="flex-1">{children}</main>

      {layoutMode === "dashboard" && (
        <footer className="app-footer">
          <div className="page-container py-10 text-sm text-ink-soft flex flex-col gap-2 md:flex-row md:justify-between">
            <p>Internal demonstration tool for Revolut checkout integrations.</p>
            <p className="text-ink-soft/60">Northline Audio is a fictional merchant storefront.</p>
          </div>
        </footer>
      )}
    </div>
  );
}
