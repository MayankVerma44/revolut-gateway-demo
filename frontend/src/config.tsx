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
        <div className="glass max-w-md rounded-2xl p-8">
          <h1 className="font-display text-2xl font-semibold">Cannot reach the demo API</h1>
          <p className="mt-3 text-ink-soft">{error}. Start the backend on port 3001.</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen grid place-items-center text-ink-soft">
        <div className="h-8 w-8 rounded-full border-2 border-teal/30 border-t-teal animate-spin" />
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
