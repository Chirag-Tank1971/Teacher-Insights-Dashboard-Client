"use client";

import { useEffect, useMemo, useState } from "react";
import { SummaryCards } from "../components/SummaryCards";
import { TeacherSelector } from "../components/TeacherSelector";
import { WeeklyActivityChart } from "../components/WeeklyActivityChart";
import { DetailsTables } from "../components/DetailsTables";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

async function fetchJson(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store"
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

export default function DashboardPage() {
  const [teachersSummary, setTeachersSummary] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingTeacher, setLoadingTeacher] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSummary() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchJson("/api/teachers/summary");
        if (cancelled) return;
        setTeachersSummary(data.data || []);
      } catch (err) {
        if (cancelled) return;
        setError("Failed to load teacher summary.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSummary();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedTeacherId) {
      setWeeklyData(null);
      setDetails(null);
      return;
    }

    let cancelled = false;

    async function loadTeacherData() {
      setLoadingTeacher(true);
      setError(null);
      try {
        const [weekly, detail] = await Promise.all([
          fetchJson(`/api/teachers/${selectedTeacherId}/weekly`),
          fetchJson(`/api/teachers/${selectedTeacherId}/details`)
        ]);
        if (cancelled) return;
        setWeeklyData(weekly.weeks || []);
        setDetails(detail);
      } catch (err) {
        if (cancelled) return;
        setError("Failed to load teacher details.");
      } finally {
        if (!cancelled) {
          setLoadingTeacher(false);
        }
      }
    }

    loadTeacherData();

    return () => {
      cancelled = true;
    };
  }, [selectedTeacherId]);

  const selectedTeacherSummary = useMemo(() => {
    if (!selectedTeacherId) {
      return null;
    }
    return teachersSummary.find((t) => t.teacher_id === selectedTeacherId) || null;
  }, [teachersSummary, selectedTeacherId]);

  const overallTotals = useMemo(() => {
    if (!teachersSummary || teachersSummary.length === 0) {
      return { lessons: 0, quizzes: 0, assessments: 0 };
    }
    return teachersSummary.reduce(
      (acc, t) => {
        acc.lessons += t.lessons || 0;
        acc.quizzes += t.quizzes || 0;
        acc.assessments += t.assessments || 0;
        return acc;
      },
      { lessons: 0, quizzes: 0, assessments: 0 }
    );
  }, [teachersSummary]);

  const currentTotals = selectedTeacherSummary
    ? {
        lessons: selectedTeacherSummary.lessons || 0,
        quizzes: selectedTeacherSummary.quizzes || 0,
        assessments: selectedTeacherSummary.assessments || 0
      }
    : overallTotals;

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-slate-900">Insights</h2>
            <p className="text-sm text-slate-500">
              {selectedTeacherSummary
                ? `Overview for ${selectedTeacherSummary.teacher_name}`
                : "Overview across all teachers"}
              .
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <button className="rounded-full bg-slate-900 text-white px-3 py-1.5 text-xs font-medium shadow-sm">
              This week
            </button>
            <button className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
              This month
            </button>
            <button className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
              This year
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1">
            <SummaryCards totals={currentTotals} />
            {loading && (
              <p className="text-xs text-slate-500 mt-1">Loading data...</p>
            )}
          </div>
          <div className="mt-2 w-full max-w-xs self-start">
            <TeacherSelector
              teachers={teachersSummary}
              selectedId={selectedTeacherId}
              onChange={setSelectedTeacherId}
            />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <WeeklyActivityChart data={weeklyData || []} />
        {loadingTeacher && selectedTeacherId && (
          <p className="text-xs text-slate-500">
            Loading weekly data...
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900">
          Per-teacher breakdown
        </h2>
        <p className="text-sm text-slate-500">
          Subject-wise and class-wise activity for the selected teacher.
        </p>
        <DetailsTables details={details || { subjects: [], classes: [] }} />
      </section>
    </div>
  );
}

