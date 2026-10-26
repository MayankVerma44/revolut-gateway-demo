import { Link, useLocation } from "react-router-dom";
import { useCart } from "../cart";
import { useConfig, useConfigError } from "../config";
import { useCheckoutSession } from "../checkoutSession";
import { RevolutWordmark } from "./RevolutWordmark";

type LayoutMode = "dashboard" | "store" | "minimal";

function resolveMode(pathname: string, sessionActive: boolean, explicit?: LayoutMode): LayoutMode {
  if (explicit) return explicit;
  if (pathname === "/") return "dashboard";
  if (sessionActive && !pathname.startsWith("/order/")) return "store";
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
  const configError = useConfigError();
  const session = useCheckoutSession();
  const { pathname } = useLocation();
  const layoutMode = resolveMode(pathname, session.isActive, mode);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="app-header">
        <div className="page-container py-4 md:py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              to="/"
              className="brand-mark shrink-0"
              onClick={(e) => {
                if (session.isActive) {
                  e.preventDefault();
                  session.clear();
                }
              }}
            >
              <span className="brand-icon" aria-hidden="true">R</span>
              <span className="brand-text">
                <span className="brand-title">
                  <span className="sr-only">Revolut </span>
                  <RevolutWordmark className="brand-wordmark" />
                  Demo
                </span>
                {layoutMode === "dashboard" && (
                  <span className="brand-tagline">Compare checkout solutions</span>
                )}
              </span>
            </Link>

            {layoutMode === "store" && session.isActive && (
              <div className="demo-chip hidden sm:flex">
                <span className="text-ink-soft">{session.solutionName}</span>
                <span className="text-ink-soft/50">·</span>
                <span className="text-teal">Demo</span>
              </div>
            )}
          </div>

          <nav className="flex items-center gap-2 shrink-0">
            {layoutMode === "store" && (
              <>
                <Link to="/product" className="nav-link hidden md:inline-flex">Store</Link>
                <Link to="/cart" className="nav-link">
                  Cart{cart.quantity > 0 ? ` (${cart.quantity})` : ""}
                </Link>
                <button type="button" className="btn-ghost text-sm" onClick={session.clear}>
                  ← Dashboard
                </button>
              </>
            )}
            {layoutMode === "minimal" && pathname.startsWith("/order/") && (
              <button type="button" className="btn-ghost text-sm" onClick={session.clear}>
                ← Dashboard
              </button>
            )}
          </nav>
        </div>

        {layoutMode === "store" && session.isActive && (
          <div className="demo-chip-mobile sm:hidden page-container pb-3">
            <span className="text-ink-soft">{session.solutionName}</span>
            <span className="text-teal">Demo</span>
          </div>
        )}
      </header>

      {layoutMode === "store" && (
        <div className="env-banner">
          <span className="status-dot" />
          {config?.sandboxReady
            ? `Demonstration store — ${config.revolutMode.toUpperCase()}`
            : configError
              ? "Demonstration store — demo API unreachable"
              : config
                ? "Demonstration store — configure Revolut sandbox keys"
                : "Demonstration store"}
        </div>
      )}

      <main className="flex-1">{children}</main>

      {layoutMode === "dashboard" && (
        <footer className="app-footer">
          <div className="page-container py-10 text-sm text-ink-soft flex flex-col gap-2 md:flex-row md:justify-between">
            <p>Internal demonstration tool for checkout solutions.</p>
            <p className="text-ink-soft/60">Interactive demos powered by the Revolut Merchant API.</p>
          </div>
        </footer>
      )}
    </div>
  );
}
