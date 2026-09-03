declare module "@revolut/checkout" {
  interface EmbeddedCheckoutOptions {
    publicToken: string;
    mode: "prod" | "sandbox";
    locale?: string;
    target: HTMLElement;
    email?: string;
    createOrder: () => Promise<{ publicId: string }>;
    onSuccess?: (payload: { orderId: string }) => void;
    onError?: (payload: { error: { message?: string }; orderId: string }) => void;
    onCancel?: (payload: { orderId: string | undefined }) => void;
  }

  interface EmbeddedCheckoutInstance {
    destroy: () => void;
  }

  interface RevolutCheckoutStatic {
    embeddedCheckout: (
      options: EmbeddedCheckoutOptions,
    ) => Promise<EmbeddedCheckoutInstance>;
  }

  const RevolutCheckout: RevolutCheckoutStatic;
  export default RevolutCheckout;
}
