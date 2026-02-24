 "use client";

import { useEffect, useMemo, useState } from "react";
import { SummaryCards } from "../components/SummaryCards";
import { TeacherSelector } from "../components/TeacherSelector";
import { WeeklyActivityChart } from "../components/WeeklyActivityChart";
import { DetailsTables } from "../components/DetailsTables";
import { AppShell } from "../components/AppShell";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

async function fetchJson(path, token) {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    headers
  });

  if (!res.ok) {
    const error = new Error(`Request failed: ${res.status}`);
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export default function DashboardPage() {
  const [authToken, setAuthToken] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [teachersSummary, setTeachersSummary] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingTeacher, setLoadingTeacher] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedToken = window.localStorage.getItem("ti_auth_token");
    const storedUser = window.localStorage.getItem("ti_auth_user");

    if (storedToken) {
      setAuthToken(storedToken);
    }

    if (storedUser) {
      try {
        setAuthUser(JSON.parse(storedUser));
      } catch {
        setAuthUser(null);
      }
    }
  }, []);

  useEffect(() => {
    if (!authToken) {
      return;
    }

    let cancelled = false;

    async function loadSummary() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchJson("/api/teachers/summary", authToken);
        if (cancelled) return;
        setTeachersSummary(data.data || []);
      } catch (err) {
        if (cancelled) return;

        if (err.status === 401) {
          setAuthToken(null);
          setAuthUser(null);
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("ti_auth_token");
            window.localStorage.removeItem("ti_auth_user");
          }
          setError("Your session has expired. Please sign in again.");
          return;
        }

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
  }, [authToken]);

  useEffect(() => {
    if (!authToken) {
      return;
    }

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
          fetchJson(`/api/teachers/${selectedTeacherId}/weekly`, authToken),
          fetchJson(`/api/teachers/${selectedTeacherId}/details`, authToken)
        ]);
        if (cancelled) return;
        setWeeklyData(weekly.weeks || []);
        setDetails(detail);
      } catch (err) {
        if (cancelled) return;

        if (err.status === 401) {
          setAuthToken(null);
          setAuthUser(null);
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("ti_auth_token");
            window.localStorage.removeItem("ti_auth_user");
          }
          setError("Your session has expired. Please sign in again.");
          return;
        }

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
  }, [authToken, selectedTeacherId]);

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

  const handleLogout = () => {
    setAuthToken(null);
    setAuthUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("ti_auth_token");
      window.localStorage.removeItem("ti_auth_user");
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString() || "";

    if (!email || !password) {
      setAuthError("Please enter both email and password.");
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        if (res.status === 401) {
          setAuthError("Invalid email or password.");
        } else {
          setAuthError("Something went wrong while signing in.");
        }
        return;
      }

      const body = await res.json();

      setAuthToken(body.token);
      setAuthUser(body.user);

      if (typeof window !== "undefined") {
        window.localStorage.setItem("ti_auth_token", body.token);
        window.localStorage.setItem("ti_auth_user", JSON.stringify(body.user));
      }

      setSelectedTeacherId(null);
      setTeachersSummary([]);
      setWeeklyData(null);
      setDetails(null);
      setError(null);
    } catch {
      setAuthError("Unable to reach the server. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  if (!authToken) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-slate-50 to-amber-50" />
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-violet-300/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 lg:px-6 py-10 md:py-16 min-h-screen flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-white/60 px-3 py-1 text-xs font-medium text-violet-700 shadow-sm backdrop-blur">
                <span className="h-6 w-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-semibold">
                  TI
                </span>
                <span>Teacher Insights</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
                Principal dashboard for teacher activity insights.
              </h1>
              <p className="text-sm md:text-base text-slate-600 max-w-xl">
                Sign in to review lessons, quizzes, and assessments created by each teacher,
                track weekly trends, and drill into subject and class breakdowns.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-white/60 border border-white/60 px-3 py-1 backdrop-blur">
                  Secure admin access
                </span>
                <span className="rounded-full bg-white/60 border border-white/60 px-3 py-1 backdrop-blur">
                  Weekly trends
                </span>
                <span className="rounded-full bg-white/60 border border-white/60 px-3 py-1 backdrop-blur">
                  Per-teacher drilldowns
                </span>
              </div>
            </div>

            <div className="w-full">
              <div className="w-full max-w-md ml-auto rounded-3xl border border-white/60 bg-white/70 p-8 shadow-2xl backdrop-blur-md">
                <div className="mb-6 space-y-2">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Sign in
                  </h2>
                  <p className="text-xs text-slate-500">
                    Use your principal/admin account to continue.
                  </p>
                </div>

                {authError && (
                  <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="block text-xs font-medium text-slate-700"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      placeholder="principal@school.edu"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="password"
                      className="block text-xs font-medium text-slate-700"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      placeholder="Enter your password"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-violet-600 px-3 py-3 text-sm font-medium text-white shadow-sm hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70 transition-colors"
                  >
                    {authLoading ? "Signing in..." : "Sign in"}
                  </button>
                </form>

                <p className="mt-4 text-[11px] text-slate-500">
                  Admin access only. If you don&apos;t have credentials, create a single admin user in the database.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppShell user={authUser} onSignOut={handleLogout}>
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
    </AppShell>
  );
}

