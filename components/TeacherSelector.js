export function TeacherSelector({ teachers, selectedId, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700">
        Teacher
      </label>
      <select
        value={selectedId || ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full max-w-xs rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All teachers</option>
        {teachers.map((t) => (
          <option key={t.teacher_id} value={t.teacher_id}>
            {t.teacher_name}
          </option>
        ))}
      </select>
    </div>
  );
}

