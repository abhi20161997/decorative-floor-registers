const specs = [
  { label: "Material", value: "Steel" },
  { label: "Gauge", value: "1.5mm" },
  { label: "Damper", value: "Adjustable multi-angle" },
  { label: "Construction", value: "Individually welded" },
  { label: "Mounting", value: "Drop-in" },
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
