import { RevolutWordmark } from "../RevolutWordmark";
import { AppleMark, BankMark, CardBrandMarks, GoogleMark } from "./paymentMarks";

const METHODS = [
  {
    id: "revolut-pay",
    label: "Revolut Pay",
    logoOnly: true,
    icon: <RevolutWordmark className="payment-revolut-logo" />,
  },
  { id: "cards", label: "Cards", icon: <CardBrandMarks /> },
  { id: "apple-pay", label: "Apple Pay", icon: <AppleMark /> },
  { id: "google-pay", label: "Google Pay", icon: <GoogleMark /> },
  { id: "pay-by-bank", label: "Pay by Bank", icon: <BankMark /> },
] as const;

export function PaymentMethodBadges() {
  return (
    <div className="payment-method-badges-block">
      <p className="payment-method-badges-label">Pay via Cards, Revolut Pay and more.</p>
      <ul className="payment-method-badges" aria-label="Payment methods">
      {METHODS.map((method) => (
        <li key={method.id} className="payment-method-badge" aria-label={method.label}>
          <span className="payment-method-icon" aria-hidden="true">
            {method.icon}
          </span>
          {"logoOnly" in method ? null : (
            <span aria-hidden="true">{method.label}</span>
          )}
        </li>
      ))}
      </ul>
    </div>
  );
}
