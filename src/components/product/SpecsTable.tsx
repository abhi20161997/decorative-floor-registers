const specs = [
  { label: "Material", value: "Steel — sheet metal louvers (not plastic)" },
  { label: "Gauge", value: "1.5mm" },
  { label: "Gauze", value: "2mm" },
  { label: "Damper", value: "Adjustable multi-angle" },
  { label: "Construction", value: "Individually welded" },
  { label: "Mounting", value: "Drop-in (floor) — wall use with spring clips (sold separately)" },
  { label: "Custom Orders", value: "Any size or design possible with development fee & timeline" },
];

export default function SpecsTable() {
  return (
    <div className="overflow-hidden rounded-lg">
      <table className="w-full text-sm">
        <tbody>
          {specs.map((spec, index) => (
            <tr
              key={spec.label}
              className={index % 2 === 0 ? "bg-warm-white" : "bg-ivory"}
            >
              <td className="px-4 py-3 font-medium text-espresso">
                {spec.label}
              </td>
              <td className="px-4 py-3 text-umber">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
