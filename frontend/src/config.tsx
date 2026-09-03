import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { PublicConfig } from "@demo/shared";
import { api } from "./api";

const ConfigContext = createContext<PublicConfig | null>(null);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PublicConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .config()
      .then(setConfig)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center p-8">
        <div className="max-w-md rounded-2xl bg-paper p-8 shadow-sm">
          <h1 className="font-display text-2xl">Cannot reach the demo API</h1>
          <p className="mt-3 text-ink-soft">{error}. Start the backend on port 3001.</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen grid place-items-center text-ink-soft">
        Loading merchant demo…
      </div>
    );
  }

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  const value = useContext(ConfigContext);
  if (!value) throw new Error("ConfigProvider missing");
  return value;
}
