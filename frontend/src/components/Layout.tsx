import { Link, NavLink } from "react-router-dom";
import { useCart } from "../cart";
import { useConfig } from "../config";

export function Layout({ children }: { children: React.ReactNode }) {
  const cart = useCart();
  const config = useConfig();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="glass-strong border-b border-white/10 text-center text-xs tracking-wide py-2.5 px-4 text-ink-soft">
        <span className="badge mr-2">Demo</span>
        {config.demoMode
          ? "DEMO mode — Revolut responses are simulated"
          : `REAL ${config.revolutMode.toUpperCase()} mode — live Revolut sandbox`}
      </div>
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="page-container py-4 flex items-center justify-between gap-6">
          <Link to="/" className="font-display text-xl font-semibold tracking-tight">
            Northline Audio
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}
            >
              Store
            </NavLink>
            <NavLink
              to="/product"
              className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}
            >
              Product
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}
            >
              Cart{cart.quantity > 0 ? ` (${cart.quantity})` : ""}
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mt-16 border-t border-white/10">
        <div className="page-container py-10 text-sm text-ink-soft flex flex-col gap-2 md:flex-row md:justify-between">
          <p>Northline Audio — fictional merchant for Revolut integration discussions.</p>
          <p className="text-ink-soft/70">Payments stay in sandbox unless production keys are configured.</p>
        </div>
      </footer>
    </div>
  );
}
