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

interface CheckoutSessionValue {
  integration: IntegrationType | null;
  solutionLabel: string | null;
  solutionName: string | null;
  isActive: boolean;
  launch: (integration: IntegrationType) => void;
  clear: () => void;
}

const CheckoutSessionContext = createContext<CheckoutSessionValue | null>(null);

export function CheckoutSessionProvider({ children }: { children: ReactNode }) {
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

  const value = useMemo<CheckoutSessionValue>(() => {
    if (!integration) {
      return {
        integration: null,
        solutionLabel: null,
        solutionName: null,
        isActive: false,
        launch,
        clear,
      };
    }
    const solution = getSolution(integration);
    return {
      integration,
      solutionLabel: solution.demoLabel,
      solutionName: solution.name,
      isActive: true,
      launch,
      clear,
    };
  }, [integration, launch, clear]);

  return (
    <CheckoutSessionContext.Provider value={value}>{children}</CheckoutSessionContext.Provider>
  );
}

export function useCheckoutSession() {
  const value = useContext(CheckoutSessionContext);
  if (!value) throw new Error("CheckoutSessionProvider missing");
  return value;
}
