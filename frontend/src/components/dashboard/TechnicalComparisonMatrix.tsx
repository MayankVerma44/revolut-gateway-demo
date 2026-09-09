import { TECHNICAL_COMPARISON } from "../../constants/comparisonOverview";

export function TechnicalComparisonMatrix() {
  return (
    <div className="glass rounded-3xl overflow-hidden">
      <div className="px-6 pt-6 pb-2 border-b border-white/6">
        <h3 className="font-display text-lg font-semibold">Technical comparison</h3>
        <p className="text-sm text-ink-soft mt-1">Side-by-side feature matrix</p>
      </div>
      <div className="overflow-x-auto">
        <table className="comparison-table w-full min-w-[640px] text-sm">
          <thead>
            <tr>
              <th className="text-left font-medium text-ink-soft w-[40%]">Feature</th>
              <th className="text-left font-display font-semibold">Revolut Checkout</th>
              <th className="text-left font-display font-semibold">Hosted Checkout</th>
            </tr>
          </thead>
          <tbody>
            {TECHNICAL_COMPARISON.map((row) => (
              <tr key={row.feature}>
                <td className="text-ink-soft">{row.feature}</td>
                <td>
                  <CellValue value={row.revolutCheckout} />
                </td>
                <td>
                  <CellValue value={row.hostedCheckout} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CellValue({ value }: { value: string }) {
  if (value === "Yes") {
    return <span className="matrix-yes">Yes</span>;
  }
  if (value === "No") {
    return <span className="matrix-no">No</span>;
  }
  return <span>{value}</span>;
}
