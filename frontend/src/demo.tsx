import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import type { IntegrationType } from "@demo/shared";
import { getSolution } from "./constants/solutions";

interface DemoContextValue {
  integration: IntegrationType | null;
  demoLabel: string | null;
  solutionName: string | null;
  isActive: boolean;
  launch: (integration: IntegrationType) => void;
  clear: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [integration, setIntegration] = useState<IntegrationType | null>(null);

  const launch = useCallback(
    (next: IntegrationType) => {
      setIntegration(next);
      navigate("/product");
    },
    [navigate],
  );

  const clear = useCallback(() => {
    setIntegration(null);
    navigate("/");
  }, [navigate]);

  const value = useMemo<DemoContextValue>(() => {
    if (!integration) {
      return {
        integration: null,
        demoLabel: null,
        solutionName: null,
        isActive: false,
        launch,
        clear,
      };
    }
    const solution = getSolution(integration);
    return {
      integration,
      demoLabel: solution.demoLabel,
      solutionName: solution.name,
      isActive: true,
      launch,
      clear,
    };
  }, [integration, launch, clear]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("DemoProvider missing");
  return value;
}
