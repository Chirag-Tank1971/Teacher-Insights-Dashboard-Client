export function DetailsTables({ details }) {
  const hasSubjects = details && details.subjects && details.subjects.length > 0;
  const hasClasses = details && details.classes && details.classes.length > 0;

  if (!hasSubjects && !hasClasses) {
    return (
      <div className="border rounded-lg bg-white p-4 text-sm text-slate-500">
        No subject or class breakdown available for this teacher.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {hasSubjects && (
        <div className="border rounded-lg bg-white p-4">
          <h3 className="text-sm font-medium text-slate-800 mb-3">
            By subject
          </h3>
          <SimpleTable items={details.subjects} labelKey="subject" />
        </div>
      )}
      {hasClasses && (
        <div className="border rounded-lg bg-white p-4">
          <h3 className="text-sm font-medium text-slate-800 mb-3">
            By class
          </h3>
          <SimpleTable items={details.classes} labelKey="class" />
        </div>
      )}
    </div>
  );
}

function SimpleTable({ items, labelKey }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50">
            <th className="text-left px-2 py-2 font-medium text-slate-700">
              {labelKey === "subject" ? "Subject" : "Class"}
            </th>
            <th className="text-right px-2 py-2 font-medium text-slate-700">
              Total
            </th>
            <th className="text-right px-2 py-2 font-medium text-slate-700">
              Lessons
            </th>
            <th className="text-right px-2 py-2 font-medium text-slate-700">
              Quizzes
            </th>
            <th className="text-right px-2 py-2 font-medium text-slate-700">
              Assessments
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item[labelKey]} className="border-b last:border-b-0">
              <td className="px-2 py-1 text-slate-800">
                {item[labelKey]}
              </td>
              <td className="px-2 py-1 text-right text-slate-800">
                {item.total}
              </td>
              <td className="px-2 py-1 text-right text-slate-800">
                {item.lessons}
              </td>
              <td className="px-2 py-1 text-right text-slate-800">
                {item.quizzes}
              </td>
              <td className="px-2 py-1 text-right text-slate-800">
                {item.assessments}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

