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

const SESSION_KEY = "demo.checkoutIntegration";

function readStoredIntegration(): IntegrationType | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw === "revolut_checkout" || raw === "hosted_checkout") return raw;
  } catch {
    /* private mode */
  }
  return null;
}

function storeIntegration(integration: IntegrationType | null) {
  try {
    if (integration) sessionStorage.setItem(SESSION_KEY, integration);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* private mode */
  }
}

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
  const [integration, setIntegration] = useState<IntegrationType | null>(readStoredIntegration);

  const launch = useCallback(
    (next: IntegrationType) => {
      storeIntegration(next);
      setIntegration(next);
      navigate("/product");
    },
    [navigate],
  );

  const clear = useCallback(() => {
    storeIntegration(null);
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
