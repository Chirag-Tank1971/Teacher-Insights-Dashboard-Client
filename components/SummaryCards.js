export function SummaryCards({ totals }) {
  const items = [
    {
      key: "lessons",
      label: "Lessons created",
      color:
        "bg-gradient-to-br from-rose-50 via-rose-50 to-rose-100 border-rose-100 text-rose-900"
    },
    {
      key: "quizzes",
      label: "Quizzes conducted",
      color:
        "bg-gradient-to-br from-emerald-50 via-emerald-50 to-emerald-100 border-emerald-100 text-emerald-900"
    },
    {
      key: "assessments",
      label: "Assessments made",
      color:
        "bg-gradient-to-br from-indigo-50 via-indigo-50 to-indigo-100 border-indigo-100 text-indigo-900"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.key}
          className={`rounded-2xl border shadow-sm px-5 py-4 flex flex-col justify-between ${item.color}`}
        >
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            {item.label}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-3xl font-semibold">
              {totals[item.key] ?? 0}
            </div>
            <div className="text-[11px] font-medium text-slate-500">
              This week
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

