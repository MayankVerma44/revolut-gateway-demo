import { COMPARISON_COLUMNS, TECHNICAL_COMPARISON } from "../../constants/comparisonOverview";

export function TechnicalComparisonMatrix() {
  return (
    <div className="glass rounded-3xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="comparison-table w-full min-w-[760px] text-sm">
          <thead>
            <tr>
              <th className="text-left font-medium text-ink-soft w-[22%]">Feature</th>
              {COMPARISON_COLUMNS.map((column) => (
                <th key={column.id} className="text-left align-bottom">
                  <span className="block font-display font-semibold text-ink">{column.name}</span>
                  <span className="mt-1 block text-xs font-normal leading-snug text-ink-soft">
                    {column.description}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TECHNICAL_COMPARISON.map((group) => (
              <GroupRows key={group.label} group={group} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GroupRows({ group }: { group: (typeof TECHNICAL_COMPARISON)[number] }) {
  return (
    <>
      <tr>
        <td
          colSpan={COMPARISON_COLUMNS.length + 1}
          className="bg-white/4 font-display text-xs font-semibold tracking-wide text-ink"
        >
          {group.label}
        </td>
      </tr>
      {group.rows.map((row) => (
        <tr key={row.feature}>
          <td className="text-ink-soft">{row.feature}</td>
          {row.values.map((value, index) => (
            <td key={COMPARISON_COLUMNS[index].id}>
              <CellValue value={value} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function CellValue({ value }: { value: string }) {
  if (value === "Yes") {
    return <span className="matrix-yes">Yes</span>;
  }
  if (value === "No") {
    return <span className="matrix-no">No</span>;
  }
  if (value === "Needs validation") {
    return (
      <span className="inline-flex rounded-full border border-amber/30 bg-amber/10 px-2 py-0.5 text-xs font-medium text-amber">
        Needs validation
      </span>
    );
  }
  return <span>{value}</span>;
}
