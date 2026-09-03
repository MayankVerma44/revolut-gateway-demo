import { Link, NavLink } from "react-router-dom";
import { useCart } from "../cart";
import { useConfig } from "../config";

export function Layout({ children }: { children: React.ReactNode }) {
  const cart = useCart();
  const config = useConfig();

  return (
    <div className="min-h-screen">
      <div className="bg-ink text-cream text-center text-sm tracking-wide py-2 px-4">
        Demonstration environment
        {config.demoMode
          ? " — DEMO mode (Revolut responses are simulated)"
          : ` — REAL ${config.revolutMode.toUpperCase()} mode`}
      </div>
      <header className="border-b border-line bg-paper/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-6">
          <Link to="/" className="font-display text-2xl">
            Northline Audio
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <NavLink to="/" className="hover:text-teal">
              Store
            </NavLink>
            <NavLink to="/product" className="hover:text-teal">
              Product
            </NavLink>
            <NavLink to="/cart" className="hover:text-teal">
              Cart {cart.quantity > 0 ? `(${cart.quantity})` : ""}
            </NavLink>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="mt-16 border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-ink-soft flex flex-col gap-2 md:flex-row md:justify-between">
          <p>Northline Audio is a fictional merchant for Revolut integration discussions.</p>
          <p>Payments never leave this architecture into production unless you configure sandbox keys.</p>
        </div>
      </footer>
    </div>
  );
}
