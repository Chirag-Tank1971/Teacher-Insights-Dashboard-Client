import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// The chart is intentionally simple: week label on X, counts on Y.
export function WeeklyActivityChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="border rounded-lg bg-white p-4 text-sm text-slate-500">
        No weekly data available for this teacher.
      </div>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    label: `${item.year}-W${item.week}`
  }));

  return (
    <div className="border rounded-lg bg-white p-4">
      <h2 className="text-sm font-medium text-slate-800 mb-3">
        Weekly activity (ISO weeks)
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ left: -16, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="lessons"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="quizzes"
              stroke="#059669"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="assessments"
              stroke="#7c3aed"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

