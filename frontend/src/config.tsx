import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { PublicConfig } from "@demo/shared";
import { api } from "./api";
import { LoadingOverlay } from "./components/LoadingOverlay";

type ConfigContextValue = {
  config: PublicConfig | null;
  error: string | null;
};

const ConfigContext = createContext<ConfigContextValue | null>(null);

const configRequest = api.config();

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PublicConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    configRequest
      .then((value) => {
        if (!cancelled) setConfig(value);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <ConfigContext.Provider value={{ config, error }}>{children}</ConfigContext.Provider>;
}

function useConfigState() {
  const value = useContext(ConfigContext);
  if (!value) throw new Error("ConfigProvider missing");
  return value;
}

export function useConfig() {
  return useConfigState().config;
}

export function useConfigError() {
  return useConfigState().error;
}

export function ConfigGate({ children }: { children?: ReactNode }) {
  const { config, error } = useConfigState();

  if (error && !config) {
    return (
      <div className="min-h-screen grid place-items-center p-8">
        <div className="glass max-w-md rounded-2xl p-8">
          <h1 className="font-display text-2xl font-semibold">Cannot reach the demo API</h1>
          <p className="mt-3 text-ink-soft">{error}. Start the backend on port 3001.</p>
        </div>
      </div>
    );
  }

  if (!config) return <LoadingOverlay />;

  return children;
}
