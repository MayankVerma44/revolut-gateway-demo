import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PRODUCT } from "@demo/shared";

const STORAGE = "northline-cart";

export interface CartState {
  quantity: number;
}

interface CartContextValue extends CartState {
  setQuantity: (quantity: number) => void;
  addOne: () => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function read(): number {
  try {
    const raw = localStorage.getItem(STORAGE);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as CartState;
    return parsed.quantity ?? 0;
  } catch {
    return 0;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [quantity, setQuantityState] = useState(read);

  const value = useMemo<CartContextValue>(
    () => ({
      quantity,
      setQuantity: (next) => {
        const quantity = Math.max(0, Math.min(5, next));
        setQuantityState(quantity);
        localStorage.setItem(STORAGE, JSON.stringify({ quantity, productId: PRODUCT.id }));
      },
      addOne: () => {
        setQuantityState((current) => {
          const quantity = Math.min(5, current + 1);
          localStorage.setItem(STORAGE, JSON.stringify({ quantity, productId: PRODUCT.id }));
          return quantity;
        });
      },
      clear: () => {
        setQuantityState(0);
        localStorage.removeItem(STORAGE);
      },
    }),
    [quantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("CartProvider missing");
  return value;
}
